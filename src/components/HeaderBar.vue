<script setup lang="ts">
import { computed } from 'vue'


import { siteConfig } from '@/composables/useSiteData'
import { useTheme } from '@/composables/useTheme'
import type { SearchEngine } from '@/types'

const logoSrc = `${import.meta.env.BASE_URL}${siteConfig.logo}`

const { theme, toggleTheme } = useTheme()

const toggleIcon = computed(() => (theme.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'))
const toggleLabel = computed(() =>
  theme.value === 'dark' ? '切换到明亮模式' : '切换到暗色模式',
)

/** 顶栏紧凑搜索框：与 Hero 大搜索框共享关键词 / 引擎状态 */
const keyword = defineModel<string>('keyword', { required: true })
const engine = defineModel<SearchEngine>('engine', { required: true })

defineProps<{
  /** 可选引擎列表 */
  engines: SearchEngine[]
  /** 是否显示紧凑搜索框（滚动离开 Hero 搜索区后为 true） */
  showSearch: boolean
}>()

const emit = defineEmits<{
  search: []
}>()

const compactPlaceholder = computed(() =>
  engine.value.id === 'site' || !engine.value.url
    ? '搜索站内网站…'
    : `在 ${engine.value.name} 搜索…`,
)

const isSiteEngine = computed(
  () => engine.value.id === 'site' || !engine.value.url,
)

function submit() {
  emit('search')
}
</script>

<template>
  <!-- 固定顶栏：滚动时保持可见 -->
  <header class="fixed inset-x-0 top-0 z-50 border-b border-default bg-default/80 backdrop-blur-md">
    <div class="mx-auto flex h-(--header-height) max-w-[1200px] items-center justify-between gap-3 px-4">
      <a class="flex min-w-0 shrink-0 items-center gap-2.5" href="#top">
        <img :src="logoSrc" :alt="siteConfig.title" class="size-7.5 rounded-lg" />
        <span class="text-[17px] font-bold whitespace-nowrap text-highlighted">{{ siteConfig.title }}</span>
        <span class="hidden overflow-hidden border-l border-default pl-3 text-xs whitespace-nowrap text-muted text-ellipsis sm:block">
          {{ siteConfig.subtitle }}
        </span>
      </a>

      <!-- 紧凑搜索框：离开 Hero 搜索区后淡入，随时发起搜索 -->
      <Transition name="compact">
        <form
          v-if="showSearch"
          class="mx-3 flex h-8.5 min-w-0 flex-1 items-center overflow-hidden rounded-full bg-elevated ring-1 ring-default transition-shadow focus-within:ring-2 focus-within:ring-primary/40"
          role="search"
          @submit.prevent="submit"
        >
          <UInput
            v-model="keyword"
            variant="none"
            size="sm"
            class="min-w-0 flex-1"
            :ui="{ base: 'h-8.5 px-3.5 ring-0' }"
            :placeholder="compactPlaceholder"
            aria-label="搜索关键词"
            @keydown.enter="submit"
          />
          <UButton
            type="submit"
            color="neutral"
            variant="ghost"
            size="xs"
            class="mr-1.5"
            :icon="isSiteEngine ? 'i-lucide-search' : 'i-lucide-arrow-up-right'"
            :aria-label="isSiteEngine ? '站内搜索' : '跳转搜索'"
          />
        </form>
      </Transition>

      <UButton
        class="shrink-0"
        color="neutral"
        variant="ghost"
        size="md"
        :icon="toggleIcon"
        :aria-label="toggleLabel"
        :title="toggleLabel"
        @click="toggleTheme"
      />
    </div>
  </header>
</template>

<style scoped>
/* 紧凑搜索框淡入 / 淡出 */
.compact-enter-active,
.compact-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.compact-enter-from,
.compact-leave-to {
  opacity: 0;
  transform: scaleX(0.85);
  transform-origin: right center;
}
</style>
