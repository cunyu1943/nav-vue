import { describe, expect, it } from 'vitest'

import type { NavLink } from '@/types'
import { hasChildren, linkRel, linkTarget } from '@/utils/nav'

/** 构造一个导航链接，只覆盖需要断言的字段 */
function link(partial: Partial<NavLink> = {}): NavLink {
  return { name: '示例', url: 'https://example.com', ...partial }
}

describe('hasChildren', () => {
  it('有子项时为 true', () => {
    expect(hasChildren(link({ children: [link()] }))).toBe(true)
  })

  it('无 children、空数组、undefined 均为 false', () => {
    expect(hasChildren(link())).toBe(false)
    expect(hasChildren(link({ children: [] }))).toBe(false)
    expect(hasChildren(undefined)).toBe(false)
  })
})

describe('linkTarget / linkRel', () => {
  it('默认新标签页打开，并带 noopener noreferrer', () => {
    const l = link()
    expect(linkTarget(l)).toBe('_blank')
    expect(linkRel(l)).toBe('noopener noreferrer')
  })

  it('external 显式为 true 时同样新标签页打开', () => {
    const l = link({ external: true })
    expect(linkTarget(l)).toBe('_blank')
    expect(linkRel(l)).toBe('noopener noreferrer')
  })

  it('external 为 false 时当前页打开，不带 target / rel', () => {
    const l = link({ external: false })
    expect(linkTarget(l)).toBeUndefined()
    expect(linkRel(l)).toBeUndefined()
  })
})
