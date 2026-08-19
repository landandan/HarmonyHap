import { loadCtx, createClient } from './common.js';
import { runEnrich } from '../src/pipeline/stages.js';

async function main() {
  const { config, state } = await loadCtx();
  const client = createClient();
  try {
    await runEnrich(state, config, client);
  } finally {
    // Persist cache even on failure so the next run reuses fetched data.
    await client.persistCache();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
