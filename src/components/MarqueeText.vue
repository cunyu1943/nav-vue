<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { splitHighlight } from '@/utils/highlight'

const props = defineProps<{
  /** 展示文本 */
  text: string
  /** 搜索关键词（用于命中高亮，可选） */
  keyword?: string
  /**
   * 是否播放滚动：由父级控制（例如鼠标悬停在卡片上时置 true）
   *
   * 用状态而不是 CSS 祖先选择器，避免 scoped 样式下 `:global()` 编译不可靠的问题。
   */
  active?: boolean
}>()

/** 高亮切分结果（命中关键词的片段用 <mark> 渲染） */
const segments = computed(() => splitHighlight(props.text, props.keyword ?? ''))

/** 视口：宽度受限，超出部分隐藏 */
const viewport = ref<HTMLElement | null>(null)
/** 文本内容：实际宽度可能超出视口 */
const content = ref<HTMLElement | null>(null)

/** 内容是否超出视口（未超出则不需要滚动） */
const scrollable = ref(false)
/** 需要滚动的距离（负值，直接供 translateX 使用） */
const shift = ref('0px')
/** 单程滚动耗时：按距离换算，保证长文本滚动速度恒定 */
const duration = ref('3s')

/** 测量内容与视口宽度，换算出滚动距离与时长 */
function measure() {
  const vp = viewport.value
  const ct = content.value
  if (!vp || !ct) return

  const overflow = ct.scrollWidth - vp.clientWidth
  scrollable.value = overflow > 1
  shift.value = `${overflow > 0 ? -overflow : 0}px`
  // 约 40px/s，单程封顶 8s，避免超长文本滚得太快
  duration.value = `${Math.min(8, Math.max(1.2, Math.max(overflow, 0) / 40))}s`
}

let observer: ResizeObserver | null = null

onMounted(() => {
  // 等一帧待 flex 布局完成，测量结果才准确
  requestAnimationFrame(measure)

  if (typeof ResizeObserver === 'undefined') {
    // 兜底：不支持 ResizeObserver 时监听窗口尺寸
    window.addEventListener('resize', measure)
    return
  }

  observer = new ResizeObserver(measure)
  if (viewport.value) observer.observe(viewport.value)
  if (content.value) observer.observe(content.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', measure)
})

// 文本变化（搜索过滤后重新渲染）时，等 DOM 更新完再重新测量
watch(
  () => props.text,
  async () => {
    await nextTick()
    measure()
  },
)
</script>

<template>
  <div ref="viewport" class="marquee">
    <span
      ref="content"
      class="marquee-inner"
      :class="{ 'is-scrollable': scrollable, 'is-active': scrollable && active }"
      :style="{ '--marquee-shift': shift, '--marquee-duration': duration }"
    >
      <template v-for="(seg, i) in segments" :key="i">
        <mark v-if="seg.hit" class="rounded-sm bg-primary/15 px-0.5 text-primary">{{ seg.text }}</mark>
        <template v-else>{{ seg.text }}</template>
      </template>
    </span>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-inner {
  display: inline-block;
  white-space: nowrap;
}

/* 仅当文本超出一行时滚动：父级激活（悬停卡片）或鼠标直接停在文字上 */
.marquee-inner.is-active,
.marquee:hover .marquee-inner.is-scrollable {
  will-change: transform;
  animation: marquee-scroll var(--marquee-duration, 3s) ease-in-out infinite alternate;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(var(--marquee-shift, 0px));
  }
}

/* 尊重系统的「减少动态效果」偏好 */
@media (prefers-reduced-motion: reduce) {
  .marquee-inner.is-active,
  .marquee:hover .marquee-inner.is-scrollable {
    animation: none;
  }
}
</style>
