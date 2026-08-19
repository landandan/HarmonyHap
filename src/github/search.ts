import { GitHubClient, GitHubError } from './client.js';
import { Logger } from '../utils/logger.js';

const log = new Logger('DISCOVERY');

export interface DiscoveredItem {
  id: number;
  full_name: string;
  discovered_by: string[];
}

/**
 * Discovery helpers. These functions ONLY find candidate repositories using
 * GitHub topics / search / organizations. They never decide indexing — that is
 * the job of the HAP detector.
 */

export async function discoverByTopics(
  client: GitHubClient,
  topics: string[],
  opts: { perPage?: number; maxPages?: number; sort?: string; order?: string },
): Promise<Map<string, Set<string>>> {
  const out = new Map<string, Set<string>>();
  for (const topic of topics) {
    const res = await client.getByTopic(topic, opts);
    for (const r of res.items) {
      const key = r.full_name;
      if (!out.has(key)) out.set(key, new Set());
      out.get(key)!.add(`topic:${topic}`);
    }
  }
  return out;
}

export async function discoverByQueries(
  client: GitHubClient,
  queries: string[],
  opts: { perPage?: number; maxPages?: number; sort?: string; order?: string },
): Promise<Map<string, Set<string>>> {
  const out = new Map<string, Set<string>>();
  for (const q of queries) {
    const res = await client.searchRepositories(q, opts);
    for (const r of res.items) {
      const key = r.full_name;
      if (!out.has(key)) out.set(key, new Set());
      out.get(key)!.add(`search:${q}`);
    }
  }
  return out;
}

export async function discoverByOrgs(
  client: GitHubClient,
  orgs: string[],
  opts: { perPage?: number; maxPages?: number },
): Promise<Map<string, Set<string>>> {
  const out = new Map<string, Set<string>>();
  for (const org of orgs) {
    try {
      const repos = await client.listOrgRepos(org, opts);
      for (const r of repos) {
        const key = r.full_name;
        if (!out.has(key)) out.set(key, new Set());
        out.get(key)!.add(`organization:${org}`);
      }
    } catch (err) {
      // A single broken/missing org must not abort the whole discovery run.
      const status = err instanceof GitHubError ? err.status : undefined;
      if (status === 404) {
        log.warn(`organization "${org}" not found (404) — skipping org enumeration`);
      } else {
        log.warn(
          `failed to enumerate organization "${org}": ${(err as Error).message} — skipping`,
        );
      }
    }
  }
  return out;
}

/** Merge multiple discovered maps (union of sources per repository). */
export function mergeDiscovered(
  maps: Array<Map<string, Set<string>>>,
  includeRepos: string[] = [],
): DiscoveredItem[] {
  const merged = new Map<string, Set<string>>();
  for (const m of maps) {
    for (const [k, v] of m.entries()) {
      if (!merged.has(k)) merged.set(k, new Set());
      for (const s of v) merged.get(k)!.add(s);
    }
  }
  for (const inc of includeRepos) {
    if (!merged.has(inc)) merged.set(inc, new Set(['include:config']));
  }
  return Array.from(merged.entries()).map(([full_name, set]) => ({
    id: 0,
    full_name,
    discovered_by: Array.from(set),
  }));
}
