<script setup lang="ts">
import { computed, ref } from 'vue'


import EngineSelect from '@/components/EngineSelect.vue'
import NavMenu from '@/components/NavMenu.vue'
import { navConfig, siteConfig } from '@/composables/useSiteData'
import { useTheme } from '@/composables/useTheme'
import type { SearchEngine } from '@/types'

const logoSrc = `${import.meta.env.BASE_URL}${siteConfig.logo}`

const { theme, toggleTheme } = useTheme()

const toggleIcon = computed(() => (theme.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'))
const toggleLabel = computed(() =>
  theme.value === 'dark' ? '切换到明亮模式' : '切换到暗色模式',
)

/** 品牌区是否展示（logo / 标题 / 副标题全部关闭时整体隐藏） */
const showBrand = computed(
  () => navConfig.showLogo || navConfig.showTitle || navConfig.showSubtitle,
)

/** 自定义导航链接（为空时 NavMenu 自身不渲染） */
const navLinks = computed(() => navConfig.links)

/** 顶栏紧凑搜索框：与 Hero 大搜索框共享关键词 / 引擎状态 */
const keyword = defineModel<string>('keyword', { required: true })
const engine = defineModel<SearchEngine>('engine', { required: true })

withDefaults(
  defineProps<{
    /** 可选引擎列表 */
    engines: SearchEngine[]
    /** 是否显示紧凑搜索框（滚动离开 Hero 搜索区后为 true） */
    showSearch: boolean
    /** 顶栏是否固定（false 时随页面滚动，紧凑搜索框不会出现） */
    sticky?: boolean
  }>(),
  { sticky: true },
)

const emit = defineEmits<{
  search: []
}>()

const compactPlaceholder = computed(() =>
  engine.value.id === 'site' || !engine.value.url
    ? '搜索站内网站…'
    : `在 ${engine.value.name} 搜索…`,
)

const isSiteEngine = computed(
  () => engine.value.id === 'site' || !engine.value.url,
)

function submit() {
  emit('search')
}

/** 点击站点 logo 返回首页：清空搜索关键词并回到页面顶部（恢复全部分类） */
function goHome() {
  keyword.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** 表单节点：清除关键词后把焦点交还输入框 */
const formRef = ref<HTMLFormElement | null>(null)

function clearKeyword() {
  keyword.value = ''
  formRef.value?.querySelector('input')?.focus()
}
</script>

<template>
  <!-- 顶栏：毛玻璃质感；sticky 为 false 时随页面滚动 -->
  <header
    class="glass-strong border-b border-default"
    :class="sticky ? 'fixed inset-x-0 top-0 z-50' : 'relative z-40'"
  >
    <div
      class="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4"
      :style="{ height: `${navConfig.height}px` }"
    >
      <!-- 左侧整体靠左：品牌区与自定义导航紧挨，菜单从 logo 后开始 -->
      <div class="flex min-w-0 items-center gap-2 md:gap-3">
        <a
          v-if="showBrand"
          class="flex min-w-0 shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
          href="#top"
          title="返回首页"
          aria-label="返回首页"
          @click="goHome"
        >
          <img
            v-if="navConfig.showLogo"
            :src="logoSrc"
            :alt="siteConfig.title"
            class="size-7.5 rounded-lg"
          />
          <!-- 窄屏只留 logo：品牌名 ≥640 出现、副标题 ≥1100 出现，宽度优先让给搜索框 -->
          <span
            v-if="navConfig.showTitle"
            class="hidden text-[17px] font-bold whitespace-nowrap text-highlighted md:inline"
          >{{ siteConfig.title }}</span>
          <span
            v-if="navConfig.showSubtitle"
            class="hidden overflow-hidden border-l border-default pl-3 text-xs whitespace-nowrap text-muted text-ellipsis xl:block"
          >
            {{ siteConfig.subtitle }}
          </span>
        </a>

        <!-- 自定义导航链接：支持二级下拉，配置来自 config.json 的 nav.links -->
        <NavMenu :links="navLinks" />
      </div>

      <!-- 紧凑搜索框：离开 Hero 搜索区后淡入，随时发起搜索 -->
      <Transition name="compact">
        <form
          v-if="showSearch && navConfig.showSearch"
          ref="formRef"
          class="glass mx-1.5 flex h-8.5 min-w-0 flex-1 items-center rounded-full pr-1 ring-1 ring-default transition-shadow focus-within:ring-2 focus-within:ring-primary/40 sm:mx-3"
          role="search"
          @submit.prevent="submit"
        >
          <!-- 搜索引擎下拉：位于搜索框最前面 -->
          <EngineSelect v-model="engine" :engines="engines" compact />

          <UInput
            v-model="keyword"
            variant="none"
            size="sm"
            class="min-w-0 flex-1"
            :ui="{ base: 'h-8.5 px-3 ring-0' }"
            :placeholder="compactPlaceholder"
            aria-label="搜索关键词"
            @keydown.enter="submit"
          />

          <!-- 清除按钮：有输入内容时才出现 -->
          <Transition name="clear-pop">
            <UButton
              v-if="keyword"
              color="neutral"
              variant="ghost"
              size="xs"
              class="size-7 shrink-0 rounded-full p-0"
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
            size="xs"
            class="size-7 shrink-0 rounded-full p-0"
            :icon="isSiteEngine ? 'i-lucide-search' : 'i-lucide-arrow-up-right'"
            :aria-label="isSiteEngine ? '站内搜索' : '跳转搜索'"
          />
        </form>
      </Transition>

      <UButton
        v-if="navConfig.showThemeToggle"
        class="shrink-0"
        color="neutral"
        variant="ghost"
        size="md"
        :icon="toggleIcon"
        :aria-label="toggleLabel"
        :title="toggleLabel"
        @click="toggleTheme"
      />
    </div>
  </header>
</template>

<style scoped>
/* 紧凑搜索框淡入 / 淡出 */
.compact-enter-active,
.compact-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.compact-enter-from,
.compact-leave-to {
  opacity: 0;
  transform: scaleX(0.85);
  transform-origin: right center;
}

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
