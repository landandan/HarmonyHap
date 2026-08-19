import { describe, it, expect, beforeAll } from 'vitest';
import { classify } from '../../src/classification/classifier.js';
import { loadConfig } from '../../src/utils/config-loader.js';
import type { KeywordsConfig } from '../../src/schemas/config.js';

describe('Classifier (config-driven)', () => {
  let config: KeywordsConfig;

  beforeAll(async () => {
    const loaded = await loadConfig();
    config = loaded.keywords;
  });

  function input(over: Partial<Parameters<typeof classify>[0]> = {}) {
    return {
      topics: [] as string[],
      readme: null,
      description: null,
      languages: [] as string[],
      treePaths: [] as string[],
      ...over,
    };
  }

  it('classifies ArkUI from topic', () => {
    const r = classify(input({ topics: ['arkui'] }), config);
    expect(r.category).toContain('arkui');
    expect(r.classification_evidence.length).toBeGreaterThan(0);
  });

  it('classifies ArkTS from topic', () => {
    const r = classify(input({ topics: ['arkts'] }), config);
    expect(r.category).toContain('arkts');
  });

  it('classifies database from topic', () => {
    const r = classify(input({ topics: ['database'] }), config);
    expect(r.category).toContain('database');
  });

  it('classifies network from topic', () => {
    const r = classify(input({ topics: ['network'] }), config);
    expect(r.category).toContain('network');
  });

  it('classifies AI from topic', () => {
    const r = classify(input({ topics: ['ai'] }), config);
    expect(r.category).toContain('ai');
  });

  it('classifies game from topic', () => {
    const r = classify(input({ topics: ['game'] }), config);
    expect(r.category).toContain('game');
  });

  it('classifies UI component from readme text', () => {
    const r = classify(input({ readme: 'A reusable UI component library for ArkUI' }), config);
    expect(r.category).toContain('ui-component');
  });

  it('falls back to other when nothing matches', () => {
    const r = classify(input({ topics: ['rust'], readme: 'rust crate' }), config);
    expect(r.category).toContain('other');
  });

  it('assigns multiple categories', () => {
    const r = classify(input({ topics: ['flutter', 'arkui'] }), config);
    expect(r.category).toContain('flutter');
    expect(r.category).toContain('arkui');
    expect(r.category).toContain('cross-platform');
  });
});
