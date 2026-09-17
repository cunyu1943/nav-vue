import { ref } from 'vue'

/**
 * 外链跳转确认（模块级单例，全站共用同一个弹窗）
 *
 * 站点卡片指向第三方网站，直接跳转前先弹窗提示，
 * 由用户点击「继续访问」后才真正打开，避免误点离开本站。
 */

/** 待确认跳转的目标地址 */
const pendingUrl = ref('')

/** 弹窗显隐（与 UModal 的 v-model:open 双向绑定） */
const open = ref(false)

/** 请求跳转：不直接打开，先弹窗让用户确认 */
function requestNavigation(url: string) {
  const target = url?.trim()
  if (!target) return
  pendingUrl.value = target
  open.value = true
}

/** 取消跳转：仅关闭弹窗，不做任何跳转 */
function cancelNavigation() {
  open.value = false
}

/**
 * 继续访问：新标签页打开目标地址并关闭弹窗
 *
 * 注意：这里不清空 pendingUrl，否则弹窗关闭动画期间文字会闪空；
 * 下次 requestNavigation 会直接覆盖它。
 */
function confirmNavigation() {
  const target = pendingUrl.value
  open.value = false
  if (!target) return
  window.open(target, '_blank', 'noopener,noreferrer')
}

export function useLinkGuard() {
  return { open, pendingUrl, requestNavigation, cancelNavigation, confirmNavigation }
}
