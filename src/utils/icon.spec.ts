import { describe, expect, it } from 'vitest'

import { isIconifyName, isImageIcon, resolveAssetUrl } from '@/utils/icon'

describe('resolveAssetUrl', () => {
  it('空值返回空串', () => {
    expect(resolveAssetUrl()).toBe('')
    expect(resolveAssetUrl('')).toBe('')
    expect(resolveAssetUrl('   ')).toBe('')
  })

  it('完整 URL 与协议相对地址直接使用', () => {
    expect(resolveAssetUrl('https://example.com/a.svg')).toBe(
      'https://example.com/a.svg',
    )
    expect(resolveAssetUrl('http://example.com/a.png')).toBe(
      'http://example.com/a.png',
    )
    expect(resolveAssetUrl('//at.alicdn.com/t/c/font_123.css')).toBe(
      '//at.alicdn.com/t/c/font_123.css',
    )
  })

  it('相对路径拼接 BASE_URL（vitest 环境为 /）', () => {
    expect(resolveAssetUrl('engines/bing.svg')).toBe('/engines/bing.svg')
  })

  it('相对路径开头的 / 会被去除，避免双斜杠', () => {
    expect(resolveAssetUrl('/engines/bing.svg')).toBe('/engines/bing.svg')
  })
})

describe('isImageIcon', () => {
  it('URL 与图片扩展名返回 true', () => {
    expect(isImageIcon('https://example.com/a.svg')).toBe(true)
    expect(isImageIcon('//cdn.example.com/a.png')).toBe(true)
    expect(isImageIcon('logos/vue.svg')).toBe(true)
    expect(isImageIcon('/logos/github.webp')).toBe(true)
  })

  it('图标类名与空值返回 false', () => {
    expect(isImageIcon()).toBe(false)
    expect(isImageIcon('')).toBe(false)
    expect(isImageIcon('i-lucide-github')).toBe(false)
    expect(isImageIcon('iconfont icon-github')).toBe(false)
  })
})

describe('isIconifyName', () => {
  it('Iconify 图标名返回 true', () => {
    expect(isIconifyName('i-lucide-github')).toBe(true)
    expect(isIconifyName('i-lucide:github')).toBe(true)
    expect(isIconifyName('  i-simple-icons-github  ')).toBe(true)
  })

  it('iconfont 类名与空值返回 false', () => {
    expect(isIconifyName()).toBe(false)
    expect(isIconifyName('')).toBe(false)
    expect(isIconifyName('   ')).toBe(false)
    expect(isIconifyName('iconfont icon-github')).toBe(false)
    expect(isIconifyName('icon-home')).toBe(false)
    expect(isIconifyName('logos/github.svg')).toBe(false)
    expect(isIconifyName('https://example.com/a.png')).toBe(false)
  })

  it('缺少图标名的残缺写法返回 false', () => {
    expect(isIconifyName('i-lucide-')).toBe(false)
    expect(isIconifyName('lucide-github')).toBe(false)
  })
})
