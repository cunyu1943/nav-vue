<script setup lang="ts">
import { computed, ref } from 'vue'


import NavIcon from '@/components/NavIcon.vue'
import type { SiteCategory } from '@/types'
import { useColumnCount } from '@/composables/useColumnCount'
import { normalizeIcon } from '@/utils/icon'
import SiteCard from './SiteCard.vue'

const props = defineProps<{
  category: SiteCategory
  /** 搜索关键词（透传给卡片做高亮） */
  keyword?: string
  /** 是否处于搜索状态：搜索结果全部展开、不折叠 */
  searching?: boolean
}>()

/** 折叠状态：每个分类默认折叠（超过阈值时） */
const collapsed = ref(true)

/** 当前网格列数（与 CSS 断点同步） */
const columnCount = useColumnCount()

/** 折叠阈值 = 当前列数 × 3 行 */
const threshold = computed(() => columnCount.value * 3)

/** 站点总数是否超出折叠阈值（搜索中不折叠） */
const shouldCollapse = computed(
  () => !props.searching && props.category.sites.length > threshold.value,
)

/** 实际渲染的站点列表 */
const visibleSites = computed(() => {
  if (props.searching || !collapsed.value) return props.category.sites
  return props.category.sites.slice(0, threshold.value)
})

/** 被折叠隐藏的数量 */
const hiddenCount = computed(
  () => props.category.sites.length - visibleSites.value.length,
)

function toggle() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <section :id="category.id" class="scroll-mt-[calc(var(--header-height)+8px)] pt-4">
    <!-- 标题行：左侧图标+标题+数量，右侧醒目的展开/收起按钮（折叠时提示更明显） -->
    <header class="glass-strong sticky top-(--header-height) z-5 mb-3.5 flex items-center justify-between gap-3 rounded-lg px-1 py-2.5">
      <h2 class="flex items-center gap-2 text-[17px] font-bold text-highlighted">
        <NavIcon
          :icon="normalizeIcon(category.icon)"
          :name="category.name"
          size-class="size-[18px]"
        />
        {{ category.name }}
        <UBadge color="neutral" variant="soft" size="sm">
          {{ category.sites.length }}
        </UBadge>
      </h2>

      <div class="flex items-center gap-3">
        <UButton
          v-if="shouldCollapse"
          size="xs"
          color="primary"
          variant="soft"
          :icon="collapsed ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
          trailing
          :label="collapsed ? `展开全部 ${category.sites.length} 个` : '收起'"
          @click="toggle"
        />
        <a class="text-sm text-dimmed opacity-60 transition-opacity hover:text-primary hover:opacity-100" :href="`#${category.id}`">#</a>
      </div>
    </header>

    <!-- 每行 5 个（minmax(0,1fr) 强制等宽），小屏按断点降级 -->
    <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <SiteCard
        v-for="site in visibleSites"
        :key="site.url"
        :site="site"
        :keyword="keyword"
      />
    </div>

    <p v-if="collapsed && hiddenCount > 0" class="pt-3 text-center text-xs text-dimmed">
      还有 {{ hiddenCount }} 个未显示，点击右上角「展开」查看全部
    </p>
  </section>
</template>
