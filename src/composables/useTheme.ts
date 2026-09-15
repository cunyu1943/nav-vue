import { ref, watch, type Ref } from 'vue'

/** 主题类型 */
export type Theme = 'light' | 'dark'

/** 主题选择的 localStorage 持久化 key */
export const THEME_STORAGE_KEY = 'vue-nav.theme'

/** 在 <html> 上应用主题（Nuxt UI 的 dark 变体基于 .dark class） */
function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

/** 读取初始主题：已有 .dark class > 用户存储 > 系统偏好 */
function getInitialTheme(): Theme {
  // 防闪烁脚本已在 index.html 中提前设置 class，优先采用
  if (document.documentElement.classList.contains('dark')) return 'dark'

  let saved: string | null = null
  try {
    saved = globalThis.localStorage?.getItem(THEME_STORAGE_KEY)
  } catch {
    // localStorage 不可用时忽略
  }
  if (saved === 'dark' || saved === 'light') return saved

  // 跟随系统偏好
  try {
    if (globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch {
    // matchMedia 不可用时忽略
  }
  return 'light'
}

/** 模块级惰性单例：多个组件共享同一主题状态 */
let themeRef: Ref<Theme> | null = null

/**
 * 主题管理：明暗切换、持久化、应用到 <html class="dark">
 */
export function useTheme() {
  if (!themeRef) {
    themeRef = ref<Theme>(getInitialTheme())

    // 应用到根元素，驱动 Tailwind / Nuxt UI 的 dark 变体与 --ui-* 变量切换
    watch(
      themeRef,
      (t) => {
        applyTheme(t)
      },
      { immediate: true },
    )

    // 用户显式选择后持久化（下次访问不再跟随系统）
    watch(themeRef, (t) => {
      try {
        globalThis.localStorage?.setItem(THEME_STORAGE_KEY, t)
      } catch {
        // ignore
      }
    })
  }

  /** 当前主题（是否暗色） */
  const isDark = () => themeRef!.value === 'dark'

  /** 明暗切换 */
  function toggleTheme() {
    themeRef!.value = themeRef!.value === 'dark' ? 'light' : 'dark'
  }

  return { theme: themeRef, isDark, toggleTheme }
}
