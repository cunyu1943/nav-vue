import { describe, expect, it } from 'vitest'

import { splitHighlight } from '@/utils/highlight'

describe('splitHighlight', () => {
  it('空关键词返回单一未命中片段', () => {
    expect(splitHighlight('Vue 官方文档', '')).toEqual([
      { text: 'Vue 官方文档', hit: false },
    ])
    expect(splitHighlight('Vue 官方文档', '   ')).toEqual([
      { text: 'Vue 官方文档', hit: false },
    ])
  })

  it('基本命中切分（英文不区分大小写）', () => {
    expect(splitHighlight('Vue.js Guide', 'js')).toEqual([
      { text: 'Vue.', hit: false },
      { text: 'js', hit: true },
      { text: ' Guide', hit: false },
    ])
  })

  it('开头与结尾命中', () => {
    expect(splitHighlight('GitHub', 'git')).toEqual([
      { text: 'Git', hit: true },
      { text: 'Hub', hit: false },
    ])
    expect(splitHighlight('GitHub', 'hub')).toEqual([
      { text: 'Git', hit: false },
      { text: 'Hub', hit: true },
    ])
  })

  it('多次命中', () => {
    expect(splitHighlight('abcabc', 'abc')).toEqual([
      { text: 'abc', hit: true },
      { text: 'abc', hit: true },
    ])
  })

  it('中文命中', () => {
    expect(splitHighlight('网盘云储分类', '云储')).toEqual([
      { text: '网盘', hit: false },
      { text: '云储', hit: true },
      { text: '分类', hit: false },
    ])
  })

  it('无命中返回原文本', () => {
    expect(splitHighlight('Hello', 'xyz')).toEqual([{ text: 'Hello', hit: false }])
  })

  it('关键词带首尾空格时按 trim 后匹配', () => {
    expect(splitHighlight('Vite', ' it')).toEqual([
      { text: 'V', hit: false },
      { text: 'it', hit: true },
      { text: 'e', hit: false },
    ])
  })
})
