import { loadCtx } from './common.js';
import { runPlatform } from '../src/pipeline/stages.js';

async function main() {
  const { state } = await loadCtx();
  await runPlatform(state);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
