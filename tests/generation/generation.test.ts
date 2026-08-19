import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { loadConfig } from '../../src/utils/config-loader.js';
import { detectHap } from '../../src/hap/detector.js';
import { detectPlatform } from '../../src/platform/detector.js';
import { classify } from '../../src/classification/classifier.js';
import { scoreRepository } from '../../src/scoring/scorer.js';
import { toRepositoryRecord } from '../../src/normalize/repository.js';
import { computeStatistics, computeCategories, computeOrganizations } from '../../src/generation/statistics.js';
import { generateReadme } from '../../src/generation/readme.js';
import { generateAiContext, generateSystemPrompt } from '../../src/generation/ai-context.js';
import { generateLlmsTxt, generateLlmsFullTxt } from '../../src/generation/llms.js';
import { validateOutputs } from '../../src/validation.js';
import { PipelineState } from '../../src/pipeline/state.js';
import type { RepoAnalysis } from '../../src/pipeline/types.js';
import type { Repository } from '../../src/schemas/repository.js';

describe('Generation + validation', () => {
  let config: Awaited<ReturnType<typeof loadConfig>>;
  let repos: Repository[];
  let indexed: Repository[];

  beforeAll(async () => {
    config = await loadConfig();
    const fixture = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'tests/fixtures/sample-fetched.json'), 'utf8'),
    );
    const analyzed: RepoAnalysis[] = fixture.items.map((item: any) => {
      const a: RepoAnalysis = {
        id: item.id,
        full_name: item.full_name,
        discovered_by: item.discovered_by,
        repo: item.repo,
        readme: item.readme,
        languages: item.languages,
        treePaths: item.treePaths,
        treeStatus: item.treeStatus,
        treeSignature: item.treeSignature,
      };
      a.hap = detectHap({
        treePaths: item.treePaths,
        readme: item.readme,
        treeStatus: item.treeStatus,
      });
      a.platform = detectPlatform({
        topics: item.repo.topics ?? [],
        readme: item.readme,
        description: item.repo.description,
        organization: item.repo.owner.type === 'Organization' ? item.repo.owner.login : null,
      });
      a.classification = classify(
        {
          topics: item.repo.topics ?? [],
          readme: item.readme,
          description: item.repo.description,
          languages: item.languages,
          treePaths: item.treePaths,
        },
        config.keywords,
      );
      a.score = scoreRepository(
        {
          hap: a.hap,
          platform_confidence: a.platform.platform_confidence,
          stars: item.repo.stargazers_count,
          forks: item.repo.forks_count,
          open_issues: item.repo.open_issues_count,
          license: item.repo.license?.spdx_id ?? null,
          readme: item.readme,
          pushed_at: item.repo.pushed_at,
          archived: item.repo.archived,
        },
        config.scoring,
      );
      return a;
    });
    repos = analyzed.map((a) => toRepositoryRecord(a, '2026-01-01T00:00:00.000Z'));
    indexed = repos.filter((r) => r.status === 'indexed');
  });

  it('README contains all required sections', () => {
    const stats = computeStatistics(repos, repos.length, '2026-01-01T00:00:00.000Z');
    const md = generateReadme(repos, stats, config.categories);
    for (const section of [
      '# HarmonyOS HAP Open Source Navigator',
      '## 收录标准',
      '## HAP 验证规则',
      '## 项目统计',
      '## 精选项目',
      '## HarmonyOS NEXT',
      '## OpenHarmony',
      '## HarmonyOS',
      '## ArkUI',
      '## AI 使用说明',
    ]) {
      expect(md).toContain(section);
    }
    expect(md).not.toContain('undefined');
    expect(md).not.toMatch(/\bnull\b/);
  });

  it('README project count matches indexed repositories', () => {
    const stats = computeStatistics(repos, repos.length, '2026-01-01T00:00:00.000Z');
    const md = generateReadme(repos, stats, config.categories);
    for (const r of indexed) {
      expect(md).toContain(r.full_name);
    }
  });

  it('ai-context and system prompt contain rules', () => {
    const stats = computeStatistics(repos, repos.length, '2026-01-01T00:00:00.000Z');
    const ctx = generateAiContext(repos, stats, config.categories);
    const prompt = generateSystemPrompt(stats);
    expect(ctx).toContain('HAP 优先');
    expect(ctx).toContain('数据来源');
    expect(prompt).toContain('GitHub 是唯一事实来源');
    expect(ctx).not.toContain('undefined');
  });

  it('llms.txt and llms-full.txt are well-formed', () => {
    const stats = computeStatistics(repos, repos.length, '2026-01-01T00:00:00.000Z');
    const txt = generateLlmsTxt(repos, stats);
    const full = generateLlmsFullTxt(repos, stats, config.categories);
    expect(txt).toContain('# HarmonyOS HAP Open Source Navigator');
    expect(txt).toContain('data/repositories.json');
    for (const r of indexed) expect(full).toContain(r.full_name);
    expect(full).not.toContain('undefined');
  });

  it('validateOutputs passes on a written temp state', async () => {
    const tmp = path.join(os.tmpdir(), `hhn-test-${Date.now()}`);
    const state = new PipelineState(
      path.join(tmp, 'work'),
      path.join(tmp, 'data'),
      path.join(tmp, 'generated'),
    );
    await state.init();
    const generatedAt = '2026-01-01T00:00:00.000Z';
    const stats = computeStatistics(repos, repos.length, generatedAt);
    const categories = computeCategories(repos, config.categories, generatedAt);
    const organizations = computeOrganizations(repos, generatedAt);

    await state.writeDataFile('repositories.json', {
      schema_version: 1,
      generated_at: generatedAt,
      source: 'github',
      repositories: repos,
    });
    await state.writeDataFile('statistics.json', stats);
    await state.writeDataFile('categories.json', categories);
    await state.writeDataFile('organizations.json', organizations);
    await state.writeGenerated('README.md', generateReadme(repos, stats, config.categories));
    await state.writeGenerated('ai-context.md', generateAiContext(repos, stats, config.categories));
    await state.writeGenerated('llms.txt', generateLlmsTxt(repos, stats));
    await state.writeGenerated('llms-full.txt', generateLlmsFullTxt(repos, stats, config.categories));

    await expect(validateOutputs(state)).resolves.toBeUndefined();
    fs.rmSync(tmp, { recursive: true, force: true });
  });
});
