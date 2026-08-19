import { loadCtx } from './common.js';
import { computeStatistics } from '../src/generation/statistics.js';
import { generateLlmsTxt, generateLlmsFullTxt } from '../src/generation/llms.js';
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
  const stats = computeStatistics(repos, discovered.length, generatedAt);
  await state.writeGenerated('llms.txt', generateLlmsTxt(repos));
  await state.writeGenerated('llms-full.txt', generateLlmsFullTxt(repos, stats, config.categories));
  console.error('[GENERATE] wrote generated/llms.txt and llms-full.txt');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
