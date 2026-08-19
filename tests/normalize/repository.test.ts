import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { loadConfig } from '../../src/utils/config-loader.js';
import { detectHap } from '../../src/hap/detector.js';
import { detectPlatform } from '../../src/platform/detector.js';
import { classify } from '../../src/classification/classifier.js';
import { scoreRepository } from '../../src/scoring/scorer.js';
import { toRepositoryRecord } from '../../src/normalize/repository.js';
import { repositorySchema } from '../../src/schemas/repository.js';
import type { RepoAnalysis } from '../../src/pipeline/types.js';

describe('Normalization + schema', () => {
  let config: Awaited<ReturnType<typeof loadConfig>>;

  beforeAll(async () => {
    config = await loadConfig();
  });

  function analyze(item: RepoAnalysis): RepoAnalysis {
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
      const repo = item.repo!;
      a.hap = detectHap({ treePaths: item.treePaths, readme: item.readme, treeStatus: item.treeStatus });
    a.platform = detectPlatform({
      topics: repo.topics ?? [],
      readme: item.readme,
      description: repo.description,
      organization: repo.owner.type === 'Organization' ? repo.owner.login : null,
    });
    a.classification = classify(
      {
        topics: repo.topics ?? [],
        readme: item.readme,
        description: repo.description,
        languages: item.languages,
        treePaths: item.treePaths,
      },
      config.keywords,
    );
    a.score = scoreRepository(
      {
        hap: a.hap,
        platform_confidence: a.platform.platform_confidence,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        open_issues: repo.open_issues_count,
        license: repo.license?.spdx_id ?? null,
        readme: item.readme,
        pushed_at: repo.pushed_at,
        archived: repo.archived,
      },
      config.scoring,
    );
    return a;
  }

  const fixture = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'tests/fixtures/sample-fetched.json'), 'utf8'),
  );

  const byName: Record<string, RepoAnalysis> = {};
  for (const item of fixture.items) byName[item.full_name] = item;

  it('every analyzed repo validates against the Zod schema', () => {
    for (const item of fixture.items) {
      const a = analyze(item);
      const rec = toRepositoryRecord(a, '2026-01-01T00:00:00.000Z');
      expect(() => repositorySchema.parse(rec)).not.toThrow();
    }
  });

  it('binary / buildable are indexed; partial / invalid are rejected', () => {
    const binary = toRepositoryRecord(analyze(byName['acme/hap-binary-demo']), '2026-01-01T00:00:00.000Z');
    expect(binary.status).toBe('indexed');

    const buildable = toRepositoryRecord(analyze(byName['acme/hap-buildable']), '2026-01-01T00:00:00.000Z');
    expect(buildable.status).toBe('indexed');

    const readmeOnly = toRepositoryRecord(analyze(byName['acme/readme-only']), '2026-01-01T00:00:00.000Z');
    expect(readmeOnly.status).toBe('rejected');

    const plain = toRepositoryRecord(analyze(byName['acme/plain-ts']), '2026-01-01T00:00:00.000Z');
    expect(plain.status).toBe('rejected');

    const hsp = toRepositoryRecord(analyze(byName['acme/hsp-lib']), '2026-01-01T00:00:00.000Z');
    expect(hsp.status).toBe('rejected');
  });

  it('archived repos are marked archived, not indexed', () => {
    const archived = toRepositoryRecord(analyze(byName['acme/old-app']), '2026-01-01T00:00:00.000Z');
    expect(archived.status).toBe('archived');
  });

  it('organization is recorded for org-owned repos', () => {
    const org = toRepositoryRecord(analyze(byName['openharmony/sample']), '2026-01-01T00:00:00.000Z');
    expect(org.organization).toBe('openharmony');
  });

  it('GitHub raw URL is preserved and valid', () => {
    const r = toRepositoryRecord(analyze(byName['acme/hap-binary-demo']), '2026-01-01T00:00:00.000Z');
    expect(r.url).toBe('https://github.com/acme/hap-binary-demo');
  });
});
