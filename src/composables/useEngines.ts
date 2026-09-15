import { computed, ref, watch } from 'vue'

import enginesData from '@/data/search-engines.json'
import type { SearchEngine, SearchEnginesData } from '@/types'
import { siteConfig } from '@/composables/useSiteData'

/** 全部可用搜索引擎（来自 src/data/search-engines.json） */
const engines: SearchEngine[] = (enginesData as SearchEnginesData).engines

/** 引擎选择的 localStorage 持久化 key */
const STORAGE_KEY = 'vue-nav.engine'

/** 读取初始引擎：用户上次选择 > 配置的默认引擎 > 列表第一个 */
function loadInitialEngine(): SearchEngine {
  let savedId: string | null = null
  try {
    savedId = globalThis.localStorage?.getItem(STORAGE_KEY)
  } catch {
    // localStorage 不可用时忽略（如隐私模式）
  }
  return (
    engines.find((e) => e.id === savedId) ??
    engines.find((e) => e.id === siteConfig.defaultSearchEngine) ??
    engines[0]
  )
}

/**
 * 搜索引擎管理：引擎列表、当前选中引擎（持久化）、跳转 URL 构建
 */
export function useEngines() {
  const currentEngine = ref<SearchEngine>(loadInitialEngine())

  // 引擎变更时持久化，下次访问记住用户的选择
  watch(currentEngine, (engine) => {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, engine.id)
    } catch {
      // ignore
    }
  })

  /** 构建外部引擎搜索地址：%s → encodeURIComponent(关键词) */
  function buildSearchUrl(engine: SearchEngine, keyword: string): string {
    if (!engine.url) return ''
    return engine.url.replace('%s', encodeURIComponent(keyword))
  }

  return {
    engines: computed(() => engines),
    currentEngine,
    buildSearchUrl,
  }
}
