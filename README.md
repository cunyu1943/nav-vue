# Nav Vue

简洁高效的个人网址导航站，基于 **Vue 3 + Vite + TypeScript** 构建。

支持**站内搜索**、**多搜索引擎切换**，数据完全由 JSON 配置驱动，可一键部署到 **GitHub Pages**。

## ✨ 特性

- 📌 **固定顶栏**：品牌导航栏始终固定在顶部（毛玻璃效果），滚动不消失；滚动离开搜索区后**顶栏自动淡入紧凑搜索框**（与主页搜索框互斥，不会同时出现），随时发起搜索
- 🌓 **明暗主题**：顶栏一键切换黑暗/明亮模式，记忆用户选择，默认跟随系统偏好，刷新无闪烁
- 🗂️ **分类导航**：侧边栏锚点导航（移动端自动切换为横向滑动分类条），分类标题滚动吸顶
- 📐 **规整网格**：每行固定 5 个卡片（小屏按断点降级 4/3/2/1 列）
- 📱 **全端自适应**：320px 手机到 1920px 桌面均无横向滚动；窄屏按断点收起顶栏品牌名与副标题，优先保证搜索框与卡片的可用宽度
- 📶 **自动折叠**：每个分类超过 3 行默认折叠，底部一键展开/收起；搜索过滤时自动全部展开
- 🔍 **站内搜索**：输入即过滤，匹配名称 / 描述 / URL / 标签，命中关键词高亮；搜索框尾部为 Google 风格的圆形「清除 + 搜索」按钮（有输入才显示清除）
- 🌐 **多引擎切换**：Hero 搜索框与顶栏紧凑搜索框**最左侧**均内置引擎下拉（图标 + 名称），支持站内、必应、百度、Google、DuckDuckGo、GitHub，默认站内搜索，两处选择实时同步且自动记忆
- 🛡️ **跳转确认**：点击网站卡片先弹窗提示「即将前往【网址】，此链接与本网站无关，请自行判断」，点「继续访问」才在新标签页打开，点「取消跳转」/ Esc / 点遮罩即关闭，避免误点离开本站
- 🖼️ **灵活 Logo**：支持本地目录、在线 URL、自动 favicon 服务三级来源，加载失败自动降级为首字母头像
- 📦 **纯静态**：构建产物为纯静态文件，无需后端；数据修改后无需改代码
- 🚀 **自动部署**：内置 GitHub Actions 流水线，推送即自动测试 + 构建 + 发布
- 🪟 **全站毛玻璃**：全局光斑 + 网格底图打底，顶栏 / 搜索框 / 网站卡片 / 侧边导航 / 吸顶标题 / 跳转确认弹窗统一玻璃质感；模糊半径与透明度集中在 `src/styles/main.css` 的 `--glass-*` 变量里调节
- 🎛️ **导航栏可配置**：顶栏显示项（logo / 标题 / 副标题 / 紧凑搜索框 / 主题按钮）、高度、是否固定、自定义链接与**二级下拉菜单**全部由 `config.json` 的 `nav` 段驱动；桌面端菜单紧跟在站点 logo 之后，窄屏自动收进**汉堡菜单**
- 🔠 **悬停小动效**：鼠标移到卡片上时，名称与描述若超出一行被截断即左右往返滚动（未超出不滚动），同时 logo 转动一圈；两处动效均遵循系统「减少动态效果」偏好
- 🎨 **图标三选一**：顶栏导航链接与**分类图标**共用同一种写法 —— Iconify 图标名、iconfont 字体图标（可自托管、离线可用）与图片，换图标只改 JSON
- ✅ **质量保障**：vitest 单元测试覆盖搜索、引擎与主题核心逻辑

## 🛠️ 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | Vue 3（`<script setup>` 组合式 API） |
| 构建 | Vite 7 |
| UI / 样式 | **Nuxt UI 4**（组件 + 语义色体系）+ Tailwind CSS 4 |
| 语言 | TypeScript（strict 模式） |
| 测试 | Vitest + happy-dom |
| 包管理 | pnpm（不锁定版本，≥ 10 即可） |
| 部署 | GitHub Pages + GitHub Actions |

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20（推荐 22+）
- pnpm ≥ 10（不锁定具体版本，本地装 10 / 11 / 12 都能直接使用）

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
      "icon": "i-lucide-star",  // 分类图标（可选，写法见下方说明）
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

