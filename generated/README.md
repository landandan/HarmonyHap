# HarmonyOS HAP Open Source Navigator

> 一个自动从 GitHub 发现、验证和整理鸿蒙 HAP 开源项目的导航。
> 只收录具有 **HAP / HAP Buildable** 证据的项目。
> 数据由 GitHub Actions 自动更新，无需服务器、数据库或人工维护列表。

## 收录标准

本项目**不是**简单的 HarmonyOS Topic 聚合。只有存在以下证据之一的项目才会进入正式索引：

- 仓库中包含真实的 `.hap` 二进制文件（`status: binary`）
- 或具备完整的 HAP 构建工程结构（`module.json5` + `entry/src/main/ets` + 构建系统），可判定为可构建 HAP（`status: buildable`）

仅包含 README 关键词、Topic、教程、文档或普通 ArkTS 代码、或仅含 HSP/HAR 库的项目**不会**进入正式列表。

## HAP 验证规则

| 状态 | 含义 | 是否收录 |
|---|---|---|
| `binary` | 检测到真实 `.hap` 文件 | ✅ |
| `buildable` | 无 `.hap`，但工程结构足以判定可构建 HAP | ✅ |
| `partial` | 有鸿蒙工程痕迹但不足以证明完整 HAP 工程 | ❌ |
| `unknown` | 无法判断 | ❌ |
| `invalid` | 明确非目标项目 | ❌ |

## 项目统计

- 候选发现总数：**785**
- 正式收录：**294**
- HAP Binary：**19**
- HAP Buildable：**279**
- HarmonyOS 项目：*111*
- HarmonyOS NEXT 项目：*149*
- OpenHarmony 项目：*241*
- 最近 7 天更新：**55**
- 最近 30 天更新：**87**

## 精选项目

