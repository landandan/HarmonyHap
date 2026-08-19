import type { Platform } from '../schemas/repository.js';

export type PlatformSignalSource = 'topic' | 'readme' | 'description' | 'organization';

export interface PlatformRule {
  platform: Platform;
  /** RegExp source, matched case-insensitively against the signal text. */
  pattern: string;
  source: PlatformSignalSource;
  weight: number;
}

/**
 * Platform evidence rules. Keywords are evidence, not proof; the detector
 * combines them with organization / structure signals to decide the platform.
 */
export const PLATFORM_RULES: PlatformRule[] = [
  // OpenHarmony
  { platform: 'OpenHarmony', pattern: 'openharmony', source: 'topic', weight: 2 },
  { platform: 'OpenHarmony', pattern: 'openharmony', source: 'readme', weight: 1 },
  { platform: 'OpenHarmony', pattern: 'open harmony', source: 'readme', weight: 1 },
  { platform: 'OpenHarmony', pattern: '\\bohos\\b', source: 'readme', weight: 1 },
  { platform: 'OpenHarmony', pattern: 'openharmony', source: 'organization', weight: 3 },
  { platform: 'OpenHarmony', pattern: 'ohos', source: 'organization', weight: 2 },

  // HarmonyOS
  { platform: 'HarmonyOS', pattern: 'harmonyos', source: 'topic', weight: 2 },
  { platform: 'HarmonyOS', pattern: 'harmonyos', source: 'readme', weight: 1 },
  { platform: 'HarmonyOS', pattern: 'deveco', source: 'readme', weight: 1 },
  { platform: 'HarmonyOS', pattern: 'harmonyos', source: 'organization', weight: 2 },

  // HarmonyOS NEXT
  { platform: 'HarmonyOS NEXT', pattern: 'harmonyos[ -]?next', source: 'topic', weight: 3 },
  { platform: 'HarmonyOS NEXT', pattern: 'harmonyos next', source: 'readme', weight: 2 },
  { platform: 'HarmonyOS NEXT', pattern: 'harmonyos-next', source: 'readme', weight: 2 },
  { platform: 'HarmonyOS NEXT', pattern: 'api 1[234]', source: 'readme', weight: 2 },
  { platform: 'HarmonyOS NEXT', pattern: '\\barkui\\b', source: 'readme', weight: 1 },
  { platform: 'HarmonyOS NEXT', pattern: 'harmonyos next', source: 'description', weight: 2 },
  { platform: 'HarmonyOS NEXT', pattern: 'harmonyos-next', source: 'organization', weight: 3 },
];
