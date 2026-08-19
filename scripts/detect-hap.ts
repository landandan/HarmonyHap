import { loadCtx } from './common.js';
import { runHap } from '../src/pipeline/stages.js';

async function main() {
  const { state } = await loadCtx();
  await runHap(state);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
