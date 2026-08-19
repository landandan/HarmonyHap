import type { RawGitHubRepo } from '../github/types.js';
import type { Hap } from '../schemas/hap.js';
import type { PlatformDetectionResult } from '../platform/detector.js';
import type { ClassificationResult } from '../classification/classifier.js';
import type { ScoreResult } from '../scoring/scorer.js';
import type { DiscoveredItem } from '../github/search.js';

export type { DiscoveredItem };

export type TreeStatus = 'ok' | 'truncated' | 'unavailable';

/**
 * Accumulating analysis record. Each pipeline stage fills in the next field
 * and the whole array is persisted between stages (resumable pipeline).
 */
export interface RepoAnalysis {
  id: number;
  full_name: string;
  discovered_by: string[];

  repo: RawGitHubRepo | null;
  readme: string | null;
  languages: string[];
  treePaths: string[];
  treeStatus: TreeStatus;
  treeSignature: string;

  error?: string;

  hap?: Hap;
  platform?: PlatformDetectionResult;
  classification?: ClassificationResult;
  score?: ScoreResult;

  content_hash?: string;

  /** Set when analysis was reused from a previous run (incremental mode). */
  reused?: boolean;
}

export interface DiscoveredState {
  schema_version: number;
  generated_at: string;
  items: DiscoveredItem[];
}

export type AnalysisStage = 'fetched' | 'hap' | 'platform' | 'classified' | 'scored';

export interface AnalysisState {
  schema_version: number;
  generated_at: string;
  stage: AnalysisStage;
  items: RepoAnalysis[];
}
