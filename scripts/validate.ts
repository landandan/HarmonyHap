import { loadCtx } from './common.js';
import { validateOutputs } from '../src/validation.js';

async function main() {
  const { state } = await loadCtx();
  await validateOutputs(state);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
