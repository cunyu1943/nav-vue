# Vue Nav

简洁高效的个人网址导航站，基于 **Vue 3 + Vite + TypeScript** 构建，UI 风格参考 [一为导航](https://nav.iowen.cn/)。

支持**站内搜索**、**多搜索引擎切换**，数据完全由 JSON 配置驱动，可一键部署到 **GitHub Pages**。

## ✨ 特性

- 📌 **固定顶栏**：品牌导航栏始终固定在顶部（毛玻璃效果），滚动不消失；滚动离开搜索区后**顶栏自动淡入紧凑搜索框**，随时发起搜索
- 🌓 **明暗主题**：顶栏一键切换黑暗/明亮模式，记忆用户选择，默认跟随系统偏好，刷新无闪烁
- 🗂️ **分类导航**：侧边栏锚点导航（移动端自动切换为横向滑动分类条），分类标题滚动吸顶
- 📐 **规整网格**：每行固定 5 个卡片（小屏按断点降级 4/3/2/1 列）
- 📶 **自动折叠**：每个分类超过 3 行默认折叠，底部一键展开/收起；搜索过滤时自动全部展开
- 🔍 **站内搜索**：输入即过滤，匹配名称 / 描述 / URL / 标签，命中关键词高亮
- 🌐 **多引擎切换**：搜索框上方一排带图标的引擎 Tab，支持站内、必应、百度、Google、DuckDuckGo、GitHub，选择自动记忆
- 🖼️ **灵活 Logo**：支持本地目录、在线 URL、自动 favicon 服务三级来源，加载失败自动降级为首字母头像
- 📦 **纯静态**：构建产物为纯静态文件，无需后端；数据修改后无需改代码
- 🚀 **自动部署**：内置 GitHub Actions 流水线，推送即自动测试 + 构建 + 发布
- ✅ **质量保障**：vitest 单元测试覆盖搜索、引擎与主题核心逻辑

## 🛠️ 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建 | Vite 7 |
| UI / 样式 | **Nuxt UI 4**（组件 + 语义色体系）+ Tailwind CSS 4 |
| 语言 | TypeScript（strict 模式） |
| 测试 | Vitest + happy-dom |
| 包管理 | pnpm 11.22（`packageManager` 字段锁定） |
| 部署 | GitHub Pages + GitHub Actions |

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20（推荐 22+）
- pnpm ≥ 10（本仓库锁定 `pnpm@12.4.1`，Corepack 用户会自动对齐版本）

### 安装与启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认 http://localhost:5173）
pnpm dev

# 运行单元测试
pnpm test

# 类型检查
pnpm typecheck

# 生产构建（输出到 dist/）
pnpm build

# 本地预览构建产物
pnpm preview
```

## ⚙️ 配置指南

所有展示内容均由 `src/data/` 下的三个 JSON 文件驱动，改完保存即可热更新。

### 1. 网站数据 — `src/data/sites.json`

```jsonc
{
  "categories": [
    {
      "id": "recommend",        // 分类唯一 id，用作页内锚点（#recommend）
      "name": "常用推荐",        // 分类展示名
      "icon": "star",           // 图标名（可选）：star/tool/book/palette/news/cloud/code
      "sites": [
        {
          "name": "Vue.js 官方文档",          // 网站名
          "url": "https://cn.vuejs.org",     // 网站 URL（同时作为去重 key）
          "logo": "logos/vue.svg",           // logo 来源（可选，见下文）
          "description": "Vue 3 官方中文文档", // 网站描述
          "tags": ["前端", "框架"]             // 标签（可选，参与站内搜索）
        }
      ]
    }
  ]
}
```

> 新增分类记得在 `src/components/SideNav.vue` 与 `CategorySection.vue` 顶部的 `ICON_MAP` 中补充图标映射（不补则显示默认 📌）。

### 2. 网站 Logo — 三种配置方式

| 方式 | 写法 | 说明 |
| --- | --- | --- |
| 本地目录 | `"logo": "logos/example.png"` | 图片放入 `public/logos/` 目录，路径相对 `public/` |
| 在线图片 | `"logo": "https://example.com/icon.png"` | 直接使用完整 URL |
| 自动获取 | 省略 `logo` 字段或留空 | 通过在线 favicon 服务按域名自动获取 |

- 图片加载失败时会自动降级为**首字母渐变头像**，保证卡片永远不破图
- favicon 服务地址可在 `src/utils/logo.ts` 顶部的 `FAVICON_SERVICE` 常量中替换
- 推荐图片尺寸：96×96 以上、正方形

### 3. 搜索引擎 — `src/data/search-engines.json`

```jsonc
{
  "engines": [
    {
      "id": "site",                       // 站内搜索，url 留空
      "name": "站内",
      "url": "",
      "icon": "engines/site.svg"          // 图标：相对 public/ 目录（可选）
    },
    {
      "id": "bing",
      "name": "必应",
      "url": "https://www.bing.com/search?q=%s",  // %s 为关键词占位符
      "icon": "engines/bing.svg"
    }
  ]
}
```

- `%s` 会被替换为 URL 编码后的搜索关键词
- `id` 为 `site` 或 `url` 为空的引擎会被识别为站内搜索（输入即实时过滤）
- `icon` 支持相对路径（放入 `public/engines/` 目录）或完整 URL，可省略；加载失败自动隐藏图标只留名称
- 内置图标为统一风格的本地 SVG（`public/engines/`），无外网依赖
- 用户的引擎选择保存在 `localStorage`（key：`vue-nav.engine`），跨会话记忆

### 4. 主题（明暗模式）

- 顶栏右侧 🌙/☀️ 按钮一键切换，选择保存在 `localStorage`（key：`vue-nav.theme`）
- 首次访问自动跟随系统偏好（`prefers-color-scheme`）
- 主题通过 `<html data-theme>` 驱动 CSS 变量；`index.html` 内有防闪烁脚本，刷新不会出现白屏闪变
- 想调整暗色配色，改 `src/styles/main.css` 中 `[data-theme='dark']` 的变量即可

### 5. 站点全局配置 — `src/data/config.json`

```jsonc
{
  "title": "Vue Nav",                 // 站点标题（导航栏 + Hero 区）
  "subtitle": "简洁高效的个人网址导航", // 副标题
  "logo": "favicon.svg",              // 站点 logo，相对 public/ 目录
  "icp": "",                          // 备案号（可选，留空不显示）
  "footer": "Powered by Vue 3 · Vite · GitHub Pages", // 页脚文字
  "defaultSearchEngine": "bing"       // 默认搜索引擎 id
}
```

## 📦 部署到 GitHub Pages

### 方式一：GitHub Actions 自动部署到 gh-pages 分支（推荐）

仓库已内置流水线（`.github/workflows/deploy.yml`），推送 `main` 分支即自动执行：**安装 → 单元测试 → 构建 → 推送 dist 到 gh-pages 分支**。

1. 把仓库推送到 GitHub
2. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **Deploy from a branch**
3. 分支选择 **gh-pages**、目录 **/(root)**，保存
4. 之后每次 push 到 `main`（或在 Actions 页面手动触发 `workflow_dispatch`），流水线都会自动把最新构建推送到 gh-pages 分支并发布

> - 工作流使用 [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) 推送分支，使用内置 `GITHUB_TOKEN`，无需额外配置密钥；`force_orphan: true` 让 gh-pages 只保留最新一次提交
> - pnpm 版本自动读取 `package.json` 的 `packageManager` 字段，无需在 CI 中写死
> - 首次部署时 gh-pages 分支尚不存在，**先跑一次流水线生成该分支**，再去 Settings 选择

### 关于 base 路径

GitHub Pages 项目页的访问地址是 `https://<user>.github.io/<repo>/`，资源需要带仓库名前缀：

- **CI 自动处理**：流水线的构建步骤会设置 `VITE_BASE=/<仓库名>/`（取自 `github.event.repository.name`），**仓库改名后无需改任何配置**
- **本地构建**：默认 base 为 `/vue-nav/`；仓库改名后本地构建用 `VITE_BASE=/<新仓库名>/ pnpm build` 覆盖，或直接修改 `vite.config.ts` 的默认值
- **使用自定义域名 / 用户主页**（`<user>.github.io` 根路径）：本地设 `VITE_BASE=/`，CI 中把 env 改为 `VITE_BASE: /`

### 方式二：本地构建手动部署

```bash
pnpm build
# 将 dist/ 目录内容发布到你托管静态文件的任意位置
```

可以使用 `npx gh-pages`（或任何静态文件发布工具）把 `dist/` 推到 `gh-pages` 分支。

## 🗃️ 目录结构

```
vue-nav/
├── .github/workflows/
│   └── deploy.yml              # GitHub Pages 自动部署流水线（测试→构建→发布）
├── public/
│   ├── engines/                # 搜索引擎图标（统一风格本地 SVG）
│   ├── logos/                  # 本地 logo 目录（放置图片，sites.json 中以 logos/xx.png 引用）
│   ├── favicon.svg
│   └── .nojekyll               # 跳过 GitHub Pages 的 Jekyll 处理
├── src/
│   ├── components/
│   │   ├── HeaderBar.vue       # 顶部品牌栏
│   │   ├── SearchBox.vue       # 搜索框 + 引擎切换 Tab
│   │   ├── SideNav.vue         # 分类导航（桌面侧栏 / 移动端滑动条）
│   │   ├── CategorySection.vue # 分类区块（吸顶标题 + 卡片网格）
│   │   ├── SiteCard.vue        # 网站卡片（logo 降级 + 命中高亮）
│   │   └── BackTop.vue         # 回到顶部按钮
│   ├── composables/
│   │   ├── useSiteData.ts      # sites.json / config.json 数据加载
│   │   ├── useSearch.ts        # 站内搜索过滤逻辑
│   │   ├── useEngines.ts       # 引擎管理（选择持久化 / 跳转 URL 构建）
│   │   └── useTheme.ts         # 明暗主题（持久化 / 系统偏好 / 应用 data-theme）
│   ├── data/
│   │   ├── sites.json          # ★ 网站数据配置
│   │   ├── search-engines.json # ★ 搜索引擎配置
│   │   └── config.json         # ★ 站点全局配置
│   ├── utils/
│   │   ├── logo.ts             # logo 解析与首字母头像降级
│   │   └── highlight.ts        # 关键词高亮切分
│   ├── types/index.ts          # 全部配置结构的 TS 类型定义
│   ├── styles/main.css         # 全局样式与设计变量（CSS 变量）
│   ├── App.vue                 # 页面组装与布局
│   └── main.ts                 # 应用入口
├── index.html
├── vite.config.ts              # base 路径 / 别名 / vitest 配置
├── pnpm-workspace.yaml         # pnpm 设置（依赖构建脚本白名单）
└── package.json
```

## ✅ 增量开发验证流程

本项目按「小步提交、每步验证」的增量流程开发，每个阶段完成都执行了对应验证命令。
后续迭代建议沿用同一流程：**改动 → 相关测试 → 类型检查 → 构建 → 预览抽查**。

| 阶段 | 内容 | 验证方式 |
| --- | --- | --- |
| 一 | 脚手架搭建 | `pnpm build` 通过 + dev server HTTP 200 |
| 二 | JSON 配置结构 + 数据加载层 | 类型检查通过 + bundle 中可检索到 JSON 数据 |
| 三 | 卡片 / 分类 / 布局 UI | `pnpm build` 通过 + bundle 数据核对 |
| 四 | 站内搜索 + 关键词高亮 | `pnpm test`（15 个用例）+ `pnpm build` |
| 五 | 搜索引擎切换 + 持久化 | `pnpm test`（8 个用例）+ `pnpm build` |
| 六 | GitHub Pages 部署配置 | base 路径产物核对（默认 / 覆盖两种场景） |
| 七 | README 文档 | 内容完整性自查 |
| 八 | 固定顶栏 + 明暗主题 | `pnpm test`（7 个主题用例）+ 构建 + 暗色变量产物核对 |
| 九 | 顶栏紧凑搜索框 + 引擎图标 | `pnpm test`（4 个资源解析用例）+ 构建 + 图标产物核对 |
| 十 | 每行 5 卡 + 超 3 行折叠 | `pnpm test`（10 个断点用例）+ 构建 + 网格样式产物核对 |
| 十一 | 迁移 Nuxt UI 4 + 卡片样式重设计 | `pnpm test` 全绿 + vite/vue-tsc 构建通过 + preview 抽查 |

**提交前固定四连**（也是 CI 流水线执行的检查）：

```bash
pnpm test        # 单元测试（44 个用例：搜索过滤 / 高亮切分 / 引擎管理 / URL 构建 / 主题切换 / 资源解析 / 网格断点）
pnpm typecheck   # TypeScript 类型检查
pnpm build       # 生产构建（先 vite build 生成 Nuxt UI 类型声明，再 vue-tsc 类型检查）
pnpm preview     # 本地预览产物抽查
```

> ⚠️ `pnpm build` 必须先跑 `vite build` 再跑 `vue-tsc`：Nuxt UI 的 `components.d.ts` / `auto-imports.d.ts` 类型声明由 Vite 插件在构建时生成，类型检查要在其之后执行（官方要求）。

## ❓ FAQ

**Q：部署后页面白屏或资源 404？**
基本是 base 路径不匹配。检查 `vite.config.ts` 的 `base` 是否等于 `/<你的仓库名>/`，或在 CI 中通过 `VITE_BASE` 环境变量覆盖。

**Q：为什么 `pnpm build` 先跑 vite 再跑类型检查？**
Nuxt UI 通过 Vite 插件生成 `components.d.ts` / `auto-imports.d.ts` 类型声明（已在 `.gitignore` 忽略）。类型检查必须等声明文件生成后执行，否则 `UButton` 等组件会报类型不存在。

**Q：为什么不能 `import { UButton } from '@nuxt/ui'`？**
`@nuxt/ui` 的主入口是 Nuxt module 定义（node 侧），组件由 unplugin 自动导入——模板里直接写 `<UButton>` 即可。手动从主入口导入会把整个 node 侧工具链拉进浏览器 bundle，导致构建失败。

**Q：部分网站 logo 显示不出来？**
favicon 服务偶发抽风时会降级为首字母头像。想彻底解决可在 `public/logos/` 放本地图片并在配置中指定 `logo` 字段。

**Q：如何新增一个分类？**
在 `sites.json` 的 `categories` 数组中追加一项即可，页面与侧边导航自动生成。

**Q：如何添加自己的搜索引擎？**
在 `search-engines.json` 的 `engines` 数组中追加，`url` 中用 `%s` 表示关键词位置。例如知乎搜索：`https://www.zhihu.com/search?type=content&q=%s`。

**Q：站内搜索支持哪些字段？**
名称、描述、URL、标签，全部大小写不敏感。

## 📄 License

MIT
