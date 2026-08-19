import { loadCtx, createClient } from './common.js';
import { runDiscovery } from '../src/pipeline/stages.js';

async function main() {
  const { config, state, generatedAt } = await loadCtx();
  const client = createClient();
  await runDiscovery(state, config, client, generatedAt);
  await client.persistCache();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
