import type { Evidence } from '../schemas/hap.js';
import type { KeywordRule, KeywordsConfig } from '../schemas/config.js';
import { loadKeywordRules } from './keywords.js';

export interface ClassificationInput {
  topics: string[];
  readme: string | null;
  description: string | null;
  languages: string[];
  treePaths: string[];
}

export interface ClassificationResult {
  category: string[];
  classification_evidence: Evidence[];
}

function signalForSource(
  source: KeywordRule['source'],
  input: ClassificationInput,
): string {
  switch (source) {
    case 'topic':
      return input.topics.join(' ');
    case 'readme':
      return input.readme ?? '';
    case 'description':
      return input.description ?? '';
    case 'language':
      return input.languages.join(' ');
    case 'file':
      return input.treePaths.join('\n');
    case 'any':
    default:
      return [
        input.topics.join(' '),
        input.readme ?? '',
        input.description ?? '',
        input.languages.join(' '),
        input.treePaths.join('\n'),
      ].join('\n');
  }
}

/**
 * Config-driven classifier. Assigns one or more categories based on keyword
 * rules and records evidence for every assignment. A repo with no matches is
 * assigned the `other` category.
 */
export function classify(input: ClassificationInput, config: KeywordsConfig): ClassificationResult {
  const rules = loadKeywordRules(config);
  const categories = new Set<string>();
  const evidence: Evidence[] = [];

  for (const rule of rules) {
    const text = signalForSource(rule.source, input).toLowerCase();
    if (!text) continue;
    let matched = false;
    if (rule.regex) {
      try {
        matched = new RegExp(rule.pattern, 'i').test(text);
      } catch {
        matched = false;
      }
    } else {
      matched = text.includes(rule.pattern.toLowerCase());
    }
    if (!matched) continue;

    for (const cat of rule.categories) {
      if (!categories.has(cat)) {
        categories.add(cat);
        evidence.push({
          source: 'github',
          type: rule.source === 'topic' ? 'topic' : rule.source === 'readme' ? 'readme' : 'file',
          value: `${cat} <- ${rule.source}:"${rule.pattern}"`,
          weight: rule.weight,
        });
      }
    }
  }

  if (categories.size === 0) {
    categories.add('other');
    evidence.push({
      source: 'github',
      type: 'metadata',
      value: 'other <- no keyword match',
      weight: 0,
    });
  }

  return {
    category: Array.from(categories),
    classification_evidence: evidence,
  };
}
