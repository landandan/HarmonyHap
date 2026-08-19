import type { KeywordRule, KeywordsConfig } from '../schemas/config.js';

/**
 * Keyword rules come from config/keywords.yml (never hard-coded in TS).
 * This module loads them into a flat, match-ready list.
 */
export function loadKeywordRules(config: KeywordsConfig): KeywordRule[] {
  return config.keywords.map((k) => ({
    pattern: k.pattern,
    categories: [...k.categories],
    source: k.source,
    weight: k.weight,
    regex: k.regex,
  }));
}

export type { KeywordRule };
