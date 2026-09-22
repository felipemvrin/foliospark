import { describe, expect, it } from 'vitest'

import { getNextVisibleSectionTops, getTopmostVisibleSectionId } from './adminSectionNavigation'

describe('adminSectionNavigation', () => {
  it('keeps previously visible sections when only one entry changes', () => {
    const current = new Map([
      ['site-settings', 100],
      ['section-settings', 280],
    ])

    const next = getNextVisibleSectionTops(current, [
      { id: 'section-settings', isIntersecting: true, top: 150 },
    ])

    expect(getTopmostVisibleSectionId(next)).toBe('site-settings')
  })

  it('removes sections that are no longer intersecting', () => {
    const current = new Map([
      ['site-settings', 100],
      ['section-settings', 280],
    ])

    const next = getNextVisibleSectionTops(current, [
      { id: 'site-settings', isIntersecting: false, top: 100 },
    ])

    expect(getTopmostVisibleSectionId(next)).toBe('section-settings')
  })
})
