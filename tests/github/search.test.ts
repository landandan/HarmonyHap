import { describe, it, expect } from 'vitest';
import { discoverByOrgs } from '../../src/github/search.js';
import { GitHubError } from '../../src/github/client.js';
import type { GitHubClient } from '../../src/github/client.js';
import type { RawGitHubRepo } from '../../src/github/types.js';

function fakeRepo(owner: string): RawGitHubRepo {
  return {
    id: 1,
    full_name: `${owner}/sample`,
    name: 'sample',
    owner: { login: owner, type: 'Organization' },
    description: null,
    html_url: `https://github.com/${owner}/sample`,
    topics: [],
    language: 'C++',
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2020-01-01T00:00:00Z',
    pushed_at: '2020-01-01T00:00:00Z',
    archived: false,
    fork: false,
    license: null,
    default_branch: 'master',
  };
}

describe('discoverByOrgs', () => {
  it('skips an org that returns 404 instead of aborting discovery', async () => {
    const client = {
      listOrgRepos: async (org: string) => {
        if (org === 'missing-org') throw new GitHubError('Not Found', 404);
        return [fakeRepo(org)];
      },
    } as unknown as GitHubClient;

    const result = await discoverByOrgs(client, ['openharmony', 'missing-org'], {});
    expect(result.has('openharmony/sample')).toBe(true);
    expect(result.get('openharmony/sample')!.sources.has('organization:openharmony')).toBe(true);
    // The missing org must not poison the result.
    expect(result.has('missing-org/sample')).toBe(false);
  });

  it('skips an org that throws a non-404 error and keeps the others', async () => {
    const client = {
      listOrgRepos: async (org: string) => {
        if (org === 'broken') throw new Error('transient boom');
        return [fakeRepo(org)];
      },
    } as unknown as GitHubClient;

    const result = await discoverByOrgs(client, ['openharmony', 'broken'], {});
    expect(result.has('openharmony/sample')).toBe(true);
    expect(result.has('broken/sample')).toBe(false);
  });
});
