import {
  repositorySchema,
  type Repository,
  type Platform,
  type RepositoryStatus,
  type AiData,
} from '../schemas/repository.js';
import type { Evidence } from '../schemas/hap.js';
import type { ExcludeConfig } from '../schemas/config.js';
import type { RepoAnalysis } from '../pipeline/types.js';

/** Build a basic, API-free AI summary from GitHub facts (no external model). */
export function buildAiSummary(a: RepoAnalysis): AiData {
  const repo = a.repo;
  if (!repo) return { summary: a.full_name, use_cases: [] };
  const parts: string[] = [];
  if (repo.description) parts.push(repo.description);
  if (a.readme) {
    const firstPara = (a.readme.split(/\n\s*\n/)[0] ?? '').trim().slice(0, 280);
    if (firstPara) parts.push(firstPara);
  }
  const summary =
    parts.join(' ').replace(/\s+/g, ' ').slice(0, 420).trim() ||
    `HarmonyOS / OpenHarmony project ${repo.full_name}.`;
  const use_cases = (a.classification?.category ?? []).slice(0, 6);
  return { summary, use_cases };
}

function safeSummary(text: string | null, max: number): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim().slice(0, max);
}

/**
 * Convert an analyzed repository into the canonical Repository record.
 * GitHub raw facts are copied verbatim; derived fields come from analysis.
 */
export function toRepositoryRecord(
  a: RepoAnalysis,
  generatedAt: string,
  override?: { category?: string[]; platform?: string[] },
): Repository {
  if (!a.repo) {
    const rec: Repository = {
      id: a.id,
      full_name: a.full_name,
      name: a.full_name.split('/')[1] ?? a.full_name,
      owner: a.full_name.split('/')[0] ?? '',
      url: `https://github.com/${a.full_name}`,
      description: null,
      platform: ['Unknown'],
      platform_confidence: 0.2,
      platform_evidence: [],
      category: ['other'],
      classification_evidence: [],
      topics: [],
      languages: [],
      license: null,
      stars: 0,
      forks: 0,
      open_issues: 0,
      created_at: generatedAt,
      updated_at: generatedAt,
      pushed_at: generatedAt,
      archived: false,
      fork: false,
      hap: a.hap ?? {
        status: 'unknown',
        score: 0,
        package_types: [],
        evidence: [],
        rejection_reasons: ['INVALID_REPOSITORY'],
      },
      activity: a.score?.activity ?? { score: 0, status: 'unknown' },
      quality: a.score?.quality ?? { documentation: 0, community: 0, overall: 0 },
      navigator_score: a.score?.navigator_score ?? 0,
      score_breakdown: a.score?.score_breakdown,
      discovered_by: a.discovered_by,
      status: 'error',
      rejection_reasons: ['INVALID_REPOSITORY'],
      organization: null,
      content_hash: a.content_hash,
      source: { type: 'github', repository: a.full_name },
      ai: { summary: a.full_name },
    };
    return rec;
  }

  const repo = a.repo;
  const isOrg = repo.owner.type === 'Organization';
  const hap = a.hap ?? {
    status: 'unknown' as const,
    score: 0,
    package_types: [] as Repository['hap']['package_types'],
    evidence: [],
  };
  const platform = a.platform ?? {
    platform: ['Unknown' as Platform],
    platform_confidence: 0.2,
    platform_evidence: [],
  };
  const classification = a.classification ?? { category: ['other'], classification_evidence: [] };
  const score = a.score ?? {
    navigator_score: 0,
    score_breakdown: {},
    activity: { score: 0, status: 'unknown' },
    quality: { documentation: 0, community: 0, overall: 0 },
  };

  // Status logic: only binary/buildable (and not archived) are indexed.
  let status: RepositoryStatus;
  if (repo.archived) {
    status = 'archived';
  } else if (hap.status === 'binary' || hap.status === 'buildable') {
    status = 'indexed';
  } else {
    status = 'rejected';
  }

  const rec: Repository = {
    id: repo.id,
    full_name: repo.full_name,
    name: repo.name,
    owner: repo.owner.login,
    url: repo.html_url,
    description: safeSummary(repo.description, 500) || null,
    platform: platform.platform,
    platform_confidence: platform.platform_confidence,
    platform_evidence: platform.platform_evidence,
    category: classification.category,
    classification_evidence: classification.classification_evidence,
    topics: repo.topics ?? [],
    languages: a.languages,
    license: repo.license?.spdx_id ?? null,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    open_issues: repo.open_issues_count,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    archived: repo.archived,
    fork: repo.fork,
    hap,
    activity: score.activity,
    quality: score.quality,
    navigator_score: score.navigator_score,
    score_breakdown: score.score_breakdown,
    discovered_by: a.discovered_by,
    status,
    rejection_reasons:
      status === 'indexed' || status === 'archived'
        ? undefined
        : (hap.rejection_reasons ?? ['NO_HAP_EVIDENCE']),
    organization: isOrg ? repo.owner.login : null,
    content_hash: a.content_hash,
    source: { type: 'github', repository: repo.full_name },
    ai: buildAiSummary(a),
  };

  // Apply manual overrides (derived fields only).
  if (override) {
    if (override.category && override.category.length > 0) {
      rec.category = Array.from(new Set([...rec.category, ...override.category]));
      const ev: Evidence = {
        source: 'config',
        type: 'config',
        value: `override category: ${override.category.join(', ')}`,
      };
      rec.classification_evidence = [...rec.classification_evidence, ev];
    }
    if (override.platform && override.platform.length > 0) {
      rec.platform = override.platform as Platform[];
      const ev: Evidence = {
        source: 'config',
        type: 'config',
        value: `override platform: ${override.platform.join(', ')}`,
      };
      rec.platform_evidence = [...rec.platform_evidence, ev];
    }
  }

  return rec;
}

/**
 * Normalize all analyzed repositories. Validates each against the Zod schema
 * and throws (listing offenders) if any record is invalid — guarantees the
 * action never emits broken data.
 */
export function normalizeAll(
  analyses: RepoAnalysis[],
  exclude: ExcludeConfig,
  generatedAt: string,
): Repository[] {
  const failures: string[] = [];
  const records: Repository[] = [];
  for (const a of analyses) {
    const override = exclude.overrides[a.full_name];
    try {
      const rec = toRepositoryRecord(a, generatedAt, override);
      const parsed = repositorySchema.parse(rec);
      records.push(parsed);
    } catch (err) {
      failures.push(`${a.full_name}: ${(err as Error).message}`);
    }
  }
  if (failures.length > 0) {
    throw new Error(
      `Schema validation failed for ${failures.length} repositories:\n${failures.join('\n')}`,
    );
  }
  return records;
}
