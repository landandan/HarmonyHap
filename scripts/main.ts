import * as path from 'node:path';
import { execSync } from 'node:child_process';
import { Logger } from '../src/utils/logger.js';
import { loadConfig, type LoadedConfig } from '../src/utils/config-loader.js';
import { PipelineState } from '../src/pipeline/state.js';
import { GitHubClient, GitHubAuthError } from '../src/github/client.js';
import { repositoriesFileSchema, type Repository } from '../src/schemas/repository.js';
import { readJson } from '../src/utils/io.js';
import {
  runDiscovery,
  runFetch,
  runTree,
  runHap,
  runPlatform,
  runClassify,
  runScore,
  runNormalize,
  runGenerate,
  applyIncremental,
} from '../src/pipeline/stages.js';
import { validateOutputs } from '../src/validation.js';
import { computeStatistics } from '../src/generation/statistics.js';
import type { RepoAnalysis } from '../src/pipeline/types.js';

const log = new Logger('MAIN');

interface Flags {
  dryRun: boolean;
  sample: boolean;
  commit: boolean;
  incremental: boolean;
}

function parseFlags(argv: string[]): Flags {
  const f = new Set(argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2)));
  return {
    dryRun: f.has('dry-run'),
    sample: f.has('sample'),
    commit: f.has('commit'),
    incremental: f.has('incremental'),
  };
}

function printStats(discovered: number, repos: Repository[]): void {
  const stats = computeStatistics(repos, discovered, new Date().toISOString());
  console.error('');
  console.error('==== Pipeline summary ====');
  console.error(`Discovered:       ${discovered}`);
  console.error(`Indexed:          ${stats.total_indexed}`);
  console.error(`HAP Binary:       ${stats.hap_binary}`);
  console.error(`HAP Buildable:    ${stats.hap_buildable}`);
  console.error(`Rejected:         ${stats.rejected}`);
  console.error(`Archived:         ${stats.archived}`);
  console.error(`Updated 7d / 30d: ${stats.updated_last_7d} / ${stats.updated_last_30d}`);
  console.error('===========================');
  console.error('');
}

async function loadSampleFixture(): Promise<RepoAnalysis[]> {
  const p = path.join(process.cwd(), 'tests', 'fixtures', 'sample-fetched.json');
  const data = await readJson<{ items: RepoAnalysis[] }>(p);
  return data.items ?? [];
}

async function maybeCommitPush(message: string): Promise<void> {
  if (!process.env.GITHUB_ACTIONS) return;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) {
    log.warn('GITHUB_TOKEN / GITHUB_REPOSITORY missing; skipping push');
    return;
  }
  try {
    execSync('git config user.name "github-actions[bot]"', { stdio: 'ignore' });
    execSync('git config user.email "github-actions[bot]@users.noreply.github.com"', {
      stdio: 'ignore',
    });
    execSync('git add data generated README.md', { stdio: 'ignore' });
    const diff = execSync('git diff --cached --stat').toString().trim();
    if (!diff) {
      log.info('no changes to commit');
      return;
    }
    execSync(`git commit -m "${message}"`, { stdio: 'ignore' });
    const remote = `https://x-access-token:${token}@github.com/${repo}.git`;
    execSync(`git push "${remote}" HEAD`, { stdio: 'ignore' });
    log.info(`committed & pushed: ${message}`);
  } catch (e) {
    log.error(`commit/push failed: ${(e as Error).message}`);
  }
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const config: LoadedConfig = await loadConfig();
  const state = new PipelineState();
  await state.init();
  const generatedAt = new Date().toISOString();

  let discovered = 0;
  let client: GitHubClient | null = null;

  if (flags.sample) {
    log.info('SAMPLE mode: using bundled fixtures (no GitHub API)');
    const fixture = await loadSampleFixture();
    discovered = fixture.length;
    await state.writeAnalysis(fixture, 'fetched', generatedAt);
  } else {
    try {
      const cacheDir = process.env.HAP_CACHE_DIR ?? '.cache/github';
      client = new GitHubClient({ cacheDir });
    } catch (e) {
      if (e instanceof GitHubAuthError) {
        console.error('[AUTH] ' + e.message);
        process.exit(1);
      }
      throw e;
    }
    const items = await runDiscovery(state, config, client, generatedAt);
    discovered = items.length;
    await runFetch(state, config, client);
    await runTree(state, config, client);
    await client.persistCache();
  }

  // Incremental reuse from previously committed data.
  if (flags.incremental) {
    const prev = await state.readDataFile<unknown>('repositories.json');
    if (prev) {
      const records = repositoriesFileSchema.parse(prev).repositories;
      const fetched = await state.readAnalysis('fetched');
      await state.writeAnalysis(applyIncremental(fetched, records), 'fetched', generatedAt);
    }
  }

  await runHap(state);
  await runPlatform(state);
  await runClassify(state, config);
  await runScore(state, config);

  const records = runNormalize(state, config, generatedAt, !flags.dryRun);

  if (flags.dryRun) {
    printStats(discovered, records);
    log.info('DRY-RUN: no data written, no commit/push');
    return;
  }

  await runGenerate(state, config, records, discovered, generatedAt);
  await validateOutputs(state);

  printStats(discovered, records);

  if (!flags.sample && (flags.commit || process.env.GITHUB_ACTIONS)) {
    await maybeCommitPush('chore(data): update harmonyos repositories');
  } else if (flags.sample) {
    log.info('SAMPLE mode: outputs written locally, no commit (do not push sample data)');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
