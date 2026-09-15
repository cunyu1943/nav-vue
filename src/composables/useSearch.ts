import { computed, type Ref } from 'vue'

import type { SiteCategory } from '@/types'

/**
 * 站内搜索：按关键词过滤分类下的站点
 *
 * 匹配字段：名称、描述、URL、标签（全部大小写不敏感）
 * 无匹配站点的分类会被隐藏
 */
export function useSearch(
  categories: Ref<SiteCategory[]>,
  keyword: Ref<string>,
) {
  /** 过滤后的分类列表 */
  const filteredCategories = computed<SiteCategory[]>(() => {
    const kw = keyword.value.trim().toLowerCase()
    if (!kw) return categories.value

    return categories.value
      .map((category) => ({
        ...category,
        sites: category.sites.filter((site) =>
          [site.name, site.description, site.url, ...(site.tags ?? [])]
            .join('\n')
            .toLowerCase()
            .includes(kw),
        ),
      }))
      .filter((category) => category.sites.length > 0)
  })

  /** 命中的站点总数 */
  const matchedCount = computed(() =>
    filteredCategories.value.reduce((sum, c) => sum + c.sites.length, 0),
  )

  /** 是否处于搜索状态 */
  const isSearching = computed(() => keyword.value.trim().length > 0)

  return { filteredCategories, matchedCount, isSearching }
}
