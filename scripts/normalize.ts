import { loadCtx } from './common.js';
import { runNormalize } from '../src/pipeline/stages.js';

async function main() {
  const { config, state, generatedAt } = await loadCtx();
  runNormalize(state, config, generatedAt, true);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
