import type { PackageType } from '../schemas/hap.js';

export type HapRuleKind = 'blob' | 'tree_prefix' | 'readme';

export interface HapRule {
  id: string;
  kind: HapRuleKind;
  /**
   * - blob: exact basename (e.g. "module.json5") or extension glob ("*.hap")
   * - tree_prefix: path prefix that must be present (e.g. "entry/src/main/ets")
   * - readme: RegExp source string matched against README text
   */
  match: string;
  weight: number;
  evidence: string;
  /** If matched, this package type is inferred (e.g. *.hap -> HAP). */
  packageType?: PackageType;
}

/**
 * HAP evidence rules. Weights are intentionally configurable here but also
 * documented in README. Total raw weight may exceed 100; it is normalized.
 */
export const HAP_RULES: HapRule[] = [
  {
    id: 'hap-binary',
    kind: 'blob',
    match: '*.hap',
    weight: 30,
    evidence: 'Detected packaged .hap binary file',
    packageType: 'HAP',
  },
  {
    id: 'module-json5',
    kind: 'blob',
    match: 'module.json5',
    weight: 20,
    evidence: 'HarmonyOS module descriptor (module.json5)',
  },
  {
    id: 'entry-ets',
    kind: 'tree_prefix',
    match: 'entry/src/main/ets',
    weight: 15,
    evidence: 'ArkTS entry source directory (entry/src/main/ets)',
  },
  {
    id: 'entry-module',
    kind: 'blob',
    match: 'entry/src/main/module.json5',
    weight: 15,
    evidence: 'Entry module descriptor (entry/src/main/module.json5)',
  },
  {
    id: 'build-profile',
    kind: 'blob',
    match: 'build-profile.json5',
    weight: 10,
    evidence: 'Build profile (build-profile.json5)',
  },
  {
    id: 'hvigor-ts',
    kind: 'blob',
    match: 'hvigorfile.ts',
    weight: 10,
    evidence: 'Hvigor build script (hvigorfile.ts)',
  },
  {
    id: 'hvigor-js',
    kind: 'blob',
    match: 'hvigorfile.js',
    weight: 10,
    evidence: 'Hvigor build script (hvigorfile.js)',
  },
  {
    id: 'oh-package',
    kind: 'blob',
    match: 'oh-package.json5',
    weight: 10,
    evidence: 'OHOS package manifest (oh-package.json5)',
  },
  {
    id: 'hsp-binary',
    kind: 'blob',
    match: '*.hsp',
    weight: 0,
    evidence: 'Detected .hsp package file (HSP, not a full app)',
    packageType: 'HSP',
  },
  {
    id: 'har-binary',
    kind: 'blob',
    match: '*.har',
    weight: 0,
    evidence: 'Detected .har package file (HAR, not a full app)',
    packageType: 'HAR',
  },
  {
    id: 'readme-hap',
    kind: 'readme',
    match: '\\b\\.?hap\\b',
    weight: 5,
    evidence: 'README references HAP build / release',
  },
];

/** IDs that together imply a buildable HAP application (no committed binary). */
export const BUILDABLE_RULE_IDS = ['module-json5', 'entry-ets', 'entry-module'];
export const BUILD_SYSTEM_RULE_IDS = ['build-profile', 'hvigor-ts', 'hvigor-js', 'oh-package'];

export function isExtensionGlob(match: string): boolean {
  return match.startsWith('*.');
}
