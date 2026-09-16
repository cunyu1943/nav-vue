/**
 * 静态资源地址解析（引擎图标、iconfont 样式表等 public/ 资源通用）
 *
 * - 完整 URL（https://...）与协议相对地址（//cdn.example.com/...）→ 直接使用
 * - 相对路径（engines/bing.svg）→ 自动拼接 BASE_URL（适配 GitHub Pages 子路径）
 * - 空值 → 返回空串（调用方自行降级）
 */
export function resolveAssetUrl(path?: string): string {
  const p = path?.trim()
  if (!p) return ''
  if (/^(https?:)?\/\//i.test(p)) return p
  return `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
}

/**
 * 判断图标写法是否为图片地址
 *
 * - 完整 URL / 协议相对 URL
 * - 带图片扩展名的相对路径（如 logos/github.svg）
 */
export function isImageIcon(value?: string): boolean {
  const v = value?.trim()
  if (!v) return false
  if (/^(https?:)?\/\//i.test(v)) return true
  return /\.(svg|png|jpe?g|gif|webp|avif|bmp|ico)$/i.test(v)
}

/**
 * 判断是否为 Iconify 图标名（如 i-lucide-github / i-lucide:github）
 *
 * 命中时按名字交给 UIcon 在运行时解析（不依赖编译期扫描，配置在 JSON 里也能生效）；
 * 其余「非空且非图片」的写法按 CSS 类名渲染（iconfont 等字体图标）。
 */
export function isIconifyName(value?: string): value is string {
  const v = value?.trim()
  if (!v) return false
  return /^i-[a-z0-9]+[-:][a-z0-9-]+$/i.test(v)
}
