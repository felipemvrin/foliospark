import { describe, expect, it } from 'vitest'

import { getPreferredSafeExternalHref, getSafeExternalHref } from './links'

describe('getSafeExternalHref', () => {
  it('normalizes bare hostnames to https urls', () => {
    expect(getSafeExternalHref('astervale.studio/work')).toBe('https://astervale.studio/work')
  })

  it('rejects non-http protocols', () => {
    expect(getSafeExternalHref('javascript:alert(1)')).toBeNull()
  })

  it('falls back to the next valid external url', () => {
    expect(getPreferredSafeExternalHref('javascript:alert(1)', 'github.com/felipemvrin/foliospark')).toBe('https://github.com/felipemvrin/foliospark')
  })
})
