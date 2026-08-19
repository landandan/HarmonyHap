/** Minimal normalized shapes for GitHub API responses we consume. */

export interface RawGitHubRepo {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string; type?: string };
  description: string | null;
  html_url: string;
  topics?: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  fork: boolean;
  license: { spdx_id: string | null } | null;
  default_branch: string;
}

export interface TreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

export interface RepoTree {
  sha: string;
  tree: TreeItem[];
  truncated: boolean;
}

export type TreeResult =
  | { ok: true; tree: RepoTree }
  | { ok: false; error: string; status?: 'unavailable' | 'too_large' | 'truncated' };

export interface SearchResult {
  total_count: number;
  items: RawGitHubRepo[];
}
