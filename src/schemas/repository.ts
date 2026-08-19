import { z } from 'zod';
import { hapSchema, evidenceSchema } from './hap.js';

export const platformEnum = z.enum([
  'HarmonyOS',
  'HarmonyOS NEXT',
  'OpenHarmony',
  'Multi-platform',
  'Unknown',
]);
export type Platform = z.infer<typeof platformEnum>;

export const repositoryStatusEnum = z.enum(['indexed', 'rejected', 'archived', 'error']);
export type RepositoryStatus = z.infer<typeof repositoryStatusEnum>;

export const activitySchema = z.object({
  score: z.number().min(0).max(100),
  status: z.string(),
  last_push_days: z.number().optional(),
  recent_commits: z.number().optional(),
  recent_releases: z.number().optional(),
  recent_issues: z.number().optional(),
  recent_prs: z.number().optional(),
});
export type Activity = z.infer<typeof activitySchema>;

export const qualitySchema = z.object({
  documentation: z.number().min(0).max(100),
  community: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),
});
export type Quality = z.infer<typeof qualitySchema>;

export const aiDataSchema = z.object({
  summary: z.string().optional(),
  use_cases: z.array(z.string()).optional(),
});
export type AiData = z.infer<typeof aiDataSchema>;

/** Canonical repository record (derived + normalized GitHub data). */
export const repositorySchema = z.object({
  id: z.number(),
  full_name: z.string(),
  name: z.string(),
  owner: z.string(),
  url: z.string(),
  description: z.string().nullable(),

  platform: z.array(platformEnum),
  platform_confidence: z.number().min(0).max(1),
  platform_evidence: z.array(evidenceSchema),

  category: z.array(z.string()),
  classification_evidence: z.array(evidenceSchema),

  topics: z.array(z.string()),
  languages: z.array(z.string()),

  license: z.string().nullable(),

  stars: z.number(),
  forks: z.number(),
  open_issues: z.number(),

  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),

  archived: z.boolean(),
  fork: z.boolean(),

  hap: hapSchema,
  activity: activitySchema,
  quality: qualitySchema,

  navigator_score: z.number().min(0).max(100),
  score_breakdown: z.record(z.number()).optional(),

  discovered_by: z.array(z.string()),

  status: repositoryStatusEnum,
  rejection_reasons: z.array(z.string()).optional(),

  organization: z.string().nullable().optional(),
  content_hash: z.string().optional(),
  source: z
    .object({
      type: z.string(),
      repository: z.string(),
    })
    .optional(),
  ai: aiDataSchema.optional(),
});
export type Repository = z.infer<typeof repositorySchema>;

/** Wrapper for data/repositories.json */
export const repositoriesFileSchema = z.object({
  schema_version: z.number(),
  generated_at: z.string(),
  source: z.string(),
  generated_by: z.string().optional(),
  repositories: z.array(repositorySchema),
});
export type RepositoriesFile = z.infer<typeof repositoriesFileSchema>;

/** Wrapper for data/statistics.json */
export const statisticsSchema = z.object({
  schema_version: z.number(),
  generated_at: z.string(),
  source: z.string(),
  total_discovered: z.number(),
  total_indexed: z.number(),
  hap_binary: z.number(),
  hap_buildable: z.number(),
  rejected: z.number(),
  archived: z.number(),
  platforms: z.record(z.number()),
  categories: z.record(z.number()),
  updated_last_24h: z.number(),
  updated_last_7d: z.number(),
  updated_last_30d: z.number(),
  removed: z.number().optional(),
  changes: z
    .object({
      added: z.number().optional(),
      removed: z.number().optional(),
      updated: z.number().optional(),
    })
    .optional(),
});
export type Statistics = z.infer<typeof statisticsSchema>;

/** Wrapper for data/categories.json */
export const categoriesFileSchema = z.object({
  schema_version: z.number(),
  generated_at: z.string(),
  source: z.string(),
  categories: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      description: z.string().optional(),
      count: z.number(),
      repositories: z.array(z.string()),
    }),
  ),
});
export type CategoriesFile = z.infer<typeof categoriesFileSchema>;

/** Wrapper for data/organizations.json */
export const organizationsFileSchema = z.object({
  schema_version: z.number(),
  generated_at: z.string(),
  source: z.string(),
  organizations: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
      repositories: z.array(z.string()),
    }),
  ),
});
export type OrganizationsFile = z.infer<typeof organizationsFileSchema>;
