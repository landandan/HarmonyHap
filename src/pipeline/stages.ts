import * as path from 'node:path';
import { Logger } from '../utils/logger.js';
import { mapWithConcurrency } from '../utils/concurrency.js';
import { writeText } from '../utils/io.js';
import { repositoryContentHash } from '../utils/hash.js';
import type { LoadedConfig } from '../utils/config-loader.js';
import { GitHubClient } from '../github/client.js';
import {
  discoverByTopics,
  discoverByQueries,
  discoverByOrgs,
  mergeDiscovered,
  type DiscoveredItem,
} from '../github/search.js';

import { fetchTreeSafe, treeSignature } from '../github/tree.js';
import { detectHap, treeItemsToPaths } from '../hap/detector.js';
import { detectPlatform } from '../platform/detector.js';
import { classify } from '../classification/classifier.js';
import { scoreRepository } from '../scoring/scorer.js';
import { normalizeAll } from '../normalize/repository.js';
import { generateReadme } from '../generation/readme.js';
import {
  computeStatistics,
  computeCategories,
  computeOrganizations,
} from '../generation/statistics.js';
import { generateAiContext, generateSystemPrompt } from '../generation/ai-context.js';
import { generateLlmsTxt, generateLlmsFullTxt } from '../generation/llms.js';
import {
  repositoriesFileSchema,
  statisticsSchema,
  categoriesFileSchema,
  organizationsFileSchema,
  type Repository,
  type Platform,
} from '../schemas/repository.js';
import type { PipelineState } from './state.js';
import type { RepoAnalysis } from './types.js';

const log = new Logger('PIPELINE');

export function getConcurrency(): number {
  const n = Number(process.env.HAP_CONCURRENCY);
  // Low default (was 6, then 4): GitHub's *secondary* rate limit (abuse
  // detection) is triggered by bursty concurrent traffic — the 403 without a
  // usable x-ratelimit-reset that never recovers. The throttling plugin now
  // serializes requests globally, and a small fan-out keeps bursts small.
  return Number.isFinite(n) && n > 0 ? n : 2;
}

function ownerOf(fullName: string): string {
  return fullName.split('/')[0] ?? '';
}

/**
 * Incremental reuse: if a previously indexed repository's content hash is
 * unchanged, copy its derived analysis (hap/platform/classification/score)
 * and skip re-detection. Saves GitHub API calls and keeps output stable.
 */
export function applyIncremental(
  analyses: RepoAnalysis[],
  prevRecords: Repository[],
): RepoAnalysis[] {
  const prevByFull = new Map(prevRecords.map((r) => [r.full_name, r]));
  let reused = 0;
  for (const a of analyses) {
    const prev = prevByFull.get(a.full_name);
    if (!prev || prev.status !== 'indexed' || !prev.content_hash) continue;
    const hash = repositoryContentHash({
      treeSignature: a.treeSignature,
      stars: a.repo?.stargazers_count ?? 0,
      pushedAt: a.repo?.pushed_at ?? '',
      archived: a.repo?.archived ?? false,
      topics: a.repo?.topics ?? [],
    });
    if (hash !== prev.content_hash) continue;
    a.hap = prev.hap;
    a.platform = {
      platform: prev.platform,
      platform_confidence: prev.platform_confidence,
      platform_evidence: prev.platform_evidence,
    };
    a.classification = {
      category: prev.category,
      classification_evidence: prev.classification_evidence,
    };
    a.score = {
      navigator_score: prev.navigator_score,
      score_breakdown: prev.score_breakdown ?? {},
      activity: prev.activity,
      quality: prev.quality,
    };
    a.content_hash = prev.content_hash;
    a.reused = true;
    reused++;
  }
  if (reused > 0) log.info(`[INCREMENTAL] reused ${reused} unchanged repositories`);
  return analyses;
}

