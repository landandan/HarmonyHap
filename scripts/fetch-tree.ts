import { loadCtx, createClient } from './common.js';
import { runTree } from '../src/pipeline/stages.js';

async function main() {
  const { config, state } = await loadCtx();
  const client = createClient();
  await runTree(state, config, client);
  await client.persistCache();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
