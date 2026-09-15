<script setup lang="ts">

const visible = defineModel<boolean>('visible', { default: false })

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="fade">
    <UButton
      v-if="visible"
      class="fixed right-7 bottom-8 z-40 shadow-lg"
      color="neutral"
      variant="outline"
      size="md"
      icon="i-lucide-arrow-up"
      aria-label="回到顶部"
      @click="backToTop"
    />
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
