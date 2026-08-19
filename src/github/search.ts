import { GitHubClient, GitHubError } from './client.js';
import { Logger } from '../utils/logger.js';
import type { RawGitHubRepo } from './types.js';

const log = new Logger('DISCOVERY');

export interface DiscoveredItem {
  id: number;
  full_name: string;
  discovered_by: string[];
  /** Raw repository data from the search / org listing; may be null for manually included repos. */
  repo?: RawGitHubRepo | null;
}

export interface SearchDiscoveryOptions {
  perPage?: number;
  maxPages?: number;
  sort?: string;
  order?: string;
  /** Append 'pushed:>=YYYY-MM-DD' to queries to focus on maintained repos. */
  pushedAfter?: string;
}

function withPushedFilter(base: string, pushedAfter?: string): string {
  return pushedAfter ? base + ' pushed:>=' + pushedAfter : base;
}

/**
 * Discovery helpers. These functions ONLY find candidate repositories using
 * GitHub topics / search / organizations. They never decide indexing — that is
 * the job of the HAP detector.
 */

type DiscoveredMap = Map<string, { sources: Set<string>; repo?: RawGitHubRepo }>;

export async function discoverByTopics(
  client: GitHubClient,
  topics: string[],
  opts: SearchDiscoveryOptions = {},
): Promise<DiscoveredMap> {
  const out: DiscoveredMap = new Map();
  for (const topic of topics) {
    const res = await client.searchRepositories(
      withPushedFilter('topic:' + topic, opts.pushedAfter),
      { perPage: opts.perPage, maxPages: opts.maxPages, sort: opts.sort, order: opts.order },
    );
    for (const r of res.items) {
      const key = r.full_name;
      if (!out.has(key)) out.set(key, { sources: new Set(), repo: r });
      out.get(key)!.sources.add('topic:' + topic);
    }
  }
  return out;
}

export async function discoverByQueries(
  client: GitHubClient,
  queries: string[],
  opts: SearchDiscoveryOptions = {},
): Promise<DiscoveredMap> {
  const out: DiscoveredMap = new Map();
  for (const q of queries) {
    const res = await client.searchRepositories(withPushedFilter(q, opts.pushedAfter), {
      perPage: opts.perPage,
      maxPages: opts.maxPages,
      sort: opts.sort,
      order: opts.order,
    });
    for (const r of res.items) {
      const key = r.full_name;
      if (!out.has(key)) out.set(key, { sources: new Set(), repo: r });
      out.get(key)!.sources.add('search:' + q);
    }
  }
  return out;
}

export async function discoverByOrgs(
  client: GitHubClient,
  orgs: string[],
  opts: { perPage?: number; maxPages?: number },
): Promise<DiscoveredMap> {
  const out: DiscoveredMap = new Map();
  for (const org of orgs) {
    try {
      const repos = await client.listOrgRepos(org, opts);
      for (const r of repos) {
        const key = r.full_name;
        if (!out.has(key)) out.set(key, { sources: new Set(), repo: r });
        out.get(key)!.sources.add('organization:' + org);
      }
    } catch (err) {
      const status = err instanceof GitHubError ? err.status : undefined;
      if (status === 404) {
        log.warn('organization "' + org + '" not found (404) — skipping org enumeration');
      } else {
        log.warn(
          'failed to enumerate organization "' +
            org +
            '": ' +
            (err as Error).message +
            ' — skipping',
        );
      }
    }
  }
  return out;
}

/** Merge multiple discovered maps (union of sources per repository). */
export function mergeDiscovered(
  maps: DiscoveredMap[],
  includeRepos: string[] = [],
): DiscoveredItem[] {
  const merged = new Map<string, { sources: Set<string>; repo?: RawGitHubRepo }>();
  for (const m of maps) {
    for (const [k, v] of m.entries()) {
      if (!merged.has(k)) {
        merged.set(k, { sources: new Set(v.sources), repo: v.repo });
      } else {
        for (const s of v.sources) merged.get(k)!.sources.add(s);
        if (!merged.get(k)!.repo) merged.get(k)!.repo = v.repo;
      }
    }
  }
  for (const inc of includeRepos) {
    if (!merged.has(inc)) merged.set(inc, { sources: new Set(['include:config']) });
  }
  return Array.from(merged.entries()).map(([full_name, v]) => ({
    id: v.repo?.id ?? 0,
    full_name,
    discovered_by: Array.from(v.sources),
    repo: v.repo ?? null,
  }));
}
