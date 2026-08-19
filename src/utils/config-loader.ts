import * as path from 'node:path';
import {
  allConfigSchema,
  discoverySchema,
  categoriesConfigSchema,
  keywordsConfigSchema,
  scoringConfigSchema,
  excludeConfigSchema,
  type AllConfig,
  type DiscoveryConfig,
  type CategoriesConfig,
  type KeywordsConfig,
  type ScoringConfig,
  type ExcludeConfig,
} from '../schemas/config.js';
import { readYaml } from './io.js';
import { Logger } from './logger.js';

const log = new Logger('CONFIG');

export interface LoadedConfig {
  discovery: DiscoveryConfig;
  categories: CategoriesConfig;
  keywords: KeywordsConfig;
  scoring: ScoringConfig;
  exclude: ExcludeConfig;
}

/**
 * Load all config YAML files from `configDir`, validate them with Zod, and
 * return a single typed config object. Business logic must read rules from
 * here — never hard-code keywords / weights in TypeScript.
 */
export async function loadConfig(configDir: string = 'config'): Promise<LoadedConfig> {
  const discovery = discoverySchema.parse(await readYaml(path.join(configDir, 'discovery.yml')));
  const categories = categoriesConfigSchema.parse(
    await readYaml(path.join(configDir, 'categories.yml')),
  );
  const keywords = keywordsConfigSchema.parse(await readYaml(path.join(configDir, 'keywords.yml')));
  const scoring = scoringConfigSchema.parse(await readYaml(path.join(configDir, 'scoring.yml')));
  const exclude = excludeConfigSchema.parse(await readYaml(path.join(configDir, 'exclude.yml')));

  const all: AllConfig = { discovery, categories, keywords, scoring, exclude };
  // Validate the whole bundle once more for cross-file consistency.
  allConfigSchema.parse(all);
  log.info(
    `loaded config: ${discovery.topics.length} topics, ${keywords.keywords.length} keyword rules, ${categories.categories.length} categories`,
  );
  return all;
}
