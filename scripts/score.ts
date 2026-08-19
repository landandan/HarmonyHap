import { loadCtx } from './common.js';
import { runScore } from '../src/pipeline/stages.js';

async function main() {
  const { config, state } = await loadCtx();
  await runScore(state, config);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
