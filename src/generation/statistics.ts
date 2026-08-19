import type {
  Repository,
  Statistics,
  CategoriesFile,
  OrganizationsFile,
} from '../schemas/repository.js';
import type { CategoriesConfig } from '../schemas/config.js';
import { getCategoryMeta, categoryOrder } from '../classification/categories.js';
import { countUpdatedWithin } from '../utils/dates.js';
import { sortRepos } from './readme.js';

const SCHEMA_VERSION = 1;
const SOURCE = 'github';

/** Build the data/statistics.json payload. */
export function computeStatistics(
  repos: Repository[],
  totalDiscovered: number,
  generatedAt: string,
): Statistics {
  const indexed = repos.filter((r) => r.status === 'indexed');
  const platforms: Record<string, number> = {};
  const categories: Record<string, number> = {};
  for (const r of indexed) {
    for (const p of r.platform) platforms[p] = (platforms[p] ?? 0) + 1;
    for (const c of r.category) categories[c] = (categories[c] ?? 0) + 1;
  }
  return {
    schema_version: SCHEMA_VERSION,
    generated_at: generatedAt,
    source: SOURCE,
    total_discovered: totalDiscovered,
    total_indexed: indexed.length,
    hap_binary: repos.filter((r) => r.hap.status === 'binary').length,
    hap_buildable: repos.filter((r) => r.hap.status === 'buildable').length,
    rejected: repos.filter((r) => r.status === 'rejected').length,
    archived: repos.filter((r) => r.status === 'archived').length,
    platforms,
    categories,
    updated_last_24h: countUpdatedWithin(indexed, 1),
    updated_last_7d: countUpdatedWithin(indexed, 7),
    updated_last_30d: countUpdatedWithin(indexed, 30),
  };
}

/** Build data/categories.json (per-category counts + top repositories). */
export function computeCategories(
  repos: Repository[],
  config: CategoriesConfig,
  generatedAt: string,
  topPerCategory = 20,
): CategoriesFile {
  const indexed = repos.filter((r) => r.status === 'indexed');
  const order = categoryOrder(config);
  const categories = order
    .map((id) => {
      const meta = getCategoryMeta(config, id);
      const inCat = sortRepos(indexed.filter((r) => r.category.includes(id)));
      return {
        id: meta.id,
        label: meta.label,
        description: meta.description,
        count: inCat.length,
        repositories: inCat.slice(0, topPerCategory).map((r) => r.full_name),
      };
    })
    .filter((c) => c.count > 0);
  return { schema_version: SCHEMA_VERSION, generated_at: generatedAt, source: SOURCE, categories };
}

/** Build data/organizations.json. */
export function computeOrganizations(
  repos: Repository[],
  generatedAt: string,
  topPerOrg = 50,
): OrganizationsFile {
  const indexed = repos.filter((r) => r.status === 'indexed' && r.organization);
  const map = new Map<string, string[]>();
  for (const r of indexed) {
    const org = r.organization as string;
    if (!map.has(org)) map.set(org, []);
    map.get(org)!.push(r.full_name);
  }
  const organizations = Array.from(map.entries())
    .map(([name, reposForOrg]) => ({
      name,
      count: reposForOrg.length,
      repositories: sortRepos(
        indexed.filter((r) => r.organization === name),
      )
        .slice(0, topPerOrg)
        .map((r) => r.full_name),
    }))
    .sort((a, b) => b.count - a.count);
  return { schema_version: SCHEMA_VERSION, generated_at: generatedAt, source: SOURCE, organizations };
}
