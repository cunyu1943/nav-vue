<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'


import BackTop from '@/components/BackTop.vue'
import CategorySection from '@/components/CategorySection.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import SearchBox from '@/components/SearchBox.vue'
import SideNav from '@/components/SideNav.vue'
import { siteConfig, useSiteData } from '@/composables/useSiteData'
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

/** 顶栏紧凑搜索框显隐：滚动离开 Hero 搜索区后显示 */
const showCompactSearch = ref(false)

/** 回到顶部按钮显示状态 */
const showBackTop = ref(false)
let scrollListener: (() => void) | null = null

onMounted(() => {
  scrollListener = () => {
    const y = window.scrollY
    showCompactSearch.value = y > 240
    showBackTop.value = y > 360
  }
  window.addEventListener('scroll', scrollListener, { passive: true })
})

onBeforeUnmount(() => {
  if (scrollListener) window.removeEventListener('scroll', scrollListener)
})
</script>

<template>
  <UApp>
    <div id="top" class="mx-auto flex max-w-[1200px] px-4">
      <SideNav :categories="isSearching ? filteredCategories : categories" />

      <main class="min-w-0 flex-1 pt-(--header-height) pb-10">
        <HeaderBar
          v-model:keyword="keyword"
          v-model:engine="currentEngine"
          :engines="engines"
          :show-search="showCompactSearch"
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
            <UButton size="2xs" color="neutral" variant="outline" icon="i-lucide-x" label="清除搜索" @click="clearSearch" />
          </p>
          <SearchBox
            v-model="keyword"
            v-model:engine="currentEngine"
            :engines="engines"
            class="mt-1"
            @search="onSearch"
          />
        </section>

        <div class="py-1 lg:hidden">
          <SideNav :categories="isSearching ? filteredCategories : categories" />
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

        <footer class="mt-9 border-t border-default pt-4.5 text-center text-xs text-dimmed">
          <p>{{ siteConfig.footer }}</p>
          <p v-if="siteConfig.icp" class="mt-1">{{ siteConfig.icp }}</p>
        </footer>
      </main>

      <BackTop v-model:visible="showBackTop" />
    </div>
  </UApp>
</template>
