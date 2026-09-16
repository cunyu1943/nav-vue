/** 顶栏自定义导航链接（对应 config.json 中 nav.links 的每一项） */
export interface NavLink {
  /** 展示名称 */
  name: string
  /** 跳转地址（支持站内锚点如 #top） */
  url: string
  /**
   * 图标（可选），支持三种写法：
   * 1. Iconify 图标名（如 "i-lucide-github"）→ 运行时按名字解析，任意图标集可用
   * 2. 字体图标类名（如 "iconfont icon-github"）→ 作为 class 渲染
   * 3. 图片地址：相对 public/ 的路径（如 "logos/xx.svg"）或完整 URL
   */
  icon?: string
  /** 是否新标签页打开，默认 true；站内锚点等可设为 false */
  external?: boolean
  /**
   * 子菜单（可选）：配置后该链接在顶栏变为下拉菜单，支持多项
   *
   * - 作为父级时 `url` 可留空字符串（点击只负责展开/收起，不跳转）
   * - 子项结构与一级项完全一致（目前只支持二级）
   */
  children?: NavLink[]
}

/**
 * 顶栏（导航栏）自定义配置（对应 config.json 中 nav）
 *
 * 所有字段均可省略，省略时使用内置默认值（见 useSiteData 的 DEFAULT_NAV）。
 */
export interface NavConfig {
  /** 顶栏是否固定在顶部，默认 true；设为 false 则随页面滚动 */
  sticky?: boolean
  /** 顶栏高度（px），默认 56；同时决定内容区让位与锚点滚动留白 */
  height?: number
  /**
   * iconfont 样式表地址（可选）：填写后应用启动时自动注入 <link rel="stylesheet">
   * - CDN 地址：如 "//at.alicdn.com/t/c/font_xxx.css"
   * - 本地文件：放入 public/ 后写相对路径，如 "iconfont/iconfont.css"
   *
   * 注入后即可在 links[].icon 中写 "iconfont icon-xxx" 这类字体图标类名
   */
  iconfontUrl?: string
  /** 是否显示站点 logo，默认 true */
  showLogo?: boolean
  /** 是否显示站点标题，默认 true */
  showTitle?: boolean
  /** 是否显示副标题，默认 true */
  showSubtitle?: boolean
  /** 是否启用顶栏紧凑搜索框（滚动离开 Hero 区后淡入），默认 true */
  showSearch?: boolean
  /** 是否显示明暗主题切换按钮，默认 true */
  showThemeToggle?: boolean
  /** 是否显示分类导航（桌面侧栏 + 移动端横滑分类条），默认 true */
  showSideNav?: boolean
  /** 自定义导航链接，默认空数组；窄屏（<640px）自动隐藏 */
  links?: NavLink[]
}

/** 站点全局配置（对应 src/data/config.json） */
export interface SiteConfig {
  /** 站点标题 */
  title: string
  /** 副标题 / 一句话介绍 */
  subtitle: string
  /** 站点 logo，相对于 public/ 目录的路径 */
  logo: string
  /** 页脚备案号（可选，留空不显示；支持 HTML 片段） */
  icp: string
  /** 页脚文字（支持 HTML 片段，如 <a> 链接） */
  footer: string
  /** 默认搜索引擎 id（对应 search-engines.json 中的 id） */
  defaultSearchEngine: string
  /** 顶栏（导航栏）自定义配置（可选，省略则全部使用默认值） */
  nav?: NavConfig
}

/** 单个网站条目（对应 sites.json 中每个 site） */
export interface SiteItem {
  /** 网站名称 */
  name: string
  /** 网站 URL */
  url: string
  /**
   * logo 来源，支持三种写法（可选）：
   * 1. 留空或不填  → 自动通过在线 favicon 服务获取
   * 2. "logos/xx.png"（相对路径）→ 使用 public/logos/ 下的本地图片
   * 3. "https://..."（完整 URL） → 直接使用在线图片
   */
  logo?: string
  /** 网站描述 */
  description: string
  /** 标签（可用于筛选，可选） */
  tags?: string[]
}

/** 网站分类（对应 sites.json 中每个 category） */
export interface SiteCategory {
  /** 分类唯一 id（用作锚点） */
  id: string
  /** 分类名称 */
  name: string
  /** 分类图标名（可选，暂用 emoji 映射） */
  icon?: string
  /** 该分类下的网站列表 */
  sites: SiteItem[]
}

/** sites.json 顶层结构 */
export interface SitesData {
  categories: SiteCategory[]
}

/** 搜索引擎条目（对应 search-engines.json 中每个 engine） */
export interface SearchEngine {
  /** 引擎唯一 id */
  id: string
  /** 展示名称 */
  name: string
  /**
   * 搜索跳转地址，用 %s 作为关键词占位符；
   * 站内搜索（id 为 "site"）该字段留空
   */
  url: string
  /**
   * 引擎图标（可选）：相对 public/ 的路径（如 "engines/bing.svg"）
   * 或完整 URL；加载失败时自动隐藏、仅显示名称
   */
  icon?: string
}

/** search-engines.json 顶层结构 */
export interface SearchEnginesData {
  engines: SearchEngine[]
}
