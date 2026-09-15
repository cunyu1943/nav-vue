/** 站点全局配置（对应 src/data/config.json） */
export interface SiteConfig {
  /** 站点标题 */
  title: string
  /** 副标题 / 一句话介绍 */
  subtitle: string
  /** 站点 logo，相对于 public/ 目录的路径 */
  logo: string
  /** 页脚备案号（可选，留空不显示） */
  icp: string
  /** 页脚文字 */
  footer: string
  /** 默认搜索引擎 id（对应 search-engines.json 中的 id） */
  defaultSearchEngine: string
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
