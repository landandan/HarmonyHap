import { loadCtx } from './common.js';
import { computeStatistics } from '../src/generation/statistics.js';
import { generateAiContext, generateSystemPrompt } from '../src/generation/ai-context.js';
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
  await state.writeGenerated('ai-context.md', generateAiContext(repos, stats, config.categories));
  await state.writeGenerated('ai-system-prompt.md', generateSystemPrompt(stats));
  console.error('[GENERATE] wrote generated/ai-context.md and ai-system-prompt.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
