import type { ScoringConfig } from '../schemas/config.js';
import { daysSince } from '../utils/dates.js';
import type { Activity } from '../schemas/repository.js';

export interface ActivityInput {
  pushed_at: string;
  archived: boolean;
}

/**
 * Activity analysis. Based primarily on push recency (not merely updated_at),
 * with an explicit archived penalty. Deeper signals (releases / issues / PRs)
 * can be layered in via config without code changes.
 */
export function computeActivity(input: ActivityInput, config: ScoringConfig): Activity {
  const days = daysSince(input.pushed_at);
  const thresholds = [...config.activity.last_push_days].sort((a, b) => a.max_days - b.max_days);

  let score = thresholds.length ? thresholds[thresholds.length - 1].score : 0;
  for (const th of thresholds) {
    if (days <= th.max_days) {
      score = th.score;
      break;
    }
  }

  if (input.archived) {
    score = Math.min(score, config.activity.archived_score);
  }

  const status = input.archived
    ? 'archived'
    : days <= 90
      ? 'active'
      : days <= 365
        ? 'moderate'
        : 'stale';

  return {
    score,
    status,
    last_push_days: days,
  };
}
