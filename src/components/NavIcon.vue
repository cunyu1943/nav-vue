<script setup lang="ts">
import { isIconifyName, isImageIcon, resolveAssetUrl } from '@/utils/icon'

withDefaults(
  defineProps<{
    /** 图标写法：Iconify 图标名 / 字体图标类名（iconfont）/ 图片地址 */
    icon?: string
    /** 无障碍名称（作为图片 alt） */
    name?: string
    /** 尺寸类（Tailwind），默认 size-4 */
    sizeClass?: string
  }>(),
  { sizeClass: 'size-4' },
)

/** 图片图标加载失败时隐藏，只保留文字 */
function hideIcon(event: Event) {
  ;(event.target as HTMLElement).style.display = 'none'
}
</script>

<template>
  <!-- 图片：相对 public/ 的路径或完整 URL -->
  <img
    v-if="isImageIcon(icon)"
    class="shrink-0 rounded object-cover"
    :class="sizeClass"
    :src="resolveAssetUrl(icon)"
    :alt="name ?? ''"
    @error="hideIcon"
  />
  <!-- Iconify 图标名：交给 UIcon 在运行时解析 -->
  <UIcon
    v-else-if="isIconifyName(icon)"
    :name="icon ?? ''"
    class="shrink-0"
    :class="sizeClass"
  />
  <!-- 其余按 CSS 类名渲染：iconfont 等字体图标 -->
  <i
    v-else-if="icon"
    :class="[icon, 'shrink-0 text-sm leading-none']"
    aria-hidden="true"
  />
</template>
