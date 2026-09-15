<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import type { SearchEngine } from '@/types'
import { resolveAssetUrl } from '@/utils/icon'

const engine = defineModel<SearchEngine>({ required: true })

const props = defineProps<{
  /** 可选引擎列表 */
  engines: SearchEngine[]
  /** 紧凑模式（顶栏紧凑搜索框使用，字号与间距更小） */
  compact?: boolean
}>()

/** 下拉面板是否展开 */
const open = ref(false)

/** 组件根节点，用于判定点击是否发生在外部 */
const rootRef = ref<HTMLElement | null>(null)

/** 引擎图标地址（未配置返回空串，模板中跳过 img） */
function iconUrl(e: SearchEngine): string {
  return resolveAssetUrl(e.icon)
}

/** 图标加载失败时隐藏 img，仅保留名称 */
function hideIcon(event: Event) {
  ;(event.target as HTMLElement).style.display = 'none'
}

/** 选中引擎并收起面板 */
function select(e: SearchEngine) {
  engine.value = e
  open.value = false
}

/** 点击组件外部时收起面板 */
function onDocumentClick(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) open.value = false
}

/** Esc 键收起面板 */
function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})

/** 触发器尺寸：紧凑模式用于顶栏小搜索框 */
const triggerClass = computed(() =>
  props.compact ? 'gap-1 pr-2 pl-3 text-xs' : 'gap-1.5 pr-2.5 pl-4 text-sm',
)
</script>

<template>
  <div ref="rootRef" class="relative flex shrink-0 items-center self-stretch">
    <!-- 触发器：当前引擎（图标 + 名称 + 箭头） -->
    <button
      type="button"
      class="inline-flex h-full items-center rounded-l-full font-medium text-default transition-colors hover:text-primary"
      :class="triggerClass"
      aria-haspopup="listbox"
      :aria-expanded="open"
      aria-label="选择搜索引擎"
      @click="open = !open"
    >
      <img
        v-if="iconUrl(engine)"
        class="size-4 shrink-0 rounded object-cover"
        :src="iconUrl(engine)"
        :alt="engine.name"
        @error="hideIcon"
      />
      <span class="whitespace-nowrap">{{ engine.name }}</span>
      <span
        class="i-lucide-chevron-down size-3.5 shrink-0 opacity-60 transition-transform duration-200"
        :class="{ 'rotate-180': open }"
        aria-hidden="true"
      />
    </button>

    <!-- 与输入框之间的分隔线 -->
    <span class="h-5 w-px shrink-0 bg-(--ui-border)" aria-hidden="true" />

    <!-- 下拉面板 -->
    <Transition name="engine-pop">
      <ul
        v-if="open"
        class="absolute top-[calc(100%+8px)] left-0 z-50 w-36 overflow-hidden rounded-xl border border-default bg-default p-1 shadow-lg"
        role="listbox"
        aria-label="搜索引擎列表"
      >
        <li v-for="e in engines" :key="e.id">
          <button
            type="button"
            role="option"
            :aria-selected="e.id === engine.id"
            class="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs whitespace-nowrap transition-colors"
            :class="
              e.id === engine.id
                ? 'bg-primary/10 font-semibold text-primary'
                : 'text-muted hover:bg-elevated hover:text-primary'
            "
            @click="select(e)"
          >
            <img
              v-if="iconUrl(e)"
              class="size-4 shrink-0 rounded object-cover"
              :src="iconUrl(e)"
              :alt="e.name"
              @error="hideIcon"
            />
            <span class="truncate">{{ e.name }}</span>
            <span
              v-if="e.id === engine.id"
              class="i-lucide-check ml-auto size-3.5 shrink-0"
              aria-hidden="true"
            />
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
/* 下拉面板展开 / 收起 */
.engine-pop-enter-active,
.engine-pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.engine-pop-enter-from,
.engine-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
  transform-origin: top left;
}
</style>
