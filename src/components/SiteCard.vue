<script setup lang="ts">
import { computed, ref, watch } from 'vue'


import type { SiteItem } from '@/types'
import { splitHighlight } from '@/utils/highlight'
import { letterAvatar, resolveLogo } from '@/utils/logo'

const props = defineProps<{
  site: SiteItem
  /** 搜索关键词（用于命中高亮，可选） */
  keyword?: string
}>()

/** 当前展示的图片 src（logo 加载失败时降级为字母头像） */
const imgSrc = ref('')
const imgFailed = ref(false)

function applyLogo() {
  imgFailed.value = false
  imgSrc.value = resolveLogo(props.site)
}

watch(() => props.site, applyLogo, { immediate: true })

function onImgError() {
  if (!imgFailed.value) {
    imgFailed.value = true
    imgSrc.value = letterAvatar(props.site.name)
  }
}

/** 首个标签高亮展示（对应参考图中红色的分类归属标签） */
const firstTag = computed(() => props.site.tags?.[0])
const restTags = computed(() => props.site.tags?.slice(1) ?? [])
</script>

<template>
  <!-- 布局参考一为导航：圆形 logo 左侧 + 名称/单行描述 + 底部标签行 + 右下直达箭头 -->
  <a
    class="group relative flex flex-col rounded-lg bg-elevated ring-1 ring-default transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary"
    :href="site.url"
    target="_blank"
    rel="noopener noreferrer"
    :title="`${site.name} — ${site.url}`"
  >
    <div class="flex flex-1 items-center gap-3 p-3.5 pb-2.5">
      <img
        v-if="imgSrc"
        class="size-14 shrink-0 rounded-full bg-muted object-cover"
        :src="imgSrc"
        :alt="site.name"
        loading="lazy"
        @error="onImgError"
      />
      <span v-else class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-inverted">
        {{ site.name.charAt(0) }}
      </span>

      <div class="min-w-0 flex-1">
        <div class="truncate text-[15px] font-semibold text-highlighted">
          <template
            v-for="(seg, i) in splitHighlight(site.name, keyword ?? '')"
            :key="i"
          >
            <mark v-if="seg.hit" class="rounded-sm bg-primary/15 px-0.5 text-primary">{{ seg.text }}</mark>
            <template v-else>{{ seg.text }}</template>
          </template>
        </div>
        <p class="mt-0.5 truncate text-sm text-muted">
          <template
            v-for="(seg, i) in splitHighlight(site.description, keyword ?? '')"
            :key="i"
          >
            <mark v-if="seg.hit" class="rounded-sm bg-primary/15 px-0.5 text-primary">{{ seg.text }}</mark>
            <template v-else>{{ seg.text }}</template>
          </template>
        </p>
      </div>
    </div>

    <!-- 标签行：恒占一行高度，保证卡片等高；首个标签高亮 -->
    <div class="flex items-center gap-1.5 overflow-hidden px-3.5 pb-3 whitespace-nowrap min-h-6">
      <UBadge v-if="firstTag" color="error" variant="soft" size="sm">
        {{ firstTag }}
      </UBadge>
      <span
        v-for="tag in restTags"
        :key="tag"
        class="text-xs text-dimmed"
      >#{{ tag }}</span>

      <span
        class="i-lucide-send ml-auto size-4 shrink-0 text-dimmed transition-colors group-hover:text-primary"
        aria-hidden="true"
      />
    </div>
  </a>
</template>
