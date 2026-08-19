import { describe, it, expect, beforeAll } from 'vitest';
import { scoreRepository } from '../../src/scoring/scorer.js';
import { computeActivity } from '../../src/scoring/activity.js';
import { loadConfig } from '../../src/utils/config-loader.js';
import type { ScoringConfig } from '../../src/schemas/config.js';

describe('Scoring', () => {
  let config: ScoringConfig;

  beforeAll(async () => {
    const loaded = await loadConfig();
    config = loaded.scoring;
  });

  const base = {
    platform_confidence: 0.9,
    stars: 100,
    forks: 10,
    open_issues: 5,
    license: 'MIT',
    readme: '# App\nA HarmonyOS application with good documentation.',
    pushed_at: new Date().toISOString(),
    archived: false,
  };

  it('binary HAP scores higher than buildable', () => {
    const binary = scoreRepository(
      { ...base, hap: { status: 'binary', score: 30, package_types: ['HAP'] } },
      config,
    );
    const buildable = scoreRepository(
      { ...base, hap: { status: 'buildable', score: 95, package_types: ['HAP'] } },
      config,
    );
    expect(binary.navigator_score).toBeGreaterThan(0);
    expect(binary.navigator_score).toBeGreaterThanOrEqual(buildable.navigator_score);
  });

  it('high stars vs low stars differ', () => {
    const high = scoreRepository(
      { ...base, stars: 20000, hap: { status: 'binary', score: 30, package_types: ['HAP'] } },
      config,
    );
    const low = scoreRepository(
      { ...base, stars: 1, hap: { status: 'binary', score: 30, package_types: ['HAP'] } },
      config,
    );
    expect(high.score_breakdown.stars!).toBeGreaterThan(low.score_breakdown.stars!);
  });

  it('archived projects get penalized activity', () => {
    const active = computeActivity(
      { pushed_at: new Date().toISOString(), archived: false },
      config,
    );
    const archived = computeActivity(
      { pushed_at: new Date().toISOString(), archived: true },
      config,
    );
    expect(archived.score).toBeLessThan(active.score);
    expect(archived.status).toBe('archived');
  });

  it('score_breakdown sums to navigator_score', () => {
    const r = scoreRepository(
      { ...base, hap: { status: 'binary', score: 30, package_types: ['HAP'] } },
      config,
    );
    const sum = Object.values(r.score_breakdown).reduce((a, b) => a + b, 0);
    expect(sum).toBe(r.navigator_score);
    expect(r.navigator_score).toBeGreaterThanOrEqual(0);
    expect(r.navigator_score).toBeLessThanOrEqual(100);
  });

  it('produces activity + quality objects', () => {
    const r = scoreRepository(
      { ...base, hap: { status: 'buildable', score: 95, package_types: ['HAP'] } },
      config,
    );
    expect(r.activity).toHaveProperty('score');
    expect(r.quality).toHaveProperty('overall');
    expect(r.quality.overall).toBe(r.navigator_score);
  });

  it('stable given same input', () => {
    const a = scoreRepository(
      { ...base, hap: { status: 'binary', score: 30, package_types: ['HAP'] } },
      config,
    );
    const b = scoreRepository(
      { ...base, hap: { status: 'binary', score: 30, package_types: ['HAP'] } },
      config,
    );
    expect(a.navigator_score).toBe(b.navigator_score);
  });
});
