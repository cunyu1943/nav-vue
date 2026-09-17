import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLinkGuard } from '@/composables/useLinkGuard'

/** node 环境无 window，stub 掉 window.open 以便断言跳转行为 */
const openMock = vi.fn()

const { open, pendingUrl, requestNavigation, cancelNavigation, confirmNavigation } =
  useLinkGuard()

beforeEach(() => {
  openMock.mockClear()
  vi.stubGlobal('window', { open: openMock })
  // 单例状态在同一次测试内共享，逐个用例前复位
  cancelNavigation()
})

describe('useLinkGuard', () => {
  it('请求跳转时记录地址并打开弹窗（不直接跳转）', () => {
    requestNavigation('https://example.com')
    expect(open.value).toBe(true)
    expect(pendingUrl.value).toBe('https://example.com')
    expect(openMock).not.toHaveBeenCalled()
  })

  it('地址首尾空格会被去除', () => {
    requestNavigation('  https://example.com  ')
    expect(pendingUrl.value).toBe('https://example.com')
  })

  it('空地址不弹窗', () => {
    requestNavigation('')
    requestNavigation('   ')
    expect(open.value).toBe(false)
  })

  it('取消跳转仅关闭弹窗，不打开新页面', () => {
    requestNavigation('https://example.com')
    cancelNavigation()
    expect(open.value).toBe(false)
    expect(openMock).not.toHaveBeenCalled()
  })

  it('继续访问在新标签页打开目标地址并关闭弹窗', () => {
    requestNavigation('https://example.com')
    confirmNavigation()
    expect(openMock).toHaveBeenCalledWith(
      'https://example.com',
      '_blank',
      'noopener,noreferrer',
    )
    expect(open.value).toBe(false)
  })

  it('无待确认地址时继续访问不做任何跳转', async () => {
    // 单例状态会跨用例保留，这里重置模块拿一份全新实例来验证该分支
    vi.resetModules()
    const { useLinkGuard: createFresh } = await import('@/composables/useLinkGuard')
    const fresh = createFresh()
    fresh.confirmNavigation()
    expect(openMock).not.toHaveBeenCalled()
  })

  it('多个调用方共享同一份状态（单例）', () => {
    const another = useLinkGuard()
    requestNavigation('https://example.com')
    expect(another.open.value).toBe(true)
    expect(another.pendingUrl.value).toBe('https://example.com')
  })
})
