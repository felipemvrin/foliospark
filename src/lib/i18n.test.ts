import { describe, expect, it } from 'vitest'

import { getLocale, getTranslations } from './i18n'

describe('i18n', () => {
  it('defaults unknown locales to Spanish', () => {
    expect(getLocale(undefined)).toBe('es')
    expect(getLocale('fr' as never)).toBe('es')
    expect(getTranslations(undefined).nav.about).toBe('Sobre mí')
  })

  it('returns the English dictionary when explicitly selected', () => {
    expect(getLocale('en')).toBe('en')
    expect(getTranslations('en').nav.about).toBe('About')
  })
})