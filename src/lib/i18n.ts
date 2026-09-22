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

export function getLocale(value: Locale | undefined): Locale {
  return value === 'en' ? 'en' : 'es'
}

export function getTranslations(locale: Locale | undefined): TranslationDictionary {
  return translations[getLocale(locale)]
}
