export type Locale = 'es' | 'en'

export interface TranslationDictionary {
  nav: {
    about: string
    work: string
    process: string
    services: string
    github: string
    journal: string
    resume: string
    contact: string
    cta: string
  }
  shell: {
    skipToContent: string
    footerTagline: string
    savedLocally: string
    savingLocally: string
  }
  editor: {
    language: string
    spanish: string
    english: string
    openPublicPreview: string
    copyPublicLink: string
    publishHosted: string
    openHostedPortfolio: string
    exportJson: string
    importJson: string
    resetSampleData: string
  }
}

const translations: Record<Locale, TranslationDictionary> = {
  es: {
    nav: {
      about: 'Sobre mí',
      work: 'Proyectos',
      process: 'Proceso',
      services: 'Servicios',
      github: 'GitHub',
      journal: 'Journal',
      resume: 'Trayectoria',
      contact: 'Contacto',
      cta: 'Iniciar un proyecto',
    },
    shell: {
      skipToContent: 'Saltar al contenido',
      footerTagline: 'Tu historia profesional, en movimiento.',
      savedLocally: 'Guardado localmente',
      savingLocally: 'Guardando localmente…',
    },
    editor: {
      language: 'Idioma',
      spanish: 'Español',
      english: 'Inglés',
      openPublicPreview: 'Abrir preview público',
      copyPublicLink: 'Copiar enlace público',
      publishHosted: 'Publicar online',
      openHostedPortfolio: 'Abrir portfolio publicado',
      exportJson: 'Exportar JSON',
      importJson: 'Importar JSON',
      resetSampleData: 'Restablecer datos de ejemplo',
    },
  },
  en: {
    nav: {
      about: 'About',
      work: 'Work',
      process: 'Process',
      services: 'Services',
      github: 'GitHub',
      journal: 'Journal',
      resume: 'Resume',
      contact: 'Contact',
      cta: 'Start a project',
    },
    shell: {
      skipToContent: 'Skip to content',
      footerTagline: 'Your professional story, in motion.',
      savedLocally: 'Saved locally',
      savingLocally: 'Saving locally…',
    },
    editor: {
      language: 'Language',
      spanish: 'Spanish',
      english: 'English',
      openPublicPreview: 'Open public preview',
      copyPublicLink: 'Copy public link',
      publishHosted: 'Publish hosted',
      openHostedPortfolio: 'Open hosted portfolio',
      exportJson: 'Export JSON',
      importJson: 'Import JSON',
      resetSampleData: 'Reset sample data',
    },
  },
}

const localeVariants: Locale[] = ['es', 'en']
const navigationLabelKeys = ['about', 'work', 'process', 'services', 'github', 'journal', 'resume', 'contact'] as const

function isKnownLocaleVariant(value: string, resolver: (dictionary: TranslationDictionary) => string) {
  const normalizedValue = value.trim()
  return localeVariants.some((locale) => resolver(translations[locale]) === normalizedValue)
}

export function getLocale(value: Locale | undefined): Locale {
  return value === 'en' ? 'en' : 'es'
}

export function getTranslations(locale: Locale | undefined): TranslationDictionary {
  return translations[getLocale(locale)]
}

export function resolveLocalizedNavLabel(id: string, label: string | undefined, locale: Locale | undefined) {
  const key = navigationLabelKeys.find((item) => item === id)
  const trimmedLabel = label?.trim() ?? ''

  if (!key) {
    return trimmedLabel
  }

  const localizedLabel = getTranslations(locale).nav[key]

  if (!trimmedLabel || isKnownLocaleVariant(trimmedLabel, (dictionary) => dictionary.nav[key])) {
    return localizedLabel
  }

  return trimmedLabel
}

export function resolveLocalizedCtaLabel(label: string | undefined, locale: Locale | undefined) {
  const trimmedLabel = label?.trim() ?? ''
  const localizedLabel = getTranslations(locale).nav.cta

  if (!trimmedLabel || isKnownLocaleVariant(trimmedLabel, (dictionary) => dictionary.nav.cta)) {
    return localizedLabel
  }

  return trimmedLabel
}

export function resolveLocalizedFooterTagline(tagline: string | undefined, locale: Locale | undefined) {
  const trimmedTagline = tagline?.trim() ?? ''
  const localizedTagline = getTranslations(locale).shell.footerTagline

  if (!trimmedTagline || isKnownLocaleVariant(trimmedTagline, (dictionary) => dictionary.shell.footerTagline)) {
    return localizedTagline
  }

  return trimmedTagline
}
