import { describe, expect, it } from 'vitest'

import { resolveAssetUrl } from '@/utils/icon'

describe('resolveAssetUrl', () => {
  it('空值返回空串', () => {
    expect(resolveAssetUrl()).toBe('')
    expect(resolveAssetUrl('')).toBe('')
    expect(resolveAssetUrl('   ')).toBe('')
  })

  it('完整 URL 直接使用', () => {
    expect(resolveAssetUrl('https://example.com/a.svg')).toBe(
      'https://example.com/a.svg',
    )
    expect(resolveAssetUrl('http://example.com/a.png')).toBe(
      'http://example.com/a.png',
    )
  })

  it('相对路径拼接 BASE_URL（vitest 环境为 /）', () => {
    expect(resolveAssetUrl('engines/bing.svg')).toBe('/engines/bing.svg')
  })

  it('相对路径开头的 / 会被去除，避免双斜杠', () => {
    expect(resolveAssetUrl('/engines/bing.svg')).toBe('/engines/bing.svg')
  })
})
