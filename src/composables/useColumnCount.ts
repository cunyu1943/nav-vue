import { ref, type Ref } from 'vue'

/**
 * 卡片网格列数（与 CategorySection.vue 中的 CSS 断点保持一致）：
 * 窗口 ≥1100px → 5 列；900–1099 → 4 列；640–899 → 3 列；480–639 → 2 列；<480 → 1 列
 */
export function getColumnCount(): number {
  const width = window.innerWidth
  if (width >= 1100) return 5
  if (width >= 900) return 4
  if (width >= 640) return 3
  if (width >= 480) return 2
  return 1
}

/** 模块级单例：所有分类共享同一个列数状态与 resize 监听 */
let columnRef: Ref<number> | null = null
let listenerBound = false

/**
 * 当前网格列数（响应式，随窗口宽度变化自动更新）
 */
export function useColumnCount(): Ref<number> {
  if (!columnRef) {
    const supported = typeof window !== 'undefined'
    columnRef = ref(supported ? getColumnCount() : 5)

    if (supported && !listenerBound) {
      listenerBound = true
      window.addEventListener(
        'resize',
        () => {
          columnRef!.value = getColumnCount()
        },
        { passive: true },
      )
    }
  }
  return columnRef
}
