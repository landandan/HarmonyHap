import { createHash } from 'node:crypto';

/** Stable SHA-256 hex digest of a string. */
export function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Content hash used for change detection. Combining multiple signals keeps
 * the pipeline from re-processing repositories whose tree / metadata have
 * not changed. NOTE: README text is intentionally NOT hashed separately —
 * the tree signature already includes every blob path (including README.md),
 * so a README change changes the tree SHA and therefore the signature.
 */
export function contentHash(parts: Array<string | number | null | undefined>): string {
  return sha256(parts.map((p) => (p === null || p === undefined ? '' : String(p))).join('||'));
}

/** Hash used specifically for tree evidence + metadata change detection. */
export function repositoryContentHash(opts: {
  treeSignature: string;
  stars: number;
  pushedAt: string;
  archived: boolean;
  topics: string[];
}): string {
  return contentHash([
    opts.treeSignature,
    opts.stars,
    opts.pushedAt,
    opts.archived ? 1 : 0,
    [...opts.topics].sort().join(','),
  ]);
}
