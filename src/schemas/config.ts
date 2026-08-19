import { z } from 'zod';

export const discoverySchema = z.object({
  topics: z.array(z.string()),
  search_queries: z.array(z.string()),
  organizations: z.array(z.string()),
  search: z
    .object({
      per_page: z.number().int().positive().default(100),
      max_pages: z.number().int().positive().default(5),
      sort: z.string().default('stars'),
      order: z.string().default('desc'),
      pushed_after: z.string().optional(),
    })
    .default({}),
  dedup: z
    .object({
      by: z.enum(['id', 'full_name']).default('full_name'),
    })
    .default({}),
});
export type DiscoveryConfig = z.infer<typeof discoverySchema>;

export const categoryMetaSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
});
export const categoriesConfigSchema = z.object({
  categories: z.array(categoryMetaSchema),
  category_order: z.array(z.string()).optional(),
});
export type CategoriesConfig = z.infer<typeof categoriesConfigSchema>;

export const keywordRuleSchema = z.object({
  pattern: z.string(),
  categories: z.array(z.string()),
  source: z
    .enum(['topic', 'readme', 'description', 'file', 'language', 'any'])
    .default('any'),
  weight: z.number().default(1),
  regex: z.boolean().default(false),
});
export const keywordsConfigSchema = z.object({
  keywords: z.array(keywordRuleSchema),
});
export type KeywordRule = z.infer<typeof keywordRuleSchema>;
export type KeywordsConfig = z.infer<typeof keywordsConfigSchema>;

const thresholdSchema = z.object({
  min: z.number().default(0),
  score: z.number().default(0),
});
const maxDaysSchema = z.object({
  max_days: z.number().default(999999),
  score: z.number().default(0),
});

export const scoringConfigSchema = z.object({
  weights: z
    .object({
      hap: z.number().default(0.3),
      platform: z.number().default(0.15),
      activity: z.number().default(0.2),
      community: z.number().default(0.1),
      documentation: z.number().default(0.1),
      license: z.number().default(0.05),
      stars: z.number().default(0.1),
    })
    .default({}),
  hap: z
    .object({
      binary_multiplier: z.number().default(1.0),
      buildable_multiplier: z.number().default(0.85),
    })
    .default({}),
  platform: z.object({ unknown_baseline: z.number().default(20) }).default({}),
  activity: z
    .object({
      last_push_days: z.array(maxDaysSchema).default([]),
      archived_score: z.number().default(12),
    })
    .default({}),
  community: z
    .object({
      forks: z.array(thresholdSchema).default([]),
      open_issues: z.array(thresholdSchema).default([]),
    })
    .default({}),
  documentation: z
    .object({
      has_readme_score: z.number().default(40),
      min_length: z.number().default(200),
      good_length: z.number().default(1500),
      max_score: z.number().default(100),
    })
    .default({}),
  license: z
    .object({
      preferred: z.array(z.string()).default([]),
      preferred_score: z.number().default(100),
      any_license_score: z.number().default(70),
      none_score: z.number().default(0),
    })
    .default({}),
  stars: z.object({ thresholds: z.array(thresholdSchema).default([]) }).default({}),
});
export type ScoringConfig = z.infer<typeof scoringConfigSchema>;

export const excludeConfigSchema = z.object({
  exclude: z
    .object({
      repositories: z.array(z.string()).default([]),
      organizations: z.array(z.string()).default([]),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),
  include: z
    .object({
      repositories: z.array(z.string()).default([]),
    })
    .default({}),
  overrides: z
    .record(
      z.object({
        category: z.array(z.string()).optional(),
        platform: z.array(z.string()).optional(),
      }),
    )
    .default({}),
});
export type ExcludeConfig = z.infer<typeof excludeConfigSchema>;

export const allConfigSchema = z.object({
  discovery: discoverySchema,
  categories: categoriesConfigSchema,
  keywords: keywordsConfigSchema,
  scoring: scoringConfigSchema,
  exclude: excludeConfigSchema,
});
export type AllConfig = z.infer<typeof allConfigSchema>;
