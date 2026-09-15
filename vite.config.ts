/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import nuxtui from '@nuxt/ui/vite'

/**
 * 部署 base 路径：
 * - GitHub Pages 项目页（https://<user>.github.io/<repo>/）需要以仓库名为前缀，
 *   默认 '/vue-nav/'，仓库改名时可通过环境变量 VITE_BASE 覆盖；
 * - 自定义域名 / 用户页（<user>.github.io）根路径部署时设 VITE_BASE=/
 */
const base = process.env.VITE_BASE || '/vue-nav/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    // 无路由的单页导航站：关闭 vue-router 集成（Link 渲染为普通 <a>）
    nuxtui({ router: false }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
})
