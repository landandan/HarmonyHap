# HarmonyOS HAP Open Source Navigator — AI Context

## 项目身份

一个 GitHub 驱动的鸿蒙 HAP 开源应用知识库。自动发现、验证并索引 HarmonyOS / HarmonyOS NEXT / OpenHarmony 的 HAP 应用工程。

## 数据来源

- 唯一外部事实来源：**GitHub**（REST API）。
- 不使用 HTML 爬取、Google/Bing 搜索或第三方 GitHub 镜像。
- 不依赖独立服务器、数据库服务器或爬虫服务器。
- GitHub 原始字段（stars、license、description、topics 等）不会被任何 AI 生成结果覆盖。

## HAP 收录标准（HAP 优先）

- 仅 `binary`（含真实 `.hap`）或 `buildable`（完整 HAP 构建工程）进入正式索引。
- `partial` / `unknown` / `invalid` 不进入正式列表，但保留 `rejection_reasons`。
- 仅含 HSP / HAR 的库项目默认不认定为完整 HAP 应用。
- 不允许仅因 README 含 "HarmonyOS"、Topic 是 harmonyos、或使用 ArkTS 就收录。

## 平台定义

- `HarmonyOS`：商业 HarmonyOS（含 DevEco）。
- `HarmonyOS NEXT`：HarmonyOS NEXT（API 12+，ArkUI）。
- `OpenHarmony`：开源 OpenHarmony / OHOS。
- `Multi-platform`：同时面向 OpenHarmony 与 HarmonyOS 家族。
- `Unknown`：无法判断。
- 每个判定均附带 `platform_evidence` 与 `platform_confidence`（0–1）。

## 分类定义

- **Official** (`official`)：Official HarmonyOS / OpenHarmony organization projects.
- **Sample** (`sample`)：Official or vendor sample / demo projects.
- **Application** (`application`)：End-user applications built for HarmonyOS / OpenHarmony.
- **Demo** (`demo`)：Demonstration projects.
- **ArkUI** (`arkui`)：ArkUI related projects.
- **ArkTS** (`arkts`)：ArkTS language / tooling projects.
- **UI Component** (`ui-component`)：Reusable UI component libraries.
- **UI Framework** (`ui-framework`)：UI frameworks and rendering engines.
- **SDK** (`sdk`)：Software development kits.
- **Library** (`library`)：General purpose libraries.
- **Network** (`network`)：Networking libraries and tools.
- **WebSocket** (`websocket`)：WebSocket implementations.
- **HTTP** (`http`)：HTTP client / server libraries.
- **Database** (`database`)：Database / ORM libraries.
- **Storage** (`storage`)：Local storage / persistence.
- **Audio** (`audio`)：Audio playback / processing.
- **Video** (`video`)：Video playback / processing.
- **Multimedia** (`multimedia`)：Multimedia (audio + video) projects.
- **Graphics** (`graphics`)：Graphics / canvas / drawing.
- **Image** (`image`)：Image processing.
- **AI** (`ai`)：Artificial intelligence projects.
- **LLM** (`llm`)：Large language model projects.
- **Machine Learning** (`machine-learning`)：Machine learning projects.
- **IoT** (`iot`)：Internet of Things.
- **Hardware** (`hardware`)：Hardware / driver / peripheral projects.
- **Distributed** (`distributed`)：Distributed soft-bus / cross-device projects.
- **System** (`system`)：System level / ROM / tooling.
- **Map** (`map`)：Map / location services.
- **Location** (`location`)：Geolocation projects.
- **Web** (`web`)：Web related projects.
- **Game** (`game`)：Game development.
- **Flutter** (`flutter`)：Flutter related projects.
- **React Native** (`react-native`)：React Native related projects.
- **Cross-platform** (`cross-platform`)：Cross-platform frameworks.
- **Developer Tools** (`developer-tools`)：Developer tooling / CLI.
- **Tutorial** (`tutorial`)：Tutorials and guides.
- **Learning** (`learning`)：Learning resources.
- **Adaptation** (`adaptation`)：Adaptation / migration from other platforms.
- **Security** (`security`)：Security related projects.
- **Research** (`research`)：Research prototypes.
- **Other** (`other`)：Projects that do not fit other categories.

## 数据字段（repositories.json）

| 字段 | 说明 |
|---|---|
| `full_name` / `url` | GitHub 仓库标识与地址（由 API 返回） |
| `platform` / `platform_confidence` / `platform_evidence` | 平台判定及证据 |
| `category` / `classification_evidence` | 配置驱动的分类及证据 |
| `hap.status` / `hap.score` / `hap.package_types` / `hap.evidence` | HAP 检测结果 |
| `activity.score` / `activity.status` | 活跃度（基于最近 push 等） |
| `quality.*` | 文档 / 社区 / 综合质量 |
| `navigator_score` / `score_breakdown` | 综合评分与分项构成 |
| `discovered_by` | 发现该仓库的 discovery 来源 |
| `status` | indexed / rejected / archived / error |
| `source` | `{ type: "github", repository }` 数据溯源 |

## 排序规则

- 默认按 `navigator_score` 降序；相同时按 `stars` 降序；再相同按 `full_name` 升序（稳定）。
- 精选项目：Top 20（无人工硬编码）。

## 推荐规则

- 优先推荐 `hap.status === "binary"` 或 `"buildable"` 的项目。
- 结合 `platform` 与 `category` 过滤；说明推荐理由时引用 `evidence`。
- 区分 HAP / HSP / HAR：仅当存在 HAP 才视为完整应用。

## 禁止虚构规则

- 不得编造仓库、stars、license、平台或分类。
- 所有结论必须可追溯至 GitHub repository 与 `evidence`。
- GitHub 原始事实不可被 AI 摘要覆盖；AI 摘要仅属于 `ai.*` 字段。

## 数据更新时间

- 生成时间（UTC）：2026-08-20T02:58:37.961Z
- 候选发现：785 / 正式收录：294
- HAP Binary：19 / HAP Buildable：279
- 最近 7 天更新：51 / 最近 30 天：86
- 当前收录项目数：294

## AI 查询规则

- 查询前先读取 `data/repositories.json` 或 `generated/llms-full.txt`。
- 若所需字段不存在，明确说明“数据不存在”，不得猜测。
- 推荐时给出 `full_name`、URL、平台、分类与 Navigator Score。
