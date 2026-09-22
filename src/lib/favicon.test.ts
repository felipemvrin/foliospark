import { describe, expect, it } from 'vitest'

import { getGeneratedFaviconHref } from './favicon'

describe('generated favicon', () => {
  it('creates an encoded SVG favicon with the configured mark and colors', () => {
    const href = getGeneratedFaviconHref('<A', '#b77852', '#171717')

    expect(href.startsWith('data:image/svg+xml,')).toBe(true)
    expect(decodeURIComponent(href)).toContain('&lt;A')
    expect(decodeURIComponent(href)).toContain('#b77852')
    expect(decodeURIComponent(href)).toContain('#171717')
  })

  it('uses a fallback mark when the configured mark is empty', () => {
    expect(decodeURIComponent(getGeneratedFaviconHref('', '#fff', '#111'))).toContain('>F</text>')
  })
})