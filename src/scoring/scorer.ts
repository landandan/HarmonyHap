import type { ScoringConfig } from '../schemas/config.js';
import type { Activity, Quality } from '../schemas/repository.js';
import type { HapStatus } from '../schemas/hap.js';
import type { PackageType } from '../schemas/hap.js';
import { computeActivity } from './activity.js';

export interface ScoreInput {
  hap: { status: HapStatus; score: number; package_types: PackageType[] };
  platform_confidence: number;
  stars: number;
  forks: number;
  open_issues: number;
  license: string | null;
  readme: string | null;
  pushed_at: string;
  archived: boolean;
}

export interface ScoreResult {
  navigator_score: number;
  score_breakdown: Record<string, number>;
  activity: Activity;
  quality: Quality;
}

function pickThreshold(value: number, list: Array<{ min: number; score: number }>): number {
  const sorted = [...list].sort((a, b) => b.min - a.min);
  for (const t of sorted) {
    if (value >= t.min) return t.score;
  }
  return 0;
}

function computeDocumentation(
  readme: string | null,
  cfg: ScoringConfig['documentation'],
): number {
  if (!readme) return 0;
  const len = readme.length;
  const base = cfg.has_readme_score;
  if (len >= cfg.good_length) return cfg.max_score;
  if (len <= 0) return 0;
  const span = Math.max(1, cfg.good_length - cfg.min_length);
  const ratio = Math.min(1, Math.max(0, (len - cfg.min_length) / span));
  return Math.min(cfg.max_score, base + ratio * (cfg.max_score - base));
}

function computeLicense(license: string | null, cfg: ScoringConfig['license']): number {
  if (!license) return cfg.none_score;
  const spdx = license.toUpperCase();
  if (cfg.preferred.map((p) => p.toUpperCase()).includes(spdx)) return cfg.preferred_score;
  return cfg.any_license_score;
}

/**
 * Weighted navigator score. All weights come from config/scoring.yml.
 * navigator_score = sum(weight_i * component_i); breakdown_i = round(weight_i * component_i).
 */
export function scoreRepository(input: ScoreInput, config: ScoringConfig): ScoreResult {
  const w = config.weights;

  // HAP component
  const mult =
    input.hap.status === 'binary'
      ? config.hap.binary_multiplier
      : input.hap.status === 'buildable'
        ? config.hap.buildable_multiplier
        : 1;
  const hapComp = Math.min(100, input.hap.score * mult);

  // Platform component
  const platformComp = Math.max(0, Math.min(100, input.platform_confidence * 100));

  // Activity component
  const activity = computeActivity(
    { pushed_at: input.pushed_at, archived: input.archived },
    config,
  );
  const activityComp = activity.score;

  // Community component
  const forksScore = pickThreshold(input.forks, config.community.forks);
  const issuesScore = pickThreshold(input.open_issues, config.community.open_issues);
  const communityComp = Math.round((forksScore + issuesScore) / 2);

  // Documentation component
  const docComp = Math.round(computeDocumentation(input.readme, config.documentation));

  // License component
  const licenseComp = Math.round(computeLicense(input.license, config.license));

  // Stars component (piecewise, never linear)
  const starsComp = pickThreshold(input.stars, config.stars.thresholds);

  const components: Record<string, number> = {
    hap: hapComp,
    platform: platformComp,
    activity: activityComp,
    community: communityComp,
    documentation: docComp,
    license: licenseComp,
    stars: starsComp,
  };

  const breakdown: Record<string, number> = {};
  let navigator = 0;
  for (const key of Object.keys(components)) {
    const weight = (w as Record<string, number>)[key] ?? 0;
    const part = Math.round(weight * components[key]);
    breakdown[key] = part;
    navigator += part;
  }

  const quality: Quality = {
    documentation: docComp,
    community: communityComp,
    overall: navigator,
  };

  return {
    navigator_score: navigator,
    score_breakdown: breakdown,
    activity,
    quality,
  };
}
