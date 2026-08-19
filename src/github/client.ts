import { Octokit } from '@octokit/rest';
import * as path from 'node:path';
import { Logger } from '../utils/logger.js';
import { readJson, writeJson, fileExists } from '../utils/io.js';
import { sleep } from '../utils/concurrency.js';
import type { RawGitHubRepo, SearchResult, TreeResult } from './types.js';

const log = new Logger('GITHUB');

export class GitHubAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GitHubAuthError';
  }
}

export class GitHubError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly isRateLimit = false,
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

export interface GitHubClientOptions {
  token?: string;
  cacheDir?: string;
  maxRetries?: number;
}

interface CacheEntry {
  data: unknown;
  fetchedAt: string;
}

/**
 * Unified GitHub client.
 *
 *  - Resolves token from GITHUB_TOKEN or GH_TOKEN (fails loudly if missing).
 *  - Wraps Octokit with retry + exponential backoff + rate-limit detection.
 *  - Caches GET responses in-memory and (optionally) on disk under .cache/.
 *
 * Security boundary: this client ONLY reads metadata / trees / selected text
 * files. It never clones third-party repos or executes their code.
 */
export class GitHubClient {
  public readonly octokit: Octokit;
  public readonly token: string;
  private readonly maxRetries: number;
  private readonly cacheDir?: string;
  private readonly cacheFile?: string;
  private readonly memory = new Map<string, CacheEntry>();

