// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getColumnCount } from '@/composables/useColumnCount'

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getColumnCount 断点', () => {
  const cases: Array<[number, number]> = [
    [1440, 5],
    [1100, 5],
    [1099, 4],
    [900, 4],
    [899, 3],
    [640, 3],
    [639, 2],
    [480, 2],
    [479, 1],
    [320, 1],
  ]

  for (const [width, expected] of cases) {
    it(`窗口宽度 ${width}px → ${expected} 列`, () => {
      vi.stubGlobal('window', { innerWidth: width })
      expect(getColumnCount()).toBe(expected)
    })
  }
})
