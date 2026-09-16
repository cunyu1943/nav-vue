import { createApp } from 'vue'
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import { navConfig } from '@/composables/useSiteData'
import { resolveAssetUrl } from '@/utils/icon'
import './styles/main.css'

/**
 * iconfont：配置了 nav.iconfontUrl 才注入样式表
 *
 * 支持 iconfont.cn 的 CDN 地址（//at.alicdn.com/t/c/font_xxx.css）
 * 或放入 public/ 的相对路径（如 iconfont/iconfont.css）；
 * 早于应用挂载注入，避免图标首屏闪烁。
 */
if (navConfig.iconfontUrl) {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = resolveAssetUrl(navConfig.iconfontUrl)
  document.head.appendChild(link)
}

createApp(App).use(ui).mount('#app')
