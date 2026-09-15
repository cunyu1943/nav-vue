/**
 * logo 地址解析与降级策略
 *
 * 优先级：
 * 1. 配置了完整 URL（http/https）→ 直接使用
 * 2. 配置了相对路径（logos/xx.png）→ 使用 public/logos/ 下的本地文件（自动拼接 base）
 * 3. 未配置 → 使用在线 favicon 服务按域名获取
 * 4. 以上全部加载失败 → SiteCard 内部降级为首字母头像
 */

/** 在线 favicon 服务（可替换为你自建或其它服务） */
const FAVICON_SERVICE = 'https://favicon.im'

import { resolveAssetUrl } from '@/utils/icon'

/** 取 URL 的主机名，非法 URL 返回空串 */
function getDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

/** 解析站点 logo 的最终 src */
export function resolveLogo(site: { url: string; logo?: string }): string {
  const logo = site.logo?.trim()
  if (logo) {
    // 在线图片或本地图片（public/ 目录），BASE_URL 自动适配 GitHub Pages 子路径
    if (/^https?:\/\//i.test(logo)) return logo
    return resolveAssetUrl(logo)
  }
  // 未配置 → favicon 服务
  const domain = getDomain(site.url)
  return domain ? `${FAVICON_SERVICE}/${domain}?larger=true` : ''
}

/** 字母头像调色板（柔和的渐变起止色） */
const AVATAR_COLORS: [string, string][] = [
  ['#6a8dff', '#4c6ef5'],
  ['#ff9a76', '#f56c6c'],
  ['#67c98f', '#3eb575'],
  ['#f7c65d', '#e6a23c'],
  ['#b18cff', '#7c4dff'],
  ['#5bc8f5', '#2f9fd6'],
  ['#f58fb0', '#e0568f'],
  ['#8fd3a8', '#4caf7d'],
]

/** 根据字符串生成稳定的 hash */
function hashString(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/** 生成首字母头像（SVG data URI），图片加载失败时的最终降级 */
export function letterAvatar(name: string): string {
  const first = name.trim().charAt(0).toUpperCase() || '?'
  const [from, to] = AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="96" height="96" rx="22" fill="url(#g)"/><text x="48" y="62" font-family="'PingFang SC','Microsoft YaHei',sans-serif" font-size="42" font-weight="600" fill="#ffffff" text-anchor="middle">${first}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
