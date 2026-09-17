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

/**
 * 分类图标的旧短名兼容表
 *
 * 早期版本的分类图标写的是 star / tool 这类短名，由组件内的 ICON_MAP 转成 emoji。
 * 现在分类图标已与顶栏统一为同一种写法，这里把旧短名映射到等价的 Iconify 名，
 * 避免沿用旧写法的配置静默失效（渲染不出任何图标）。
 */
const LEGACY_ICON_ALIASES: Record<string, string> = {
  star: 'i-lucide-star',
  tool: 'i-lucide-tool-case',
  book: 'i-lucide-book-open',
  palette: 'i-lucide-palette',
  news: 'i-lucide-newspaper',
  cloud: 'i-lucide-cloud',
  code: 'i-lucide-code',
}

/**
 * 归一化图标写法：旧短名转成等价的 Iconify 名，其余写法原样返回
 *
 * 供 NavIcon 使用，让分类图标与顶栏链接支持完全相同的三种写法：
 * Iconify 图标名 / 字体图标类名（iconfont）/ 图片地址。
 */
export function normalizeIcon(icon?: string): string | undefined {
  const v = icon?.trim()
  if (!v) return undefined
  return LEGACY_ICON_ALIASES[v] ?? v
}
