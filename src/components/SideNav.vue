<script setup lang="ts">
import { computed } from 'vue'

import NavIcon from '@/components/NavIcon.vue'
import type { SiteCategory } from '@/types'
import { normalizeIcon } from '@/utils/icon'

const props = defineProps<{
  categories: SiteCategory[]
  /**
   * 展示形态：单个实例只渲染一种，避免多实例并存时互相挤占布局
   * - sidebar：仅桌面固定侧栏（作为页面左侧列）
   * - chips：仅移动端横滑分类条（放在内容区内）
   */
  variant?: 'sidebar' | 'chips'
}>()

/** 是否为桌面侧栏形态 */
const isSidebar = computed(() => props.variant !== 'chips')
</script>

<template>
  <!-- 桌面端：固定侧边栏（lg = 900px 起，与网格断点一致） -->
  <nav
    v-if="isSidebar"
    class="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] w-44 shrink-0 self-start overflow-y-auto py-6 lg:block"
    aria-label="分类导航"
  >
    <ul class="glass-panel flex flex-col gap-0.5 rounded-xl p-1.5">
      <li v-for="c in categories" :key="c.id">
        <a
          class="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm text-default transition-colors hover:bg-primary/10 hover:text-primary"
          :href="`#${c.id}`"
        >
          <NavIcon :icon="normalizeIcon(c.icon)" :name="c.name" size-class="size-4" />
          {{ c.name }}
          <span class="ml-auto text-[11px] text-dimmed">{{ c.sites.length }}</span>
        </a>
      </li>
    </ul>
  </nav>

  <!-- 移动端：顶部横向滚动分类 -->
  <nav v-else class="scrollbar-none flex gap-2 overflow-x-auto py-1 lg:hidden" aria-label="分类导航">
    <a
      v-for="c in categories"
      :key="c.id"
      class="glass inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs text-default ring-1 ring-default transition-colors hover:text-primary hover:ring-primary"
      :href="`#${c.id}`"
    >
      <NavIcon :icon="normalizeIcon(c.icon)" :name="c.name" size-class="size-3.5" />
      {{ c.name }}
    </a>
  </nav>
</template>

<style scoped>
.scrollbar-none {
  scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
