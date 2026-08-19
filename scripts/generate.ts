import { loadCtx } from './common.js';
import { runGenerate } from '../src/pipeline/stages.js';
import { repositoriesFileSchema } from '../src/schemas/repository.js';

async function main() {
  const { config, state, generatedAt } = await loadCtx();
  const data = await state.readDataFile('repositories.json');
  if (!data) {
    console.error('[GENERATE] data/repositories.json missing; run `npm run normalize` first');
    process.exit(1);
  }
  const repos = repositoriesFileSchema.parse(data).repositories;
  const discovered = await state.readDiscovered();
  await runGenerate(state, config, repos, discovered.length, generatedAt);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