  constructor(options: GitHubClientOptions = {}) {
    const token =
      options.token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '';
    if (!token) {
      throw new GitHubAuthError(
        'Missing GitHub token. Set GITHUB_TOKEN (or GH_TOKEN) environment variable.\n' +
          'GitHub Actions provides secrets.GITHUB_TOKEN automatically; no PAT required for the basic pipeline.',
      );
    }
    this.token = token;
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'harmonyos-hap-navigator',
      throttle: { enabled: false },
    });
    this.maxRetries = options.maxRetries ?? 3;
    if (options.cacheDir) {
      this.cacheDir = options.cacheDir;
      this.cacheFile = path.join(options.cacheDir, 'github.json');
    }
    this.loadCache();
  }

  /** Resolve + validate a token without constructing a client. */
  static resolveToken(): string {
    const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '';
    if (!token) {
      throw new GitHubAuthError(
        'Missing GitHub token. Set GITHUB_TOKEN (or GH_TOKEN) environment variable.',
      );
    }
    return token;
  }

  private loadCache(): void {
    if (!this.cacheFile) return;
    // Synchronous-ish best-effort load; ignore errors.
    void (async () => {
      try {
        if (await fileExists(this.cacheFile!)) {
          const data = await readJson<Record<string, CacheEntry>>(this.cacheFile!);
          for (const [k, v] of Object.entries(data)) this.memory.set(k, v);
          log.debug(`loaded ${this.memory.size} cached entries`);
        }
      } catch {
        /* ignore */
      }
    })();
  }

  /** Persist in-memory cache to disk (call before process exit). */
  async persistCache(): Promise<void> {
    if (!this.cacheFile || !this.cacheDir) return;
    const obj: Record<string, CacheEntry> = {};
    for (const [k, v] of this.memory.entries()) obj[k] = v;
    try {
      await writeJson(this.cacheFile, obj);
    } catch {
      /* ignore cache write failures */
    }
  }

  private cacheKey(method: string, params: unknown): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  private getCache<T>(key: string): T | undefined {
    const hit = this.memory.get(key);
    return hit ? (hit.data as T) : undefined;
  }

  private setCache(key: string, data: unknown): void {
    this.memory.set(key, { data, fetchedAt: new Date().toISOString() });
  }

  private retryAfterMs(err: unknown): number | undefined {
    const e = err as { response?: { headers?: Record<string, string> } };
    const header =
      e?.response?.headers?.['retry-after'] ?? e?.response?.headers?.['Retry-After'];
    if (header) {
      const secs = Number(header);
      if (!Number.isNaN(secs)) return secs * 1000;
    }
    return undefined;
  }

  /**
   * Run an Octokit request with retry + exponential backoff.
   * Detects 403/429 rate limits and surfaces them clearly.
   */
  private async withRetry<T>(
    context: string,
    fn: () => Promise<T>,
    useCache: boolean,
    cacheKeyStr: string,
  ): Promise<T> {
    if (useCache) {
      const cached = this.getCache<T>(cacheKeyStr);
      if (cached !== undefined) return cached;
    }
    let attempt = 0;
    let delay = 1000;
    while (true) {
      try {
        const result = await fn();
        if (useCache) this.setCache(cacheKeyStr, result);
        return result;
      } catch (err) {
        const e = err as { status?: number; message?: string };
        const status = e?.status;
        const isRateLimit = status === 403 || status === 429;
        if (attempt >= this.maxRetries) {
          throw new GitHubError(
            `GitHub request failed after ${attempt + 1} attempts: ${context} (${e?.message ?? ''})`,
            status,
            isRateLimit,
          );
        }
        attempt++;
        const wait = isRateLimit ? this.retryAfterMs(err) ?? delay : delay;
        log.warn(
          `retry ${attempt}/${this.maxRetries} for ${context} (status=${status ?? '?'}) in ${wait}ms`,
        );
        await sleep(wait);
        delay = Math.min(delay * 2, 30_000);
      }
    }
  }

  /** Search repositories by a GitHub search query string. */
  async searchRepositories(
    query: string,
    opts: { perPage?: number; maxPages?: number; sort?: string; order?: string } = {},
  ): Promise<SearchResult> {
    const perPage = opts.perPage ?? 100;
    const maxPages = opts.maxPages ?? 5;
    const all: RawGitHubRepo[] = [];
    let total = 0;
    for (let page = 1; page <= maxPages; page++) {
      const res = await this.withRetry(
        `search:${query} p${page}`,
        () =>
          this.octokit.rest.search.repos({
            q: query,
            sort: (opts.sort as 'stars') ?? 'stars',
            order: (opts.order as 'desc') ?? 'desc',
            per_page: perPage,
            page,
          }),
        true,
        `search:${query}:${opts.sort}:${opts.order}:${perPage}:${page}`,
      );
      const items = (res.data.items ?? []) as unknown as Array<
        RawGitHubRepo & { owner?: { login: string; type?: string } }
      >;
      total = res.data.total_count ?? 0;
      all.push(...items);
      if (items.length < perPage) break;
    }
    log.info(`search "${query}" -> ${all.length} repos (total=${total})`);
    return { total_count: total, items: all };
  }

  /** Discover repositories that have a given GitHub topic. */
  async getByTopic(
    topic: string,
    opts: { perPage?: number; maxPages?: number } = {},
  ): Promise<SearchResult> {
    return this.searchRepositories(`topic:${topic}`, opts);
  }

  /** List public repositories for an organization. */
  async listOrgRepos(
    org: string,
    opts: { perPage?: number; maxPages?: number } = {},
  ): Promise<RawGitHubRepo[]> {
    const perPage = opts.perPage ?? 100;
    const maxPages = opts.maxPages ?? 5;
    const all: RawGitHubRepo[] = [];
    for (let page = 1; page <= maxPages; page++) {
      const res = await this.withRetry(
        `org:${org} p${page}`,
        () =>
          this.octokit.rest.repos.listForOrg({
            org,
            type: 'public',
            per_page: perPage,
            page,
          }),
        true,
        `org:${org}:${perPage}:${page}`,
      );
      const items = (res.data ?? []) as unknown as RawGitHubRepo[];
      all.push(...items);
      if (items.length < perPage) break;
    }
    log.info(`org ${org} -> ${all.length} repos`);
    return all;
  }

  /** Fetch a single repository's metadata. */
  async getRepository(fullName: string): Promise<RawGitHubRepo> {
    const [owner, repo] = fullName.split('/');
    const res = await this.withRetry(
      `repo:${fullName}`,
      () => this.octokit.rest.repos.get({ owner, repo }),
      true,
      `repo:${fullName}`,
    );
    return res.data as unknown as RawGitHubRepo;
  }

  /** Fetch README text (decoded). Returns null when absent. */
  async getReadme(fullName: string): Promise<string | null> {
    const [owner, repo] = fullName.split('/');
    try {
      const res = await this.withRetry(
        `readme:${fullName}`,
        () => this.octokit.rest.repos.getReadme({ owner, repo }),
        true,
        `readme:${fullName}`,
      );
      const content = (res.data as { content?: string; encoding?: string }).content ?? '';
      const encoding = (res.data as { encoding?: string }).encoding ?? 'base64';
      if (!content) return '';
      if (encoding === 'base64') {
        return Buffer.from(content, 'base64').toString('utf8');
      }
      return content;
    } catch (err) {
      const e = err as { status?: number };
      if (e?.status === 404) return null;
      // Surfaced as null so a missing README never aborts the pipeline.
      log.warn(`readme unavailable for ${fullName}: ${e?.status ?? '?'}`);
      return null;
    }
  }

  /** List languages for a repository (used for the `languages` field). */
  async getLanguages(fullName: string): Promise<string[]> {
    const [owner, repo] = fullName.split('/');
    try {
      const res = await this.withRetry(
        `lang:${fullName}`,
        () => this.octokit.rest.repos.listLanguages({ owner, repo }),
        true,
        `lang:${fullName}`,
      );
      return Object.keys(res.data ?? {});
    } catch {
      return [];
    }
  }

  /**
   * Fetch the Git tree (recursive). Never throws for tree problems — returns a
   * TreeResult so the pipeline can mark `tree_status` and continue.
   */
  async getTree(fullName: string, ref: string): Promise<TreeResult> {
    const [owner, repo] = fullName.split('/');
    try {
      const res = await this.withRetry(
        `tree:${fullName}:${ref}`,
        () =>
          this.octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: ref,
            recursive: 'true',
          }),
        false,
        `tree:${fullName}:${ref}`,
      );
      const tree = (res.data.tree ?? []).map((t) => ({
        path: (t as { path?: string }).path ?? '',
        type: ((t as { type?: string }).type as 'blob' | 'tree') ?? 'blob',
        sha: (t as { sha?: string }).sha ?? '',
        size: (t as { size?: number }).size,
      }));
      const truncated = Boolean((res.data as { truncated?: boolean }).truncated);
      return { ok: true, tree: { sha: res.data.sha ?? ref, tree, truncated } };
    } catch (err) {
      const e = err as { status?: number; message?: string };
      const status = e?.status;
      if (status === 404 || status === 409) {
        return { ok: false, error: `tree unavailable (status ${status})`, status: 'unavailable' };
      }
      log.warn(`tree fetch failed for ${fullName}: ${status ?? '?'}`);
      return { ok: false, error: e?.message ?? 'tree error', status: 'unavailable' };
    }
  }

  /** Current rate limit status (best-effort). */
  async getRateLimit(): Promise<{ remaining: number; limit: number; reset: number } | null> {
    try {
      const res = await this.octokit.rest.rateLimit.get();
      const core = (res.data as { resources?: Record<string, { remaining: number; limit: number; reset: number }> })
        .resources?.core;
      return core ?? null;
    } catch {
      return null;
    }
  }
}
