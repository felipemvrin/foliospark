export type Locale = 'es' | 'en'

export interface TranslationDictionary {
  home: {
    heroEyebrow: string
    exploreWork: string
    startProject: string
    portfolioLabel: string
    currentRole: string
    aboutEyebrow: string
    aboutTitle: string
    profileLabel: string
    overviewLabel: string
    processEyebrow: string
    processTitle: string
    processDescription: string
    servicesEyebrow: string
    servicesTitle: string
    servicesDescription: string
    mostRequested: string
    readyToLaunch: string
    ctaTitle: string
    ctaDescription: string
    faqTitle: string
    contactTitle: string
    emailStudio: string
    sendInquiry: string
    name: string
    email: string
    projectType: string
    budget: string
    timeline: string
    projectBrief: string
  }
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
    home: {
      heroEyebrow: 'Sistema de portfolio profesional',
      exploreWork: 'Ver proyectos',
      startProject: 'Iniciar un proyecto',
      portfolioLabel: 'Portfolio',
      currentRole: 'Rol actual',
      aboutEyebrow: 'Sobre mí',
      aboutTitle: 'Una identidad que evoluciona con tu trabajo.',
      profileLabel: 'Perfil',
      overviewLabel: 'Resumen',
      processEyebrow: 'Proceso',
      processTitle: 'Un proceso creativo claro y cuidado.',
      processDescription: 'Estrategia, identidad e interfaces avanzan juntas desde el descubrimiento hasta el lanzamiento.',
      servicesEyebrow: 'Servicios',
      servicesTitle: 'Una colaboración flexible para el trabajo que importa.',
      servicesDescription: 'Desde el posicionamiento hasta el lanzamiento, cada servicio ayuda a comunicar tu valor con claridad.',
      mostRequested: 'Más solicitado',
      readyToLaunch: 'Listo para empezar',
      ctaTitle: 'Convierte tu trabajo en un activo de negocio más sólido.',
      ctaDescription: 'Si vendes servicios, presentas un estudio o estás construyendo tu siguiente etapa, FolioSpark ayuda a que tu historia tenga la misma credibilidad que tu trabajo.',
      faqTitle: 'Preguntas frecuentes antes de avanzar.',
      contactTitle: 'Construye la historia que acompaña a tu trabajo.',
      emailStudio: 'Iniciar un proyecto',
      sendInquiry: 'Enviar consulta',
      name: 'Nombre',
      email: 'Email',
      projectType: 'Tipo de proyecto',
      budget: 'Presupuesto',
      timeline: 'Plazo',
      projectBrief: 'Brief del proyecto',
    },
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
    home: {
      heroEyebrow: 'Professional portfolio system',
      exploreWork: 'Explore work',
      startProject: 'Start a project',
      portfolioLabel: 'Portfolio',
      currentRole: 'Current role',
      aboutEyebrow: 'About',
      aboutTitle: 'An identity that moves with the work.',
      profileLabel: 'Profile',
      overviewLabel: 'Overview',
      processEyebrow: 'Process',
      processTitle: 'A creative process built to feel clear and premium.',
      processDescription: 'Strategy, identities, and interfaces move together from discovery through launch.',
      servicesEyebrow: 'Services',
      servicesTitle: 'Flexible engagement for the work that matters most.',
      servicesDescription: 'From positioning to launch-ready storytelling, each package helps ambitious teams move with clarity.',
      mostRequested: 'Most requested',
      readyToLaunch: 'Ready to launch',
      ctaTitle: 'Turn your work into a sharper business asset.',
      ctaDescription: 'Whether you are selling a service, outlining a studio, or positioning a next chapter, FolioSpark helps the story feel as credible as the work itself.',
      faqTitle: 'Questions people ask before they move forward.',
      contactTitle: 'Build the story that follows your work.',
      emailStudio: 'Start a project',
      sendInquiry: 'Send inquiry',
      name: 'Name',
      email: 'Email',
      projectType: 'Project type',
      budget: 'Budget range',
      timeline: 'Timeline',
      projectBrief: 'Project brief',
    },
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
