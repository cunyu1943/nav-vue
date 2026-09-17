<script setup lang="ts">
import { useLinkGuard } from '@/composables/useLinkGuard'

const { open, pendingUrl, cancelNavigation, confirmNavigation } = useLinkGuard()
</script>

<template>
  <!--
    外链跳转确认：全站唯一实例，由 useLinkGuard 单例驱动

    必须显式指定 z-index：Nuxt UI 的 modal 主题（overlay / content）本身不含 z-index，
    而本项目的内容容器 #top 设了 z-index: 1（用于压住 z-index: 0 的毛玻璃底图）并形成层叠上下文，
    弹窗又 portal 到 body 下，于是整页内容会盖住弹窗。这里的 z-70 高于项目内最高的 z-60。
  -->
  <UModal
    v-model:open="open"
    title="温馨提示"
    :ui="{
      overlay: 'z-70',
      content: 'z-70 max-w-md',
      // 头部为 flex 布局，wrapper 撑满后标题才能在整个头部里居中
      wrapper: 'flex-1',
      title: 'text-center',
    }"
  >
    <template #body>
      <div class="flex gap-3">
        <UIcon name="i-lucide-external-link" class="mt-0.5 size-5 shrink-0 text-primary" />
        <p class="text-sm leading-relaxed text-muted">
          即将前往<span class="font-medium break-all text-highlighted">{{ pendingUrl }}</span>，此链接与本网站无关，请自行判断
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="outline" label="取消跳转" @click="cancelNavigation" />
        <UButton color="primary" label="继续访问" @click="confirmNavigation" />
      </div>
    </template>
  </UModal>
</template>
