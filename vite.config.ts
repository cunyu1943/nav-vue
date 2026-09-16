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
    nuxtui({
      router: false,
      icon: {
        clientBundle: {
          /**
           * 默认只扫描源码里的图标名，而本项目的图标写在 JSON 配置里，
           * 因此把数据文件一并纳入扫描范围，让 i-lucide-* 也能打包进本地图标数据
           * （避免运行时请求在线 Iconify API）
           */
          scan: {
            globInclude: ['**/*.{vue,js,ts,json,jsonc}'],
          },
        },
      },
    }),
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
