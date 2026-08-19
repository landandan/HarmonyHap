import { loadCtx, createClient } from './common.js';
import { runDiscovery } from '../src/pipeline/stages.js';

async function main() {
  const { config, state, generatedAt } = await loadCtx();
  const client = createClient();
  try {
    await runDiscovery(state, config, client, generatedAt);
  } finally {
    // Persist cache even on failure so the next run reuses discovered data.
    await client.persistCache();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
