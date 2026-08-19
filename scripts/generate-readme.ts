import * as path from 'node:path';
import { loadCtx } from './common.js';
import { computeStatistics } from '../src/generation/statistics.js';
import { generateReadme } from '../src/generation/readme.js';
import { repositoriesFileSchema } from '../src/schemas/repository.js';
import { writeText } from '../src/utils/io.js';

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
  const readme = generateReadme(repos, stats, config.categories);
  await state.writeGenerated('README.md', readme);
  await writeText(path.join(process.cwd(), 'README.md'), readme);
  console.error('[GENERATE] wrote generated/README.md and README.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
