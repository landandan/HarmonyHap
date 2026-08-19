import { z } from 'zod';

/**
 * HAP detection status.
 * Only `binary` and `buildable` may enter the official index.
 */
export const hapStatusEnum = z.enum(['binary', 'buildable', 'partial', 'unknown', 'invalid']);
export type HapStatus = z.infer<typeof hapStatusEnum>;

/** HarmonyOS package types. */
export const packageTypeEnum = z.enum(['HAP', 'HSP', 'HAR']);
export type PackageType = z.infer<typeof packageTypeEnum>;

/** A single piece of evidence that supports a derived field. */
export const evidenceSchema = z.object({
  source: z.string(), // github | readme | file | topic | config | metadata
  type: z.string(), // file | readme | topic | organization | metadata | package_type
  value: z.string(),
  path: z.string().optional(),
  weight: z.number().optional(),
});
export type Evidence = z.infer<typeof evidenceSchema>;

export const hapSchema = z.object({
  status: hapStatusEnum,
  score: z.number().min(0).max(100),
  package_types: z.array(packageTypeEnum),
  evidence: z.array(evidenceSchema),
  rejection_reasons: z.array(z.string()).optional(),
});
export type Hap = z.infer<typeof hapSchema>;

/** Rejection reason codes. */
export const rejectionReasonEnum = z.enum([
  'NO_HAP_EVIDENCE',
  'INSUFFICIENT_PROJECT_STRUCTURE',
  'NOT_HARMONY_PROJECT',
  'ARCHIVED',
  'INVALID_REPOSITORY',
  'TREE_UNAVAILABLE',
]);
export type RejectionReason = z.infer<typeof rejectionReasonEnum>;
