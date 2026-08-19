import type { Repository } from '../schemas/repository.js';
import type { Statistics } from '../schemas/repository.js';
import type { CategoriesConfig } from '../schemas/config.js';
import { getCategoryMeta, categoryOrder } from '../classification/categories.js';
import { escapeTableCell, truncate } from '../utils/markdown.js';

export interface ReadmeOptions {
  topPerSection?: number;
  topFeatured?: number;
}

/** Stable sort: navigator_score desc, stars desc, full_name asc. */
export function sortRepos(repos: Repository[]): Repository[] {
  return [...repos].sort((a, b) => {
    if (b.navigator_score !== a.navigator_score) return b.navigator_score - a.navigator_score;
    if (b.stars !== a.stars) return b.stars - a.stars;
    return a.full_name.localeCompare(b.full_name);
  });
}

function hapLabel(status: string): string {
  if (status === 'binary') return 'Binary';
  if (status === 'buildable') return 'Buildable';
  return '-';
}

function platformLabel(repo: Repository): string {
  return repo.platform.map((p) => escapeTableCell(p)).join(', ') || 'Unknown';
}

function renderTable(repos: Repository[], topN: number): string {
  const sorted = sortRepos(repos).slice(0, topN);
  if (sorted.length === 0) return '_暂无收录项目。_\n';
  const header =
    '| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |\n' +
    '|---|---|---|---:|---|---|---:|';
  const rows = sorted.map((r) => {
    const name = `[${escapeTableCell(r.full_name)}](${r.url})`;
    const desc = r.description ? `<br><small>${escapeTableCell(truncate(r.description, 120))}</small>` : '';
    const lic = r.license ? escapeTableCell(r.license) : '-';
    return `| ${name}${desc} | ${platformLabel(r)} | ${hapLabel(r.hap.status)} | ${r.stars} | ${escapeTableCell(r.activity.status)} | ${lic} | ${r.navigator_score} |`;
  });
  return [header, ...rows].join('\n');
}

function countByPlatform(repos: Repository[], platform: string): number {
  return repos.filter((r) => r.platform.includes(platform as Repository['platform'][number])).length;
}

/**
 * Generate the navigator README. This is both generated/README.md and the
 * repository root README.md. Contains intro, standards, stats, featured and
 * per-platform / per-category tables (Top N each).
 */
