import type { Repository, Statistics } from '../schemas/repository.js';
import type { CategoriesConfig } from '../schemas/config.js';
import { getCategoryMeta, categoryOrder } from '../classification/categories.js';

/**
 * Generate generated/ai-context.md — a structured context document for AI
 * consumers: identity, data source, HAP policy, platform / category
 * definitions, data fields, sort & recommendation rules, and no-fabrication
 * guarantees.
 */
export function generateAiContext(
  repos: Repository[],
  stats: Statistics,
  config: CategoriesConfig,
): string {
  const indexed = repos.filter((r) => r.status === 'indexed');
  const lines: string[] = [];
  lines.push('# HarmonyOS HAP Open Source Navigator — AI Context');
  lines.push('');
  lines.push('## 项目身份');
  lines.push('');
  lines.push(
    '一个 GitHub 驱动的鸿蒙 HAP 开源应用知识库。自动发现、验证并索引 HarmonyOS / HarmonyOS NEXT / OpenHarmony 的 HAP 应用工程。',
  );
  lines.push('');
  lines.push('## 数据来源');
  lines.push('');
  lines.push('- 唯一外部事实来源：**GitHub**（REST API）。');
  lines.push('- 不使用 HTML 爬取、Google/Bing 搜索或第三方 GitHub 镜像。');
  lines.push('- 不依赖独立服务器、数据库服务器或爬虫服务器。');
  lines.push('- GitHub 原始字段（stars、license、description、topics 等）不会被任何 AI 生成结果覆盖。');
  lines.push('');
  lines.push('## HAP 收录标准（HAP 优先）');
  lines.push('');
  lines.push('- 仅 `binary`（含真实 `.hap`）或 `buildable`（完整 HAP 构建工程）进入正式索引。');
  lines.push('- `partial` / `unknown` / `invalid` 不进入正式列表，但保留 `rejection_reasons`。');
  lines.push('- 仅含 HSP / HAR 的库项目默认不认定为完整 HAP 应用。');
  lines.push('- 不允许仅因 README 含 "HarmonyOS"、Topic 是 harmonyos、或使用 ArkTS 就收录。');
  lines.push('');
  lines.push('## 平台定义');
  lines.push('');
  lines.push('- `HarmonyOS`：商业 HarmonyOS（含 DevEco）。');
  lines.push('- `HarmonyOS NEXT`：HarmonyOS NEXT（API 12+，ArkUI）。');
  lines.push('- `OpenHarmony`：开源 OpenHarmony / OHOS。');
  lines.push('- `Multi-platform`：同时面向 OpenHarmony 与 HarmonyOS 家族。');
  lines.push('- `Unknown`：无法判断。');
  lines.push('- 每个判定均附带 `platform_evidence` 与 `platform_confidence`（0–1）。');
  lines.push('');
  lines.push('## 分类定义');
  lines.push('');
  for (const id of categoryOrder(config)) {
    const meta = getCategoryMeta(config, id);
    lines.push(`- **${meta.label}** (\`${meta.id}\`)${meta.description ? `：${meta.description}` : ''}`);
  }
  lines.push('');
  lines.push('## 数据字段（repositories.json）');
  lines.push('');
  lines.push('| 字段 | 说明 |');
  lines.push('|---|---|');
  lines.push('| `full_name` / `url` | GitHub 仓库标识与地址（由 API 返回） |');
  lines.push('| `platform` / `platform_confidence` / `platform_evidence` | 平台判定及证据 |');
  lines.push('| `category` / `classification_evidence` | 配置驱动的分类及证据 |');
  lines.push('| `hap.status` / `hap.score` / `hap.package_types` / `hap.evidence` | HAP 检测结果 |');
  lines.push('| `activity.score` / `activity.status` | 活跃度（基于最近 push 等） |');
  lines.push('| `quality.*` | 文档 / 社区 / 综合质量 |');
  lines.push('| `navigator_score` / `score_breakdown` | 综合评分与分项构成 |');
  lines.push('| `discovered_by` | 发现该仓库的 discovery 来源 |');
  lines.push('| `status` | indexed / rejected / archived / error |');
  lines.push('| `source` | `{ type: "github", repository }` 数据溯源 |');
  lines.push('');
  lines.push('## 排序规则');
  lines.push('');
  lines.push('- 默认按 `navigator_score` 降序；相同时按 `stars` 降序；再相同按 `full_name` 升序（稳定）。');
  lines.push('- 精选项目：Top 20（无人工硬编码）。');
  lines.push('');
  lines.push('## 推荐规则');
  lines.push('');
  lines.push('- 优先推荐 `hap.status === "binary"` 或 `"buildable"` 的项目。');
  lines.push('- 结合 `platform` 与 `category` 过滤；说明推荐理由时引用 `evidence`。');
  lines.push('- 区分 HAP / HSP / HAR：仅当存在 HAP 才视为完整应用。');
  lines.push('');
  lines.push('## 禁止虚构规则');
  lines.push('');
  lines.push('- 不得编造仓库、stars、license、平台或分类。');
  lines.push('- 所有结论必须可追溯至 GitHub repository 与 `evidence`。');
  lines.push('- GitHub 原始事实不可被 AI 摘要覆盖；AI 摘要仅属于 `ai.*` 字段。');
  lines.push('');
  lines.push('## 数据更新时间');
  lines.push('');
  lines.push(`- 生成时间（UTC）：${stats.generated_at}`);
  lines.push(`- 候选发现：${stats.total_discovered} / 正式收录：${stats.total_indexed}`);
  lines.push(`- HAP Binary：${stats.hap_binary} / HAP Buildable：${stats.hap_buildable}`);
  lines.push(`- 最近 7 天更新：${stats.updated_last_7d} / 最近 30 天：${stats.updated_last_30d}`);
  lines.push(`- 当前收录项目数：${indexed.length}`);
  lines.push('');
  lines.push('## AI 查询规则');
  lines.push('');
  lines.push('- 查询前先读取 `data/repositories.json` 或 `generated/llms-full.txt`。');
  lines.push('- 若所需字段不存在，明确说明“数据不存在”，不得猜测。');
  lines.push('- 推荐时给出 `full_name`、URL、平台、分类与 Navigator Score。');
  lines.push('');
  return lines.join('\n');
}

