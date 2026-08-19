import { GitHubClient } from './client.js';
import type { RawGitHubRepo } from './types.js';

/** A repository plus its README text and language list (all read-only). */
export interface RepositoryBundle {
  repo: RawGitHubRepo;
  readme: string | null;
  languages: string[];
}

/**
 * Fetch the full bundle needed for analysis: metadata + README + languages.
 * README is fetched via the GitHub API (never HTML scraping).
 */
export async function fetchRepositoryBundle(
  client: GitHubClient,
  repo: RawGitHubRepo,
): Promise<RepositoryBundle> {
  const readme = await client.getReadme(repo.full_name);
  const languages = await client.getLanguages(repo.full_name);
  return { repo, readme, languages };
}