> **分类图标写法**（与顶栏导航链接完全一致，可选；不写则不显示图标）：
> 1. **Iconify 图标名**：`"i-lucide-star"`（推荐）。图标名查 [Lucide](https://lucide.dev/icons/)，由 `vite.config.ts` 的 `icon.clientBundle.scan` 从 JSON 中扫描并打包进本地图标数据，**离线可用**
> 2. **iconfont 字体图标**：先在 `nav.iconfontUrl` 配置样式表，再写 `"icon": "iconfont icon-xxx"`
> 3. **图片**：相对 `public/` 的路径（`"logos/vue.svg"`）或完整 URL
>
> 早期版本的短名写法（`star` / `tool` / `book` / `palette` / `news` / `cloud` / `code`，过去渲染为 emoji）仍可用：`src/utils/icon.ts` 里的 `LEGACY_ICON_ALIASES` 会把它们映射为等价的 Iconify 图标。新配置建议直接用第 1 种写法。

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
- 主题通过 `<html class="dark">` 驱动 CSS 变量；`index.html` 内有防闪烁脚本，刷新不会出现白屏闪变
- **主色**：`main.css` 里的 `--ui-primary`（明亮 `#4fc08d` / 暗色 `#5fd3a0`，即 Vue 官方品牌绿）。按钮、链接、导航激活态、卡片悬停描边、输入框聚焦环等语义色全部由它派生，**改这一处即可全站换色**
- **背景光斑**：`--glass-glow-a/b/c` 是与主色同色系的三档（绿 / 青绿 / 薄荷）。换主色时建议一并调整，否则整页色调会不统一
- 想调整暗色配色，改 `src/styles/main.css` 中 `.dark` 内的变量即可

### 5. 站点全局配置 — `src/data/config.json`

```jsonc
{
  "title": "Nav Vue",                 // 站点标题（导航栏 + Hero 区）
  "subtitle": "简洁高效的个人网址导航", // 副标题
  "logo": "favicon.svg",              // 站点 logo，相对 public/ 目录
  "icp": "",                          // 备案号（可选，留空不显示；支持 HTML）
  "footer": "Powered by <a href=\"https://vuejs.org\" target=\"_blank\">Vue 3</a> · Vite · GitHub Pages", // 页脚文字（支持 HTML 片段，可放链接）
  "defaultSearchEngine": "site"       // 默认搜索引擎 id（默认站内搜索）
}
```

### 6. 导航栏（顶栏）自定义 —— `config.json` 的 `nav` 字段

顶栏的展示内容、尺寸与行为都由 `nav` 配置驱动，**改 JSON 即改导航栏，无需改组件代码**；所有字段均可省略，省略即用默认值。

```jsonc
{
  "nav": {
    "sticky": true,           // 顶栏是否固定顶部；false 则随页面滚动
    "height": 56,             // 顶栏高度（px），同步决定内容区让位与锚点滚动留白
    "iconfontUrl": "",        // iconfont 样式表地址（可选）：CDN 或 public/ 相对路径
    "showLogo": true,         // 站点 logo
    "showTitle": true,        // 站点标题
    "showSubtitle": true,     // 副标题（≥1100px 才显示）
    "showSearch": true,       // 滚动后淡入的顶栏紧凑搜索框
    "showThemeToggle": true,  // 明暗主题切换按钮
    "showSideNav": true,      // 分类导航（桌面侧栏 + 移动端横滑分类条）
    "github": "",             // 项目 GitHub 地址（可选）：填写后主题按钮旁出现 GitHub 图标，留空隐藏
    "links": [                // 自定义导航链接（<640px 窄屏自动隐藏）
      {
        "name": "GitHub",                   // 展示名称
        "url": "https://github.com/vuejs",  // 跳转地址
        "icon": "i-lucide-github",          // 图标：Iconify 图标名 / 字体图标类名 / 图片
        "external": true                    // 是否新标签页打开，默认 true
      },
      {
        "name": "常用推荐",                 // 配置了 children 即变为下拉菜单
        "url": "",                          // 父级菜单项 url 留空即可（点击只展开/收起）
        "icon": "i-lucide-star",
        "children": [                       // 子项结构与一级项完全一致（只支持二级）
          {
            "name": "Vue.js 官方文档",
            "url": "https://cn.vuejs.org",
            "icon": "i-lucide-book-open"
          },
          {
            "name": "Vite",
            "url": "https://cn.vite.dev",
            "icon": "i-lucide-zap"
          }
        ]
      }
    ]
  }
}
```

- **图标写法**（三选一）：
  1. **Iconify 图标名**：`"i-lucide-github"`（图标名查 [Lucide](https://lucide.dev/icons/) 等图标集即写即用）。图标由 `vite.config.ts` 中 `icon.clientBundle.scan` 从源码与 JSON 里扫描并打包进本地数据，**离线可用**，不请求在线接口
  2. **iconfont 字体图标**：先在 `iconfontUrl` 填入 iconfont.cn 生成的样式表地址，再写 `"icon": "iconfont icon-github"`。这是最灵活的方式——自建图标全部可用，样式表既能用 CDN（`//at.alicdn.com/t/c/font_xxx.css`），也能把 `iconfont.css` 与字体文件放进 `public/iconfont/` 后写相对路径 `iconfont/iconfont.css`（自托管、无外网依赖）
  3. **图片**：`"logos/vue.svg"`（相对 `public/`）或完整 URL，加载失败自动隐藏、只留文字
- **默认值**：不写 `nav` 段时，上述开关均为 `true`、`height` 为 `56`、`links` 为空数组；默认值集中定义在 `src/composables/useSiteData.ts` 的 `DEFAULT_NAV`
- **二级下拉菜单**：给链接加 `children` 数组即变为下拉菜单（鼠标悬停或点击展开，Esc / 点击面板外收起）；子项超过 6 个时面板自动分列（每列最多 6 项、最多 3 列，纵向填充）
- **窄屏 / 平板菜单**：`<900px` 时自定义导航自动切换为顶栏右侧的**汉堡按钮**，点击展开横跨整屏的玻璃面板，有子菜单的一级项点击展开 / 收起；点链接、点面板外、按 Esc、或视口放大到 900px 以上都会自动收起。`≥900px` 恢复为 logo 旁的横向内联导航（断点即 Tailwind 的 `lg`）
- **菜单位置**：自定义导航紧跟在 logo / 标题之后靠左排列，不会被推到顶栏中间
- **GitHub 入口**：`github` 填地址后，主题切换按钮左侧出现 GitHub 图标（新标签页打开，带 `rel="noopener noreferrer"`）；留空或不写即完全隐藏。图标在 `≥640px` 显示，`<640px` 收进移动端菜单（名称「本仓库」）以免占用搜索框宽度；菜单项无需在 `links` 里重复配置
- **顶栏高度**：`height` 以 `--header-height` 变量下发全站，侧栏粘性偏移、内容区让位、分类锚点滚动留白都会自动跟随；`sticky` 为 `false` 时该变量自动归零
- **毛玻璃强度**：想调节玻璃的通透感，改 `src/styles/main.css` 中 `--glass-blur` / `--glass-saturate` / `--glass-alpha-*` 即可，全站玻璃元素一起生效（弹窗面板用 `--glass-alpha-modal`）；背景光斑与网格由 `--glass-glow-a/b/c`、`--glass-grid` 控制（明暗主题各一套）

## 📦 部署到 GitHub Pages

### 方式一：GitHub Actions 自动部署到 gh-pages 分支（推荐）

仓库已内置流水线（`.github/workflows/deploy.yml`），推送 `main` 分支即自动执行：**安装 → 单元测试 → 构建 → 推送 dist 到 gh-pages 分支**。

1. 把仓库推送到 GitHub
2. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **Deploy from a branch**
3. 分支选择 **gh-pages**、目录 **/(root)**，保存
4. 之后每次 push 到 `main`（或在 Actions 页面手动触发 `workflow_dispatch`），流水线都会自动把最新构建推送到 gh-pages 分支并发布

> - 工作流使用 [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) 推送分支，使用内置 `GITHUB_TOKEN`，无需额外配置密钥；`force_orphan: true` 让 gh-pages 只保留最新一次提交
> - CI 中 pnpm 安装 **latest**（不锁定版本）；若想要完全可复现的构建，可在 workflow 里为 `pnpm/action-setup` 指定具体 `version`
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
│   │   ├── HeaderBar.vue       # 顶部品牌栏（含滚动后出现的紧凑搜索框）
│   │   ├── SearchBox.vue       # Hero 大搜索框
│   │   ├── EngineSelect.vue    # 搜索引擎下拉（两个搜索框共用，默认站内）
│   │   ├── LinkGuardDialog.vue # 外链跳转确认弹窗（全站唯一实例）
│   │   ├── NavMenu.vue         # 顶栏自定义导航（桌面端内联 + 二级下拉菜单）
│   │   ├── MobileNav.vue       # 顶栏自定义导航（窄屏汉堡菜单 + 可展开子项）
│   │   ├── NavIcon.vue         # 图标渲染（Iconify / iconfont / 图片三选一，顶栏与分类共用）
│   │   ├── MarqueeText.vue     # 单行文本悬停往返滚动（卡片名称 / 描述）
│   │   ├── SideNav.vue         # 分类导航（桌面侧栏 / 移动端滑动条）
│   │   ├── CategorySection.vue # 分类区块（吸顶标题 + 卡片网格）
│   │   ├── SiteCard.vue        # 网站卡片（logo 降级 + 命中高亮）
│   │   └── BackTop.vue         # 回到顶部按钮
│   ├── composables/
│   │   ├── useSiteData.ts      # sites.json / config.json 数据加载
│   │   ├── useSearch.ts        # 站内搜索过滤逻辑
│   │   ├── useEngines.ts       # 引擎管理（选择持久化 / 跳转 URL 构建）
│   │   ├── useTheme.ts         # 明暗主题（持久化 / 系统偏好 / 应用 data-theme）
│   │   ├── useColumnCount.ts   # 网格列数响应式计算（每行 5 卡 / 断点降级）
│   │   └── useLinkGuard.ts     # 外链跳转确认（单例状态 + 跳转决策）
│   ├── data/
│   │   ├── sites.json          # ★ 网站数据配置
│   │   ├── search-engines.json # ★ 搜索引擎配置
│   │   └── config.json         # ★ 站点全局配置
│   ├── utils/
│   │   ├── logo.ts             # logo 解析与首字母头像降级
│   │   ├── icon.ts             # 静态资源地址解析（引擎图标等 public/ 资源，适配 BASE_URL）
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
| 十二 | 全站毛玻璃 + 顶栏自定义配置 | `pnpm test`（47 个用例）+ vite/vue-tsc 构建通过 + CSS 产物核对 |
| 十三 | 顶栏导航链接示例 + 卡片文本悬停滚动 | `pnpm test` + vite/vue-tsc 构建通过 + 产物核对 |
| 十四 | 图标改为 UIcon 运行时渲染 + iconfont 支持 | `pnpm test`（49 个用例）+ 构建通过 + 图标数据产物核对 |
| 十五 | 外链跳转确认弹窗 | `pnpm test`（56 个用例）+ 构建通过 + 无头浏览器实测（遮挡 / 取消 / 跳转 / Esc / 点外部） |

**提交前固定四连**（也是 CI 流水线执行的检查）：

```bash
pnpm test        # 单元测试（56 个用例：搜索过滤 / 高亮切分 / 引擎管理 / URL 构建 / 主题切换 / 资源解析 / 图标类名 / 网格断点 / 跳转确认）
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

**Q：为什么图标要用 `<UIcon>`，而不能写 `class="i-lucide-xxx"`？**
`@nuxt/ui` 在 Vue 项目里通过 `@iconify/vue` 在**运行时**解析图标名，不会为 `i-*` 生成 CSS 类，所以 `class="i-lucide-xxx"` 不会显示任何东西。请统一用 `<UIcon name="i-lucide-xxx" />` 或组件的 `icon` 属性；写在 JSON 配置里的图标名由 `vite.config.ts` 的 `icon.clientBundle.scan` 扫描进本地图标数据，因此配置文件里的图标同样生效。若要使用自建图标，用上面的 iconfont 方式最省事。

**Q：`i-lucide-book-open` 是什么意思？为什么在 iconfont 上搜不到？**
它是 [Iconify](https://iconify.design/) 的图标名，格式为 `i-<图标集>-<图标名>`：`i-` 是前缀、`lucide` 是[图标集](https://lucide.dev/icons/)名（内置 1900+ 矢量图标）、`book-open` 是该集合里的图标名。找图标直接去 Lucide 官网搜索，页面上标的 `book-open` 对应配置里写 `i-lucide-book-open`。
Iconify 与 [iconfont](https://www.iconfont.cn/) 是两套彼此独立的体系（前者是聚合 200+ 图标集的 SVG 数据，后者是阿里的字体图标库），名字不通用，所以在 iconfont 上搜不到 Lucide 的名字。本项目用到的图标由 `@iconify-json/lucide` 在本地提供，离线可用。
想改用其它图标集：`pnpm add -D @iconify-json/tabler` 装上集合后即可写 `i-tabler-book`（集合名就是包名去掉 `@iconify-json/` 的部分）；跨集合搜索图标名可用 [Iconify 图标搜索](https://icon-sets.iconify.design/)。

**Q：新增弹窗 / 遮罩类组件时，为什么会被页面内容盖住？**
Nuxt UI 的 modal 主题（`overlay` / `content`）**本身不含 z-index**，而本项目的内容容器 `#top` 设了 `z-index: 1`（用于压住 `z-index: 0` 的毛玻璃底图 `.app-backdrop`）并因此形成层叠上下文。弹窗会 portal 到 `body` 下、`z-index` 为 `auto`，于是整个页面内容都盖在它上面 —— 表现为弹窗"半透明"、按钮点不动。
解法是给弹窗显式抬高层级，`LinkGuardDialog.vue` 里通过 `:ui="{ overlay: 'z-70', content: 'z-70 max-w-md' }"` 指定（高于项目内最高的 `z-60`）。**以后新增任何全屏遮罩 / 弹窗都要做同样处理。**

## 📄 License

本项目基于 [MIT](./LICENSE) 协议开源。
