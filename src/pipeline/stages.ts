import * as path from 'node:path';
import { Logger } from '../utils/logger.js';
import { mapWithConcurrency } from '../utils/concurrency.js';
import { writeText } from '../utils/io.js';
import { repositoryContentHash } from '../utils/hash.js';
import { loadConfig, type LoadedConfig } from '../utils/config-loader.js';
import { GitHubClient } from '../github/client.js';
import {
  discoverByTopics,
  discoverByQueries,
  discoverByOrgs,
  mergeDiscovered,
  type DiscoveredItem,
} from '../github/search.js';
import { fetchRepositoryBundle } from '../github/repositories.js';
import { fetchTreeSafe, treeSignature } from '../github/tree.js';
import { detectHap, treeItemsToPaths } from '../hap/detector.js';
import { detectPlatform } from '../platform/detector.js';
import { classify } from '../classification/classifier.js';
import { scoreRepository } from '../scoring/scorer.js';
import { normalizeAll } from '../normalize/repository.js';
import {
  generateReadme,
} from '../generation/readme.js';
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
  return Number.isFinite(n) && n > 0 ? n : 6;
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
      readme: a.readme ?? '',
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

/** Stage 2: fetch repository metadata + README + languages. */
export async function runFetch(
  state: PipelineState,
  config: LoadedConfig,
  client: GitHubClient,
): Promise<RepoAnalysis[]> {
  const discovered = await state.readDiscovered();
  log.info(`[FETCH] fetching ${discovered.length} repositories`);

  const results = await mapWithConcurrency(discovered, getConcurrency(), async (item) => {
    const analysis: RepoAnalysis = {
      id: item.id,
      full_name: item.full_name,
      discovered_by: item.discovered_by,
      repo: null,
      readme: null,
      languages: [],
      treePaths: [],
      treeStatus: 'unavailable',
      treeSignature: '',
    };
    try {
      const repo = await client.getRepository(item.full_name);
      const bundle = await fetchRepositoryBundle(client, repo);
      analysis.repo = bundle.repo;
      analysis.readme = bundle.readme;
      analysis.languages = bundle.languages;
      analysis.id = repo.id;
      log.info(`[FETCH] ${item.full_name} stars=${repo.stargazers_count}`);
    } catch (err) {
      analysis.error = (err as Error).message;
      log.warn(`[FETCH] failed ${item.full_name}: ${(err as Error).message}`);
    }
    return analysis;
  });

  await state.writeAnalysis(results, 'fetched', new Date().toISOString());
  return results;
}

/** Stage 3: fetch Git trees. */
export async function runTree(
  state: PipelineState,
  _config: LoadedConfig,
  client: GitHubClient,
): Promise<RepoAnalysis[]> {
  const analyses = await state.readAnalysis('fetched');
  log.info(`[TREE] fetching trees for ${analyses.length} repositories`);

  const results = await mapWithConcurrency(analyses, getConcurrency(), async (a) => {
    if (!a.repo) {
      a.treeStatus = 'unavailable';
      return a;
    }
    const treeRes = await fetchTreeSafe(client, a.full_name, a.repo.default_branch);
    if (treeRes.ok) {
      a.treePaths = treeItemsToPaths(treeRes.tree.tree);
      a.treeStatus = treeRes.tree.truncated ? 'truncated' : 'ok';
      a.treeSignature = treeSignature(treeRes.tree);
      if (treeRes.tree.truncated) log.warn(`[TREE] truncated ${a.full_name}`);
    } else {
      a.treeStatus = 'unavailable';
      a.treePaths = [];
      log.warn(`[TREE] unavailable ${a.full_name}: ${treeRes.error}`);
    }
    return a;
  });

  await state.writeAnalysis(results, 'fetched', new Date().toISOString());
  return results;
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
      readme: a.readme ?? '',
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
  const llms = generateLlmsTxt(repos, stats);
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
