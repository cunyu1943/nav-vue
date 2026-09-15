<script setup lang="ts">

import type { SearchEngine } from '@/types'
import { resolveAssetUrl } from '@/utils/icon'

const keyword = defineModel<string>({ required: true })
const engine = defineModel<SearchEngine>('engine', { required: true })

defineProps<{
  /** 可选引擎列表 */
  engines: SearchEngine[]
}>()

const emit = defineEmits<{
  /** 用户触发搜索（回车或点击按钮） */
  search: []
}>()

function isSiteEngine(e: SearchEngine): boolean {
  return e.id === 'site' || !e.url
}

/** 引擎图标地址（未配置返回空串，模板中跳过 img） */
function iconUrl(e: SearchEngine): string {
  return resolveAssetUrl(e.icon)
}

/** 图标加载失败时隐藏 img，仅保留名称 */
function hideIcon(event: Event) {
  ;(event.target as HTMLElement).style.display = 'none'
}
</script>

<template>
  <div class="mx-auto flex w-full min-w-0 max-w-[560px] flex-col items-center gap-3">
    <!-- 引擎切换 Tab（图标 + 名称，点击切换） -->
    <div class="flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="搜索引擎切换">
      <button
        v-for="e in engines"
        :key="e.id"
        type="button"
        role="tab"
        class="inline-flex items-center gap-1.5 rounded-full border border-transparent px-3.5 py-1 text-xs text-muted transition-colors hover:text-primary"
        :class="{
          'border-primary/30 bg-primary/10 font-semibold text-primary': e.id === engine.id,
        }"
        :aria-selected="e.id === engine.id"
        @click="engine = e"
      >
        <img
          v-if="iconUrl(e)"
          class="size-4 rounded object-cover"
          :src="iconUrl(e)"
          :alt="e.name"
          loading="lazy"
          @error="hideIcon"
        />
        {{ e.name }}
      </button>
    </div>

    <form
      class="flex w-full items-stretch overflow-hidden rounded-full bg-elevated shadow-sm ring-1 ring-default transition-shadow focus-within:ring-2 focus-within:ring-primary/40"
      role="search"
      @submit.prevent="emit('search')"
    >
      <UInput
        v-model="keyword"
        variant="none"
        size="lg"
        class="min-w-0 flex-1"
        :ui="{ base: 'px-5 text-sm ring-0' }"
        :placeholder="
          isSiteEngine(engine)
            ? '输入关键词，搜索站内网站…'
            : `在 ${engine.name} 中搜索后跳转…`
        "
        aria-label="搜索关键词"
        @keydown.enter="emit('search')"
      />
      <UButton
        type="submit"
        color="neutral"
        variant="ghost"
        size="md"
        class="mr-2 self-center"
        :icon="isSiteEngine(engine) ? 'i-lucide-search' : 'i-lucide-arrow-up-right'"
        :aria-label="isSiteEngine(engine) ? '站内搜索' : '跳转搜索'"
      />
    </form>
  </div>
</template>