以下为 Navigator Score 最高的 20 个项目（无人工硬编码）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ohosvscode/arkTS](https://github.com/ohosvscode/arkTS)<br><small>🧩 VSCode鸿蒙ArkTS插件 ✨✍️ 支持各种补全/跳转 ⛺️ 支持codelinter检测代码错误 🎵 VSCode HarmonyOS ArkTS plugin for personal use ✨✍️ supports so…</small> | Multi-platform | Binary | 861 | active | MIT | 93 |
| [JackJiang2011/MobileIMSDK](https://github.com/JackJiang2011/MobileIMSDK)<br><small>原创全平台IM通信层框架，轻量级、高度提炼，历经10年、久经考验。可能是市面上唯一同时支持UDP+TCP+WebSocket三种协议的同类开源框架，支持 iOS、Android、Java、H5、小程序、Uniapp、鸿蒙Next，服务端基于…</small> | HarmonyOS NEXT | Buildable | 6082 | active | Apache-2.0 | 83 |
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [SKL-666666/mnn-local-ai-chat](https://github.com/SKL-666666/mnn-local-ai-chat)<br><small>HarmonyOS 本地 AI 对话应用：MNN + llama.cpp 双引擎，完全离线运行大模型推理 / On-device LLM chat app for HarmonyOS with dual MNN & llama.cpp en…</small> | Multi-platform | Binary | 2 | active | Apache-2.0 | 81 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [harmony-on-android/HOA](https://github.com/harmony-on-android/HOA)<br><small>Run OpenHarmony hap on Android</small> | Multi-platform | Binary | 713 | active | - | 79 |
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [ecnusse/Kea](https://github.com/ecnusse/Kea)<br><small>Property-based Testing for Mobile GUI Apps</small> | HarmonyOS | Binary | 75 | active | MIT | 77 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [openharmony/applications_hap](https://github.com/openharmony/applications_hap)<br><small>暂无描述</small> | OpenHarmony | Binary | 3 | active | Apache-2.0 | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [LiMingKuan-UESTC/HarmonyOs-Clock-Demo](https://github.com/LiMingKuan-UESTC/HarmonyOs-Clock-Demo)<br><small>一个基于 HarmonyOS ArkTS 的翻页时钟与饭点提醒 Demo 应用，支持三餐闹钟设置与通知提醒 A HarmonyOS ArkTS demo app that features a flip clock and meal rem…</small> | HarmonyOS NEXT | Binary | 5 | active | Apache-2.0 | 76 |
| [openharmony/global_resmgr_lite](https://github.com/openharmony/global_resmgr_lite)<br><small>Global resource manager framework \| 全球化资源管理框架</small> | OpenHarmony | Binary | 0 | active | Apache-2.0 | 76 |
| [openharmony/global_resmgr_standard](https://github.com/openharmony/global_resmgr_standard) | OpenHarmony | Binary | 0 | active | Apache-2.0 | 76 |
| [suibianqwe/Ehviewer_OHOS](https://github.com/suibianqwe/Ehviewer_OHOS)<br><small>Ehviewer on Harmony OS，原生构建，纵享丝滑。还原安卓版多数功能，同时添加了一些实用功能。现已支持图片ocr翻译。</small> | HarmonyOS NEXT | Buildable | 21 | active | NOASSERTION | 75 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [didi/dimina](https://github.com/didi/dimina)<br><small>星河小程序 - 滴滴开源小程序 / Dimina MiniProgram - DiDi's Open-Source MiniProgram</small> | HarmonyOS | Buildable | 918 | active | Apache-2.0 | 74 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |

## HarmonyOS NEXT

共 99 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [JackJiang2011/MobileIMSDK](https://github.com/JackJiang2011/MobileIMSDK)<br><small>原创全平台IM通信层框架，轻量级、高度提炼，历经10年、久经考验。可能是市面上唯一同时支持UDP+TCP+WebSocket三种协议的同类开源框架，支持 iOS、Android、Java、H5、小程序、Uniapp、鸿蒙Next，服务端基于…</small> | HarmonyOS NEXT | Buildable | 6082 | active | Apache-2.0 | 83 |
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [LiMingKuan-UESTC/HarmonyOs-Clock-Demo](https://github.com/LiMingKuan-UESTC/HarmonyOs-Clock-Demo)<br><small>一个基于 HarmonyOS ArkTS 的翻页时钟与饭点提醒 Demo 应用，支持三餐闹钟设置与通知提醒 A HarmonyOS ArkTS demo app that features a flip clock and meal rem…</small> | HarmonyOS NEXT | Binary | 5 | active | Apache-2.0 | 76 |
| [suibianqwe/Ehviewer_OHOS](https://github.com/suibianqwe/Ehviewer_OHOS)<br><small>Ehviewer on Harmony OS，原生构建，纵享丝滑。还原安卓版多数功能，同时添加了一些实用功能。现已支持图片ocr翻译。</small> | HarmonyOS NEXT | Buildable | 21 | active | NOASSERTION | 75 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [StarHeartY/CalculatorX](https://github.com/StarHeartY/CalculatorX)<br><small>HarmonyOS端的专业科学符号计算器</small> | HarmonyOS NEXT | Buildable | 5 | active | GPL-3.0 | 72 |
| [huihui200739/YueJiPC](https://github.com/huihui200739/YueJiPC)<br><small>阅迹：HarmonyOS PC 可追溯阅读工作台，连接 PDF 阅读、证据卡与复习整理</small> | HarmonyOS NEXT | Buildable | 1 | active | Apache-2.0 | 71 |
| [XCNXNXNX/lingxi-flow-agent](https://github.com/XCNXNXNX/lingxi-flow-agent)<br><small>灵犀流序（Lingxi Flow）：运行在 HarmonyOS NEXT 上的 AI 智能体（Agent）个人助理。一句话描述需求，AI 自主规划、调用系统工具完成任务。纯 ArkTS 实现，支持 25+ 系统工具（文件/提醒/日历/天气/…</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 71 |
| [siyuan-note/siyuan-harmony](https://github.com/siyuan-note/siyuan-harmony)<br><small>SiYuan HarmonyOS NEXT APP</small> | HarmonyOS NEXT | Buildable | 61 | active | AGPL-3.0 | 70 |
| [zhengzaihong/rxnet](https://github.com/zhengzaihong/rxnet)<br><small>RxNet 是一款专为 Flutter 开发的跨平台网络请求工具，贴合原生开发习惯，几乎零学习成本即可上手。它不仅让网络通信更丝滑，还支持丰富的功能组合，助你构建高性能、可维护的移动应用，已经支持Android、ios、windows、li…</small> | HarmonyOS NEXT | Buildable | 44 | active | MIT | 70 |
| [CCDawn/harmony-pc-touchpad](https://github.com/CCDawn/harmony-pc-touchpad)<br><small>Turn a HarmonyOS phone into an Apple-style touchpad for Windows PCs.</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 70 |
| [LoMoCatAp/Bika-HarmonyOS](https://github.com/LoMoCatAp/Bika-HarmonyOS)<br><small>鸿蒙系统第三方哔咔客户端</small> | HarmonyOS NEXT | Buildable | 7 | active | GPL-3.0 | 68 |
| [willvar/webox](https://github.com/willvar/webox)<br><small>Native WebView app template for Android, iOS, and HarmonyOS NEXT.</small> | HarmonyOS NEXT | Buildable | 4 | active | MIT | 68 |
| [wuweiyouzuoju/jidecards-anki-harmonyos](https://github.com/wuweiyouzuoju/jidecards-anki-harmonyos)<br><small>基于 HarmonyOS 的 Anki 卡片学习客户端，复用 Anki Rust 后端</small> | HarmonyOS NEXT | Buildable | 2 | active | AGPL-3.0 | 68 |
| [wbbb0/wPlayer](https://github.com/wbbb0/wPlayer)<br><small>A clean, offline local music player for HarmonyOS, built with ArkTS and ArkUI.</small> | HarmonyOS NEXT | Buildable | 1 | active | GPL-3.0 | 68 |
| [dw443106/obsidian-article-sync-harmony](https://github.com/dw443106/obsidian-article-sync-harmony)<br><small>HarmonyOS app that turns WeChat article links into Obsidian Markdown and syncs via WebDAV</small> | HarmonyOS NEXT | Buildable | 0 | active | MIT | 68 |
| [iHongRen/hpack](https://github.com/iHongRen/hpack)<br><small>鸿蒙HarmonyOS应用内部测试分发，一键签名打包分发工具。</small> | HarmonyOS NEXT | Buildable | 96 | moderate | Apache-2.0 | 67 |
| [Hujiko02/Ohush](https://github.com/Hujiko02/Ohush)<br><small>HarmonyOS NEXT的白噪音软件 （基于API23）</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 67 |
| [luojunqi20111219/ZhengJianZhao](https://github.com/luojunqi20111219/ZhengJianZhao)<br><small>基于 HarmonyOS NEXT (ArkTS/ArkUI) │ 开发的智能证件照制作应用，支持人像抠图换底、多种预设尺寸裁剪、轻量美颜优化，以及一抓一放（拖拽传输）和碰一碰分享等鸿蒙原生特性。</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 67 |
| [fengnanrui/Hermes-Agent-Mobile-HarmonyOS](https://github.com/fengnanrui/Hermes-Agent-Mobile-HarmonyOS)<br><small>Hermes Agent Mobile source preview for HarmonyOS 6/7 using ArkTS, ArkUI and ArkWeb with a remote Hermes-CN Dashboard.</small> | HarmonyOS NEXT | Buildable | 0 | active | NOASSERTION | 67 |

## OpenHarmony

共 18 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [openharmony/applications_hap](https://github.com/openharmony/applications_hap)<br><small>暂无描述</small> | OpenHarmony | Binary | 3 | active | Apache-2.0 | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [openharmony/global_resmgr_lite](https://github.com/openharmony/global_resmgr_lite)<br><small>Global resource manager framework \| 全球化资源管理框架</small> | OpenHarmony | Binary | 0 | active | Apache-2.0 | 76 |
| [openharmony/global_resmgr_standard](https://github.com/openharmony/global_resmgr_standard) | OpenHarmony | Binary | 0 | active | Apache-2.0 | 76 |
| [openharmony/communication_wifi](https://github.com/openharmony/communication_wifi)<br><small>Wi-Fi station/P2P/AP management\| including enabling\| disabling\| scanning\| connecting\| and information obtaining operatio…</small> | OpenHarmony | Buildable | 5 | active | Apache-2.0 | 68 |
| [openharmony/powermgr_power_manager](https://github.com/openharmony/powermgr_power_manager)<br><small>暂无描述</small> | OpenHarmony | Buildable | 3 | active | Apache-2.0 | 67 |
| [openharmony/aafwk_standard](https://github.com/openharmony/aafwk_standard)<br><small>Ability management framework \| 元能力框架</small> | OpenHarmony | Binary | 1 | active | Apache-2.0 | 66 |
| [openharmony/appexecfwk_standard](https://github.com/openharmony/appexecfwk_standard)<br><small>Application execution and management framework \| 用户程序运行管理框架</small> | OpenHarmony | Binary | 1 | active | Apache-2.0 | 66 |
| [kipp7/landslide-monitoring-v2](https://github.com/kipp7/landslide-monitoring-v2)<br><small>End-to-end landslide monitoring system with Windows desktop client, RK3568 edge gateway, RK2206 field firmware, and carr…</small> | OpenHarmony | Buildable | 0 | active | MIT | 66 |
| [openharmony/security](https://github.com/openharmony/security)<br><small>Introduction to the handling process and operation modes of security issues \| 安全问题响应处理流程和运作方式介绍</small> | OpenHarmony | Buildable | 0 | active | Apache-2.0 | 66 |
| [galaxywk223/dayorder](https://github.com/galaxywk223/dayorder)<br><small>日序（DayOrder）：面向 Android 与 Windows 的本地优先待办、日历与备忘应用，支持跨端同步和应用内更新。</small> | OpenHarmony | Buildable | 1 | active | GPL-3.0 | 65 |
| [openharmony/distributedschedule_dms_fwk](https://github.com/openharmony/distributedschedule_dms_fwk)<br><small>Framework of the distributed manager service (distributed scheduler) \| 分布式任务调度执行框架</small> | OpenHarmony | Buildable | 3 | active | Apache-2.0 | 64 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [darcycui/DarcyHarmonyNext](https://github.com/darcycui/DarcyHarmonyNext)<br><small>鸿蒙Next ArkUI实现的App。 集成企业微信自定义状态管理框架DataList。</small> | OpenHarmony | Buildable | 6 | active | - | 53 |
| [HarmonyCandies/loading_more_list](https://github.com/HarmonyCandies/loading_more_list)<br><small>A loading more list which supports List,Grid,WaterFlow.</small> | OpenHarmony | Buildable | 22 | stale | Apache-2.0 | 47 |
| [krmao/arcview](https://github.com/krmao/arcview)<br><small>arcview for harmony arkui</small> | OpenHarmony | Buildable | 3 | stale | Apache-2.0 | 47 |
| [CherryRH/OpenHarmony-DistributedChat](https://github.com/CherryRH/OpenHarmony-DistributedChat)<br><small>基于OpenHarmony的分布式聊天应用</small> | OpenHarmony | Buildable | 3 | stale | - | 38 |
| [zhaozihanzzh/OpenHarmonyScreenCaptureSample](https://github.com/zhaozihanzzh/OpenHarmonyScreenCaptureSample)<br><small>OpenHarmony 官方 repo 中的录屏工具 Sample Demo，可以录制屏幕（应该需要 OH5.0+）</small> | OpenHarmony | Buildable | 0 | moderate | - | 38 |

## HarmonyOS

共 24 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ecnusse/Kea](https://github.com/ecnusse/Kea)<br><small>Property-based Testing for Mobile GUI Apps</small> | HarmonyOS | Binary | 75 | active | MIT | 77 |
| [didi/dimina](https://github.com/didi/dimina)<br><small>星河小程序 - 滴滴开源小程序 / Dimina MiniProgram - DiDi's Open-Source MiniProgram</small> | HarmonyOS | Buildable | 918 | active | Apache-2.0 | 74 |
| [XiaoLuoLYG/Appless-Phone](https://github.com/XiaoLuoLYG/Appless-Phone)<br><small>Device-local HarmonyOS agent phone prototype where the agent becomes the entry point and apps become tools</small> | HarmonyOS | Buildable | 11 | active | - | 69 |
| [WisdomGardenInc/CloakPlugins](https://github.com/WisdomGardenInc/CloakPlugins)<br><small>A collection of Cloak framework(A Hybrid Development Framework for HarmonyOS) plugins developed by the official WisdomGa…</small> | HarmonyOS | Buildable | 4 | active | NOASSERTION | 68 |
| [BlackishGreen33/Expo-Harmony-Toolkit](https://github.com/BlackishGreen33/Expo-Harmony-Toolkit)<br><small>面向 Managed/CNG Expo 项目的 HarmonyOS 迁移、准入检查与 UI-stack 构建工具链</small> | HarmonyOS | Buildable | 18 | active | MIT | 67 |
| [alibaba/GaiaX](https://github.com/alibaba/GaiaX)<br><small>动态模板引擎是一套轻量化、跨平台、高性能的纯原生移动端卡片渲染动态化解决方案</small> | HarmonyOS | Buildable | 1288 | moderate | Apache-2.0 | 64 |
| [zhengzaihong/uikit](https://github.com/zhengzaihong/uikit)<br><small>基于 Dart 实现的 UI 组件库，支持 Android、iOS、Web、Windows、macOS、Linux 、 HarmonyOS（SDK ≥ 3.29）等多平台编译，持续维护更新</small> | HarmonyOS | Buildable | 51 | moderate | MIT | 60 |
| [KeloYuan/xxCode](https://github.com/KeloYuan/xxCode)<br><small>💻 原生鸿蒙开源轻量代码编辑器 — A native, lightweight code editor built from scratch for HarmonyOS 5 with ArkTS.</small> | HarmonyOS | Buildable | 5 | moderate | MIT | 60 |
| [zhengzaihong/router_lifecycle](https://github.com/zhengzaihong/router_lifecycle)<br><small>一个基于 Flutter Router 2.0 的轻量级路由生命周期管理框架。提供统一路由跳转、页面生命周期监听、页面可见性追踪、导航守卫、抽屉路由栈管理，并支持低侵入接入、嵌套路由、多 Navigator 管理及声明式扩展。</small> | HarmonyOS | Buildable | 67 | moderate | MIT | 59 |
| [yongoe1024/Rental](https://github.com/yongoe1024/Rental)<br><small>鸿蒙项目：硅谷租房（完成品）</small> | HarmonyOS | Buildable | 65 | stale | MIT | 57 |
| [larksuite/rich-text-vista](https://github.com/larksuite/rich-text-vista)<br><small>RichTextVista is a high-performance, extensible rich text component designed for HarmonyOS applications, supporting dive…</small> | HarmonyOS | Buildable | 50 | stale | NOASSERTION | 57 |
| [JongWoocheon/springboot-harmonyos-hospital-system](https://github.com/JongWoocheon/springboot-harmonyos-hospital-system)<br><small>基于 Spring Boot、MyBatis-Plus、MySQL 和 HarmonyOS ArkTS 的医院预约挂号系统，支持用户登录注册、科室浏览、医生排班查询、预约创建与个人预约管理。</small> | HarmonyOS | Buildable | 0 | active | - | 55 |
| [121212165/md-hongmengban](https://github.com/121212165/md-hongmengban)<br><small>Markdown 编辑器鸿蒙版 \| Markdown editor for HarmonyOS</small> | HarmonyOS | Buildable | 0 | active | - | 53 |
| [banggx/account_app_harmonyos](https://github.com/banggx/account_app_harmonyos)<br><small>原生鸿蒙ArkTs 记账助手APP</small> | HarmonyOS | Buildable | 135 | stale | Apache-2.0 | 52 |
| [linwu-hi/open_neteasy_cloud](https://github.com/linwu-hi/open_neteasy_cloud)<br><small>鸿蒙ArkTS仿网易云</small> | HarmonyOS | Buildable | 367 | stale | - | 49 |
| [amazingcoderpro/HarmonyOS_2048](https://github.com/amazingcoderpro/HarmonyOS_2048)<br><small>鸿蒙HarmonyOS ArkTS实现 2048 小游戏</small> | HarmonyOS | Buildable | 14 | stale | - | 49 |
| [HarmonyCandies/pull_to_refresh](https://github.com/HarmonyCandies/pull_to_refresh)<br><small>ArkTS plugin for building pull to refresh effects with PullToRefresh quickly.</small> | HarmonyOS | Buildable | 22 | stale | Apache-2.0 | 48 |
| [Charles-Stark/Youtube-Music-ArkTS-Clone](https://github.com/Charles-Stark/Youtube-Music-ArkTS-Clone)<br><small>鸿蒙 ArkTS 仿 YouTube Music app</small> | HarmonyOS | Buildable | 28 | stale | - | 47 |
| [iuroc/ElderMate](https://github.com/iuroc/ElderMate)<br><small>智老同行（基于鸿蒙系统的老年人智能生活助手）客户端</small> | HarmonyOS | Buildable | 16 | stale | Apache-2.0 | 45 |
| [3muyuxu3/muyu-music](https://github.com/3muyuxu3/muyu-music)<br><small>HarmonyOS 木羽云音乐</small> | HarmonyOS | Buildable | 1 | moderate | - | 44 |

## ArkUI

> ArkUI related projects.

共 140 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ohosvscode/arkTS](https://github.com/ohosvscode/arkTS)<br><small>🧩 VSCode鸿蒙ArkTS插件 ✨✍️ 支持各种补全/跳转 ⛺️ 支持codelinter检测代码错误 🎵 VSCode HarmonyOS ArkTS plugin for personal use ✨✍️ supports so…</small> | Multi-platform | Binary | 861 | active | MIT | 93 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [harmony-on-android/HOA](https://github.com/harmony-on-android/HOA)<br><small>Run OpenHarmony hap on Android</small> | Multi-platform | Binary | 713 | active | - | 79 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [LiMingKuan-UESTC/HarmonyOs-Clock-Demo](https://github.com/LiMingKuan-UESTC/HarmonyOs-Clock-Demo)<br><small>一个基于 HarmonyOS ArkTS 的翻页时钟与饭点提醒 Demo 应用，支持三餐闹钟设置与通知提醒 A HarmonyOS ArkTS demo app that features a flip clock and meal rem…</small> | HarmonyOS NEXT | Binary | 5 | active | Apache-2.0 | 76 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [wgli-collab/qs-arkts](https://github.com/wgli-collab/qs-arkts)<br><small>qs v6.15.2 ported to HarmonyOS ArkTS — querystring parser and stringifier with prototype pollution protection</small> | Multi-platform | Buildable | 45 | active | BSD-3-Clause | 73 |
| [OHPG/FinVideo](https://github.com/OHPG/FinVideo)<br><small>Jellyfin video client for HarmonyOS.</small> | Multi-platform | Buildable | 56 | active | GPL-3.0 | 72 |
| [wgli-collab/arkts-lodash](https://github.com/wgli-collab/arkts-lodash)<br><small>lodash v4.17.21 ported to HarmonyOS ArkTS — 230+ utility functions with strict-mode type safety</small> | Multi-platform | Buildable | 30 | active | MIT | 72 |
| [haohaoai0/UniClipboardHarmonyOS](https://github.com/haohaoai0/UniClipboardHarmonyOS)<br><small>Community HarmonyOS client for UniClipboard, built with ArkTS, ArkUI, Rust and encrypted P2P sync.</small> | Multi-platform | Buildable | 5 | active | AGPL-3.0 | 72 |
| [linhay/harmony-next.skills](https://github.com/linhay/harmony-next.skills)<br><small>🚀 Expert guidance for HarmonyOS NEXT (API 12+) development. Covers IDE operations, performance tuning, architecture (HA…</small> | Multi-platform | Buildable | 330 | active | - | 71 |
| [huihui200739/YueJiPC](https://github.com/huihui200739/YueJiPC)<br><small>阅迹：HarmonyOS PC 可追溯阅读工作台，连接 PDF 阅读、证据卡与复习整理</small> | HarmonyOS NEXT | Buildable | 1 | active | Apache-2.0 | 71 |
| [rickytan/OhosPatch](https://github.com/rickytan/OhosPatch)<br><small>The missing HarmonyOS Patch Implementation! 鸿蒙 ArkTS 零业务入侵热修复方案：现有代码无需改造，基于 JSVM 动态修复方法与声明式组件 / Zero-intrusion HarmonyOS…</small> | Multi-platform | Buildable | 1 | active | MIT | 71 |
| [Torry2022/turbo-ai-chat-harmonyos](https://github.com/Torry2022/turbo-ai-chat-harmonyos)<br><small>Multi-model native LLM chat for HarmonyOS NEXT with MNN Runtime</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 71 |
| [caidingding233/chromium-hmos](https://github.com/caidingding233/chromium-hmos)<br><small>从华为官方在GitCopy（划掉）改版Chromium的Fork/Fork From Huawei's official version of Chromium from GitCode repository</small> | Multi-platform | Buildable | 0 | active | BSD-3-Clause | 71 |
| [MinamiJogen/HarmonyOS-EhViewer](https://github.com/MinamiJogen/HarmonyOS-EhViewer)<br><small>鸿蒙 EhViewer / HarmonyOS 原生 EhViewer 客户端，ArkTS 开发，支持 HarmonyOS 6.1+</small> | Multi-platform | Buildable | 38 | active | Apache-2.0 | 70 |
| [yongoe1024/RdbPlus](https://github.com/yongoe1024/RdbPlus)<br><small>哈啰出行SQLite的ORM框架，无需编写sql代码，通过装饰器解析表结构，一行搞定增删改查</small> | Multi-platform | Buildable | 18 | active | MIT | 70 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [dososo/HarmonyOS-HCheck](https://github.com/dososo/HarmonyOS-HCheck)<br><small>鸿鉴 HCheck：HarmonyOS 应用本地优先、证据驱动的发布前审查 CLI. Local-first, evidence-driven pre-release inspection for HarmonyOS apps.</small> | Multi-platform | Buildable | 3 | active | MIT | 70 |

## ArkTS

> ArkTS language / tooling projects.

共 176 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ohosvscode/arkTS](https://github.com/ohosvscode/arkTS)<br><small>🧩 VSCode鸿蒙ArkTS插件 ✨✍️ 支持各种补全/跳转 ⛺️ 支持codelinter检测代码错误 🎵 VSCode HarmonyOS ArkTS plugin for personal use ✨✍️ supports so…</small> | Multi-platform | Binary | 861 | active | MIT | 93 |
| [SKL-666666/mnn-local-ai-chat](https://github.com/SKL-666666/mnn-local-ai-chat)<br><small>HarmonyOS 本地 AI 对话应用：MNN + llama.cpp 双引擎，完全离线运行大模型推理 / On-device LLM chat app for HarmonyOS with dual MNN & llama.cpp en…</small> | Multi-platform | Binary | 2 | active | Apache-2.0 | 81 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [harmony-on-android/HOA](https://github.com/harmony-on-android/HOA)<br><small>Run OpenHarmony hap on Android</small> | Multi-platform | Binary | 713 | active | - | 79 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [LiMingKuan-UESTC/HarmonyOs-Clock-Demo](https://github.com/LiMingKuan-UESTC/HarmonyOs-Clock-Demo)<br><small>一个基于 HarmonyOS ArkTS 的翻页时钟与饭点提醒 Demo 应用，支持三餐闹钟设置与通知提醒 A HarmonyOS ArkTS demo app that features a flip clock and meal rem…</small> | HarmonyOS NEXT | Binary | 5 | active | Apache-2.0 | 76 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [didi/dimina](https://github.com/didi/dimina)<br><small>星河小程序 - 滴滴开源小程序 / Dimina MiniProgram - DiDi's Open-Source MiniProgram</small> | HarmonyOS | Buildable | 918 | active | Apache-2.0 | 74 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [popsiclelmlm/Hey](https://github.com/popsiclelmlm/Hey)<br><small>A native network tunnel and protocol debugging client for HarmonyOS NEXT. Bring your own server.</small> | Multi-platform | Buildable | 11 | active | GPL-3.0 | 74 |
| [wgli-collab/qs-arkts](https://github.com/wgli-collab/qs-arkts)<br><small>qs v6.15.2 ported to HarmonyOS ArkTS — querystring parser and stringifier with prototype pollution protection</small> | Multi-platform | Buildable | 45 | active | BSD-3-Clause | 73 |
| [WisdomGardenInc/Cloak](https://github.com/WisdomGardenInc/Cloak)<br><small>Cloak - A Hybrid Development Framework for HarmonyOS</small> | Multi-platform | Buildable | 13 | active | NOASSERTION | 73 |
| [harmony-contrib/openharmony-ability](https://github.com/harmony-contrib/openharmony-ability)<br><small>Building application for OpenHarmony with Rust</small> | Multi-platform | Buildable | 11 | active | NOASSERTION | 73 |
| [OHPG/FinVideo](https://github.com/OHPG/FinVideo)<br><small>Jellyfin video client for HarmonyOS.</small> | Multi-platform | Buildable | 56 | active | GPL-3.0 | 72 |
| [wgli-collab/arkts-lodash](https://github.com/wgli-collab/arkts-lodash)<br><small>lodash v4.17.21 ported to HarmonyOS ArkTS — 230+ utility functions with strict-mode type safety</small> | Multi-platform | Buildable | 30 | active | MIT | 72 |
| [haohaoai0/UniClipboardHarmonyOS](https://github.com/haohaoai0/UniClipboardHarmonyOS)<br><small>Community HarmonyOS client for UniClipboard, built with ArkTS, ArkUI, Rust and encrypted P2P sync.</small> | Multi-platform | Buildable | 5 | active | AGPL-3.0 | 72 |
| [StarHeartY/CalculatorX](https://github.com/StarHeartY/CalculatorX)<br><small>HarmonyOS端的专业科学符号计算器</small> | HarmonyOS NEXT | Buildable | 5 | active | GPL-3.0 | 72 |
| [linhay/harmony-next.skills](https://github.com/linhay/harmony-next.skills)<br><small>🚀 Expert guidance for HarmonyOS NEXT (API 12+) development. Covers IDE operations, performance tuning, architecture (HA…</small> | Multi-platform | Buildable | 330 | active | - | 71 |

## UI Component

> Reusable UI component libraries.

共 15 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [1322208983/harmonyos-arkts-demo](https://github.com/1322208983/harmonyos-arkts-demo)<br><small>能编译、能装、能真机跑的 HarmonyOS / ArkTS 完整示例工程，附 91 个编译错误总结出的 ArkTS 踩坑清单</small> | Multi-platform | Buildable | 0 | active | MIT | 70 |
| [openharmony/arkui_arkui_cangjie_wrapper](https://github.com/openharmony/arkui_arkui_cangjie_wrapper)<br><small>The OpenHarmony Cangjie UI framework based on ArkUI framework.</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 68 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [eclipse-oniro-mirrors/arkui_arkui_cangjie_wrapper](https://github.com/eclipse-oniro-mirrors/arkui_arkui_cangjie_wrapper) | Multi-platform | Buildable | 0 | active | Apache-2.0 | 62 |
| [zhengzaihong/uikit](https://github.com/zhengzaihong/uikit)<br><small>基于 Dart 实现的 UI 组件库，支持 Android、iOS、Web、Windows、macOS、Linux 、 HarmonyOS（SDK ≥ 3.29）等多平台编译，持续维护更新</small> | HarmonyOS | Buildable | 51 | moderate | MIT | 60 |
| [OpeNopEn2007/arkts-patterns](https://github.com/OpeNopEn2007/arkts-patterns)<br><small>Production-ready ArkTS development patterns for HarmonyOS NEXT - 100% benchmark pass rate</small> | Multi-platform | Buildable | 0 | moderate | MIT | 59 |
| [larksuite/rich-text-vista](https://github.com/larksuite/rich-text-vista)<br><small>RichTextVista is a high-performance, extensible rich text component designed for HarmonyOS applications, supporting dive…</small> | HarmonyOS | Buildable | 50 | stale | NOASSERTION | 57 |
| [megaacheyounes/harmony-next-mvvm-sample](https://github.com/megaacheyounes/harmony-next-mvvm-sample)<br><small>Building Dynamic UIs with MVVM Architecture in HarmonyOS Next</small> | HarmonyOS NEXT | Buildable | 0 | moderate | - | 57 |
| [apowerfulmei/ArkUI](https://github.com/apowerfulmei/ArkUI) | Multi-platform | Buildable | 0 | moderate | Apache-2.0 | 50 |
| [Intocord/Arkui](https://github.com/Intocord/Arkui) | Multi-platform | Buildable | 0 | moderate | Apache-2.0 | 50 |
| [jpnurmi/arkui_ace_engine](https://github.com/jpnurmi/arkui_ace_engine)<br><small>ArkUI framework \| ArkUI开发框架</small> | Multi-platform | Buildable | 0 | stale | Apache-2.0 | 46 |

## UI Framework

> UI frameworks and rendering engines.

共 119 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ohosvscode/arkTS](https://github.com/ohosvscode/arkTS)<br><small>🧩 VSCode鸿蒙ArkTS插件 ✨✍️ 支持各种补全/跳转 ⛺️ 支持codelinter检测代码错误 🎵 VSCode HarmonyOS ArkTS plugin for personal use ✨✍️ supports so…</small> | Multi-platform | Binary | 861 | active | MIT | 93 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [harmony-on-android/HOA](https://github.com/harmony-on-android/HOA)<br><small>Run OpenHarmony hap on Android</small> | Multi-platform | Binary | 713 | active | - | 79 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [LiMingKuan-UESTC/HarmonyOs-Clock-Demo](https://github.com/LiMingKuan-UESTC/HarmonyOs-Clock-Demo)<br><small>一个基于 HarmonyOS ArkTS 的翻页时钟与饭点提醒 Demo 应用，支持三餐闹钟设置与通知提醒 A HarmonyOS ArkTS demo app that features a flip clock and meal rem…</small> | HarmonyOS NEXT | Binary | 5 | active | Apache-2.0 | 76 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [OHPG/FinVideo](https://github.com/OHPG/FinVideo)<br><small>Jellyfin video client for HarmonyOS.</small> | Multi-platform | Buildable | 56 | active | GPL-3.0 | 72 |
| [haohaoai0/UniClipboardHarmonyOS](https://github.com/haohaoai0/UniClipboardHarmonyOS)<br><small>Community HarmonyOS client for UniClipboard, built with ArkTS, ArkUI, Rust and encrypted P2P sync.</small> | Multi-platform | Buildable | 5 | active | AGPL-3.0 | 72 |
| [linhay/harmony-next.skills](https://github.com/linhay/harmony-next.skills)<br><small>🚀 Expert guidance for HarmonyOS NEXT (API 12+) development. Covers IDE operations, performance tuning, architecture (HA…</small> | Multi-platform | Buildable | 330 | active | - | 71 |
| [huihui200739/YueJiPC](https://github.com/huihui200739/YueJiPC)<br><small>阅迹：HarmonyOS PC 可追溯阅读工作台，连接 PDF 阅读、证据卡与复习整理</small> | HarmonyOS NEXT | Buildable | 1 | active | Apache-2.0 | 71 |
| [rickytan/OhosPatch](https://github.com/rickytan/OhosPatch)<br><small>The missing HarmonyOS Patch Implementation! 鸿蒙 ArkTS 零业务入侵热修复方案：现有代码无需改造，基于 JSVM 动态修复方法与声明式组件 / Zero-intrusion HarmonyOS…</small> | Multi-platform | Buildable | 1 | active | MIT | 71 |
| [caidingding233/chromium-hmos](https://github.com/caidingding233/chromium-hmos)<br><small>从华为官方在GitCopy（划掉）改版Chromium的Fork/Fork From Huawei's official version of Chromium from GitCode repository</small> | Multi-platform | Buildable | 0 | active | BSD-3-Clause | 71 |
| [MinamiJogen/HarmonyOS-EhViewer](https://github.com/MinamiJogen/HarmonyOS-EhViewer)<br><small>鸿蒙 EhViewer / HarmonyOS 原生 EhViewer 客户端，ArkTS 开发，支持 HarmonyOS 6.1+</small> | Multi-platform | Buildable | 38 | active | Apache-2.0 | 70 |
| [yongoe1024/RdbPlus](https://github.com/yongoe1024/RdbPlus)<br><small>哈啰出行SQLite的ORM框架，无需编写sql代码，通过装饰器解析表结构，一行搞定增删改查</small> | Multi-platform | Buildable | 18 | active | MIT | 70 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [dososo/HarmonyOS-HCheck](https://github.com/dososo/HarmonyOS-HCheck)<br><small>鸿鉴 HCheck：HarmonyOS 应用本地优先、证据驱动的发布前审查 CLI. Local-first, evidence-driven pre-release inspection for HarmonyOS apps.</small> | Multi-platform | Buildable | 3 | active | MIT | 70 |
| [GYZsoftware/data-pacakage-killer](https://github.com/GYZsoftware/data-pacakage-killer)<br><small>一个网络流量测试工具，为HarmonyOS NEXT打造</small> | Multi-platform | Buildable | 1 | active | MulanPSL-2.0 | 70 |
| [miuiadmin/hapi-hmos](https://github.com/miuiadmin/hapi-hmos)<br><small>Hapi 的鸿蒙（HarmonyOS）原生客户端 — ArkTS + ArkUI 重写官方 React Web 前端，对接同一个 Hub 后端</small> | Multi-platform | Buildable | 1 | active | AGPL-3.0 | 70 |
| [1322208983/harmonyos-arkts-demo](https://github.com/1322208983/harmonyos-arkts-demo)<br><small>能编译、能装、能真机跑的 HarmonyOS / ArkTS 完整示例工程，附 91 个编译错误总结出的 ArkTS 踩坑清单</small> | Multi-platform | Buildable | 0 | active | MIT | 70 |

## Network

> Networking libraries and tools.

共 29 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [popsiclelmlm/Hey](https://github.com/popsiclelmlm/Hey)<br><small>A native network tunnel and protocol debugging client for HarmonyOS NEXT. Bring your own server.</small> | Multi-platform | Buildable | 11 | active | GPL-3.0 | 74 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [Torry2022/turbo-ai-chat-harmonyos](https://github.com/Torry2022/turbo-ai-chat-harmonyos)<br><small>Multi-model native LLM chat for HarmonyOS NEXT with MNN Runtime</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 71 |
| [zhengzaihong/rxnet](https://github.com/zhengzaihong/rxnet)<br><small>RxNet 是一款专为 Flutter 开发的跨平台网络请求工具，贴合原生开发习惯，几乎零学习成本即可上手。它不仅让网络通信更丝滑，还支持丰富的功能组合，助你构建高性能、可维护的移动应用，已经支持Android、ios、windows、li…</small> | HarmonyOS NEXT | Buildable | 44 | active | MIT | 70 |
| [CCDawn/harmony-pc-touchpad](https://github.com/CCDawn/harmony-pc-touchpad)<br><small>Turn a HarmonyOS phone into an Apple-style touchpad for Windows PCs.</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 70 |
| [bilibiliales/HarmonyOSMusicPlayer](https://github.com/bilibiliales/HarmonyOSMusicPlayer)<br><small>一款用 ArkTS 为 HarmonyOS NEXT 构建的本地音乐播放器。一款受网易云音乐平台启发的现代化鸿蒙轻量化应用。</small> | Multi-platform | Buildable | 0 | active | MIT | 70 |
| [wandcs/leantty](https://github.com/wandcs/leantty)<br><small>Keyboard-first SSH terminal for ARM64 HarmonyOS PC</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 70 |
| [XiaoLuoLYG/Appless-Phone](https://github.com/XiaoLuoLYG/Appless-Phone)<br><small>Device-local HarmonyOS agent phone prototype where the agent becomes the entry point and apps become tools</small> | HarmonyOS | Buildable | 11 | active | - | 69 |
| [LoMoCatAp/Bika-HarmonyOS](https://github.com/LoMoCatAp/Bika-HarmonyOS)<br><small>鸿蒙系统第三方哔咔客户端</small> | HarmonyOS NEXT | Buildable | 7 | active | GPL-3.0 | 68 |
| [openharmony/communication_wifi](https://github.com/openharmony/communication_wifi)<br><small>Wi-Fi station/P2P/AP management\| including enabling\| disabling\| scanning\| connecting\| and information obtaining operatio…</small> | OpenHarmony | Buildable | 5 | active | Apache-2.0 | 68 |
| [richerfu/Paws](https://github.com/richerfu/Paws)<br><small>A Clash/mihomo OpenHarmony client with a native ArkUI interface, powered by meow-rs and a Rust userspace TUN stack.</small> | Multi-platform | Buildable | 3 | active | MIT | 68 |
| [richerfu/arkit](https://github.com/richerfu/arkit)<br><small>A dioxus-style UI framework for OpenHarmony</small> | Multi-platform | Buildable | 6 | active | Apache-2.0 | 67 |
| [openharmony/xts_tools](https://github.com/openharmony/xts_tools)<br><small>Development framework of the acts \| acts测试套开发框架</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [WenYin-Community/harmonyOffice](https://github.com/WenYin-Community/harmonyOffice)<br><small>基于 HarmonyOS ArkTS + Python Flask + MySQL 的办公用品申领管理系统。</small> | Multi-platform | Buildable | 0 | active | GPL-3.0 | 66 |
| [wgli-collab/axios-arkts](https://github.com/wgli-collab/axios-arkts)<br><small>Promise-based HTTP client for HarmonyOS ArkTS — ported from axios v1.17.0</small> | HarmonyOS NEXT | Buildable | 0 | active | MIT | 66 |
| [alibaba/GaiaX](https://github.com/alibaba/GaiaX)<br><small>动态模板引擎是一套轻量化、跨平台、高性能的纯原生移动端卡片渲染动态化解决方案</small> | HarmonyOS | Buildable | 1288 | moderate | Apache-2.0 | 64 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [Joker-x-dev/CoolMallArkTS](https://github.com/Joker-x-dev/CoolMallArkTS)<br><small>基于 ArkTS 与 ArkUI 打造的电商项目，运用 MVVM 架构和模块化设计，为 HarmonyOS 开发者提供现代开发参考。</small> | HarmonyOS NEXT | Buildable | 71 | moderate | MIT | 63 |

## Database

> Database / ORM libraries.

共 122 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [SKL-666666/mnn-local-ai-chat](https://github.com/SKL-666666/mnn-local-ai-chat)<br><small>HarmonyOS 本地 AI 对话应用：MNN + llama.cpp 双引擎，完全离线运行大模型推理 / On-device LLM chat app for HarmonyOS with dual MNN & llama.cpp en…</small> | Multi-platform | Binary | 2 | active | Apache-2.0 | 81 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [ecnusse/Kea](https://github.com/ecnusse/Kea)<br><small>Property-based Testing for Mobile GUI Apps</small> | HarmonyOS | Binary | 75 | active | MIT | 77 |
| [openharmony/applications_hap](https://github.com/openharmony/applications_hap)<br><small>暂无描述</small> | OpenHarmony | Binary | 3 | active | Apache-2.0 | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [LiMingKuan-UESTC/HarmonyOs-Clock-Demo](https://github.com/LiMingKuan-UESTC/HarmonyOs-Clock-Demo)<br><small>一个基于 HarmonyOS ArkTS 的翻页时钟与饭点提醒 Demo 应用，支持三餐闹钟设置与通知提醒 A HarmonyOS ArkTS demo app that features a flip clock and meal rem…</small> | HarmonyOS NEXT | Binary | 5 | active | Apache-2.0 | 76 |
| [openharmony/global_resmgr_lite](https://github.com/openharmony/global_resmgr_lite)<br><small>Global resource manager framework \| 全球化资源管理框架</small> | OpenHarmony | Binary | 0 | active | Apache-2.0 | 76 |
| [openharmony/global_resmgr_standard](https://github.com/openharmony/global_resmgr_standard) | OpenHarmony | Binary | 0 | active | Apache-2.0 | 76 |
| [suibianqwe/Ehviewer_OHOS](https://github.com/suibianqwe/Ehviewer_OHOS)<br><small>Ehviewer on Harmony OS，原生构建，纵享丝滑。还原安卓版多数功能，同时添加了一些实用功能。现已支持图片ocr翻译。</small> | HarmonyOS NEXT | Buildable | 21 | active | NOASSERTION | 75 |
| [didi/dimina](https://github.com/didi/dimina)<br><small>星河小程序 - 滴滴开源小程序 / Dimina MiniProgram - DiDi's Open-Source MiniProgram</small> | HarmonyOS | Buildable | 918 | active | Apache-2.0 | 74 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [popsiclelmlm/Hey](https://github.com/popsiclelmlm/Hey)<br><small>A native network tunnel and protocol debugging client for HarmonyOS NEXT. Bring your own server.</small> | Multi-platform | Buildable | 11 | active | GPL-3.0 | 74 |
| [ywl5320/wlmedia](https://github.com/ywl5320/wlmedia)<br><small>Android&HarmonyOS Next 音视频播放器SDK，几句代码即可实现音视频播放功能（支持：手机、车机系统、电视盒子等设备。支持：http、https、rtsp、rtp、rtmp、byte[]、加密视频和各种文件格式视频；包含视…</small> | Multi-platform | Buildable | 835 | active | Apache-2.0 | 73 |
| [wgli-collab/qs-arkts](https://github.com/wgli-collab/qs-arkts)<br><small>qs v6.15.2 ported to HarmonyOS ArkTS — querystring parser and stringifier with prototype pollution protection</small> | Multi-platform | Buildable | 45 | active | BSD-3-Clause | 73 |
| [harmony-contrib/openharmony-ability](https://github.com/harmony-contrib/openharmony-ability)<br><small>Building application for OpenHarmony with Rust</small> | Multi-platform | Buildable | 11 | active | NOASSERTION | 73 |
| [xuegao-tzx/Fllama](https://github.com/xuegao-tzx/Fllama)<br><small>A flutter binding for llama.cpp, which use platform channel.</small> | Multi-platform | Buildable | 37 | active | MIT | 72 |

## Storage

> Local storage / persistence.

共 40 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [ywl5320/wlmedia](https://github.com/ywl5320/wlmedia)<br><small>Android&HarmonyOS Next 音视频播放器SDK，几句代码即可实现音视频播放功能（支持：手机、车机系统、电视盒子等设备。支持：http、https、rtsp、rtp、rtmp、byte[]、加密视频和各种文件格式视频；包含视…</small> | Multi-platform | Buildable | 835 | active | Apache-2.0 | 73 |
| [LingXia-Dev/Rong](https://github.com/LingXia-Dev/Rong)<br><small>Rong is a JavaScript runtime for Rust with a unified API over multiple JS engines. It is designed for embedding, Rust-dr…</small> | Multi-platform | Buildable | 3 | active | Apache-2.0 | 71 |
| [Torry2022/turbo-ai-chat-harmonyos](https://github.com/Torry2022/turbo-ai-chat-harmonyos)<br><small>Multi-model native LLM chat for HarmonyOS NEXT with MNN Runtime</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 71 |
| [yongoe1024/RdbPlus](https://github.com/yongoe1024/RdbPlus)<br><small>哈啰出行SQLite的ORM框架，无需编写sql代码，通过装饰器解析表结构，一行搞定增删改查</small> | Multi-platform | Buildable | 18 | active | MIT | 70 |
| [CCDawn/harmony-pc-touchpad](https://github.com/CCDawn/harmony-pc-touchpad)<br><small>Turn a HarmonyOS phone into an Apple-style touchpad for Windows PCs.</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 70 |
| [1322208983/harmonyos-arkts-demo](https://github.com/1322208983/harmonyos-arkts-demo)<br><small>能编译、能装、能真机跑的 HarmonyOS / ArkTS 完整示例工程，附 91 个编译错误总结出的 ArkTS 踩坑清单</small> | Multi-platform | Buildable | 0 | active | MIT | 70 |
| [water04not-speak/NatureSound_Music](https://github.com/water04not-speak/NatureSound_Music)<br><small>Open-source HarmonyOS / ArkTS music app reference template with AVPlayer, AVSession, RDB, LRC lyrics, public demo data,…</small> | Multi-platform | Buildable | 1 | active | MIT | 69 |
| [willvar/webox](https://github.com/willvar/webox)<br><small>Native WebView app template for Android, iOS, and HarmonyOS NEXT.</small> | HarmonyOS NEXT | Buildable | 4 | active | MIT | 68 |
| [richerfu/Paws](https://github.com/richerfu/Paws)<br><small>A Clash/mihomo OpenHarmony client with a native ArkUI interface, powered by meow-rs and a Rust userspace TUN stack.</small> | Multi-platform | Buildable | 3 | active | MIT | 68 |
| [ShwStone/AnyPWA](https://github.com/ShwStone/AnyPWA)<br><small>HarmonyOS PC/2-in-1 native web app and PWA manager</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 68 |
| [BlackishGreen33/Expo-Harmony-Toolkit](https://github.com/BlackishGreen33/Expo-Harmony-Toolkit)<br><small>面向 Managed/CNG Expo 项目的 HarmonyOS 迁移、准入检查与 UI-stack 构建工具链</small> | HarmonyOS | Buildable | 18 | active | MIT | 67 |
| [halaprix/leakwatch](https://github.com/halaprix/leakwatch)<br><small>Battery-frugal monitor for Huawei watches and HMS phones. Hard-mode sampling, <0.5%/24h drain.</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [harmoninux/Harmonix](https://github.com/harmoninux/Harmonix)<br><small>A terminal for running Linux ELF binary on HarmonyOS PC.</small> | Multi-platform | Buildable | 117 | moderate | MIT | 66 |
| [iHongRen/SandboxFinder](https://github.com/iHongRen/SandboxFinder)<br><small>鸿蒙沙箱文件浏览器</small> | HarmonyOS NEXT | Buildable | 47 | moderate | Apache-2.0 | 64 |
| [yabi-zzh/simple-live-ohos](https://github.com/yabi-zzh/simple-live-ohos)<br><small>简洁的多平台直播聚合应用 HarmonyOS NEXT 版，支持B站/斗鱼/虎牙/抖音</small> | Multi-platform | Buildable | 43 | moderate | GPL-3.0 | 64 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [OSSD-Course-SYSU-1/2026Spring-25307013-Lab1](https://github.com/OSSD-Course-SYSU-1/2026Spring-25307013-Lab1)<br><small>HarmonyOS / ArkTS 轻量便签应用，基于 InstantNote 改造，支持搜索、置顶、响应式布局和局域网投送流程验证。</small> | Multi-platform | Buildable | 0 | active | - | 64 |
| [Joker-x-dev/CoolMallArkTS](https://github.com/Joker-x-dev/CoolMallArkTS)<br><small>基于 ArkTS 与 ArkUI 打造的电商项目，运用 MVVM 架构和模块化设计，为 HarmonyOS 开发者提供现代开发参考。</small> | HarmonyOS NEXT | Buildable | 71 | moderate | MIT | 63 |

## Audio

> Audio playback / processing.

共 31 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [openharmony/applications_hap](https://github.com/openharmony/applications_hap)<br><small>暂无描述</small> | OpenHarmony | Binary | 3 | active | Apache-2.0 | 77 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [ywl5320/wlmedia](https://github.com/ywl5320/wlmedia)<br><small>Android&HarmonyOS Next 音视频播放器SDK，几句代码即可实现音视频播放功能（支持：手机、车机系统、电视盒子等设备。支持：http、https、rtsp、rtp、rtmp、byte[]、加密视频和各种文件格式视频；包含视…</small> | Multi-platform | Buildable | 835 | active | Apache-2.0 | 73 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [DawningW/CoralReefPlayer](https://github.com/DawningW/CoralReefPlayer)<br><small>珊瑚礁播放器，一款现代化跨平台流媒体播放器库，支持 RTSP、RTP 和 MJPEG over HTTP 流，提供可定制、高性能、低延迟的推拉流、编解码及录像能力</small> | Multi-platform | Buildable | 47 | active | MIT | 70 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [bilibiliales/HarmonyOSMusicPlayer](https://github.com/bilibiliales/HarmonyOSMusicPlayer)<br><small>一款用 ArkTS 为 HarmonyOS NEXT 构建的本地音乐播放器。一款受网易云音乐平台启发的现代化鸿蒙轻量化应用。</small> | Multi-platform | Buildable | 0 | active | MIT | 70 |
| [water04not-speak/NatureSound_Music](https://github.com/water04not-speak/NatureSound_Music)<br><small>Open-source HarmonyOS / ArkTS music app reference template with AVPlayer, AVSession, RDB, LRC lyrics, public demo data,…</small> | Multi-platform | Buildable | 1 | active | MIT | 69 |
| [obeiipcom/jmScrcpy](https://github.com/obeiipcom/jmScrcpy)<br><small>鸿蒙（HarmonyOS NEXT）系统内录音频采集服务：基于华为官方 Media Kit（@ohos.multimedia.media，HarmonyOS 多媒体服务）的 OH_AVScreenCapture C API（innerCap…</small> | Multi-platform | Buildable | 0 | active | NOASSERTION | 69 |
| [Hujiko02/Ohush](https://github.com/Hujiko02/Ohush)<br><small>HarmonyOS NEXT的白噪音软件 （基于API23）</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 67 |
| [openharmony/xts_tools](https://github.com/openharmony/xts_tools)<br><small>Development framework of the acts \| acts测试套开发框架</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [OHPG/FinMusic](https://github.com/OHPG/FinMusic)<br><small>Jellyfin music client for HarmonyOS.</small> | Multi-platform | Buildable | 2 | active | GPL-3.0 | 66 |
| [94run/AudioRecorder](https://github.com/94run/AudioRecorder) | HarmonyOS NEXT | Buildable | 0 | active | AGPL-3.0 | 66 |
| [arkui-x/samples](https://github.com/arkui-x/samples)<br><small>Cross-platform use cases of ArkUI-X \| ArkUI-X跨平台应用示例</small> | HarmonyOS NEXT | Buildable | 5 | active | Apache-2.0 | 64 |
| [AkirTech/FFmpegLiteNative](https://github.com/AkirTech/FFmpegLiteNative)<br><small>An FFmpeg user interface for HarmonyOS users.</small> | Multi-platform | Buildable | 1 | active | MIT | 64 |

## Video

> Video playback / processing.

共 27 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [JackJiang2011/MobileIMSDK](https://github.com/JackJiang2011/MobileIMSDK)<br><small>原创全平台IM通信层框架，轻量级、高度提炼，历经10年、久经考验。可能是市面上唯一同时支持UDP+TCP+WebSocket三种协议的同类开源框架，支持 iOS、Android、Java、H5、小程序、Uniapp、鸿蒙Next，服务端基于…</small> | HarmonyOS NEXT | Buildable | 6082 | active | Apache-2.0 | 83 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [ecnusse/Kea](https://github.com/ecnusse/Kea)<br><small>Property-based Testing for Mobile GUI Apps</small> | HarmonyOS | Binary | 75 | active | MIT | 77 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [ywl5320/wlmedia](https://github.com/ywl5320/wlmedia)<br><small>Android&HarmonyOS Next 音视频播放器SDK，几句代码即可实现音视频播放功能（支持：手机、车机系统、电视盒子等设备。支持：http、https、rtsp、rtp、rtmp、byte[]、加密视频和各种文件格式视频；包含视…</small> | Multi-platform | Buildable | 835 | active | Apache-2.0 | 73 |
| [OHPG/FinVideo](https://github.com/OHPG/FinVideo)<br><small>Jellyfin video client for HarmonyOS.</small> | Multi-platform | Buildable | 56 | active | GPL-3.0 | 72 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [DawningW/CoralReefPlayer](https://github.com/DawningW/CoralReefPlayer)<br><small>珊瑚礁播放器，一款现代化跨平台流媒体播放器库，支持 RTSP、RTP 和 MJPEG over HTTP 流，提供可定制、高性能、低延迟的推拉流、编解码及录像能力</small> | Multi-platform | Buildable | 47 | active | MIT | 70 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [KodeGood/webkitview-openharmony](https://github.com/KodeGood/webkitview-openharmony)<br><small>WebKitView for OpenHarmony</small> | Multi-platform | Buildable | 2 | active | LGPL-2.1 | 70 |
| [XiaoLuoLYG/Appless-Phone](https://github.com/XiaoLuoLYG/Appless-Phone)<br><small>Device-local HarmonyOS agent phone prototype where the agent becomes the entry point and apps become tools</small> | HarmonyOS | Buildable | 11 | active | - | 69 |
| [openharmony/xts_tools](https://github.com/openharmony/xts_tools)<br><small>Development framework of the acts \| acts测试套开发框架</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [azhuge233/Wake-HarmonyOS](https://github.com/azhuge233/Wake-HarmonyOS)<br><small>Wake-on-LAN on HarmonyOS NEXT</small> | HarmonyOS NEXT | Buildable | 17 | active | - | 66 |
| [arkui-x/samples](https://github.com/arkui-x/samples)<br><small>Cross-platform use cases of ArkUI-X \| ArkUI-X跨平台应用示例</small> | HarmonyOS NEXT | Buildable | 5 | active | Apache-2.0 | 64 |
| [AkirTech/FFmpegLiteNative](https://github.com/AkirTech/FFmpegLiteNative)<br><small>An FFmpeg user interface for HarmonyOS users.</small> | Multi-platform | Buildable | 1 | active | MIT | 64 |
| [ZhaoYuLiOfficial/HarmonyOS6-WebView-Shell](https://github.com/ZhaoYuLiOfficial/HarmonyOS6-WebView-Shell)<br><small>纯 ArkTS 开发的鸿蒙 NEXT WebView 套壳应用模板</small> | HarmonyOS NEXT | Buildable | 7 | moderate | MIT | 63 |
| [azhuge233/ASFShortcut-HN](https://github.com/azhuge233/ASFShortcut-HN)<br><small>ArchiSteamFarm client for HarmonyOS NEXT.</small> | HarmonyOS NEXT | Buildable | 0 | active | - | 62 |
| [jun-chy/ELDetect2](https://github.com/jun-chy/ELDetect2)<br><small>OpenHarmony-based energy label detection and defect recognition system</small> | Multi-platform | Buildable | 0 | active | - | 61 |

## Multimedia

> Multimedia (audio + video) projects.

共 24 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [ywl5320/wlmedia](https://github.com/ywl5320/wlmedia)<br><small>Android&HarmonyOS Next 音视频播放器SDK，几句代码即可实现音视频播放功能（支持：手机、车机系统、电视盒子等设备。支持：http、https、rtsp、rtp、rtmp、byte[]、加密视频和各种文件格式视频；包含视…</small> | Multi-platform | Buildable | 835 | active | Apache-2.0 | 73 |
| [OHPG/FinVideo](https://github.com/OHPG/FinVideo)<br><small>Jellyfin video client for HarmonyOS.</small> | Multi-platform | Buildable | 56 | active | GPL-3.0 | 72 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [DawningW/CoralReefPlayer](https://github.com/DawningW/CoralReefPlayer)<br><small>珊瑚礁播放器，一款现代化跨平台流媒体播放器库，支持 RTSP、RTP 和 MJPEG over HTTP 流，提供可定制、高性能、低延迟的推拉流、编解码及录像能力</small> | Multi-platform | Buildable | 47 | active | MIT | 70 |
| [bilibiliales/HarmonyOSMusicPlayer](https://github.com/bilibiliales/HarmonyOSMusicPlayer)<br><small>一款用 ArkTS 为 HarmonyOS NEXT 构建的本地音乐播放器。一款受网易云音乐平台启发的现代化鸿蒙轻量化应用。</small> | Multi-platform | Buildable | 0 | active | MIT | 70 |
| [water04not-speak/NatureSound_Music](https://github.com/water04not-speak/NatureSound_Music)<br><small>Open-source HarmonyOS / ArkTS music app reference template with AVPlayer, AVSession, RDB, LRC lyrics, public demo data,…</small> | Multi-platform | Buildable | 1 | active | MIT | 69 |
| [obeiipcom/jmScrcpy](https://github.com/obeiipcom/jmScrcpy)<br><small>鸿蒙（HarmonyOS NEXT）系统内录音频采集服务：基于华为官方 Media Kit（@ohos.multimedia.media，HarmonyOS 多媒体服务）的 OH_AVScreenCapture C API（innerCap…</small> | Multi-platform | Buildable | 0 | active | NOASSERTION | 69 |
| [Aloereed/aloeplayer_ohos](https://github.com/Aloereed/aloeplayer_ohos)<br><small>AloePlayer: a cross-platform local media player.</small> | Multi-platform | Buildable | 16 | active | - | 68 |
| [openharmony/arkui_arkui_cangjie_wrapper](https://github.com/openharmony/arkui_arkui_cangjie_wrapper)<br><small>The OpenHarmony Cangjie UI framework based on ArkUI framework.</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 68 |
| [wbbb0/wPlayer](https://github.com/wbbb0/wPlayer)<br><small>A clean, offline local music player for HarmonyOS, built with ArkTS and ArkUI.</small> | HarmonyOS NEXT | Buildable | 1 | active | GPL-3.0 | 68 |
| [openharmony/xts_tools](https://github.com/openharmony/xts_tools)<br><small>Development framework of the acts \| acts测试套开发框架</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [OHPG/FinMusic](https://github.com/OHPG/FinMusic)<br><small>Jellyfin music client for HarmonyOS.</small> | Multi-platform | Buildable | 2 | active | GPL-3.0 | 66 |
| [94run/AudioRecorder](https://github.com/94run/AudioRecorder) | HarmonyOS NEXT | Buildable | 0 | active | AGPL-3.0 | 66 |
| [eclipse-oniro-mirrors/arkui_arkui_cangjie_wrapper](https://github.com/eclipse-oniro-mirrors/arkui_arkui_cangjie_wrapper) | Multi-platform | Buildable | 0 | active | Apache-2.0 | 62 |
| [Z-P-J/AnimeZ](https://github.com/Z-P-J/AnimeZ)<br><small>AnimeZ，OpenHarmony开源看动漫应用</small> | Multi-platform | Buildable | 99 | stale | Apache-2.0 | 60 |
| [zhengzaihong/router_lifecycle](https://github.com/zhengzaihong/router_lifecycle)<br><small>一个基于 Flutter Router 2.0 的轻量级路由生命周期管理框架。提供统一路由跳转、页面生命周期监听、页面可见性追踪、导航守卫、抽屉路由栈管理，并支持低侵入接入、嵌套路由、多 Navigator 管理及声明式扩展。</small> | HarmonyOS | Buildable | 67 | moderate | MIT | 59 |

## Graphics

> Graphics / canvas / drawing.

共 23 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [wuweiyouzuoju/jidecards-anki-harmonyos](https://github.com/wuweiyouzuoju/jidecards-anki-harmonyos)<br><small>基于 HarmonyOS 的 Anki 卡片学习客户端，复用 Anki Rust 后端</small> | HarmonyOS NEXT | Buildable | 2 | active | AGPL-3.0 | 68 |
| [openharmony/arkui_arkui_cangjie_wrapper](https://github.com/openharmony/arkui_arkui_cangjie_wrapper)<br><small>The OpenHarmony Cangjie UI framework based on ArkUI framework.</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 68 |
| [richerfu/arkit](https://github.com/richerfu/arkit)<br><small>A dioxus-style UI framework for OpenHarmony</small> | Multi-platform | Buildable | 6 | active | Apache-2.0 | 67 |
| [Glen-Yan/harmony-physics-sandbox](https://github.com/Glen-Yan/harmony-physics-sandbox)<br><small>🪐 一款基于 HarmonyOS 的 2D 物理沙盒仿真工具 — 自由绘制、物理交互、场景管理、跨设备分享</small> | Multi-platform | Buildable | 2 | active | Apache-2.0 | 67 |
| [halaprix/leakwatch](https://github.com/halaprix/leakwatch)<br><small>Battery-frugal monitor for Huawei watches and HMS phones. Hard-mode sampling, <0.5%/24h drain.</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [openharmony/xts_tools](https://github.com/openharmony/xts_tools)<br><small>Development framework of the acts \| acts测试套开发框架</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [yabi-zzh/simple-live-ohos](https://github.com/yabi-zzh/simple-live-ohos)<br><small>简洁的多平台直播聚合应用 HarmonyOS NEXT 版，支持B站/斗鱼/虎牙/抖音</small> | Multi-platform | Buildable | 43 | moderate | GPL-3.0 | 64 |
| [eclipse-oniro-mirrors/arkui_arkui_cangjie_wrapper](https://github.com/eclipse-oniro-mirrors/arkui_arkui_cangjie_wrapper) | Multi-platform | Buildable | 0 | active | Apache-2.0 | 62 |
| [Aiyc-02/YOLO-HarmonyOS-Vision](https://github.com/Aiyc-02/YOLO-HarmonyOS-Vision)<br><small>基于 ArkTS 与 MindSpore Lite 的鸿蒙端侧 YOLO 目标检测引擎</small> | HarmonyOS NEXT | Buildable | 0 | active | - | 61 |
| [Chen-ce/NextAI](https://github.com/Chen-ce/NextAI)<br><small>基于鸿蒙 HarmonyOS NEXT 原生组件构建的本地 AI 助手，支持接入 OpenAI、DeepSeek、Qwen 等多模型服务。 A native AI assistant built with HarmonyOS NEXT co…</small> | HarmonyOS NEXT | Binary | 0 | moderate | - | 60 |
| [heidouya/BlackBeanLedger](https://github.com/heidouya/BlackBeanLedger)<br><small>基于 ArkTS+ArkUI 开发的鸿蒙本地记账开源项目，使用 SQLite 本地数据库，完整实现账单录入、分类、数据统计功能。Open-source offline ledger app for HarmonyOS using ArkTS…</small> | HarmonyOS NEXT | Buildable | 1 | moderate | - | 57 |
| [huangyuanlove/HelloArkUI](https://github.com/huangyuanlove/HelloArkUI)<br><small>ArkUI demo，for api 12 or above</small> | HarmonyOS NEXT | Buildable | 9 | moderate | Apache-2.0 | 56 |
| [openharmony/xts_acts](https://github.com/openharmony/xts_acts)<br><small>暂无描述</small> | Multi-platform | Buildable | 1 | stale | Apache-2.0 | 52 |
| [apowerfulmei/ArkUI](https://github.com/apowerfulmei/ArkUI) | Multi-platform | Buildable | 0 | moderate | Apache-2.0 | 50 |

## Image

> Image processing.

共 78 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ohosvscode/arkTS](https://github.com/ohosvscode/arkTS)<br><small>🧩 VSCode鸿蒙ArkTS插件 ✨✍️ 支持各种补全/跳转 ⛺️ 支持codelinter检测代码错误 🎵 VSCode HarmonyOS ArkTS plugin for personal use ✨✍️ supports so…</small> | Multi-platform | Binary | 861 | active | MIT | 93 |
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [suibianqwe/Ehviewer_OHOS](https://github.com/suibianqwe/Ehviewer_OHOS)<br><small>Ehviewer on Harmony OS，原生构建，纵享丝滑。还原安卓版多数功能，同时添加了一些实用功能。现已支持图片ocr翻译。</small> | HarmonyOS NEXT | Buildable | 21 | active | NOASSERTION | 75 |
| [popsiclelmlm/Hey](https://github.com/popsiclelmlm/Hey)<br><small>A native network tunnel and protocol debugging client for HarmonyOS NEXT. Bring your own server.</small> | Multi-platform | Buildable | 11 | active | GPL-3.0 | 74 |
| [haohaoai0/UniClipboardHarmonyOS](https://github.com/haohaoai0/UniClipboardHarmonyOS)<br><small>Community HarmonyOS client for UniClipboard, built with ArkTS, ArkUI, Rust and encrypted P2P sync.</small> | Multi-platform | Buildable | 5 | active | AGPL-3.0 | 72 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [rickytan/OhosPatch](https://github.com/rickytan/OhosPatch)<br><small>The missing HarmonyOS Patch Implementation! 鸿蒙 ArkTS 零业务入侵热修复方案：现有代码无需改造，基于 JSVM 动态修复方法与声明式组件 / Zero-intrusion HarmonyOS…</small> | Multi-platform | Buildable | 1 | active | MIT | 71 |
| [Torry2022/turbo-ai-chat-harmonyos](https://github.com/Torry2022/turbo-ai-chat-harmonyos)<br><small>Multi-model native LLM chat for HarmonyOS NEXT with MNN Runtime</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 71 |
| [zhengzaihong/rxnet](https://github.com/zhengzaihong/rxnet)<br><small>RxNet 是一款专为 Flutter 开发的跨平台网络请求工具，贴合原生开发习惯，几乎零学习成本即可上手。它不仅让网络通信更丝滑，还支持丰富的功能组合，助你构建高性能、可维护的移动应用，已经支持Android、ios、windows、li…</small> | HarmonyOS NEXT | Buildable | 44 | active | MIT | 70 |
| [KodeGood/webkitview-openharmony](https://github.com/KodeGood/webkitview-openharmony)<br><small>WebKitView for OpenHarmony</small> | Multi-platform | Buildable | 2 | active | LGPL-2.1 | 70 |
| [Cloudrs/Cloudrs-ohos](https://github.com/Cloudrs/Cloudrs-ohos)<br><small>HarmonyOS Next native client for Cloudreve, built with ArkTS + Rust. Supports Cloudreve V3/V4.</small> | Multi-platform | Buildable | 1 | active | GPL-3.0 | 70 |
| [bilibiliales/HarmonyOSMusicPlayer](https://github.com/bilibiliales/HarmonyOSMusicPlayer)<br><small>一款用 ArkTS 为 HarmonyOS NEXT 构建的本地音乐播放器。一款受网易云音乐平台启发的现代化鸿蒙轻量化应用。</small> | Multi-platform | Buildable | 0 | active | MIT | 70 |
| [ohosvscode/project-detector](https://github.com/ohosvscode/project-detector)<br><small>🔍 Hvigor Project Finder analyzer 🧐 Specify a base working directory, scan all HarmonyOS projects ✨ written in Rust, pr…</small> | Multi-platform | Buildable | 4 | active | MIT | 69 |
| [openharmony/communication_wifi](https://github.com/openharmony/communication_wifi)<br><small>Wi-Fi station/P2P/AP management\| including enabling\| disabling\| scanning\| connecting\| and information obtaining operatio…</small> | OpenHarmony | Buildable | 5 | active | Apache-2.0 | 68 |
| [richerfu/Paws](https://github.com/richerfu/Paws)<br><small>A Clash/mihomo OpenHarmony client with a native ArkUI interface, powered by meow-rs and a Rust userspace TUN stack.</small> | Multi-platform | Buildable | 3 | active | MIT | 68 |

## AI

> Artificial intelligence projects.

共 27 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [SKL-666666/mnn-local-ai-chat](https://github.com/SKL-666666/mnn-local-ai-chat)<br><small>HarmonyOS 本地 AI 对话应用：MNN + llama.cpp 双引擎，完全离线运行大模型推理 / On-device LLM chat app for HarmonyOS with dual MNN & llama.cpp en…</small> | Multi-platform | Binary | 2 | active | Apache-2.0 | 81 |
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [suibianqwe/Ehviewer_OHOS](https://github.com/suibianqwe/Ehviewer_OHOS)<br><small>Ehviewer on Harmony OS，原生构建，纵享丝滑。还原安卓版多数功能，同时添加了一些实用功能。现已支持图片ocr翻译。</small> | HarmonyOS NEXT | Buildable | 21 | active | NOASSERTION | 75 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [xuegao-tzx/Fllama](https://github.com/xuegao-tzx/Fllama)<br><small>A flutter binding for llama.cpp, which use platform channel.</small> | Multi-platform | Buildable | 37 | active | MIT | 72 |
| [Torry2022/turbo-ai-chat-harmonyos](https://github.com/Torry2022/turbo-ai-chat-harmonyos)<br><small>Multi-model native LLM chat for HarmonyOS NEXT with MNN Runtime</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 71 |
| [XCNXNXNX/lingxi-flow-agent](https://github.com/XCNXNXNX/lingxi-flow-agent)<br><small>灵犀流序（Lingxi Flow）：运行在 HarmonyOS NEXT 上的 AI 智能体（Agent）个人助理。一句话描述需求，AI 自主规划、调用系统工具完成任务。纯 ArkTS 实现，支持 25+ 系统工具（文件/提醒/日历/天气/…</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 71 |
| [MinamiJogen/HarmonyOS-EhViewer](https://github.com/MinamiJogen/HarmonyOS-EhViewer)<br><small>鸿蒙 EhViewer / HarmonyOS 原生 EhViewer 客户端，ArkTS 开发，支持 HarmonyOS 6.1+</small> | Multi-platform | Buildable | 38 | active | Apache-2.0 | 70 |
| [GYZsoftware/data-pacakage-killer](https://github.com/GYZsoftware/data-pacakage-killer)<br><small>一个网络流量测试工具，为HarmonyOS NEXT打造</small> | Multi-platform | Buildable | 1 | active | MulanPSL-2.0 | 70 |
| [miuiadmin/hapi-hmos](https://github.com/miuiadmin/hapi-hmos)<br><small>Hapi 的鸿蒙（HarmonyOS）原生客户端 — ArkTS + ArkUI 重写官方 React Web 前端，对接同一个 Hub 后端</small> | Multi-platform | Buildable | 1 | active | AGPL-3.0 | 70 |
| [XiaoLuoLYG/Appless-Phone](https://github.com/XiaoLuoLYG/Appless-Phone)<br><small>Device-local HarmonyOS agent phone prototype where the agent becomes the entry point and apps become tools</small> | HarmonyOS | Buildable | 11 | active | - | 69 |
| [fengnanrui/Hermes-Agent-Mobile-HarmonyOS](https://github.com/fengnanrui/Hermes-Agent-Mobile-HarmonyOS)<br><small>Hermes Agent Mobile source preview for HarmonyOS 6/7 using ArkTS, ArkUI and ArkWeb with a remote Hermes-CN Dashboard.</small> | HarmonyOS NEXT | Buildable | 0 | active | NOASSERTION | 67 |
| [harmoninux/Harmonix](https://github.com/harmoninux/Harmonix)<br><small>A terminal for running Linux ELF binary on HarmonyOS PC.</small> | Multi-platform | Buildable | 117 | moderate | MIT | 66 |
| [dososo/HarmonyOS-Design](https://github.com/dososo/HarmonyOS-Design)<br><small>面向 AI Agent 的 HarmonyOS / ArkUI 设计与动效 Skill、规则库与评测基线 · Design & motion Skills, rule library and evaluation baseline for…</small> | Multi-platform | Buildable | 25 | active | Apache-2.0 | 66 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [kakahuote1/ArkTaint](https://github.com/kakahuote1/ArkTaint)<br><small>Static taint analysis for HarmonyOS/ArkTS with declarative assets, LLM-assisted API modeling, OCLFS, and evidence-driven…</small> | Multi-platform | Buildable | 2 | active | - | 63 |
| [kexijiang/OpenX](https://github.com/kexijiang/OpenX)<br><small>OpenX: an open-source, model-configurable personal memory voice Agent for HarmonyOS.</small> | HarmonyOS NEXT | Buildable | 0 | active | Apache-2.0 | 63 |
| [Turbo1123/turbo-ai-chat-harmonyos](https://github.com/Turbo1123/turbo-ai-chat-harmonyos)<br><small>HarmonyOS NEXT native Gemma 4 MNN on-device LLM chat demo</small> | Multi-platform | Buildable | 5 | moderate | NOASSERTION | 62 |
| [andoter0501/wanAndroid](https://github.com/andoter0501/wanAndroid)<br><small>wanAndroid 网站的鸿蒙移动 App，适用华为鸿蒙系统，采用 ViewModel 架构设计开发，简洁风格，包括登录、首页、体系、公众号、导航、项目，运行流畅</small> | HarmonyOS NEXT | Buildable | 2 | moderate | NOASSERTION | 62 |

## LLM

> Large language model projects.

共 8 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [SKL-666666/mnn-local-ai-chat](https://github.com/SKL-666666/mnn-local-ai-chat)<br><small>HarmonyOS 本地 AI 对话应用：MNN + llama.cpp 双引擎，完全离线运行大模型推理 / On-device LLM chat app for HarmonyOS with dual MNN & llama.cpp en…</small> | Multi-platform | Binary | 2 | active | Apache-2.0 | 81 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [Torry2022/turbo-ai-chat-harmonyos](https://github.com/Torry2022/turbo-ai-chat-harmonyos)<br><small>Multi-model native LLM chat for HarmonyOS NEXT with MNN Runtime</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 71 |
| [XCNXNXNX/lingxi-flow-agent](https://github.com/XCNXNXNX/lingxi-flow-agent)<br><small>灵犀流序（Lingxi Flow）：运行在 HarmonyOS NEXT 上的 AI 智能体（Agent）个人助理。一句话描述需求，AI 自主规划、调用系统工具完成任务。纯 ArkTS 实现，支持 25+ 系统工具（文件/提醒/日历/天气/…</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 71 |
| [composable-tu/pangu.arkts](https://github.com/composable-tu/pangu.arkts)<br><small>Inserts spacing between CJK characters and Latin letters, numbers, or symbols in ArkTS</small> | Multi-platform | Buildable | 1 | active | MulanPSL-2.0 | 70 |
| [kakahuote1/ArkTaint](https://github.com/kakahuote1/ArkTaint)<br><small>Static taint analysis for HarmonyOS/ArkTS with declarative assets, LLM-assisted API modeling, OCLFS, and evidence-driven…</small> | Multi-platform | Buildable | 2 | active | - | 63 |
| [Turbo1123/turbo-ai-chat-harmonyos](https://github.com/Turbo1123/turbo-ai-chat-harmonyos)<br><small>HarmonyOS NEXT native Gemma 4 MNN on-device LLM chat demo</small> | Multi-platform | Buildable | 5 | moderate | NOASSERTION | 62 |
| [Chen-ce/NextAI](https://github.com/Chen-ce/NextAI)<br><small>基于鸿蒙 HarmonyOS NEXT 原生组件构建的本地 AI 助手，支持接入 OpenAI、DeepSeek、Qwen 等多模型服务。 A native AI assistant built with HarmonyOS NEXT co…</small> | HarmonyOS NEXT | Binary | 0 | moderate | - | 60 |

## IoT

> Internet of Things.

共 2 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [kipp7/landslide-monitoring-v2](https://github.com/kipp7/landslide-monitoring-v2)<br><small>End-to-end landslide monitoring system with Windows desktop client, RK3568 edge gateway, RK2206 field firmware, and carr…</small> | OpenHarmony | Buildable | 0 | active | MIT | 66 |

## Hardware

> Hardware / driver / peripheral projects.

共 5 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ecnusse/Kea](https://github.com/ecnusse/Kea)<br><small>Property-based Testing for Mobile GUI Apps</small> | HarmonyOS | Binary | 75 | active | MIT | 77 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [KodeGood/webkitview-openharmony](https://github.com/KodeGood/webkitview-openharmony)<br><small>WebKitView for OpenHarmony</small> | Multi-platform | Buildable | 2 | active | LGPL-2.1 | 70 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [icecreamZeng/DriverEasy](https://github.com/icecreamZeng/DriverEasy)<br><small>🚗 鸿蒙原生驾照理论刷题 App — 科目一 + 科目四，4378 道题库，错题本，模拟考试</small> | HarmonyOS NEXT | Buildable | 1 | moderate | - | 59 |

## Game

> Game development.

共 10 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [GYZsoftware/data-pacakage-killer](https://github.com/GYZsoftware/data-pacakage-killer)<br><small>一个网络流量测试工具，为HarmonyOS NEXT打造</small> | Multi-platform | Buildable | 1 | active | MulanPSL-2.0 | 70 |
| [SuppliedGoat435/NumberSlidingPuzzle](https://github.com/SuppliedGoat435/NumberSlidingPuzzle)<br><small>基于 ArkTS + ArkUI 开发的经典数字华容道鸿蒙应用，适配华为鸿蒙HarmonyOS 6.1.0(23)，支持3×3/4×4/5×5三档难度。</small> | HarmonyOS NEXT | Buildable | 2 | active | MIT | 65 |
| [zcg741/chengyu-game](https://github.com/zcg741/chengyu-game)<br><small>HarmonyOS 成语猜猜乐 - 基于 ArkTS/ArkUI 的鸿蒙成语猜谜游戏，含510条成语数据、成就系统、每日挑战</small> | HarmonyOS NEXT | Buildable | 2 | moderate | MIT | 61 |
| [dividez/harmonyos-games](https://github.com/dividez/harmonyos-games)<br><small>HarmonyOS 游戏开发；基于华为 HarmonyOS NEXT ArkTS 开发的小游戏集合。A collection of mini games developed based on Huawei HarmonyOS NEXT Ar…</small> | HarmonyOS NEXT | Buildable | 14 | stale | MIT | 54 |
| [jiwangyihao/FlameChase](https://github.com/jiwangyihao/FlameChase)<br><small>A HarmonyOS ArkTS ArkUI-X cross-platform APP</small> | Multi-platform | Buildable | 7 | stale | MPL-2.0 | 50 |
| [amazingcoderpro/HarmonyOS_2048](https://github.com/amazingcoderpro/HarmonyOS_2048)<br><small>鸿蒙HarmonyOS ArkTS实现 2048 小游戏</small> | HarmonyOS | Buildable | 14 | stale | - | 49 |
| [awaLiny2333/Snake_NEXT](https://github.com/awaLiny2333/Snake_NEXT)<br><small>The Gluttonous snake Game on HarmonyOS NEXT!</small> | Multi-platform | Buildable | 3 | stale | MIT | 47 |

## Flutter

> Flutter related projects.

共 21 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [JackJiang2011/MobileIMSDK](https://github.com/JackJiang2011/MobileIMSDK)<br><small>原创全平台IM通信层框架，轻量级、高度提炼，历经10年、久经考验。可能是市面上唯一同时支持UDP+TCP+WebSocket三种协议的同类开源框架，支持 iOS、Android、Java、H5、小程序、Uniapp、鸿蒙Next，服务端基于…</small> | HarmonyOS NEXT | Buildable | 6082 | active | Apache-2.0 | 83 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [xuegao-tzx/Fllama](https://github.com/xuegao-tzx/Fllama)<br><small>A flutter binding for llama.cpp, which use platform channel.</small> | Multi-platform | Buildable | 37 | active | MIT | 72 |
| [zhengzaihong/rxnet](https://github.com/zhengzaihong/rxnet)<br><small>RxNet 是一款专为 Flutter 开发的跨平台网络请求工具，贴合原生开发习惯，几乎零学习成本即可上手。它不仅让网络通信更丝滑，还支持丰富的功能组合，助你构建高性能、可维护的移动应用，已经支持Android、ios、windows、li…</small> | HarmonyOS NEXT | Buildable | 44 | active | MIT | 70 |
| [Aloereed/aloeplayer_ohos](https://github.com/Aloereed/aloeplayer_ohos)<br><small>AloePlayer: a cross-platform local media player.</small> | Multi-platform | Buildable | 16 | active | - | 68 |
| [seasonZhu/HarmonyStudy](https://github.com/seasonZhu/HarmonyStudy)<br><small>使用ArkTS与ArkUI编写HarmonyOS Next的wanandroid客户端</small> | Multi-platform | Buildable | 8 | active | - | 66 |
| [galaxywk223/dayorder](https://github.com/galaxywk223/dayorder)<br><small>日序（DayOrder）：面向 Android 与 Windows 的本地优先待办、日历与备忘应用，支持跨端同步和应用内更新。</small> | OpenHarmony | Buildable | 1 | active | GPL-3.0 | 65 |
| [yabi-zzh/simple-live-ohos](https://github.com/yabi-zzh/simple-live-ohos)<br><small>简洁的多平台直播聚合应用 HarmonyOS NEXT 版，支持B站/斗鱼/虎牙/抖音</small> | Multi-platform | Buildable | 43 | moderate | GPL-3.0 | 64 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [CarGuo/GSYGithubAppOH](https://github.com/CarGuo/GSYGithubAppOH)<br><small>鸿蒙 ArkUI 超完整的开源项目，功能丰富，适合学习和日常使用。GSYGithubApp 系列的优势：我们目前已经拥有 Flutter、Weex、ReactNative、Kotlin View、Kotlin Jetpack Compose…</small> | HarmonyOS NEXT | Buildable | 7 | active | MIT | 63 |
| [zhengzaihong/uikit](https://github.com/zhengzaihong/uikit)<br><small>基于 Dart 实现的 UI 组件库，支持 Android、iOS、Web、Windows、macOS、Linux 、 HarmonyOS（SDK ≥ 3.29）等多平台编译，持续维护更新</small> | HarmonyOS | Buildable | 51 | moderate | MIT | 60 |
| [collaborative-creation/etohos](https://github.com/collaborative-creation/etohos)<br><small>EasyTier for 鸿蒙</small> | Multi-platform | Buildable | 31 | moderate | LGPL-3.0 | 60 |
| [itzkowitzhause811-cyber/enterprise-ai-flutter-client](https://github.com/itzkowitzhause811-cyber/enterprise-ai-flutter-client)<br><small>Flutter client for Android, HarmonyOS/OpenHarmony and desktop/web, with SSE AI assistant, offline recovery and service w…</small> | Multi-platform | Buildable | 0 | active | - | 60 |
| [zhengzaihong/router_lifecycle](https://github.com/zhengzaihong/router_lifecycle)<br><small>一个基于 Flutter Router 2.0 的轻量级路由生命周期管理框架。提供统一路由跳转、页面生命周期监听、页面可见性追踪、导航守卫、抽屉路由栈管理，并支持低侵入接入、嵌套路由、多 Navigator 管理及声明式扩展。</small> | HarmonyOS | Buildable | 67 | moderate | MIT | 59 |
| [GuoguoDad/jdMall_Harmony](https://github.com/GuoguoDad/jdMall_Harmony)<br><small>🔥🔥高仿某东商城鸿蒙版 ... 同款Flutter版本（ https://github.com/GuoguoDad/jd_mall_flutter.git ）</small> | Multi-platform | Buildable | 7 | moderate | - | 59 |
| [kongpf8848/cute_contact_picker](https://github.com/kongpf8848/cute_contact_picker)<br><small>Flutter选择联系人插件，小巧精致，简单易用，支持Android、iOS和鸿蒙NEXT系统🚀</small> | Multi-platform | Buildable | 2 | moderate | MIT | 56 |
| [lxdklp/MCB_OHOS](https://github.com/lxdklp/MCB_OHOS)<br><small>Minecraft Box的鸿蒙版仓库</small> | HarmonyOS NEXT | Buildable | 13 | moderate | GPL-3.0 | 55 |
| [WinWang/HarmoneyOpenEye](https://github.com/WinWang/HarmoneyOpenEye)<br><small>华为鸿蒙Harmony开眼App（项目整体基于Api9+ArkTs+ArkUI）适配API 11+DevEco 4.0</small> | HarmonyOS NEXT | Buildable | 621 | stale | - | 53 |
| [hushenghao/ArkTS-RelativeContainerExtend](https://github.com/hushenghao/ArkTS-RelativeContainerExtend)<br><small>HramonyOS ArkTS RelativeContainer dxtend</small> | Multi-platform | Buildable | 4 | stale | MIT | 51 |
| [sskEvan/NCMusicHarmony](https://github.com/sskEvan/NCMusicHarmony)<br><small>鸿蒙Harmony ArkUI实战项目：仿网易云音乐NCMusicHarmony</small> | HarmonyOS NEXT | Buildable | 255 | stale | - | 50 |

## React Native

> React Native related projects.

共 3 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [BlackishGreen33/Expo-Harmony-Toolkit](https://github.com/BlackishGreen33/Expo-Harmony-Toolkit)<br><small>面向 Managed/CNG Expo 项目的 HarmonyOS 迁移、准入检查与 UI-stack 构建工具链</small> | HarmonyOS | Buildable | 18 | active | MIT | 67 |
| [CarGuo/GSYGithubAppOH](https://github.com/CarGuo/GSYGithubAppOH)<br><small>鸿蒙 ArkUI 超完整的开源项目，功能丰富，适合学习和日常使用。GSYGithubApp 系列的优势：我们目前已经拥有 Flutter、Weex、ReactNative、Kotlin View、Kotlin Jetpack Compose…</small> | HarmonyOS NEXT | Buildable | 7 | active | MIT | 63 |
| [xiebyapps/link-my-harmony](https://github.com/xiebyapps/link-my-harmony)<br><small>Unofficial HarmonyOS Next client for Linkwarden (鸿笺 / Folio). ArkTS + ArkUI. Upstream: github.com/linkwarden/linkwarden</small> | Multi-platform | Buildable | 1 | active | NOASSERTION | 63 |

## Cross-platform

> Cross-platform frameworks.

共 26 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [JackJiang2011/MobileIMSDK](https://github.com/JackJiang2011/MobileIMSDK)<br><small>原创全平台IM通信层框架，轻量级、高度提炼，历经10年、久经考验。可能是市面上唯一同时支持UDP+TCP+WebSocket三种协议的同类开源框架，支持 iOS、Android、Java、H5、小程序、Uniapp、鸿蒙Next，服务端基于…</small> | HarmonyOS NEXT | Buildable | 6082 | active | Apache-2.0 | 83 |
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [xuegao-tzx/Fllama](https://github.com/xuegao-tzx/Fllama)<br><small>A flutter binding for llama.cpp, which use platform channel.</small> | Multi-platform | Buildable | 37 | active | MIT | 72 |
| [zhengzaihong/rxnet](https://github.com/zhengzaihong/rxnet)<br><small>RxNet 是一款专为 Flutter 开发的跨平台网络请求工具，贴合原生开发习惯，几乎零学习成本即可上手。它不仅让网络通信更丝滑，还支持丰富的功能组合，助你构建高性能、可维护的移动应用，已经支持Android、ios、windows、li…</small> | HarmonyOS NEXT | Buildable | 44 | active | MIT | 70 |
| [Aloereed/aloeplayer_ohos](https://github.com/Aloereed/aloeplayer_ohos)<br><small>AloePlayer: a cross-platform local media player.</small> | Multi-platform | Buildable | 16 | active | - | 68 |
| [BlackishGreen33/Expo-Harmony-Toolkit](https://github.com/BlackishGreen33/Expo-Harmony-Toolkit)<br><small>面向 Managed/CNG Expo 项目的 HarmonyOS 迁移、准入检查与 UI-stack 构建工具链</small> | HarmonyOS | Buildable | 18 | active | MIT | 67 |
| [seasonZhu/HarmonyStudy](https://github.com/seasonZhu/HarmonyStudy)<br><small>使用ArkTS与ArkUI编写HarmonyOS Next的wanandroid客户端</small> | Multi-platform | Buildable | 8 | active | - | 66 |
| [galaxywk223/dayorder](https://github.com/galaxywk223/dayorder)<br><small>日序（DayOrder）：面向 Android 与 Windows 的本地优先待办、日历与备忘应用，支持跨端同步和应用内更新。</small> | OpenHarmony | Buildable | 1 | active | GPL-3.0 | 65 |
| [alibaba/GaiaX](https://github.com/alibaba/GaiaX)<br><small>动态模板引擎是一套轻量化、跨平台、高性能的纯原生移动端卡片渲染动态化解决方案</small> | HarmonyOS | Buildable | 1288 | moderate | Apache-2.0 | 64 |
| [yabi-zzh/simple-live-ohos](https://github.com/yabi-zzh/simple-live-ohos)<br><small>简洁的多平台直播聚合应用 HarmonyOS NEXT 版，支持B站/斗鱼/虎牙/抖音</small> | Multi-platform | Buildable | 43 | moderate | GPL-3.0 | 64 |
| [CodeFuckee/shipyard](https://github.com/CodeFuckee/shipyard)<br><small>Shipyard 🚢 — Cross-platform Docker container management platform. Python FastAPI backend + Flutter frontend for Android…</small> | OpenHarmony | Buildable | 1 | active | MIT | 64 |
| [CarGuo/GSYGithubAppOH](https://github.com/CarGuo/GSYGithubAppOH)<br><small>鸿蒙 ArkUI 超完整的开源项目，功能丰富，适合学习和日常使用。GSYGithubApp 系列的优势：我们目前已经拥有 Flutter、Weex、ReactNative、Kotlin View、Kotlin Jetpack Compose…</small> | HarmonyOS NEXT | Buildable | 7 | active | MIT | 63 |
| [xiebyapps/link-my-harmony](https://github.com/xiebyapps/link-my-harmony)<br><small>Unofficial HarmonyOS Next client for Linkwarden (鸿笺 / Folio). ArkTS + ArkUI. Upstream: github.com/linkwarden/linkwarden</small> | Multi-platform | Buildable | 1 | active | NOASSERTION | 63 |
| [zhengzaihong/uikit](https://github.com/zhengzaihong/uikit)<br><small>基于 Dart 实现的 UI 组件库，支持 Android、iOS、Web、Windows、macOS、Linux 、 HarmonyOS（SDK ≥ 3.29）等多平台编译，持续维护更新</small> | HarmonyOS | Buildable | 51 | moderate | MIT | 60 |
| [collaborative-creation/etohos](https://github.com/collaborative-creation/etohos)<br><small>EasyTier for 鸿蒙</small> | Multi-platform | Buildable | 31 | moderate | LGPL-3.0 | 60 |
| [itzkowitzhause811-cyber/enterprise-ai-flutter-client](https://github.com/itzkowitzhause811-cyber/enterprise-ai-flutter-client)<br><small>Flutter client for Android, HarmonyOS/OpenHarmony and desktop/web, with SSE AI assistant, offline recovery and service w…</small> | Multi-platform | Buildable | 0 | active | - | 60 |
| [zhengzaihong/router_lifecycle](https://github.com/zhengzaihong/router_lifecycle)<br><small>一个基于 Flutter Router 2.0 的轻量级路由生命周期管理框架。提供统一路由跳转、页面生命周期监听、页面可见性追踪、导航守卫、抽屉路由栈管理，并支持低侵入接入、嵌套路由、多 Navigator 管理及声明式扩展。</small> | HarmonyOS | Buildable | 67 | moderate | MIT | 59 |
| [GuoguoDad/jdMall_Harmony](https://github.com/GuoguoDad/jdMall_Harmony)<br><small>🔥🔥高仿某东商城鸿蒙版 ... 同款Flutter版本（ https://github.com/GuoguoDad/jd_mall_flutter.git ）</small> | Multi-platform | Buildable | 7 | moderate | - | 59 |

## Developer Tools

> Developer tooling / CLI.

共 101 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [ohosvscode/arkTS](https://github.com/ohosvscode/arkTS)<br><small>🧩 VSCode鸿蒙ArkTS插件 ✨✍️ 支持各种补全/跳转 ⛺️ 支持codelinter检测代码错误 🎵 VSCode HarmonyOS ArkTS plugin for personal use ✨✍️ supports so…</small> | Multi-platform | Binary | 861 | active | MIT | 93 |
| [JackJiang2011/MobileIMSDK](https://github.com/JackJiang2011/MobileIMSDK)<br><small>原创全平台IM通信层框架，轻量级、高度提炼，历经10年、久经考验。可能是市面上唯一同时支持UDP+TCP+WebSocket三种协议的同类开源框架，支持 iOS、Android、Java、H5、小程序、Uniapp、鸿蒙Next，服务端基于…</small> | HarmonyOS NEXT | Buildable | 6082 | active | Apache-2.0 | 83 |
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [ecnusse/Kea](https://github.com/ecnusse/Kea)<br><small>Property-based Testing for Mobile GUI Apps</small> | HarmonyOS | Binary | 75 | active | MIT | 77 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [openharmony/arkui_ace_engine](https://github.com/openharmony/arkui_ace_engine)<br><small>The OpenHarmony JS UI framework provides basic\| container\| and canvas UI components and standard CSS animation capabilit…</small> | OpenHarmony | Buildable | 14 | active | Apache-2.0 | 76 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [AimesSoft/Erika](https://github.com/AimesSoft/Erika)<br><small>Rust media player kernel</small> | Multi-platform | Buildable | 20 | active | MPL-2.0 | 74 |
| [popsiclelmlm/Hey](https://github.com/popsiclelmlm/Hey)<br><small>A native network tunnel and protocol debugging client for HarmonyOS NEXT. Bring your own server.</small> | Multi-platform | Buildable | 11 | active | GPL-3.0 | 74 |
| [haohaoai0/UniClipboardHarmonyOS](https://github.com/haohaoai0/UniClipboardHarmonyOS)<br><small>Community HarmonyOS client for UniClipboard, built with ArkTS, ArkUI, Rust and encrypted P2P sync.</small> | Multi-platform | Buildable | 5 | active | AGPL-3.0 | 72 |
| [linhay/harmony-next.skills](https://github.com/linhay/harmony-next.skills)<br><small>🚀 Expert guidance for HarmonyOS NEXT (API 12+) development. Covers IDE operations, performance tuning, architecture (HA…</small> | Multi-platform | Buildable | 330 | active | - | 71 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [LingXia-Dev/Rong](https://github.com/LingXia-Dev/Rong)<br><small>Rong is a JavaScript runtime for Rust with a unified API over multiple JS engines. It is designed for embedding, Rust-dr…</small> | Multi-platform | Buildable | 3 | active | Apache-2.0 | 71 |
| [huihui200739/YueJiPC](https://github.com/huihui200739/YueJiPC)<br><small>阅迹：HarmonyOS PC 可追溯阅读工作台，连接 PDF 阅读、证据卡与复习整理</small> | HarmonyOS NEXT | Buildable | 1 | active | Apache-2.0 | 71 |
| [rickytan/OhosPatch](https://github.com/rickytan/OhosPatch)<br><small>The missing HarmonyOS Patch Implementation! 鸿蒙 ArkTS 零业务入侵热修复方案：现有代码无需改造，基于 JSVM 动态修复方法与声明式组件 / Zero-intrusion HarmonyOS…</small> | Multi-platform | Buildable | 1 | active | MIT | 71 |
| [XCNXNXNX/lingxi-flow-agent](https://github.com/XCNXNXNX/lingxi-flow-agent)<br><small>灵犀流序（Lingxi Flow）：运行在 HarmonyOS NEXT 上的 AI 智能体（Agent）个人助理。一句话描述需求，AI 自主规划、调用系统工具完成任务。纯 ArkTS 实现，支持 25+ 系统工具（文件/提醒/日历/天气/…</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 71 |

## Tutorial

> Tutorials and guides.

共 6 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [megaacheyounes/harmony-next-mvvm-sample](https://github.com/megaacheyounes/harmony-next-mvvm-sample)<br><small>Building Dynamic UIs with MVVM Architecture in HarmonyOS Next</small> | HarmonyOS NEXT | Buildable | 0 | moderate | - | 57 |
| [SeaEpoch/SepWeather](https://github.com/SeaEpoch/SepWeather)<br><small>基于 HarmonyOS Next 构建（ArkUI & ArkTS）的鸿蒙手机应用 App。</small> | HarmonyOS NEXT | Buildable | 1 | stale | GPL-3.0 | 55 |
| [RicardoWesleyli/ArkUI-Animations](https://github.com/RicardoWesleyli/ArkUI-Animations)<br><small>HarmonyOS NEXT ArkUI Tutorials by LIZHIWEI</small> | HarmonyOS NEXT | Buildable | 4 | stale | MIT | 53 |
| [yymm120/harmony_todo](https://github.com/yymm120/harmony_todo)<br><small>a todo app based on harmony arkui.</small> | HarmonyOS NEXT | Buildable | 1 | stale | MIT | 45 |

## Learning

> Learning resources.

共 11 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [water04not-speak/NatureSound_Music](https://github.com/water04not-speak/NatureSound_Music)<br><small>Open-source HarmonyOS / ArkTS music app reference template with AVPlayer, AVSession, RDB, LRC lyrics, public demo data,…</small> | Multi-platform | Buildable | 1 | active | MIT | 69 |
| [OSSD-Course-SYSU-1/2026Spring-25307013-Lab1](https://github.com/OSSD-Course-SYSU-1/2026Spring-25307013-Lab1)<br><small>HarmonyOS / ArkTS 轻量便签应用，基于 InstantNote 改造，支持搜索、置顶、响应式布局和局域网投送流程验证。</small> | Multi-platform | Buildable | 0 | active | - | 64 |
| [Aiyc-02/YOLO-HarmonyOS-Vision](https://github.com/Aiyc-02/YOLO-HarmonyOS-Vision)<br><small>基于 ArkTS 与 MindSpore Lite 的鸿蒙端侧 YOLO 目标检测引擎</small> | HarmonyOS NEXT | Buildable | 0 | active | - | 61 |
| [lorien123/harmonyos-class-schedule](https://github.com/lorien123/harmonyos-class-schedule)<br><small>A Schedule Sharing App Built with HarmonyOS NEXT + Spring Boot</small> | HarmonyOS NEXT | Buildable | 1 | active | - | 59 |
| [megaacheyounes/harmony-next-mvvm-sample](https://github.com/megaacheyounes/harmony-next-mvvm-sample)<br><small>Building Dynamic UIs with MVVM Architecture in HarmonyOS Next</small> | HarmonyOS NEXT | Buildable | 0 | moderate | - | 57 |
| [SeaEpoch/SepWeather](https://github.com/SeaEpoch/SepWeather)<br><small>基于 HarmonyOS Next 构建（ArkUI & ArkTS）的鸿蒙手机应用 App。</small> | HarmonyOS NEXT | Buildable | 1 | stale | GPL-3.0 | 55 |
| [RicardoWesleyli/ArkUI-Animations](https://github.com/RicardoWesleyli/ArkUI-Animations)<br><small>HarmonyOS NEXT ArkUI Tutorials by LIZHIWEI</small> | HarmonyOS NEXT | Buildable | 4 | stale | MIT | 53 |
| [yymm120/harmony_todo](https://github.com/yymm120/harmony_todo)<br><small>a todo app based on harmony arkui.</small> | HarmonyOS NEXT | Buildable | 1 | stale | MIT | 45 |

## Security

> Security related projects.

共 33 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [openharmony/codelabs](https://github.com/openharmony/codelabs)<br><small>分享知识与见解，一起探索代码的独特魅力。</small> | Multi-platform | Binary | 7 | active | - | 77 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [popsiclelmlm/Hey](https://github.com/popsiclelmlm/Hey)<br><small>A native network tunnel and protocol debugging client for HarmonyOS NEXT. Bring your own server.</small> | Multi-platform | Buildable | 11 | active | GPL-3.0 | 74 |
| [haohaoai0/UniClipboardHarmonyOS](https://github.com/haohaoai0/UniClipboardHarmonyOS)<br><small>Community HarmonyOS client for UniClipboard, built with ArkTS, ArkUI, Rust and encrypted P2P sync.</small> | Multi-platform | Buildable | 5 | active | AGPL-3.0 | 72 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [DawningW/CoralReefPlayer](https://github.com/DawningW/CoralReefPlayer)<br><small>珊瑚礁播放器，一款现代化跨平台流媒体播放器库，支持 RTSP、RTP 和 MJPEG over HTTP 流，提供可定制、高性能、低延迟的推拉流、编解码及录像能力</small> | Multi-platform | Buildable | 47 | active | MIT | 70 |
| [yongoe1024/RdbPlus](https://github.com/yongoe1024/RdbPlus)<br><small>哈啰出行SQLite的ORM框架，无需编写sql代码，通过装饰器解析表结构，一行搞定增删改查</small> | Multi-platform | Buildable | 18 | active | MIT | 70 |
| [daugf2527/harmonyos-libretro-emulator](https://github.com/daugf2527/harmonyos-libretro-emulator)<br><small>HarmonyOS Libretro emulator frontend with ArkTS + C++ + XComponent (GLES/Vulkan), multi-core ROM loading, audio bridge,…</small> | Multi-platform | Buildable | 7 | active | NOASSERTION | 70 |
| [dososo/HarmonyOS-HCheck](https://github.com/dososo/HarmonyOS-HCheck)<br><small>鸿鉴 HCheck：HarmonyOS 应用本地优先、证据驱动的发布前审查 CLI. Local-first, evidence-driven pre-release inspection for HarmonyOS apps.</small> | Multi-platform | Buildable | 3 | active | MIT | 70 |
| [CCDawn/harmony-pc-touchpad](https://github.com/CCDawn/harmony-pc-touchpad)<br><small>Turn a HarmonyOS phone into an Apple-style touchpad for Windows PCs.</small> | HarmonyOS NEXT | Buildable | 1 | active | MIT | 70 |
| [wandcs/leantty](https://github.com/wandcs/leantty)<br><small>Keyboard-first SSH terminal for ARM64 HarmonyOS PC</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 70 |
| [water04not-speak/NatureSound_Music](https://github.com/water04not-speak/NatureSound_Music)<br><small>Open-source HarmonyOS / ArkTS music app reference template with AVPlayer, AVSession, RDB, LRC lyrics, public demo data,…</small> | Multi-platform | Buildable | 1 | active | MIT | 69 |
| [openharmony/communication_wifi](https://github.com/openharmony/communication_wifi)<br><small>Wi-Fi station/P2P/AP management\| including enabling\| disabling\| scanning\| connecting\| and information obtaining operatio…</small> | OpenHarmony | Buildable | 5 | active | Apache-2.0 | 68 |
| [willvar/webox](https://github.com/willvar/webox)<br><small>Native WebView app template for Android, iOS, and HarmonyOS NEXT.</small> | HarmonyOS NEXT | Buildable | 4 | active | MIT | 68 |
| [openharmony/arkui_arkui_cangjie_wrapper](https://github.com/openharmony/arkui_arkui_cangjie_wrapper)<br><small>The OpenHarmony Cangjie UI framework based on ArkUI framework.</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 68 |
| [wbbb0/wPlayer](https://github.com/wbbb0/wPlayer)<br><small>A clean, offline local music player for HarmonyOS, built with ArkTS and ArkUI.</small> | HarmonyOS NEXT | Buildable | 1 | active | GPL-3.0 | 68 |
| [halaprix/leakwatch](https://github.com/halaprix/leakwatch)<br><small>Battery-frugal monitor for Huawei watches and HMS phones. Hard-mode sampling, <0.5%/24h drain.</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [openharmony/xts_tools](https://github.com/openharmony/xts_tools)<br><small>Development framework of the acts \| acts测试套开发框架</small> | Multi-platform | Buildable | 0 | active | Apache-2.0 | 67 |
| [bytedance/rdbStore](https://github.com/bytedance/rdbStore)<br><small>字节跳动鸿蒙生态数据库组件，支撑字节系鸿蒙应用数据库相关能力。</small> | Multi-platform | Buildable | 74 | moderate | Apache-2.0 | 66 |

## System

> System level / ROM / tooling.

共 94 个（展示 Top 20）：

| 项目 | 平台 | HAP | Stars | 活跃度 | License | Score |
|---|---|---|---:|---|---|---:|
| [JackJiang2011/MobileIMSDK](https://github.com/JackJiang2011/MobileIMSDK)<br><small>原创全平台IM通信层框架，轻量级、高度提炼，历经10年、久经考验。可能是市面上唯一同时支持UDP+TCP+WebSocket三种协议的同类开源框架，支持 iOS、Android、Java、H5、小程序、Uniapp、鸿蒙Next，服务端基于…</small> | HarmonyOS NEXT | Buildable | 6082 | active | Apache-2.0 | 83 |
| [Tencent-TDS/KuiklyUI](https://github.com/Tencent-TDS/KuiklyUI)<br><small>A Kotlin Multiplatform UI framework from Tencent TDS — high-performance, one codebase for six platforms, with dynamic de…</small> | Multi-platform | Buildable | 3399 | active | NOASSERTION | 81 |
| [SKL-666666/mnn-local-ai-chat](https://github.com/SKL-666666/mnn-local-ai-chat)<br><small>HarmonyOS 本地 AI 对话应用：MNN + llama.cpp 双引擎，完全离线运行大模型推理 / On-device LLM chat app for HarmonyOS with dual MNN & llama.cpp en…</small> | Multi-platform | Binary | 2 | active | Apache-2.0 | 81 |
| [waylau/harmonyos-tutorial](https://github.com/waylau/harmonyos-tutorial)<br><small>HarmonyOS Tutorial. 《跟老卫学HarmonyOS开发》</small> | Multi-platform | Binary | 1741 | moderate | - | 80 |
| [lkimuk/ReArk](https://github.com/lkimuk/ReArk)<br><small>鸿蒙 HarmonyOS NEXT APP/HAP/ABC 专业逆向工具，支持反汇编、反编译、交叉引用、Agent智能分析、签名识别、包体浏览、实时投屏、设备操纵、HAP安装等功能。</small> | HarmonyOS NEXT | Binary | 71 | active | Apache-2.0 | 79 |
| [AGenUI/AGenUI](https://github.com/AGenUI/AGenUI)<br><small>Native A2UI Renderer for iOS/Android/HarmonyOS. High performance streaming Generative UI. Custom Components, Styles and…</small> | Multi-platform | Buildable | 1100 | active | Apache-2.0 | 78 |
| [ecnusse/Kea](https://github.com/ecnusse/Kea)<br><small>Property-based Testing for Mobile GUI Apps</small> | HarmonyOS | Binary | 75 | active | MIT | 77 |
| [openharmony/global_resmgr_standard](https://github.com/openharmony/global_resmgr_standard) | OpenHarmony | Binary | 0 | active | Apache-2.0 | 76 |
| [fenwii/OpenHarmony](https://github.com/fenwii/OpenHarmony)<br><small>华为鸿蒙分布式操作系统（Huawei HarmonyOS，纯血鸿蒙Harmony Next ），开源鸿蒙分布式操作系统（ OpenHarmony）开发技术交流，最全鸿蒙技术资料库，手册，指南，共建国产操作系统万物互联新生态。</small> | Multi-platform | Binary | 1374 | stale | MIT | 74 |
| [OpenBMB/MiniCPM-V-Apps](https://github.com/OpenBMB/MiniCPM-V-Apps)<br><small>MiniCPM-V apps — fully offline multimodal chat on iOS / Android / HarmonyOS</small> | HarmonyOS NEXT | Buildable | 368 | active | - | 74 |
| [popsiclelmlm/Hey](https://github.com/popsiclelmlm/Hey)<br><small>A native network tunnel and protocol debugging client for HarmonyOS NEXT. Bring your own server.</small> | Multi-platform | Buildable | 11 | active | GPL-3.0 | 74 |
| [wgli-collab/qs-arkts](https://github.com/wgli-collab/qs-arkts)<br><small>qs v6.15.2 ported to HarmonyOS ArkTS — querystring parser and stringifier with prototype pollution protection</small> | Multi-platform | Buildable | 45 | active | BSD-3-Clause | 73 |
| [WisdomGardenInc/Cloak](https://github.com/WisdomGardenInc/Cloak)<br><small>Cloak - A Hybrid Development Framework for HarmonyOS</small> | Multi-platform | Buildable | 13 | active | NOASSERTION | 73 |
| [harmony-contrib/openharmony-ability](https://github.com/harmony-contrib/openharmony-ability)<br><small>Building application for OpenHarmony with Rust</small> | Multi-platform | Buildable | 11 | active | NOASSERTION | 73 |
| [wgli-collab/arkts-lodash](https://github.com/wgli-collab/arkts-lodash)<br><small>lodash v4.17.21 ported to HarmonyOS ArkTS — 230+ utility functions with strict-mode type safety</small> | Multi-platform | Buildable | 30 | active | MIT | 72 |
| [StarHeartY/CalculatorX](https://github.com/StarHeartY/CalculatorX)<br><small>HarmonyOS端的专业科学符号计算器</small> | HarmonyOS NEXT | Buildable | 5 | active | GPL-3.0 | 72 |
| [awemorris/suika3](https://github.com/awemorris/suika3)<br><small>Visual novel engine written in C. Scripts run in a JIT virtual machine. Windows, Mac, Linux, iPhone, Android, HarmonyOS,…</small> | Multi-platform | Buildable | 46 | active | Zlib | 71 |
| [LingXia-Dev/Rong](https://github.com/LingXia-Dev/Rong)<br><small>Rong is a JavaScript runtime for Rust with a unified API over multiple JS engines. It is designed for embedding, Rust-dr…</small> | Multi-platform | Buildable | 3 | active | Apache-2.0 | 71 |
| [rickytan/OhosPatch](https://github.com/rickytan/OhosPatch)<br><small>The missing HarmonyOS Patch Implementation! 鸿蒙 ArkTS 零业务入侵热修复方案：现有代码无需改造，基于 JSVM 动态修复方法与声明式组件 / Zero-intrusion HarmonyOS…</small> | Multi-platform | Buildable | 1 | active | MIT | 71 |
| [Torry2022/turbo-ai-chat-harmonyos](https://github.com/Torry2022/turbo-ai-chat-harmonyos)<br><small>Multi-model native LLM chat for HarmonyOS NEXT with MNN Runtime</small> | Multi-platform | Buildable | 1 | active | Apache-2.0 | 71 |

## 数据更新时间

- 生成时间（UTC）：2026-08-19T08:59:39.218Z
- 数据来源：GitHub（唯一外部事实来源）

## AI 使用说明

本仓库的数据可被 AI 直接读取，且保持稳定、结构化、可解析：

- `data/repositories.json` — 完整结构化数据（含 HAP / 平台 / 分类 / 评分 / 证据）
- `generated/ai-context.md` — 面向 AI 的项目上下文与规则
- `generated/llms.txt` — 简洁索引
- `generated/llms-full.txt` — 完整 AI 检索上下文
- `generated/ai-system-prompt.md` — 供 AI 使用的系统提示词

> 所有 AI 摘要均基于 GitHub 原始事实生成，GitHub 原始字段不会被 AI 结果覆盖。

## 本地运行

```bash
npm install
npm run all -- --sample   # 使用内置样例数据离线试运行
npm run all               # 使用 GITHUB_TOKEN 执行完整流程
```
