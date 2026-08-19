import type { Evidence, Hap, HapStatus, PackageType } from '../schemas/hap.js';
import { HAP_RULES, isExtensionGlob, type HapRule } from './rules.js';
import { scoreHapEvidence, type MatchedRule } from './evidence.js';

export interface HapDetectionInput {
  /** Repository tree blob/ tree paths (relative). */
  treePaths: string[];
  /** README text (may be null). */
  readme: string | null;
  /** Tree availability; 'unavailable' forces a conservative verdict. */
  treeStatus?: 'ok' | 'truncated' | 'unavailable';
}

function basename(p: string): string {
  const i = p.lastIndexOf('/');
  return i >= 0 ? p.slice(i + 1) : p;
}

/** Match a single rule against the input; return evidence if matched. */
function matchRule(
  rule: HapRule,
  lowerPaths: string[],
  readme: string | null,
): { evidence: Evidence; path?: string } | null {
  if (rule.kind === 'readme') {
    if (!readme) return null;
    try {
      if (new RegExp(rule.match, 'i').test(readme)) {
        return { evidence: { source: 'github', type: 'readme', value: rule.evidence, weight: rule.weight } };
      }
    } catch {
      /* ignore bad regex */
    }
    return null;
  }

  if (rule.kind === 'tree_prefix') {
    const hit = lowerPaths.find((p) => p === rule.match || p.startsWith(rule.match + '/'));
    if (hit) {
      return {
        evidence: { source: 'github', type: 'file', value: rule.evidence, path: hit, weight: rule.weight },
        path: hit,
      };
    }
    return null;
  }

  // blob
  if (isExtensionGlob(rule.match)) {
    const ext = rule.match.slice(1).toLowerCase(); // ".hap"
    const hit = lowerPaths.find((p) => p.endsWith(ext));
    if (hit) {
      return {
        evidence: { source: 'github', type: 'file', value: rule.evidence, path: hit, weight: rule.weight },
        path: hit,
      };
    }
    return null;
  }
  const target = rule.match.toLowerCase();
  const hit = lowerPaths.find(
    (p) => p === target || basename(p) === target || p.endsWith('/' + target),
  );
  if (hit) {
    return {
      evidence: { source: 'github', type: 'file', value: rule.evidence, path: hit, weight: rule.weight },
      path: hit,
    };
  }
  return null;
}

/**
 * Core HAP detector.
 *
 * Returns a Hap record with one of: binary | buildable | partial | unknown | invalid.
 * Only `binary` and `buildable` may enter the official index.
 */
export function detectHap(input: HapDetectionInput): Hap {
  const lowerPaths = input.treePaths.map((p) => p.toLowerCase());
  const readme = input.readme;

  const matched: MatchedRule[] = [];
  for (const rule of HAP_RULES) {
    const m = matchRule(rule, lowerPaths, readme);
    if (m) matched.push({ rule, evidence: m.evidence, path: m.path });
  }

  const scored = scoreHapEvidence(matched);
  const hasHapBinary = scored.package_types.includes('HAP');
  const hasHsp = scored.package_types.includes('HSP');
  const hasHar = scored.package_types.includes('HAR');
  const treeUnavailable = input.treeStatus === 'unavailable';

  let status: HapStatus;
  let rejectionReasons: string[] = [];
  let readmeOnly = false;

  const hasHarmonyReadme =
    !!readme && /harmonyos|openharmony|\bohos\b/i.test(readme);

  if (treeUnavailable && !hasHapBinary) {
    status = 'unknown';
    rejectionReasons = ['TREE_UNAVAILABLE'];
  } else if (hasHapBinary) {
    status = 'binary';
  } else if (scored.strongStructure) {
    status = 'buildable';
  } else if (hasHsp || hasHar) {
    // HSP / HAR alone are libraries, not a full HAP application.
    status = 'partial';
    rejectionReasons = ['INSUFFICIENT_PROJECT_STRUCTURE'];
  } else if (matched.length > 0) {
    status = 'partial';
    const hasHarmonyDescriptor = matched.some(
      (m) => m.rule.id === 'module-json5' || m.rule.id === 'readme-hap',
    );
    rejectionReasons = [hasHarmonyDescriptor ? 'NO_HAP_EVIDENCE' : 'INSUFFICIENT_PROJECT_STRUCTURE'];
  } else if (hasHarmonyReadme) {
    // README mentions HarmonyOS/OpenHarmony but no project structure.
    status = 'partial';
    rejectionReasons = ['NO_HAP_EVIDENCE'];
    readmeOnly = true;
  } else {
    status = 'invalid';
    rejectionReasons = ['NOT_HARMONY_PROJECT'];
  }

  // Finalize package types.
  const packageTypes = new Set<PackageType>(scored.package_types);
  if (status === 'buildable') packageTypes.add('HAP'); // it is a HAP application project
  const package_types = Array.from(packageTypes);

  const evidence: Evidence[] = matched.map((m) => m.evidence);
  if (readmeOnly) {
    evidence.push({
      source: 'github',
      type: 'readme',
      value: 'README mentions HarmonyOS / OpenHarmony (no project structure)',
    });
  }

  return {
    status,
    score: scored.normalized,
    package_types,
    evidence,
    rejection_reasons: status === 'binary' || status === 'buildable' ? undefined : rejectionReasons,
  };
}

/** Convenience: extract blob/tree paths from tree items. */
export function treeItemsToPaths(
  items: Array<{ path: string; type: 'blob' | 'tree' }>,
): string[] {
  return items.map((i) => i.path).filter(Boolean);
}
