<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import NavIcon from '@/components/NavIcon.vue'
import type { NavLink } from '@/types'
import { hasChildren, linkRel, linkTarget } from '@/utils/nav'

defineProps<{
  /** 自定义导航链接（来自 config.json 的 nav.links） */
  links: NavLink[]
}>()

/**
 * 组件根节点：仅用于判定点击是否发生在外部
 *
 * 刻意不设 position，让下拉面板的 absolute 直接锚到顶栏 <header> 上，
 * 这样面板才能横跨整个顶栏宽度。
 */
const rootRef = ref<HTMLElement | null>(null)

/** 面板是否展开 */
const open = ref(false)

/** 当前展开子菜单的一级项下标（-1 表示全部收起） */
const expandedIndex = ref(-1)

function close() {
  open.value = false
  expandedIndex.value = -1
}

function toggleMenu() {
  if (open.value) close()
  else open.value = true
}

/** 展开 / 收起某一项的子菜单 */
function toggleGroup(index: number) {
  expandedIndex.value = expandedIndex.value === index ? -1 : index
}

/**
 * 判断事件是否发生在组件内部
 *
 * 这里刻意用 composedPath() 而不是 rootRef.contains(event.target)：
 * 触发按钮会在点击的同一轮里把图标在「汉堡 / ×」之间切换，旧图标节点随即被移除并脱离文档，
 * 而 document 上的监听是在冒泡阶段执行的（晚于按钮自身的 click），此时 contains(event.target)
 * 会对一个已脱离的节点返回 false，导致刚展开的面板被立刻关掉。
 * composedPath() 记录的是事件派发时的传播路径，不受中途重渲染影响。
 */
function isInside(event: MouseEvent): boolean {
  const root = rootRef.value
  return !!root && event.composedPath().includes(root)
}

function onDocumentClick(event: MouseEvent) {
  if (!isInside(event)) close()
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

/**
 * 视口变宽到桌面断点时收起，避免缩回窄屏后面板还处于展开状态
 *
 * 900px 对应 Tailwind 的 lg 断点（见 src/styles/main.css 的 @theme），
 * 必须与 NavMenu 根节点的 lg:flex / 本组件根节点的 lg:hidden 保持一致 ——
 * 三者不同步会导致「两边都不显示」或「同时显示」。
 */
const DESKTOP_MIN_WIDTH = 900

const mql =
  typeof window !== 'undefined'
    ? window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`)
    : null

function onBreakpointChange(event: MediaQueryListEvent) {
  if (event.matches) close()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
  mql?.addEventListener('change', onBreakpointChange)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  mql?.removeEventListener('change', onBreakpointChange)
})
</script>

<template>
  <!-- 窄屏 / 平板导航：lg 断点（≥900px）起整体隐藏，由 NavMenu 接管 -->
  <div v-if="links.length" ref="rootRef" class="lg:hidden">
    <UButton
      color="neutral"
      variant="ghost"
      size="md"
      class="shrink-0"
      :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
      :aria-label="open ? '关闭导航菜单' : '打开导航菜单'"
      :title="open ? '关闭导航菜单' : '打开导航菜单'"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggleMenu"
    />

    <Transition name="mobile-nav">
      <div
        v-if="open"
        class="glass-strong absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-height)-1rem)] overflow-y-auto border-b border-default shadow-xl"
        role="menu"
      >
        <ul class="mx-auto flex max-w-[1200px] flex-col gap-0.5 p-2">
          <li v-for="(link, i) in links" :key="`${link.name}-${i}`">
            <!-- 有子菜单：点击展开 / 收起 -->
            <template v-if="hasChildren(link)">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-primary/10 hover:text-primary"
                :class="expandedIndex === i ? 'text-primary' : 'text-default'"
                :aria-expanded="expandedIndex === i"
                @click="toggleGroup(i)"
              >
                <NavIcon :icon="link.icon" :name="link.name" size-class="size-4" />
                <span>{{ link.name }}</span>
                <UIcon
                  name="i-lucide-chevron-down"
                  class="ml-auto size-4 shrink-0 opacity-60 transition-transform duration-200"
                  :class="{ 'rotate-180': expandedIndex === i }"
                />
              </button>

              <Transition name="submenu">
                <ul v-if="expandedIndex === i" class="mt-0.5 flex flex-col gap-0.5 pl-5">
                  <li v-for="(child, ci) in link.children" :key="`${child.name}-${ci}`">
                    <a
                      class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                      :href="child.url"
                      :target="linkTarget(child)"
                      :rel="linkRel(child)"
                      :title="child.name"
                      role="menuitem"
                      @click="close"
                    >
                      <NavIcon :icon="child.icon" :name="child.name" size-class="size-3.5" />
                      <span>{{ child.name }}</span>
                    </a>
                  </li>
                </ul>
              </Transition>
            </template>

            <!-- 无子菜单：直接跳转 -->
            <a
              v-else
              class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-default transition-colors hover:bg-primary/10 hover:text-primary"
              :href="link.url"
              :target="linkTarget(link)"
              :rel="linkRel(link)"
              :title="link.name"
              role="menuitem"
              @click="close"
            >
              <NavIcon :icon="link.icon" :name="link.name" size-class="size-4" />
              <span>{{ link.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 面板从顶栏下方滑出 */
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* 子菜单展开 / 收起 */
.submenu-enter-active,
.submenu-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
