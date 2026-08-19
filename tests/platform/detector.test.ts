import { describe, it, expect } from 'vitest';
import { detectPlatform } from '../../src/platform/detector.js';

describe('Platform detector', () => {
  it('detects HarmonyOS from topic', () => {
    const r = detectPlatform({
      topics: ['harmonyos'],
      readme: null,
      description: null,
      organization: null,
    });
    expect(r.platform).toEqual(['HarmonyOS']);
    expect(r.platform_confidence).toBeGreaterThan(0);
  });

  it('detects HarmonyOS NEXT from API 12 + ArkUI', () => {
    const r = detectPlatform({
      topics: ['arkui'],
      readme: 'Built for HarmonyOS NEXT with API 12 and ArkUI',
      description: null,
      organization: null,
    });
    expect(r.platform).toEqual(['HarmonyOS NEXT']);
  });

  it('detects OpenHarmony from organization', () => {
    const r = detectPlatform({
      topics: ['openharmony'],
      readme: null,
      description: null,
      organization: 'openharmony',
    });
    expect(r.platform).toEqual(['OpenHarmony']);
    expect(r.platform_confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('detects OpenHarmony from ohos keyword', () => {
    const r = detectPlatform({
      topics: ['ohos'],
      readme: 'OHOS sample',
      description: null,
      organization: null,
    });
    expect(r.platform).toEqual(['OpenHarmony']);
  });

  it('detects Multi-platform when both families appear', () => {
    const r = detectPlatform({
      topics: ['harmonyos', 'openharmony'],
      readme: 'HarmonyOS and OpenHarmony compatible',
      description: null,
      organization: null,
    });
    expect(r.platform).toEqual(['Multi-platform']);
  });

  it('returns Unknown with low confidence when no signal', () => {
    const r = detectPlatform({
      topics: ['rust'],
      readme: 'A rust library',
      description: null,
      organization: null,
    });
    expect(r.platform).toEqual(['Unknown']);
    expect(r.platform_confidence).toBeLessThanOrEqual(0.3);
  });

  it('does not confuse NEXT with generic HarmonyOS', () => {
    const next = detectPlatform({
      topics: ['harmonyos-next'],
      readme: null,
      description: null,
      organization: null,
    });
    expect(next.platform).toEqual(['HarmonyOS NEXT']);

    const plain = detectPlatform({
      topics: ['harmonyos'],
      readme: null,
      description: null,
      organization: null,
    });
    expect(plain.platform).toEqual(['HarmonyOS']);
  });

  it('records platform evidence', () => {
    const r = detectPlatform({
      topics: ['openharmony'],
      readme: null,
      description: null,
      organization: 'openharmony',
    });
    expect(r.platform_evidence.length).toBeGreaterThan(0);
  });
});
