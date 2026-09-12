# Sylvia Xie — 作品集网站

最后同步：2026-09-12。基于当前本地源码；不代表线上已部署到同一版本。

这是一个 Next.js 16 App Router + React 19 + TypeScript 项目，包含首页和独立设计的项目案例页。首页使用 Tailwind v4；案例页使用各自的 CSS，保留不同的字体、配色和叙事方式。

## 本地运行

安装 Node.js 22.13.0 或更新版本，用 VS Code 打开整个项目文件夹，在终端运行：

```bash
npm install
npm run dev
```

打开终端显示的地址，默认是 `http://localhost:3000`；端口被占用时以实际输出为准。保存源码后页面通常自动更新，按 Ctrl+C 停止服务。

生产构建与本地预览：

```bash
npm run build
npm run start
```

构建使用 `next/font/google`，首次构建可能需要联网下载字体。本项目没有单独的 `npm test` 或 lint 脚本。

## 页面与编号

| 首页顺序 | 项目 | 案例标识 | 当前首页入口 |
|---|---|---|---|
| 01 | HALOGRIP | 001 | `/work/halogrip` |
| 02 | Maritime HMI | 002 | `/work/maritime-hmi` |
| 03 | Truck Sensory Design | 预留 003 | Coming soon，不可点击 |
| 04 | Post Harvest | 004 | `/work/post-harvest` |

首页位于 `/`，项目卡片由 [projects.ts](app/data/projects.ts) 管理。工作区中的 Volvo 新页面和素材仍在开发中，本次文档同步不将其视作已完成、已接入首页或已发布的案例。不要因为第三张卡片尚未开放，就把 Post Harvest 改成 003。

## 修改哪些文件

| 修改内容 | 位置 |
|---|---|
| 首页组成、文案和组件 | [app/page.tsx](app/page.tsx)、`app/components/home/`、`app/data/` |
| 首页样式与共享基础规则 | [app/globals.css](app/globals.css) |
| 全站标题、字体与分享默认值 | [app/layout.tsx](app/layout.tsx) |
| HALOGRIP 页面与样式 | `app/work/halogrip/page.tsx`、`halogrip.css` |
| HALOGRIP 开场与加载逻辑 | `app/work/halogrip/scroll-intro.tsx`、`scroll-intro.css`、`scroll-intro-scene.tsx` |
| HALOGRIP 方向盘交互 | [interaction-deck.tsx](app/work/halogrip/interaction-deck.tsx) |
| Maritime 文案、章节和标注数据 | [content.ts](app/work/maritime-hmi/content.ts) |
| Maritime 页面、样式和原图查看器 | `app/work/maritime-hmi/page.tsx`、`maritime-hmi.css`、`image-viewer.tsx` |
| Post Harvest 文案、证据和章节 | [content.ts](app/work/post-harvest/content.ts) |
| Post Harvest 页面、样式和手册阅读器 | `app/work/post-harvest/page.tsx`、`post-harvest.css`、`handbook-reader.tsx`、`handbook-pages.ts` |

案例样式从各自路由导入，不要放进 `globals.css`。路由导入并不等于选择器自动隔离，仍须保留项目命名空间，检查页面间导航是否串样式。共享 reset 放在 `@layer base` 内。

图片按项目存放在 `public/home/`、`public/media/halogrip图片/`、`public/maritime-hmi/` 和 `public/post-harvest/`。网页路径不包含 `public`。`design-source/` 是原始设计资料，不作为公开静态目录；`public/fonts/` 中的旧字体仍留档，但当前页面字体由 `next/font` 管理。

## 当前设计决定

- HALOGRIP：旧版完整 `HeroFallback` 已移除，不能再作为加载或错误界面恢复。服务端和首次客户端渲染是近白色全屏占位，保留无障碍 H1；3D 加载时保持空白遮罩，就绪后淡出并启动原来的滚动动画。小于 760px、减少动态效果、WebGL 不可用或加载失败时，使用与动画首帧一致的简洁标题版 `StaticIntro`，不是旧图片 Hero。无 JavaScript 时保留白色占位和后续服务端正文。产品信息仍在后续介绍区，旧 Hero 图片仅可继续用于分享元数据。
- Maritime：当前是 01 Overview、02 Operating model、03 Interface system 三个章节。A/B/C 分别表示上方单船屏、左下 Fleet、右下 Docking；细节区使用深色技术网格、大字母和留白分组，不再用绿色横线分隔。上方三船括号已向右对齐标签。项目标识、开场层级、阅读宽度和关闭按钮与整个 portfolio 呼应，Archivo / IBM Plex Mono 和 CSTRIDER 绿色保持独立。
- Maritime 资料边界：原始课程 Scenario 是 Järntorget–Lindholmen，5 分钟和 0.2 海里仅属于该场景；实习界面是 Koön–Marstrand。左下 Fleet 的外部交通管理系统是简化占位示意，不能写成已交付系统；专家 demo 不能扩写成量化验证成果。
- Post Harvest：案例编号 004；内部保留十个内容 section，对外只有五个编号阶段（Discover、Reframe、Develop、Deliver、Reflect），单节标题不再重复编号。手册阅读器默认展示 7 页概览，可展开全部 53 页。手册是完成的主要交付物；只有集热器做了原型，整塔未建成或性能验证。约 100 kg 是十层托盘的估算批次容量，不是测试结果。

## 检查与已知待办

```bash
node --test scripts/halogrip-lifecycle.test.cjs
npx tsc --noEmit --incremental false
npm run build
node --test scripts/maritime-regression.test.cjs
```

Maritime 回归脚本读取 `.next/server/app/work/*.html`，必须在构建后运行；仅测试旧构建不能证明当前源码通过。

2026-09-12 本次文档同步重跑现有两组测试，基于已有 `.next` 产物：共 13 项，11 项通过、2 项失败。HALOGRIP 生命周期 6 项全部通过；Maritime 脚本的旧断言仍要求第四个章节 `prototype-validation`，以及 HALOGRIP 初始 HTML 中的 `CASE STUDY 001`。两者都与当前源码设计不同，测试尚待同步，不能通过恢复已删除的页面内容来“修复”。本次没有重建、修改测试、运行浏览器验收或部署。

真实浏览器仍需检查冷加载无旧 Hero 闪现、模型失败降级、前后导航、窗口缩放、减少动态效果、手机端和查看器键盘/触控行为。生命周期测试不等于这些视觉验收。其他内容待办见源码中的 `TODO(sylvia)` 和 [CLAUDE.md](CLAUDE.md)。

## 文档与发布

- [CLAUDE.md](CLAUDE.md)：当前结构、设计约束、内容待办和维护规则。
- [CHANGELOG.md](CHANGELOG.md)：按时间保留的修改记录；旧实现不能覆盖最新决定。
- [HALOGRIP 调试记录](docs/halogrip-debug.md)：加载状态、稳定性处理和浏览器待验收项。
- [Post Harvest 资料审查](docs/kenya-case-audit.md)、[内容计划](docs/kenya-content-plan.md)：保留原始证据与历史方案，文件开头说明当前实现及被替代的内容。

当前配置的 Vercel 项目名为 `sylviaxie`，分享元数据使用 `https://sylviaxie.vercel.app`。本地保存或构建不等于线上更新；部署前确认 Vercel 项目、GitHub 集成状态和待发布内容。文档更新本身不触发部署。
