import { describe, it, expect } from 'vitest';
import { detectHap } from '../../src/hap/detector.js';

describe('HAP detector', () => {
  it('Case 1: detects a real .hap binary', () => {
    const r = detectHap({ treePaths: ['release/app.hap'], readme: null });
    expect(r.status).toBe('binary');
    expect(r.package_types).toContain('HAP');
    expect(r.score).toBeGreaterThan(0);
  });

  it('Case 2: detects a buildable HAP project (no binary)', () => {
    const r = detectHap({
      treePaths: [
        'entry/src/main/ets/MainAbility.ts',
        'entry/src/main/module.json5',
        'build-profile.json5',
        'hvigorfile.ts',
        'oh-package.json5',
      ],
      readme: 'HarmonyOS app',
    });
    expect(r.status).toBe('buildable');
    expect(r.package_types).toContain('HAP');
  });

  it('Case 3: README only with HarmonyOS text is rejected (partial)', () => {
    const r = detectHap({ treePaths: ['README.md'], readme: 'HarmonyOS application' });
    expect(r.status).toBe('partial');
    expect(r.rejection_reasons).toContain('NO_HAP_EVIDENCE');
  });

  it('Case 4: plain TypeScript project is invalid', () => {
    const r = detectHap({ treePaths: ['src/index.ts', 'package.json'], readme: null });
    expect(r.status).toBe('invalid');
    expect(r.rejection_reasons).toContain('NOT_HARMONY_PROJECT');
  });

  it('HSP-only library is not a full HAP app', () => {
    const r = detectHap({
      treePaths: ['library/src/main/module.json5', 'dist/library.hsp'],
      readme: 'HSP library',
    });
    expect(r.status).toBe('partial');
    expect(r.package_types).toContain('HSP');
    expect(r.package_types).not.toContain('HAP');
  });

  it('HAR-only library is not a full HAP app', () => {
    const r = detectHap({ treePaths: ['library/src/main/module.json5', 'dist/x.har'], readme: null });
    expect(r.status).toBe('partial');
    expect(r.package_types).toContain('HAR');
  });

  it('HAP + HSP is allowed (binary)', () => {
    const r = detectHap({
      treePaths: ['release/app.hap', 'library/build-profile.json5', 'dist/lib.hsp'],
      readme: null,
    });
    expect(r.status).toBe('binary');
    expect(r.package_types).toEqual(expect.arrayContaining(['HAP', 'HSP']));
  });

  it('only ArkTS files (no module.json5 / entry) is not buildable', () => {
    const r = detectHap({
      treePaths: ['src/main/ets/Foo.ts', 'hvigorfile.ts'],
      readme: null,
    });
    expect(r.status).toBe('partial');
    expect(r.rejection_reasons).toContain('INSUFFICIENT_PROJECT_STRUCTURE');
  });

  it('unavailable tree forces unknown', () => {
    const r = detectHap({ treePaths: [], readme: null, treeStatus: 'unavailable' });
    expect(r.status).toBe('unknown');
    expect(r.rejection_reasons).toContain('TREE_UNAVAILABLE');
  });

  it('scores cap at 100', () => {
    const r = detectHap({
      treePaths: [
        'release/app.hap',
        'entry/src/main/ets/MainAbility.ts',
        'entry/src/main/module.json5',
        'build-profile.json5',
        'hvigorfile.ts',
        'hvigorfile.js',
        'oh-package.json5',
        'README.md',
      ],
      readme: 'build hap release',
    });
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
