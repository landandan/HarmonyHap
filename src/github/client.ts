import { Octokit } from '@octokit/rest';
import * as path from 'node:path';
import { readFileSync } from 'node:fs';
import { Logger } from '../utils/logger.js';
import { writeJson } from '../utils/io.js';
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
  /** Max retries for transient (non-rate-limit) errors. Default 3. */
  maxRetries?: number;
  /**
   * Disk-cache TTL in ms. Entries older than this are treated as a miss and
   * refetched, keeping metadata fresh while avoiding redundant calls within
   * the window. Default 24h. Set 0 to disable expiry (cache forever).
   */
  cacheTtlMs?: number;
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
  private readonly cacheTtlMs: number;
  private readonly cacheDir?: string;
  private readonly cacheFile?: string;
  private readonly memory = new Map<string, CacheEntry>();

  constructor(options: GitHubClientOptions = {}) {
    const token = options.token ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '';
    if (!token) {
      throw new GitHubAuthError(
        'Missing GitHub token. Set GITHUB_TOKEN (or GH_TOKEN) environment variable.\n' +
          'GitHub Actions provides secrets.GITHUB_TOKEN automatically; no PAT required for the basic pipeline.',
      );
    }
    this.token = token;
    // NOTE: Octokit's `throttle` option only takes effect when the
    // @octokit/plugin-throttling plugin is registered. We intentionally do NOT
    // rely on it and instead handle rate limits explicitly in `withRetry` so
    // that we can wait until the *hourly* window resets instead of burning the
    // retry budget with sub-second backoff (which never recovers a 403).
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'harmonyos-hap-navigator',
    });
    this.maxRetries = options.maxRetries ?? 3;
    this.cacheTtlMs = options.cacheTtlMs ?? 24 * 60 * 60 * 1000;
    if (options.cacheDir) {
      this.cacheDir = options.cacheDir;
      this.cacheFile = path.join(options.cacheDir, 'github.json');
      this.loadCacheSync();
    }
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

  /**
   * Synchronously load the on-disk cache at construction time so the very first
   * requests in a run can hit previously fetched data. Expired entries (older
   * than `cacheTtlMs`) are dropped so stale metadata is never served.
   */
  private loadCacheSync(): void {
    if (!this.cacheFile) return;
    try {
      const raw = readFileSync(this.cacheFile, 'utf8');
      const data = JSON.parse(raw) as Record<string, CacheEntry>;
      const now = Date.now();
      let loaded = 0;
      for (const [k, v] of Object.entries(data)) {
        const fetchedAt = new Date(v?.fetchedAt ?? '').getTime();
        if (Number.isNaN(fetchedAt)) continue;
        if (this.cacheTtlMs > 0 && now - fetchedAt > this.cacheTtlMs) continue;
        this.memory.set(k, v);
        loaded++;
      }
      if (loaded > 0) log.debug(`loaded ${loaded} cached entries`);
    } catch {
      /* missing or corrupt cache is fine — start fresh */
    }
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
    if (!hit) return undefined;
    if (this.cacheTtlMs > 0) {
      const fetchedAt = new Date(hit.fetchedAt).getTime();
      if (!Number.isNaN(fetchedAt) && Date.now() - fetchedAt > this.cacheTtlMs) {
        this.memory.delete(key);
        return undefined;
      }
    }
    return hit.data as T;
  }

  private setCache(key: string, data: unknown): void {
    this.memory.set(key, { data, fetchedAt: new Date().toISOString() });
  }

  private retryAfterMs(err: unknown): number | undefined {
    const e = err as { response?: { headers?: Record<string, string> } };
    const header = e?.response?.headers?.['retry-after'] ?? e?.response?.headers?.['Retry-After'];
    if (header) {
      const secs = Number(header);
      if (!Number.isNaN(secs)) return secs * 1000;
    }
    return undefined;
  }

  /**
   * GitHub returns `x-ratelimit-reset` (Unix epoch seconds) on rate-limited
   * responses. Compute how long we must wait for the *window* to reset. This is
   * what actually recovers a 403 — the default 1s/2s/4s backoff never does.
   */
  private rateLimitResetMs(err: unknown): number | undefined {
    const e = err as { response?: { headers?: Record<string, string> } };
    const header =
      e?.response?.headers?.['x-ratelimit-reset'] ?? e?.response?.headers?.['X-RateLimit-Reset'];
    if (header) {
      const resetSecs = Number(header);
      if (!Number.isNaN(resetSecs)) {
        const ms = resetSecs * 1000 - Date.now();
        return ms > 0 ? ms : 0;
      }
    }
    return undefined;
  }

  /** True when the error is (or is caused by) a GitHub rate limit. */
  private isRateLimit(status: number | undefined, message?: string): boolean {
    if (status === 403 || status === 429) return true;
    const m = (message ?? '').toLowerCase();
    return (
      m.includes('rate limit') ||
      m.includes('secondary rate limit') ||
      m.includes('abuse detection')
    );
  }

  /**
   * Run an Octokit request with retry + backoff.
   *
   * Two failure classes are handled differently:
   *  - Rate limits (403/429): wait until the quota window resets (via
   *    `x-ratelimit-reset` / `Retry-After`) and retry — these are NOT bounded by
   *    `maxRetries`, because a short backoff can never recover an hourly limit.
   *    A cap (`MAX_RATE_LIMIT_WAITS`) prevents an infinite stall.
   *  - Other transient errors (5xx): exponential backoff up to `maxRetries`.
   *  - 404/410: non-retryable, fail fast.
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
    const MAX_RATE_LIMIT_WAITS = 4;
    const MAX_WAIT_MS = 15 * 60 * 1000; // stay safely under the 60m job timeout
    let attempt = 0;
    let rateLimitWaits = 0;
    let delay = 1000;
    while (true) {
      try {
        const result = await fn();
        if (useCache) this.setCache(cacheKeyStr, result);
        return result;
      } catch (err) {
        const e = err as {
          status?: number;
          message?: string;
          response?: { headers?: Record<string, string> };
        };
        const status = e?.status;
        const rateLimited = this.isRateLimit(status, e?.message);
        // 404/410 are non-transient: retrying will never succeed, so fail fast.
        const isNonRetryable = status === 404 || status === 410;
        if (isNonRetryable || (!rateLimited && attempt >= this.maxRetries)) {
          throw new GitHubError(
            `GitHub request failed after ${attempt + 1} attempts: ${context} (${e?.message ?? ''})`,
            status,
            rateLimited,
          );
        }
        attempt++;
        if (rateLimited) {
          rateLimitWaits++;
          if (rateLimitWaits > MAX_RATE_LIMIT_WAITS) {
            throw new GitHubError(
              `GitHub rate limit did not recover after ${rateLimitWaits - 1} waits: ${context} (${e?.message ?? ''})`,
              status,
              true,
            );
          }
          const reset = this.rateLimitResetMs(err);
          const ra = this.retryAfterMs(err);
          const wait = Math.min(MAX_WAIT_MS, Math.max(reset ?? ra ?? 60_000, 1000));
          log.warn(
            `rate limit hit for ${context}; waiting ${Math.round(wait / 1000)}s until reset (wait ${rateLimitWaits}/${MAX_RATE_LIMIT_WAITS})`,
          );
          await sleep(wait);
          continue;
        }
        const wait = Math.min(delay, MAX_WAIT_MS);
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
      const core = (
        res.data as {
          resources?: Record<string, { remaining: number; limit: number; reset: number }>;
        }
      ).resources?.core;
      return core ?? null;
    } catch {
      return null;
    }
  }
}
