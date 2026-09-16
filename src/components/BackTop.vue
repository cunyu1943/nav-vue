<script setup lang="ts">

const visible = defineModel<boolean>('visible', { default: false })

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="fade">
    <!-- 原生 button：避免按钮组件底色覆盖毛玻璃效果 -->
    <button
      v-if="visible"
      type="button"
      class="glass fixed right-7 bottom-8 z-40 flex size-10 items-center justify-center rounded-full text-default shadow-lg ring-1 ring-default transition-colors hover:text-primary hover:ring-primary"
      aria-label="回到顶部"
      title="回到顶部"
      @click="backToTop"
    >
      <UIcon name="i-lucide-arrow-up" class="size-5" aria-hidden="true" />
    </button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
