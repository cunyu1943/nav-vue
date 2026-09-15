// @vitest-environment happy-dom
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Theme } from '@/composables/useTheme'

/**
 * useTheme 依赖浏览器 DOM（document / localStorage / matchMedia），
 * 使用 happy-dom 环境提供真实 DOM，matchMedia 用 stub 控制系统偏好。
 */

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  vi.unstubAllGlobals()
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

/** 控制模拟的系统暗色偏好 */
function stubPrefersDark(prefersDark: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-color-scheme: dark') && prefersDark,
  }))
}

async function load() {
  return await import('@/composables/useTheme')
}

describe('useTheme 初始主题解析', () => {
  it('无任何记录时默认明亮', async () => {
    stubPrefersDark(false)
    const { useTheme } = await load()
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('系统偏好为暗色且无记录时跟随系统', async () => {
    stubPrefersDark(true)
    const { useTheme } = await load()
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('localStorage 已有选择时优先于系统偏好', async () => {
    stubPrefersDark(true)
    localStorage.setItem('vue-nav.theme', 'light')
    const { useTheme } = await load()
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('html 上已有 .dark class 时优先（防闪烁脚本结果）', async () => {
    // 防闪烁脚本判定 dark 后会添加 .dark class；此时即使系统偏好为 light 也以 class 为准
    stubPrefersDark(false)
    document.documentElement.classList.add('dark')
    const { useTheme } = await load()
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('非法存储值被忽略，回退到系统偏好', async () => {
    stubPrefersDark(true)
    localStorage.setItem('vue-nav.theme', 'blue')
    const { useTheme } = await load()
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })
})

describe('useTheme 切换与应用', () => {
  it('toggleTheme 在明暗间切换并同步 html class', async () => {
    stubPrefersDark(false)
    const { useTheme } = await load()
    const { theme, toggleTheme } = useTheme()

    expect(theme.value).toBe('light')
    toggleTheme()
    await nextTick()
    expect(theme.value).toBe<Theme>('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    toggleTheme()
    await nextTick()
    expect(theme.value).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('切换后写入 localStorage 持久化', async () => {
    stubPrefersDark(false)
    const { useTheme } = await load()
    const { toggleTheme } = useTheme()

    toggleTheme()
    await nextTick()
    expect(localStorage.getItem('vue-nav.theme')).toBe('dark')
  })
})
