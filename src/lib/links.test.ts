import { describe, expect, it } from 'vitest'

import { getSafeExternalHref } from './links'

describe('getSafeExternalHref', () => {
  it('normalizes bare hostnames to https urls', () => {
    expect(getSafeExternalHref('astervale.studio/work')).toBe('https://astervale.studio/work')
  })

  it('rejects non-http protocols', () => {
    expect(getSafeExternalHref('javascript:alert(1)')).toBeNull()
  })
})
