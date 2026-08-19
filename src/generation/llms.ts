import type { Repository, Statistics } from '../schemas/repository.js';
import type { CategoriesConfig } from '../schemas/config.js';
import { getCategoryMeta, categoryOrder } from '../classification/categories.js';
import { sortRepos } from './readme.js';

/** Concise llms.txt (llmstxt-style index). */
export function generateLlmsTxt(repos: Repository[], stats: Statistics): string {
  const indexed = sortRepos(repos.filter((r) => r.status === 'indexed')).slice(0, 50);
  const lines: string[] = [];
  lines.push('# HarmonyOS HAP Open Source Navigator');
  lines.push('');
  lines.push(
    '> GitHub 驱动的鸿蒙 HAP 开源应用知识库：自动发现、验证（仅收录 HAP / HAP Buildable）并索引 HarmonyOS / HarmonyOS NEXT / OpenHarmony 项目。',
  );
  lines.push('');
  lines.push('## Purpose');
  lines.push('为开发者提供经过 HAP 真实性验证的鸿蒙开源应用导航与检索上下文。');
  lines.push('');
  lines.push('## Data source');
  lines.push('GitHub（唯一外部事实来源）。无服务器、无数据库、无爬虫。');
  lines.push('');
  lines.push('## HAP policy');
  lines.push('仅 `binary`（含 .hap）或 `buildable`（完整 HAP 构建工程）进入正式索引。');
  lines.push('');
  lines.push('## Platform definitions');
  lines.push('HarmonyOS | HarmonyOS NEXT | OpenHarmony | Multi-platform | Unknown。');
  lines.push('');
  lines.push('## Data files');
  lines.push('- [repositories.json](data/repositories.json): 完整结构化数据');
  lines.push('- [ai-context.md](generated/ai-context.md): AI 上下文与规则');
  lines.push('- [llms-full.txt](generated/llms-full.txt): 完整 AI 检索上下文');
  lines.push('- [ai-system-prompt.md](generated/ai-system-prompt.md): AI 系统提示词');
  lines.push('');
  lines.push('## Top projects');
  for (const r of indexed) {
    const desc = r.description ? ` — ${r.description.replace(/\n/g, ' ').slice(0, 120)}` : '';
    lines.push(`- [${r.full_name}](${r.url})${desc}`);
  }
  lines.push('');
  return lines.join('\n');
}

/** Full AI retrieval context (rules + per-project standardized summaries). */
export function generateLlmsFullTxt(
  repos: Repository[],
  stats: Statistics,
  config: CategoriesConfig,
): string {
  const indexed = sortRepos(repos.filter((r) => r.status === 'indexed'));
  const lines: string[] = [];
  lines.push('# HarmonyOS HAP Open Source Navigator — Full Context');
  lines.push('');
  lines.push('## Project rules');
  lines.push('- 数据来源：GitHub。');
  lines.push('- 收录：仅 HAP binary / buildable。');
  lines.push('- 区分 HAP / HSP / HAR；仅 HAP 视为完整应用。');
  lines.push('- 平台：HarmonyOS / HarmonyOS NEXT / OpenHarmony / Multi-platform / Unknown。');
  lines.push('- 排序：navigator_score desc, stars desc, full_name asc。');
  lines.push('- 禁止虚构；GitHub 原始事实不可被 AI 覆盖。');
  lines.push('');
  lines.push('## Category rules');
  for (const id of categoryOrder(config)) {
    const meta = getCategoryMeta(config, id);
    lines.push(`- ${meta.id}: ${meta.label}${meta.description ? ` — ${meta.description}` : ''}`);
  }
  lines.push('');
  lines.push('## Platform rules');
  lines.push('- HarmonyOS NEXT 判定依据：API 12+、ArkUI、HarmonyOS NEXT 关键词/组织。');
  lines.push('- OpenHarmony 判定依据：openharmony / ohos 关键词/组织。');
  lines.push('- 同时面向两者 -> Multi-platform。');
  lines.push('');

  lines.push(`## Projects (${indexed.length} indexed)`);
  lines.push('');
  for (const r of indexed) {
    const hapEvidence = r.hap.evidence.map((e) => e.value).join('; ');
    lines.push(`### ${r.full_name}`);
    lines.push(`- url: ${r.url}`);
    lines.push(`- platform: ${r.platform.join(', ')} (confidence ${r.platform_confidence})`);
    lines.push(`- category: ${r.category.join(', ')}`);
    lines.push(`- hap_status: ${r.hap.status} (score ${r.hap.score}, packages ${r.hap.package_types.join('/') || '-'})`);
    lines.push(`- hap_evidence: ${hapEvidence || '-'}`);
    lines.push(`- summary: ${(r.ai?.summary ?? '').replace(/\n/g, ' ')}`);
    lines.push(`- use_cases: ${(r.ai?.use_cases ?? []).join(', ')}`);
    lines.push(`- stars: ${r.stars} | license: ${r.license ?? 'none'} | activity: ${r.activity.status}`);
    lines.push(`- navigator_score: ${r.navigator_score}`);
    lines.push('');
  }

  lines.push('## Stats');
  lines.push(`- generated_at: ${stats.generated_at}`);
  lines.push(`- total_indexed: ${stats.total_indexed}`);
  lines.push(`- hap_binary: ${stats.hap_binary} / hap_buildable: ${stats.hap_buildable}`);
  lines.push(`- updated_7d: ${stats.updated_last_7d} / updated_30d: ${stats.updated_last_30d}`);
  lines.push('');
  return lines.join('\n');
}
