import { computed } from 'vue'

import configData from '@/data/config.json'
import sitesData from '@/data/sites.json'
import type { NavConfig, SiteCategory, SiteConfig, SitesData } from '@/types'

/** 站点全局配置（编译时随包加载） */
export const siteConfig = configData as SiteConfig

/** 全部分类与网站数据（编译时随包加载） */
const sites = sitesData as SitesData

/** 顶栏配置默认值：config.json 中未填写的字段回落到这里 */
const DEFAULT_NAV: Required<NavConfig> = {
  sticky: true,
  height: 56,
  iconfontUrl: '',
  showLogo: true,
  showTitle: true,
  showSubtitle: true,
  showSearch: true,
  showThemeToggle: true,
  showSideNav: true,
  github: '',
  links: [],
}

/** 取值：未配置（undefined / null）时回落到默认值 */
function pick<T>(value: T | undefined | null, fallback: T): T {
  return value === undefined || value === null ? fallback : value
}

const rawNav: NavConfig = configData.nav ?? {}

/**
 * 顶栏（导航栏）配置：已合并默认值，可直接在模板中读取
 *
 * 全部字段均来自 config.json 的 nav 段，改配置即改导航栏，无需改组件代码。
 */
export const navConfig: Required<NavConfig> = {
  sticky: pick(rawNav.sticky, DEFAULT_NAV.sticky),
  height:
    typeof rawNav.height === 'number' && rawNav.height > 0
      ? rawNav.height
      : DEFAULT_NAV.height,
  iconfontUrl: rawNav.iconfontUrl?.trim() ?? '',
  showLogo: pick(rawNav.showLogo, DEFAULT_NAV.showLogo),
  showTitle: pick(rawNav.showTitle, DEFAULT_NAV.showTitle),
  showSubtitle: pick(rawNav.showSubtitle, DEFAULT_NAV.showSubtitle),
  showSearch: pick(rawNav.showSearch, DEFAULT_NAV.showSearch),
  showThemeToggle: pick(rawNav.showThemeToggle, DEFAULT_NAV.showThemeToggle),
  showSideNav: pick(rawNav.showSideNav, DEFAULT_NAV.showSideNav),
  github: rawNav.github?.trim() ?? '',
  links: Array.isArray(rawNav.links) ? rawNav.links : [],
}

/**
 * 网站数据加载层
 *
 * 数据来自 src/data/sites.json，由 Vite 在构建时打包。
 * 修改 JSON 后保存即可热更新，无需重启 dev server。
 */
export function useSiteData() {
  /** 全部分类 */
  const categories = computed<SiteCategory[]>(() => sites.categories)

  /** 网站总数 */
  const totalSites = computed(() =>
    categories.value.reduce((sum, c) => sum + c.sites.length, 0),
  )

  return { categories, totalSites }
}
