import { computed } from 'vue'

import configData from '@/data/config.json'
import sitesData from '@/data/sites.json'
import type { SiteCategory, SiteConfig, SitesData } from '@/types'

/** 站点全局配置（编译时随包加载） */
export const siteConfig = configData as SiteConfig

/** 全部分类与网站数据（编译时随包加载） */
const sites = sitesData as SitesData

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
