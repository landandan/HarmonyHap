import { loadConfig, type LoadedConfig } from '../src/utils/config-loader.js';
import { PipelineState } from '../src/pipeline/state.js';
import { GitHubClient, GitHubAuthError } from '../src/github/client.js';

export interface Ctx {
  config: LoadedConfig;
  state: PipelineState;
  generatedAt: string;
}

export async function loadCtx(workDir = 'data/.work'): Promise<Ctx> {
  const config = await loadConfig();
  const state = new PipelineState(workDir);
  await state.init();
  return { config, state, generatedAt: new Date().toISOString() };
}

/** Create a GitHub client or exit with a clear auth error. */
export function createClient(): GitHubClient {
  try {
    return new GitHubClient();
  } catch (e) {
    if (e instanceof GitHubAuthError) {
      console.error('[AUTH] ' + e.message);
      process.exit(1);
    }
    throw e;
  }
}

export function parseFlags(argv: string[]): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  for (const a of argv) {
    if (a.startsWith('--')) flags[a.slice(2)] = true;
  }
  return flags;
}
