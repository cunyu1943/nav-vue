<script setup lang="ts">
import { ref } from 'vue'

import EngineSelect from '@/components/EngineSelect.vue'
import type { SearchEngine } from '@/types'

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

/** 表单节点：清除关键词后把焦点交还输入框 */
const formRef = ref<HTMLFormElement | null>(null)

function clearKeyword() {
  keyword.value = ''
  formRef.value?.querySelector('input')?.focus()
}
</script>

<template>
  <div class="mx-auto flex w-full min-w-0 max-w-[560px] flex-col items-center gap-3">
    <form
      ref="formRef"
      class="glass relative z-30 flex w-full items-stretch rounded-full pr-1.5 shadow-sm ring-1 ring-default transition-shadow focus-within:ring-2 focus-within:ring-primary/40"
      role="search"
      @submit.prevent="emit('search')"
    >
      <!-- 搜索引擎下拉：位于搜索框最前面 -->
      <EngineSelect v-model="engine" :engines="engines" />

      <UInput
        v-model="keyword"
        variant="none"
        size="lg"
        class="min-w-0 flex-1"
        :ui="{ base: 'px-3 text-sm ring-0' }"
        :placeholder="
          isSiteEngine(engine)
            ? '输入关键词，搜索站内网站…'
            : `在 ${engine.name} 中搜索后跳转…`
        "
        aria-label="搜索关键词"
        @keydown.enter="emit('search')"
      />

      <!-- 清除按钮：有输入内容时才出现 -->
      <Transition name="clear-pop">
        <UButton
          v-if="keyword"
          color="neutral"
          variant="ghost"
          size="sm"
          class="size-8 shrink-0 self-center rounded-full p-0"
          icon="i-lucide-x"
          aria-label="清除输入"
          @click="clearKeyword"
        />
      </Transition>

      <!-- 搜索按钮：仅保留图标本身（无底色），与清除按钮保持一致的图标风格 -->
      <UButton
        type="submit"
        color="neutral"
        variant="ghost"
        size="sm"
        class="size-8 shrink-0 self-center rounded-full p-0"
        :icon="isSiteEngine(engine) ? 'i-lucide-search' : 'i-lucide-arrow-up-right'"
        :aria-label="isSiteEngine(engine) ? '站内搜索' : '跳转搜索'"
      />
    </form>
  </div>
</template>

<style scoped>
/* 清除按钮淡入 / 淡出 */
.clear-pop-enter-active,
.clear-pop-leave-active {
  transition:
    opacity 0.15s ease,
    scale 0.15s ease;
}

.clear-pop-enter-from,
.clear-pop-leave-to {
  opacity: 0;
  scale: 0.7;
}
</style>
