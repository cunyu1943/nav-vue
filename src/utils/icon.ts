/**
 * 静态资源地址解析（引擎图标等 public/ 资源通用）
 *
 * - 完整 URL（http/https）→ 直接使用
 * - 相对路径（engines/bing.svg）→ 自动拼接 BASE_URL（适配 GitHub Pages 子路径）
 * - 空值 → 返回空串（调用方自行降级）
 */
export function resolveAssetUrl(path?: string): string {
  const p = path?.trim()
  if (!p) return ''
  if (/^https?:\/\//i.test(p)) return p
  return `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
}