/** Stage 1: GitHub discovery (topics + queries + orgs), dedup, apply exclude. */
export async function runDiscovery(
  state: PipelineState,
  config: LoadedConfig,
  client: GitHubClient,
  generatedAt: string,
): Promise<DiscoveredItem[]> {
  const searchOpts = {
    perPage: config.discovery.search.per_page,
    maxPages: config.discovery.search.max_pages,
    sort: config.discovery.search.sort,
    order: config.discovery.search.order,
  };

  log.info('[DISCOVERY] starting topic discovery');
  const byTopic = await discoverByTopics(client, config.discovery.topics, searchOpts);
  log.info(`[DISCOVERY] topics -> ${byTopic.size} candidates`);

  log.info('[DISCOVERY] starting query discovery');
  const byQuery = await discoverByQueries(client, config.discovery.search_queries, searchOpts);
  log.info(`[DISCOVERY] queries -> ${byQuery.size} candidates`);

  log.info('[DISCOVERY] starting organization discovery');
  const byOrg = await discoverByOrgs(client, config.discovery.organizations, {
    perPage: searchOpts.perPage,
    maxPages: searchOpts.maxPages,
  });

  let items = mergeDiscovered([byTopic, byQuery, byOrg], config.exclude.include.repositories);

  // Apply exclude rules.
  const exRepos = new Set(config.exclude.exclude.repositories);
  const exOrgs = new Set(config.exclude.exclude.organizations);
  items = items.filter((it) => {
    if (exRepos.has(it.full_name)) return false;
    if (exOrgs.has(ownerOf(it.full_name))) return false;
    return true;
  });
  // Drop excluded topic sources.
  if (config.exclude.exclude.keywords.length > 0) {
    const exKw = new Set(config.exclude.exclude.keywords);
    items = items
      .map((it) => ({
        ...it,
        discovered_by: it.discovered_by.filter((s) => {
          const m = /^topic:(.+)$/.exec(s);
          return !(m && exKw.has(m[1]));
        }),
      }))
      .filter((it) => it.discovered_by.length > 0);
  }

  await state.writeDiscovered(items, generatedAt);
  log.info(`[DISCOVERY] total candidates after exclude: ${items.length}`);
  return items;
}

/**
 * Build a fresh RepoAnalysis from a discovered item.
 * Carries the raw metadata supplied by the GitHub search / org response so no
 * extra `repos.get` call is required.
 */
function analysisFromDiscovered(item: DiscoveredItem): RepoAnalysis {
  return {
    id: item.repo?.id ?? item.id ?? 0,
    full_name: item.full_name,
    discovered_by: item.discovered_by,
    repo: item.repo ?? null,
    readme: null,
    languages: [],
    treePaths: [],
    treeStatus: 'unavailable',
    treeSignature: '',
  };
}

/**
 * Stage 2: fetch repository metadata + Git trees.
 *
 * Cost optimization vs. the previous design:
 *  - Search/topic/org responses already include the full `RawGitHubRepo`
 *    metadata, so `repos.get` (1 API call per repo) is dropped.
 *  - README + languages are deferred to the `enrich` stage and only fetched
 *    for repositories that actually show HAP evidence (binary or buildable).
 *  - Trees are cached on disk (7-day TTL) so unchanged repos are not
 *    re-fetched every daily run.
 */
