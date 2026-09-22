import { describe, expect, it } from 'vitest'

import { getLocale, getTranslations, resolveLocalizedCtaLabel, resolveLocalizedFooterTagline, resolveLocalizedNavLabel } from './i18n'

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

  it('localizes default navigation labels but preserves custom labels', () => {
    expect(resolveLocalizedNavLabel('about', 'About', 'es')).toBe('Sobre mí')
    expect(resolveLocalizedNavLabel('about', 'Sobre mí', 'en')).toBe('About')
    expect(resolveLocalizedNavLabel('about', 'Quién soy', 'en')).toBe('Quién soy')
  })

  it('localizes default CTA and footer copy but preserves custom values', () => {
    expect(resolveLocalizedCtaLabel('Start a project', 'es')).toBe('Iniciar un proyecto')
    expect(resolveLocalizedCtaLabel('Comencemos', 'en')).toBe('Comencemos')
    expect(resolveLocalizedFooterTagline('Your professional story, in motion.', 'es')).toBe('Tu historia profesional, en movimiento.')
    expect(resolveLocalizedFooterTagline('A handcrafted tagline', 'es')).toBe('A handcrafted tagline')
  })
})