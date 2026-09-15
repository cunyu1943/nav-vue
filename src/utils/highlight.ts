/**
 * 文本关键词高亮工具：把文本按关键词切分为「命中/未命中」片段序列
 * 大小写不敏感；用于卡片名称与描述的搜索命中高亮
 */
export interface HighlightSegment {
  text: string
  /** 该片段是否命中关键词 */
  hit: boolean
}

export function splitHighlight(text: string, keyword: string): HighlightSegment[] {
  const kw = keyword.trim().toLowerCase()
  if (!kw) return [{ text, hit: false }]

  const segments: HighlightSegment[] = []
  let rest = text

  while (rest.length > 0) {
    const idx = rest.toLowerCase().indexOf(kw)
    if (idx === -1) {
      segments.push({ text: rest, hit: false })
      break
    }
    if (idx > 0) {
      segments.push({ text: rest.slice(0, idx), hit: false })
    }
    segments.push({ text: rest.slice(idx, idx + kw.length), hit: true })
    rest = rest.slice(idx + kw.length)
  }

  return segments
}
