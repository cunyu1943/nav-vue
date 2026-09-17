<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import NavIcon from '@/components/NavIcon.vue'
import type { NavLink } from '@/types'
import { hasChildren, linkRel, linkTarget } from '@/utils/nav'

const props = defineProps<{
  /** 自定义导航链接（来自 config.json 的 nav.links） */
  links: NavLink[]
}>()

/** 组件根节点：用于判定点击是否发生在外部 */
const rootRef = ref<HTMLElement | null>(null)

/** 当前展开的一级菜单下标（-1 表示全部收起） */
const openIndex = ref(-1)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? -1 : index
}

/** 延迟收起定时器：留出鼠标从触发项滑向下拉面板的时间 */
let closeTimer: ReturnType<typeof setTimeout> | undefined

/** 悬停进入某一项：有子菜单则展开，无子菜单则收起其它面板 */
function onItemEnter(index: number) {
  if (closeTimer) clearTimeout(closeTimer)
  openIndex.value = hasChildren(props.links[index]) ? index : -1
}

function onItemLeave() {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    openIndex.value = -1
  }, 140)
}

/** 点击组件外部时收起 */
function onDocumentClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) openIndex.value = -1
}

/** Esc 键收起 */
function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') openIndex.value = -1
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  if (closeTimer) clearTimeout(closeTimer)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})

/**
 * 下拉面板分列：每列最多 6 项、最多 3 列，纵向填充（与参考站观感一致）
 */
function gridStyle(link: NavLink) {
  const total = link.children?.length ?? 0
  const columns = Math.min(3, Math.max(1, Math.ceil(total / 6)))
  const rows = Math.ceil(total / columns)
  return {
    gridTemplateRows: `repeat(${rows}, auto)`,
    gridAutoFlow: 'column',
  }
}

</script>

<template>
  <!-- 自定义导航：紧跟在品牌区之后；lg 断点（<900px）以下隐藏，改由 MobileNav 的汉堡菜单承载 -->
  <nav
    v-if="links.length"
    ref="rootRef"
    class="hidden min-w-0 items-center gap-0.5 lg:flex"
    aria-label="自定义导航"
  >
    <div
      v-for="(link, i) in links"
      :key="`${link.name}-${i}`"
      class="relative"
      @mouseenter="onItemEnter(i)"
      @mouseleave="onItemLeave"
    >
      <!-- 有子菜单：按钮展开 / 收齐 -->
      <button
        v-if="hasChildren(link)"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs whitespace-nowrap transition-colors"
        :class="
          openIndex === i
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:bg-primary/10 hover:text-primary'
        "
        aria-haspopup="menu"
        :aria-expanded="openIndex === i"
        @click="toggle(i)"
      >
        <NavIcon :icon="link.icon" :name="link.name" />
        <span>{{ link.name }}</span>
        <UIcon
          name="i-lucide-chevron-down"
          class="size-3 shrink-0 opacity-60 transition-transform duration-200"
          :class="{ 'rotate-180': openIndex === i }"
        />
      </button>

      <!-- 无子菜单：普通链接 -->
      <a
        v-else
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs whitespace-nowrap text-muted transition-colors hover:bg-primary/10 hover:text-primary"
        :href="link.url"
        :target="linkTarget(link)"
        :rel="linkRel(link)"
        :title="link.name"
      >
        <NavIcon :icon="link.icon" :name="link.name" />
        <span>{{ link.name }}</span>
      </a>

      <!-- 下拉面板：外层 pt-2 补足与触发项之间的间隙，避免鼠标经过时闪断 -->
      <Transition name="menu-pop">
        <div v-if="hasChildren(link) && openIndex === i" class="absolute top-full left-0 z-60 pt-2">
          <ul
            class="grid gap-0.5 rounded-xl border border-default bg-default p-1.5 shadow-xl"
            :style="gridStyle(link)"
            role="menu"
          >
            <li v-for="(child, ci) in link.children" :key="`${child.name}-${ci}`">
              <a
                class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                :href="child.url"
                :target="linkTarget(child)"
                :rel="linkRel(child)"
                :title="child.name"
                role="menuitem"
                @click="openIndex = -1"
              >
                <NavIcon :icon="child.icon" :name="child.name" />
                <span>{{ child.name }}</span>
              </a>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<style scoped>
/* 下拉面板展开 / 收起 */
.menu-pop-enter-active,
.menu-pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