export async function runFetch(
  state: PipelineState,
  _config: LoadedConfig,
  client: GitHubClient,
): Promise<RepoAnalysis[]> {
  const discovered = await state.readDiscovered();
  log.info(`[FETCH] fetching metadata + trees for ${discovered.length} repositories`);

  let requestsSinceQuotaCheck = 0;
  const results = await mapWithConcurrency(discovered, getConcurrency(), async (item) => {
    // Amortized rate-limit guard: check core quota once per 20 repos instead
    // of per repo (the /rate_limit endpoint is free but adds a round trip).
    if (requestsSinceQuotaCheck++ % 20 === 0) {
      await client.ensureQuota(20);
    }
    const analysis = analysisFromDiscovered(item);
    if (!analysis.repo) {
      // Manually included repo without search metadata: one metadata call.
      try {
        analysis.repo = await client.getRepository(analysis.full_name);
        analysis.id = analysis.repo.id;
      } catch (err) {
        analysis.error = (err as Error).message;
        log.warn(`[FETCH] metadata failed ${analysis.full_name}: ${(err as Error).message}`);
      }
    }
    // A repo with no metadata cannot be analyzed; leave tree unavailable.
    if (!analysis.repo) return analysis;
    const treeRes = await fetchTreeSafe(client, analysis.full_name, analysis.repo.default_branch);
    if (treeRes.ok) {
      analysis.treePaths = treeItemsToPaths(treeRes.tree.tree);
      analysis.treeStatus = treeRes.tree.truncated ? 'truncated' : 'ok';
      analysis.treeSignature = treeSignature(treeRes.tree);
      if (treeRes.tree.truncated) log.warn(`[TREE] truncated ${analysis.full_name}`);
    } else {
      analysis.treeStatus = 'unavailable';
      log.warn(`[TREE] unavailable ${analysis.full_name}: ${treeRes.error}`);
    }
    log.info(`[FETCH] ${analysis.full_name} stars=${analysis.repo.stargazers_count}`);
    return analysis;
  });

  await state.writeAnalysis(results, 'fetched', new Date().toISOString());
  return results;
}

/** Stage 2b (optional): fetch README + languages only for HAP-relevant repos. */
export async function runEnrich(
  state: PipelineState,
  _config: LoadedConfig,
  client: GitHubClient,
): Promise<RepoAnalysis[]> {
  const analyses = await state.readAnalysis('hap');
  const relevant = analyses.filter(
    (a) => a.hap?.status === 'binary' || a.hap?.status === 'buildable',
  );
  const skipped = analyses.length - relevant.length;
  log.info(
    `[ENRICH] fetching README + languages for ${relevant.length} HAP-verified repos (skipping ${skipped} non-HAP)`,
  );

  const bundleCache = new Map<string, Promise<{ readme: string | null; languages: string[] }>>();
  const enriched = await mapWithConcurrency(relevant, getConcurrency(), async (a) => {
    if ((a.readme !== null && a.readme !== undefined) || a.languages.length > 0) return a;
    if (!bundleCache.has(a.full_name)) {
      bundleCache.set(a.full_name, client.getReadmeAndLanguages(a.full_name));
    }
    const bundle = await bundleCache.get(a.full_name)!;
    a.readme = bundle.readme;
    a.languages = bundle.languages;
    log.info(
      `[ENRICH] ${a.full_name} readme=${a.readme?.length ?? 0} lang=${a.languages.join(',')}`,
    );
    return a;
  });
  const byName = new Map(analyses.map((a) => [a.full_name, a]));
  for (const a of enriched) {
    const target = byName.get(a.full_name);
    if (target) {
      target.readme = a.readme;
      target.languages = a.languages;
    }
  }
  const full = analyses.map((a) => byName.get(a.full_name) ?? a);
  await state.writeAnalysis(full, 'hap', new Date().toISOString());
  return full;
}

/**
 * Stage 3 (resume/backfill): fetch Git trees that are still unavailable.
 * In the normal flow, runFetch fetches metadata + trees together so this is a
 * cheap no-op; it exists so a crashed `npm run fetch` can be resumed with an
 * explicit `npm run fetch-tree` without re-fetching every repository.
 */
