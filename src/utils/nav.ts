import type { NavLink } from '@/types'

/**
 * 自定义导航链接的共享辅助函数
 *
 * 桌面端（NavMenu）与移动端（MobileNav）共用同一套判定，
 * 避免两处行为分叉（比如是否新标签页打开、是否带 rel）。
 */

/** 是否配置了子菜单 */
export function hasChildren(link?: NavLink): boolean {
  return !!link?.children?.length
}

/** 站外链接默认新标签页打开（`external: false` 时在当前页打开） */
export function linkTarget(link: NavLink): string | undefined {
  return link.external === false ? undefined : '_blank'
}

/** 站外链接的 rel：配合 target="_blank" 防反向 Tab 劫持 */
export function linkRel(link: NavLink): string | undefined {
  return link.external === false ? undefined : 'noopener noreferrer'
}
