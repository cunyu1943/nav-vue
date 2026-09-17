import { describe, expect, it } from 'vitest'

import { isIconifyName, isImageIcon, normalizeIcon, resolveAssetUrl } from '@/utils/icon'

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

describe('normalizeIcon', () => {
  it('旧的分类短名映射为等价的 Iconify 名', () => {
    expect(normalizeIcon('star')).toBe('i-lucide-star')
    expect(normalizeIcon('tool')).toBe('i-lucide-tool-case')
    expect(normalizeIcon('book')).toBe('i-lucide-book-open')
    expect(normalizeIcon('palette')).toBe('i-lucide-palette')
    expect(normalizeIcon('news')).toBe('i-lucide-newspaper')
    expect(normalizeIcon('cloud')).toBe('i-lucide-cloud')
    expect(normalizeIcon('code')).toBe('i-lucide-code')
  })

  it('三种标准写法原样返回（Iconify / 字体图标类名 / 图片地址）', () => {
    expect(normalizeIcon('i-lucide-github')).toBe('i-lucide-github')
    expect(normalizeIcon('iconfont icon-github')).toBe('iconfont icon-github')
    expect(normalizeIcon('logos/vue.svg')).toBe('logos/vue.svg')
    expect(normalizeIcon('https://example.com/a.png')).toBe(
      'https://example.com/a.png',
    )
  })

  it('空值返回 undefined（不渲染图标）', () => {
    expect(normalizeIcon()).toBeUndefined()
    expect(normalizeIcon('')).toBeUndefined()
    expect(normalizeIcon('   ')).toBeUndefined()
  })

  it('先去除首尾空格再归一化', () => {
    expect(normalizeIcon('  star  ')).toBe('i-lucide-star')
    expect(normalizeIcon('  i-lucide-star  ')).toBe('i-lucide-star')
  })
})
