import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useEngines } from '@/composables/useEngines'
import type { SearchEngine } from '@/types'

/** node 环境无 localStorage，挂一个简易 stub */
function installLocalStorageStub() {
  const store = new Map<string, string>()
  const stub = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => void store.clear(),
  }
  vi.stubGlobal('localStorage', stub)
  return store
}

let storage: ReturnType<typeof installLocalStorageStub>

beforeEach(() => {
  storage = installLocalStorageStub()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useEngines', () => {
  it('引擎列表包含站内与多个外部引擎', () => {
    const { engines } = useEngines()
    expect(engines.value.length).toBeGreaterThanOrEqual(5)
    expect(engines.value.some((e) => e.id === 'site')).toBe(true)
    expect(engines.value.some((e) => e.id === 'bing')).toBe(true)
  })

  it('默认引擎为配置中的 defaultSearchEngine（bing）', () => {
    const { currentEngine } = useEngines()
    expect(currentEngine.value.id).toBe('bing')
  })

  it('切换引擎后写入 localStorage 持久化', async () => {
    const { engines, currentEngine } = useEngines()
    const github = engines.value.find((e) => e.id === 'github') as SearchEngine
    currentEngine.value = github
    // watch 回调在微任务中执行，等待其触发
    await nextTick()
    expect(storage.get('vue-nav.engine')).toBe('github')
  })

  it('再次初始化时恢复上次选择的引擎', () => {
    storage.set('vue-nav.engine', 'baidu')
    const { currentEngine } = useEngines()
    expect(currentEngine.value.id).toBe('baidu')
  })

  it('localStorage 中存了不存在的引擎 id 时回退到默认引擎', () => {
    storage.set('vue-nav.engine', 'no-such-engine')
    const { currentEngine } = useEngines()
    expect(currentEngine.value.id).toBe('bing')
  })
})

describe('buildSearchUrl', () => {
  const { buildSearchUrl, engines } = useEngines()

  it('正确替换 %s 占位符', () => {
    const bing = engines.value.find((e) => e.id === 'bing') as SearchEngine
    expect(buildSearchUrl(bing, 'vue')).toBe('https://www.bing.com/search?q=vue')
  })

  it('中文关键词进行 URL 编码', () => {
    const bing = engines.value.find((e) => e.id === 'bing') as SearchEngine
    const url = buildSearchUrl(bing, '前端 教程')
    // 空格 → %20，中文逐字编码
    expect(url).toBe(
      `https://www.bing.com/search?q=${encodeURIComponent('前端 教程')}`,
    )
    expect(url).not.toContain('前端')
  })

  it('站内引擎 url 为空时返回空串', () => {
    const site = engines.value.find((e) => e.id === 'site') as SearchEngine
    expect(buildSearchUrl(site, 'anything')).toBe('')
  })
})
