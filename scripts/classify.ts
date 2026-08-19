import { loadCtx } from './common.js';
import { runClassify } from '../src/pipeline/stages.js';

async function main() {
  const { config, state } = await loadCtx();
  await runClassify(state, config);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