export async function runTree(
  state: PipelineState,
  _config: LoadedConfig,
  client: GitHubClient,
): Promise<RepoAnalysis[]> {
  const analyses = await state.readAnalysis('fetched');
  const missing = analyses.filter(
    (a) =>
      a.repo &&
      (a.treeStatus === 'unavailable' || (a.treeStatus !== 'ok' && a.treeStatus !== 'truncated')) &&
      a.treePaths.length === 0,
  );
  if (missing.length > 0) {
    log.info(`[TREE] backfilling ${missing.length} missing trees`);
  }
  const results = await mapWithConcurrency(missing, getConcurrency(), async (a) => {
    const treeRes = await fetchTreeSafe(client, a.full_name, a.repo!.default_branch);
    if (treeRes.ok) {
      a.treePaths = treeItemsToPaths(treeRes.tree.tree);
      a.treeStatus = treeRes.tree.truncated ? 'truncated' : 'ok';
      a.treeSignature = treeSignature(treeRes.tree);
      if (treeRes.tree.truncated) log.warn(`[TREE] truncated ${a.full_name}`);
    } else {
      log.warn(`[TREE] unavailable ${a.full_name}: ${treeRes.error}`);
    }
    return a;
  });
  // Merge backfilled values into the full analysis list, preserving order.
  if (missing.length > 0) {
    const byName = new Map(results.map((a) => [a.full_name, a]));
    const merged = analyses.map((a) => byName.get(a.full_name) ?? a);
    await state.writeAnalysis(merged, 'fetched', new Date().toISOString());
    return merged;
  }
  return analyses;
}

/** Stage 4: HAP detection. */
export function runHap(state: PipelineState): Promise<RepoAnalysis[]> {
  return transformStage(state, 'fetched', 'hap', (a) => {
    if (a.reused && a.hap) return a; // incremental reuse
    if (!a.repo) {
      a.hap = {
        status: 'invalid',
        score: 0,
        package_types: [],
        evidence: [],
        rejection_reasons: ['INVALID_REPOSITORY'],
      };
      log.info(`[HAP] ${a.full_name} status=invalid (no repo)`);
      return a;
    }
    a.hap = detectHap({
      treePaths: a.treePaths,
      readme: a.readme,
      treeStatus: a.treeStatus,
    });
    log.info(`[HAP] ${a.full_name} status=${a.hap.status} score=${a.hap.score}`);
    if (a.hap.status !== 'binary' && a.hap.status !== 'buildable') {
      log.info(`[SKIP] ${a.full_name} reason=${(a.hap.rejection_reasons ?? []).join(',')}`);
    }
    return a;
  });
}

/** Stage 5: platform detection. */
export function runPlatform(state: PipelineState): Promise<RepoAnalysis[]> {
  return transformStage(state, 'hap', 'platform', (a) => {
    if (a.reused && a.platform) return a; // incremental reuse
    const repo = a.repo;
    a.platform = detectPlatform({
      topics: repo?.topics ?? [],
      readme: a.readme,
      description: repo?.description ?? null,
      organization: repo?.owner.type === 'Organization' ? repo.owner.login : null,
    });
    log.info(
      `[PLATFORM] ${a.full_name} -> ${a.platform.platform.join(',')} (conf=${a.platform.platform_confidence})`,
    );
    return a;
  });
}

/** Stage 6: classification (+ overrides). */
export function runClassify(state: PipelineState, config: LoadedConfig): Promise<RepoAnalysis[]> {
  return transformStage(state, 'platform', 'classified', (a) => {
    if (a.reused && a.classification) return a; // incremental reuse
    const repo = a.repo;
    a.classification = classify(
      {
        topics: repo?.topics ?? [],
        readme: a.readme,
        description: repo?.description ?? null,
        languages: a.languages,
        treePaths: a.treePaths,
      },
      config.keywords,
    );
    const override = config.exclude.overrides[a.full_name];
    if (override?.category) {
      a.classification.category = Array.from(
        new Set([...a.classification.category, ...override.category]),
      );
    }
    if (override?.platform) {
      a.platform = {
        platform: override.platform as Platform[],
        platform_confidence: a.platform?.platform_confidence ?? 0.9,
        platform_evidence: [
          ...(a.platform?.platform_evidence ?? []),
          {
            source: 'config',
            type: 'config',
            value: `override platform: ${override.platform.join(', ')}`,
          },
        ],
      };
    }
    log.info(`[CLASSIFY] ${a.full_name} categories=${a.classification.category.join(',')}`);
    return a;
  });
}

