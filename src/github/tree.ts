import { createHash } from 'node:crypto';
import { GitHubClient } from './client.js';
import type { RepoTree, TreeItem, TreeResult } from './types.js';

/**
 * Safely fetch a repository tree. Returns a TreeResult so callers can mark
 * `tree_status` and continue instead of aborting the whole pipeline.
 */
export async function fetchTreeSafe(
  client: GitHubClient,
  fullName: string,
  branch: string,
): Promise<TreeResult> {
  return client.getTree(fullName, branch);
}

/** Stable signature of a tree, used for change detection across runs. */
export function treeSignature(tree: RepoTree | null): string {
  if (!tree) return '';
  const paths = tree.tree.map((t: TreeItem) => `${t.type[0]}:${t.path}`).sort();
  return createHash('sha256').update(paths.join('\n'), 'utf8').digest('hex');
}
