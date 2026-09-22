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

  it('provides localized FAQ and contact-form shell copy for the home page', () => {
    const spanish = getTranslations('es').home
    const english = getTranslations('en').home

    expect(spanish.selectOption).toBe('Selecciona una opción')
    expect(spanish.projectTypeOptions).toEqual(['Posicionamiento de marca', 'Experiencia de portfolio', 'Narrativa de producto', 'Otro'])
    expect(spanish.timelineOptions).toEqual(['Explorando', 'En 1 mes', '1–3 meses', '3+ meses'])
    expect(spanish.faqItems[0]?.question).toBe('¿Qué tipo de proyectos encajan mejor con FolioSpark?')
    expect(spanish.faqItems).toHaveLength(4)

    expect(english.selectOption).toBe('Select an option')
    expect(english.projectInquiryFallback).toBe('Project inquiry')
    expect(english.faqItems[3]?.question).toBe('Is the site secure and production-ready?')
  })

  it('provides localized work-section copy', () => {
    expect(getTranslations('es').home.workEyebrow).toBe('Proyectos seleccionados')
    expect(getTranslations('es').home.workTitle).toBe('Diseñado para captar atención, creado para generar confianza.')
    expect(getTranslations('es').home.readCaseStudy).toBe('Ver caso de estudio')
    expect(getTranslations('es').home.challenge).toBe('Desafío')
    expect(getTranslations('en').home.workEyebrow).toBe('Selected work')
    expect(getTranslations('en').home.viewProject).toBe('View project')
  })

  it('provides localized trust-section copy', () => {
    expect(getTranslations('es').home.trustPoints[1]).toEqual({ value: '1–3 sem.', label: 'plazo habitual de entrega' })
    expect(getTranslations('es').home.trustedBy).toBe('Han confiado en nosotros')
    expect(getTranslations('en').home.trustTitle).toBe('Used by teams that need clarity, polish, and momentum.')
  })

  it('provides localized experience and resume interface copy', () => {
    expect(getTranslations('es').home.experienceEyebrow).toBe('Trayectoria')
    expect(getTranslations('es').home.printPdf).toBe('Imprimir / PDF')
    expect(getTranslations('en').home.capabilities).toBe('Capabilities')
  })
})