export function generateReadme(
  repos: Repository[],
  stats: Statistics,
  config: CategoriesConfig,
  opts: ReadmeOptions = {},
): string {
  const topN = opts.topPerSection ?? 20;
  const topFeatured = opts.topFeatured ?? 20;
  const indexed = repos.filter((r) => r.status === 'indexed');
  const featured = sortRepos(indexed).slice(0, topFeatured);

  const lines: string[] = [];
  lines.push('# HarmonyOS HAP Open Source Navigator');
  lines.push('');
  lines.push(
    '> 一个自动从 GitHub 发现、验证和整理鸿蒙 HAP 开源项目的导航。\n' +
      '> 只收录具有 **HAP / HAP Buildable** 证据的项目。\n' +
      '> 数据由 GitHub Actions 自动更新，无需服务器、数据库或人工维护列表。',
  );
  lines.push('');

  // 收录标准
  lines.push('## 收录标准');
  lines.push('');
  lines.push(
    '本项目**不是**简单的 HarmonyOS Topic 聚合。只有存在以下证据之一的项目才会进入正式索引：',
  );
  lines.push('');
  lines.push('- 仓库中包含真实的 `.hap` 二进制文件（`status: binary`）');
  lines.push(
    '- 或具备完整的 HAP 构建工程结构（`module.json5` + `entry/src/main/ets` + 构建系统），可判定为可构建 HAP（`status: buildable`）',
  );
  lines.push('');
  lines.push(
    '仅包含 README 关键词、Topic、教程、文档或普通 ArkTS 代码、或仅含 HSP/HAR 库的项目**不会**进入正式列表。',
  );
  lines.push('');

  // HAP 验证规则
  lines.push('## HAP 验证规则');
  lines.push('');
  lines.push('| 状态 | 含义 | 是否收录 |');
  lines.push('|---|---|---|');
  lines.push('| `binary` | 检测到真实 `.hap` 文件 | ✅ |');
  lines.push('| `buildable` | 无 `.hap`，但工程结构足以判定可构建 HAP | ✅ |');
  lines.push('| `partial` | 有鸿蒙工程痕迹但不足以证明完整 HAP 工程 | ❌ |');
  lines.push('| `unknown` | 无法判断 | ❌ |');
  lines.push('| `invalid` | 明确非目标项目 | ❌ |');
  lines.push('');

  // 统计
  lines.push('## 项目统计');
  lines.push('');
  lines.push(`- 候选发现总数：**${stats.total_discovered}**`);
  lines.push(`- 正式收录：**${stats.total_indexed}**`);
  lines.push(`- HAP Binary：**${stats.hap_binary}**`);
  lines.push(`- HAP Buildable：**${stats.hap_buildable}**`);
  lines.push(`- HarmonyOS 项目：*${countByPlatform(repos, 'HarmonyOS')}*`);
  lines.push(`- HarmonyOS NEXT 项目：*${countByPlatform(repos, 'HarmonyOS NEXT')}*`);
  lines.push(`- OpenHarmony 项目：*${countByPlatform(repos, 'OpenHarmony')}*`);
  lines.push(`- 最近 7 天更新：**${stats.updated_last_7d}**`);
  lines.push(`- 最近 30 天更新：**${stats.updated_last_30d}**`);
  lines.push('');

  // 精选项目
  lines.push('## 精选项目');
  lines.push('');
  lines.push(`以下为 Navigator Score 最高的 ${featured.length} 个项目（无人工硬编码）：`);
  lines.push('');
  lines.push(renderTable(featured, topFeatured));
  lines.push('');

  // 平台分区
  const platformSections: Array<{ key: string; title: string }> = [
    { key: 'HarmonyOS NEXT', title: 'HarmonyOS NEXT' },
    { key: 'OpenHarmony', title: 'OpenHarmony' },
    { key: 'HarmonyOS', title: 'HarmonyOS' },
  ];
  for (const sec of platformSections) {
    lines.push(`## ${sec.title}`);
    lines.push('');
    const inSec = indexed.filter((r) => r.platform.includes(sec.key as Repository['platform'][number]));
    lines.push(`共 ${inSec.length} 个（展示 Top ${topN}）：`);
    lines.push('');
    lines.push(renderTable(inSec, topN));
    lines.push('');
  }

  // 分类分区
  const order = categoryOrder(config);
  const priority = [
    'arkui',
    'arkts',
    'ui-component',
    'ui-framework',
    'network',
    'database',
    'storage',
    'audio',
    'video',
    'multimedia',
    'graphics',
    'image',
    'ai',
    'llm',
    'iot',
    'hardware',
    'game',
    'flutter',
    'react-native',
    'cross-platform',
    'developer-tools',
    'tutorial',
    'learning',
    'security',
    'system',
  ];
  const sectionCats = priority.filter((c) => order.includes(c));
  for (const catId of sectionCats) {
    const meta = getCategoryMeta(config, catId);
    const inCat = indexed.filter((r) => r.category.includes(catId));
    if (inCat.length === 0) continue;
    lines.push(`## ${meta.label}`);
    if (meta.description) {
      lines.push('');
      lines.push(`> ${meta.description}`);
    }
    lines.push('');
    lines.push(`共 ${inCat.length} 个（展示 Top ${topN}）：`);
    lines.push('');
    lines.push(renderTable(inCat, topN));
    lines.push('');
  }

  // 数据更新时间
  lines.push('## 数据更新时间');
  lines.push('');
  lines.push(`- 生成时间（UTC）：${stats.generated_at}`);
  lines.push(`- 数据来源：GitHub（唯一外部事实来源）`);
  lines.push('');

  // AI 使用说明
  lines.push('## AI 使用说明');
  lines.push('');
  lines.push('本仓库的数据可被 AI 直接读取，且保持稳定、结构化、可解析：');
  lines.push('');
  lines.push('- `data/repositories.json` — 完整结构化数据（含 HAP / 平台 / 分类 / 评分 / 证据）');
  lines.push('- `generated/ai-context.md` — 面向 AI 的项目上下文与规则');
  lines.push('- `generated/llms.txt` — 简洁索引');
  lines.push('- `generated/llms-full.txt` — 完整 AI 检索上下文');
  lines.push('- `generated/ai-system-prompt.md` — 供 AI 使用的系统提示词');
  lines.push('');
  lines.push('> 所有 AI 摘要均基于 GitHub 原始事实生成，GitHub 原始字段不会被 AI 结果覆盖。');
  lines.push('');

  // 本地运行
  lines.push('## 本地运行');
  lines.push('');
  lines.push('```bash');
  lines.push('npm install');
  lines.push('npm run all -- --sample   # 使用内置样例数据离线试运行');
  lines.push('npm run all               # 使用 GITHUB_TOKEN 执行完整流程');
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}
