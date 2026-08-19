import type { Evidence, PackageType } from '../schemas/hap.js';
import { HAP_RULES, BUILD_SYSTEM_RULE_IDS, type HapRule } from './rules.js';

export interface MatchedRule {
  rule: HapRule;
  evidence: Evidence;
  path?: string;
}

/** Scan tree paths for HAP / HSP / HAR package files. */
export function detectPackageTypes(paths: string[]): PackageType[] {
  const types = new Set<PackageType>();
  for (const p of paths) {
    const lower = p.toLowerCase();
    if (lower.endsWith('.hap')) types.add('HAP');
    else if (lower.endsWith('.hsp')) types.add('HSP');
    else if (lower.endsWith('.har')) types.add('HAR');
  }
  return Array.from(types);
}

/**
 * Score HAP evidence.
 *  - raw = sum of matched rule weights (may exceed 100)
 *  - normalized = min(100, round(raw))
 *  - strongStructure = has module.json5 + entry/ets (+ entry module) AND a build system
 */
export function scoreHapEvidence(matched: MatchedRule[]): {
  raw: number;
  normalized: number;
  package_types: PackageType[];
  strongStructure: boolean;
} {
  const raw = matched.reduce((acc, m) => acc + m.rule.weight, 0);
  const normalized = Math.min(100, Math.round(raw));

  const ids = new Set(matched.map((m) => m.rule.id));
  const hasModule = ids.has('module-json5');
  const hasEntryEts = ids.has('entry-ets') || ids.has('entry-module');
  const hasBuildSystem = BUILD_SYSTEM_RULE_IDS.some((id) => ids.has(id));
  const strongStructure = hasModule && hasEntryEts && hasBuildSystem;

  const packageTypes = new Set<PackageType>();
  for (const m of matched) {
    if (m.rule.packageType) packageTypes.add(m.rule.packageType);
  }

  return {
    raw,
    normalized,
    package_types: Array.from(packageTypes),
    strongStructure,
  };
}

export { HAP_RULES };
