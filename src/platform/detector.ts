import type { Platform } from '../schemas/repository.js';
import type { Evidence } from '../schemas/hap.js';
import { PLATFORM_RULES, type PlatformRule, type PlatformSignalSource } from './rules.js';

export interface PlatformDetectionInput {
  topics: string[];
  readme: string | null;
  description: string | null;
  organization: string | null;
}

export interface PlatformDetectionResult {
  platform: Platform[];
  platform_confidence: number;
  platform_evidence: Evidence[];
}

function signalsForSource(
  source: PlatformSignalSource,
  input: PlatformDetectionInput,
): string {
  switch (source) {
    case 'topic':
      return input.topics.join(' ');
    case 'readme':
      return input.readme ?? '';
    case 'description':
      return input.description ?? '';
    case 'organization':
      return input.organization ?? '';
  }
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Detect platform (HarmonyOS / HarmonyOS NEXT / OpenHarmony / Multi-platform / Unknown)
 * from GitHub signals. Always records evidence so the verdict is traceable.
 */
export function detectPlatform(input: PlatformDetectionInput): PlatformDetectionResult {
  const evidence: Evidence[] = [];
  const weights: Record<string, number> = {
    OpenHarmony: 0,
    HarmonyOS: 0,
    'HarmonyOS NEXT': 0,
  };
  let hasOrgMatch = false;

  for (const rule of PLATFORM_RULES) {
    const text = signalsForSource(rule.source, input).toLowerCase();
    if (!text) continue;
    let matched = false;
    try {
      matched = new RegExp(rule.pattern, 'i').test(text);
    } catch {
      matched = false;
    }
    if (!matched) continue;
    weights[rule.platform] += rule.weight;
    if (rule.source === 'organization') hasOrgMatch = true;
    evidence.push({
      source: 'github',
      type: rule.source === 'topic' ? 'topic' : rule.source === 'readme' ? 'readme' : 'organization',
      value: `${rule.platform} <- ${rule.source}:/${rule.pattern}`,
      weight: rule.weight,
    });
  }

  const familyOH = weights['OpenHarmony'];
  const familyH = Math.max(weights['HarmonyOS'], weights['HarmonyOS NEXT']);

  let platform: Platform;
  if (familyOH > 0 && familyH > 0) {
    platform = 'Multi-platform';
  } else if (familyOH > 0) {
    platform = 'OpenHarmony';
  } else if (weights['HarmonyOS NEXT'] > 0) {
    platform = 'HarmonyOS NEXT';
  } else if (weights['HarmonyOS'] > 0) {
    platform = 'HarmonyOS';
  } else {
    platform = 'Unknown';
  }

  let confidence: number;
  if (platform === 'Unknown') {
    confidence = 0.2;
  } else {
    const strong = evidence.filter((e) => (e.weight ?? 0) >= 2).length;
    const weak = evidence.filter((e) => (e.weight ?? 0) < 2).length;
    confidence = clamp01(0.4 + 0.25 * strong + 0.08 * weak + (hasOrgMatch ? 0.15 : 0));
    confidence = Math.min(confidence, 0.98);
  }

  return {
    platform: [platform],
    platform_confidence: Number(confidence.toFixed(2)),
    platform_evidence: evidence,
  };
}