/** Generate generated/ai-system-prompt.md — a ready-to-use system prompt. */
export function generateSystemPrompt(stats: Statistics): string {
  return `# System Prompt — HarmonyOS HAP Navigator Assistant

你是 HarmonyOS HAP Open Source Navigator 的助手。

## 核心约束
1. **GitHub 是唯一事实来源**。所有仓库、stars、license、平台、分类结论都必须来自 \`data/repositories.json\` 等本仓库数据。
2. **HAP 优先**。只推荐 \`hap.status\` 为 \`binary\` 或 \`buildable\` 的项目。
3. **平台区分**。明确区分 HarmonyOS / HarmonyOS NEXT / OpenHarmony；不要混淆。Multi-platform 表示同时面向 OpenHarmony 与 HarmonyOS 家族。
4. **禁止虚构**。不得编造任何仓库、指标或属性。数据不存在时说明“数据不存在”。
5. **推荐规则**。结合 \`platform\`、\`category\` 与 \`navigator_score\` 推荐，并引用 \`evidence\` 说明原因。
6. **License 规则**。推荐时说明项目 license（来自 GitHub 原始字段），不臆测。
7. **活跃度规则**。使用 \`activity.status\` / \`activity.score\`，基于最近 push 等信号，不单看 updated_at。
8. **Navigator Score 规则**。综合评分由 hap(30%) / platform(15%) / activity(20%) / community(10%) / documentation(10%) / license(5%) / stars(10%) 构成；高分项目优先。
9. **数据不存在时的行为**。若用户询问的数据字段缺失，明确告知，不猜测。

## 数据快照（生成于 ${stats.generated_at}）
- 正式收录：${stats.total_indexed}
- HAP Binary：${stats.hap_binary} / HAP Buildable：${stats.hap_buildable}
- 最近 7 天更新：${stats.updated_last_7d} / 30 天：${stats.updated_last_30d}

始终基于本仓库提供的数据作答，并给出可点击的 GitHub URL。
`;
}
