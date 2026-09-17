<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'


import BackTop from '@/components/BackTop.vue'
import CategorySection from '@/components/CategorySection.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import LinkGuardDialog from '@/components/LinkGuardDialog.vue'
import SearchBox from '@/components/SearchBox.vue'
import SideNav from '@/components/SideNav.vue'
import { navConfig, siteConfig, useSiteData } from '@/composables/useSiteData'
import { useEngines } from '@/composables/useEngines'
import { useSearch } from '@/composables/useSearch'

const { categories, totalSites } = useSiteData()

/** 搜索关键词：站内模式下输入即过滤 */
const keyword = ref('')
const { filteredCategories, matchedCount, isSearching } = useSearch(
  categories,
  keyword,
)

/** 搜索引擎切换与跳转 */
const { engines, currentEngine, buildSearchUrl } = useEngines()

/** 触发搜索：站内引擎实时过滤已生效；外部引擎跳转新标签页 */
function onSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  if (currentEngine.value.id === 'site' || !currentEngine.value.url) return
  window.open(buildSearchUrl(currentEngine.value, kw), '_blank', 'noopener,noreferrer')
}

/** 清空搜索 */
function clearSearch() {
  keyword.value = ''
}

/**
 * 顶栏高度以 CSS 变量下发给全站（侧栏粘性偏移 / 内容区让位 / 锚点滚动留白）：
 * 非固定顶栏时不占位，取 0 让内容自然贴顶
 */
const rootStyle = computed<Record<string, string>>(() => ({
  '--header-height': navConfig.sticky ? `${navConfig.height}px` : '0px',
}))

/** 顶栏紧凑搜索框显隐：滚动离开 Hero 搜索区后显示（顶栏非固定时无意义，恒不显示） */
const showCompactSearch = ref(false)

/** 回到顶部按钮显示状态 */
const showBackTop = ref(false)
let scrollListener: (() => void) | null = null

onMounted(() => {
  scrollListener = () => {
    const y = window.scrollY
    // 仅按滚动位置判断：滚过 Hero 搜索区后才显示顶栏搜索框，
    // 保证它与主页搜索框互斥（Hero 搜索框此时已完全滚出视口）
    showCompactSearch.value = navConfig.sticky && navConfig.showSearch && y > 240
    showBackTop.value = y > 360
  }
  // 初始同步一次：页面以滚动状态打开（如刷新时保留位置）也能正确显示
  scrollListener()
  window.addEventListener('scroll', scrollListener, { passive: true })
})

onBeforeUnmount(() => {
  if (scrollListener) window.removeEventListener('scroll', scrollListener)
})
</script>

<template>
  <UApp>
    <!-- 全站毛玻璃底图：光斑 + 网格，作为各玻璃元素的模糊对象 -->
    <div class="app-backdrop" aria-hidden="true" />

    <div id="top" class="relative z-[1] mx-auto flex max-w-[1200px] px-4" :style="rootStyle">
      <SideNav
        v-if="navConfig.showSideNav"
        variant="sidebar"
        :categories="isSearching ? filteredCategories : categories"
      />

      <main
        class="min-w-0 flex-1 pb-10"
        :class="navConfig.sticky ? 'pt-(--header-height)' : ''"
      >
        <HeaderBar
          v-model:keyword="keyword"
          v-model:engine="currentEngine"
          :engines="engines"
          :show-search="showCompactSearch"
          :sticky="navConfig.sticky"
          @search="onSearch"
        />

        <section class="flex flex-col items-center gap-2.5 py-8.5 pb-7 text-center">
          <h1 class="text-3xl font-extrabold tracking-wide text-highlighted">
            {{ siteConfig.title }}
          </h1>
          <p v-if="!isSearching" class="flex items-center gap-2.5 text-sm text-muted">
            {{ siteConfig.subtitle }} · 收录 {{ totalSites }} 个精选网站
          </p>
          <p v-else class="flex items-center gap-2.5 text-sm text-muted">
            站内找到
            <strong class="text-base text-primary">{{ matchedCount }}</strong>
            个网站
          </p>
          <SearchBox
            v-model="keyword"
            v-model:engine="currentEngine"
            :engines="engines"
            class="mt-1"
            @search="onSearch"
          />
        </section>

        <div v-if="navConfig.showSideNav" class="py-1">
          <SideNav
            variant="chips"
            :categories="isSearching ? filteredCategories : categories"
          />
        </div>

        <div class="flex flex-col gap-3">
          <CategorySection
            v-for="c in filteredCategories"
            :key="c.id"
            :category="c"
            :keyword="keyword"
            :searching="isSearching"
          />

          <div v-if="isSearching && matchedCount === 0" class="flex flex-col items-center gap-2.5 py-15">
            <p class="text-4xl">🔍</p>
            <p class="text-[15px] text-muted">没有找到与「{{ keyword }}」相关的网站</p>
            <UButton
              size="sm"
              color="primary"
              variant="soft"
              icon="i-lucide-rotate-ccw"
              label="清除关键词，浏览全部网站"
              @click="clearSearch"
            />
          </div>
        </div>

        <!-- 页脚：footer / icp 均支持 HTML 片段（配置来自本仓库 JSON，非用户输入） -->
        <footer class="mt-9 border-t border-default pt-4.5 text-center text-xs text-dimmed">
          <p v-html="siteConfig.footer"></p>
          <p v-if="siteConfig.icp" class="mt-1" v-html="siteConfig.icp"></p>
        </footer>
      </main>

      <BackTop v-model:visible="showBackTop" />
    </div>

    <!-- 外链跳转确认弹窗（全站唯一实例，由 useLinkGuard 单例驱动） -->
    <LinkGuardDialog />
  </UApp>
</template>
