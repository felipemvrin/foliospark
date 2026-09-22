import { describe, expect, it } from 'vitest'

import { getGeneratedFaviconHref, getSiteFaviconHref } from './favicon'

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

  it('uses a valid custom favicon URL instead of the generated fallback', () => {
    expect(getSiteFaviconHref('cdn.example.com/favicon.svg', 'F', '#fff', '#111')).toBe('https://cdn.example.com/favicon.svg')
  })

  it('falls back to the generated favicon when the custom URL is invalid', () => {
    const href = getSiteFaviconHref('javascript:alert(1)', 'F', '#fff', '#111')

    expect(href.startsWith('data:image/svg+xml,')).toBe(true)
    expect(decodeURIComponent(href)).toContain('>F</text>')
  })
})