/** Stage 7: scoring. */
export function runScore(state: PipelineState, config: LoadedConfig): Promise<RepoAnalysis[]> {
  return transformStage(state, 'classified', 'scored', (a) => {
    if (a.reused && a.score) return a; // incremental reuse
    const repo = a.repo;
    if (!repo || !a.hap || !a.platform) {
      a.score = {
        navigator_score: 0,
        score_breakdown: {},
        activity: { score: 0, status: 'unknown' },
        quality: { documentation: 0, community: 0, overall: 0 },
      };
      return a;
    }
    a.score = scoreRepository(
      {
        hap: a.hap,
        platform_confidence: a.platform.platform_confidence,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        open_issues: repo.open_issues_count,
        license: repo.license?.spdx_id ?? null,
        readme: a.readme,
        pushed_at: repo.pushed_at,
        archived: repo.archived,
      },
      config.scoring,
    );
    a.content_hash = repositoryContentHash({
      treeSignature: a.treeSignature,
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      archived: repo.archived,
      topics: repo.topics ?? [],
    });
    log.info(`[SCORE] ${a.full_name} navigator=${a.score.navigator_score}`);
    return a;
  });
}

/** Stage 8: normalize to canonical records + write data/repositories.json. */
export function runNormalize(
  state: PipelineState,
  config: LoadedConfig,
  generatedAt: string,
  write = true,
): Repository[] {
  const analyses = readStageSync(state, 'scored');
  const records = normalizeAll(analyses, config.exclude, generatedAt);
  const file = {
    schema_version: 1,
    generated_at: generatedAt,
    source: 'github',
    generated_by: 'harmonyos-hap-navigator',
    repositories: records,
  };
  repositoriesFileSchema.parse(file); // fail loudly on broken data
  if (write) {
    void state.writeDataFile('repositories.json', file);
  } else {
    log.info('[NORMALIZE] dry-run: skipping data/repositories.json write');
  }
  return records;
}

/** Stage 9: generate data/ + generated/ outputs. */
export async function runGenerate(
  state: PipelineState,
  config: LoadedConfig,
  repos: Repository[],
  totalDiscovered: number,
  generatedAt: string,
): Promise<void> {
  const stats = computeStatistics(repos, totalDiscovered, generatedAt);
  const categories = computeCategories(repos, config.categories, generatedAt);
  const organizations = computeOrganizations(repos, generatedAt);

  statisticsSchema.parse(stats);
  categoriesFileSchema.parse(categories);
  organizationsFileSchema.parse(organizations);
  void state.writeDataFile('statistics.json', stats);
  void state.writeDataFile('categories.json', categories);
  void state.writeDataFile('organizations.json', organizations);

  const readme = generateReadme(repos, stats, config.categories);
  const aiContext = generateAiContext(repos, stats, config.categories);
  const systemPrompt = generateSystemPrompt(stats);
  const llms = generateLlmsTxt(repos);
  const llmsFull = generateLlmsFullTxt(repos, stats, config.categories);

  await state.writeGenerated('README.md', readme);
  await state.writeGenerated('ai-context.md', aiContext);
  await state.writeGenerated('ai-system-prompt.md', systemPrompt);
  await state.writeGenerated('llms.txt', llms);
  await state.writeGenerated('llms-full.txt', llmsFull);

  // Sync navigator README to repository root.
  await writeText(path.join(process.cwd(), 'README.md'), readme);
  log.info(
    `[GENERATE] repositories=${repos.length} indexed=${stats.total_indexed} binary=${stats.hap_binary} buildable=${stats.hap_buildable}`,
  );
}

// ---- internal helpers ----

function readStageSync(state: PipelineState, stage: 'scored'): RepoAnalysis[] {
  return state.readAnalysisSync(stage);
}

async function transformStage(
  state: PipelineState,
  from: 'fetched' | 'hap' | 'platform' | 'classified',
  to: 'hap' | 'platform' | 'classified' | 'scored',
  fn: (a: RepoAnalysis) => RepoAnalysis,
): Promise<RepoAnalysis[]> {
  const items = await state.readAnalysis(from);
  const out = items.map(fn);
  await state.writeAnalysis(out, to, new Date().toISOString());
  return out;
}
