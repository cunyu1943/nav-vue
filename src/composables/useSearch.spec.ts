import { computed } from 'vue'
import { describe, expect, it } from 'vitest'

import type { SiteCategory } from '@/types'
import { useSearch } from '@/composables/useSearch'

const mockCategories: SiteCategory[] = [
  {
    id: 'a',
    name: '分类A',
    sites: [
      { name: 'Vue 文档', url: 'https://vuejs.org', description: 'Vue 官方文档', tags: ['前端'] },
      { name: 'GitHub', url: 'https://github.com', description: '代码托管', tags: ['开源'] },
    ],
  },
  {
    id: 'b',
    name: '分类B',
    sites: [
      { name: 'Vite', url: 'https://vite.dev', description: '构建工具', tags: ['前端'] },
      { name: 'TinyPNG', url: 'https://tinypng.com', description: '图片压缩', tags: ['图片'] },
    ],
  },
]

function setup(keyword: string) {
  return useSearch(
    computed(() => mockCategories),
    computed(() => keyword),
  )
}

describe('useSearch', () => {
  it('空关键词返回全部分类与站点', () => {
    const { filteredCategories, matchedCount, isSearching } = setup('')
    expect(filteredCategories.value).toHaveLength(2)
    expect(matchedCount.value).toBe(4)
    expect(isSearching.value).toBe(false)
  })

  it('按名称匹配（不区分大小写）', () => {
    const { filteredCategories, matchedCount } = setup('vue')
    expect(matchedCount.value).toBe(1)
    expect(filteredCategories.value[0].sites[0].name).toBe('Vue 文档')
  })

  it('关键词大小写不敏感', () => {
    const { matchedCount } = setup('GITHUB')
    expect(matchedCount.value).toBe(1)
  })

  it('按标签匹配', () => {
    const { filteredCategories, matchedCount } = setup('图片')
    expect(matchedCount.value).toBe(1)
    expect(filteredCategories.value[0].id).toBe('b')
    expect(filteredCategories.value[0].sites[0].name).toBe('TinyPNG')
  })

  it('按描述匹配', () => {
    const { matchedCount } = setup('构建工具')
    expect(matchedCount.value).toBe(1)
  })

  it('按 URL 匹配', () => {
    const { matchedCount } = setup('tinypng.com')
    expect(matchedCount.value).toBe(1)
  })

  it('无匹配站点时整个分类被隐藏', () => {
    const { filteredCategories, matchedCount } = setup('不存在的关键词xyz')
    expect(filteredCategories.value).toHaveLength(0)
    expect(matchedCount.value).toBe(0)
  })

  it('分类保留多个命中站点', () => {
    const { matchedCount } = setup('前端')
    // 分类A 的 Vue 文档 + 分类B 的 Vite 都带「前端」标签
    expect(matchedCount.value).toBe(2)
  })
})
