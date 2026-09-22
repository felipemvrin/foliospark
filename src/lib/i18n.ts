export type Locale = 'es' | 'en'

export interface TranslationDictionary {
  home: {
    heroEyebrow: string
    exploreWork: string
    startProject: string
    workEyebrow: string
    workTitle: string
    workDescription: string
    trustTitle: string
    trustDescription: string
    trustPoints: ReadonlyArray<{
      value: string
      label: string
    }>
    trustedBy: string
    experienceEyebrow: string
    experienceTitle: string
    experienceDescription: string
    resumeTitle: string
    resumeDescription: string
    printPdf: string
    contact: string
    experience: string
    experienceDescriptionShort: string
    education: string
    capabilities: string
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
    selectOption: string
    missingEmailAddress: string
    missingPhoneNumber: string
    addEmailBeforeInquiry: string
    emailClientOpening: string
    projectInquiryFallback: string
    notSpecified: string
    projectTypeOptions: readonly string[]
    budgetOptions: readonly string[]
    timelineOptions: readonly string[]
    faqItems: ReadonlyArray<{
      question: string
      answer: string
    }>
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
      workEyebrow: 'Proyectos seleccionados',
      workTitle: 'Diseñado para captar atención, creado para generar confianza.',
      workDescription: 'Una combinación cuidada de narrativa de portfolio y pensamiento de producto: cada proyecto busca ser editorial, útil y memorable.',
      trustTitle: 'Elegido por equipos que buscan claridad, cuidado e impulso.',
      trustDescription: 'FolioSpark está pensado para quienes quieren que su trabajo se perciba premium sin procesos lentos ni frágiles. El resultado es una historia más sólida, menos fricción y un sitio que ayuda a los clientes a avanzar.',
      trustPoints: [
        { value: '14', label: 'lanzamientos de marca' },
        { value: '1–3 sem.', label: 'plazo habitual de entrega' },
        { value: '4.9/5', label: 'satisfacción de clientes' },
      ],
      trustedBy: 'Han confiado en nosotros',
      experienceEyebrow: 'Trayectoria',
      experienceTitle: 'Una carrera definida por sistemas e historias.',
      experienceDescription: 'Desde el diseño de producto hasta la narrativa de marca, cada etapa se construye con claridad, oficio y resultados relevantes.',
      resumeTitle: 'Una vista concisa del trabajo detrás del trabajo.',
      resumeDescription: 'Un resumen práctico para reclutadores, colaboradores y equipos que buscan liderazgo de diseño reflexivo con alcance técnico.',
      printPdf: 'Imprimir / PDF',
      contact: 'Contacto',
      experience: 'Experiencia',
      experienceDescriptionShort: 'Roles y responsabilidades seleccionados.',
      education: 'Formación',
      capabilities: 'Capacidades',
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
      selectOption: 'Selecciona una opción',
      missingEmailAddress: 'Agrega un email',
      missingPhoneNumber: 'Agrega un teléfono',
      addEmailBeforeInquiry: 'Agrega un email antes de enviar una consulta.',
      emailClientOpening: 'Se está abriendo tu cliente de email.',
      projectInquiryFallback: 'Consulta de proyecto',
      notSpecified: 'No especificado',
      projectTypeOptions: ['Posicionamiento de marca', 'Experiencia de portfolio', 'Narrativa de producto', 'Otro'],
      budgetOptions: ['Menos de $2,500', '$2,500 – $5,000', '$5,000 – $10,000', '$10,000+'],
      timelineOptions: ['Explorando', 'En 1 mes', '1–3 meses', '3+ meses'],
      faqItems: [
        {
          question: '¿Qué tipo de proyectos encajan mejor con FolioSpark?',
          answer:
            'Está pensado para creativos, founders y equipos de producto que necesitan una presencia online premium, editorial, creíble y lista para convertir sin depender de un CMS a medida.',
        },
        {
          question: '¿Cuánto suele tardar la creación de un portfolio?',
          answer:
            'La mayoría de los proyectos duran entre una y tres semanas según la profundidad del contenido, las revisiones y cuánto de la dirección editorial ya esté definido.',
        },
        {
          question: '¿Puedo editar el contenido después del lanzamiento?',
          answer:
            'Sí. El producto está construido sobre datos estructurados, así que el portfolio se puede actualizar fácilmente sin reescribir toda la estructura de la página ni el sistema de diseño.',
        },
        {
          question: '¿El sitio es seguro y está listo para producción?',
          answer:
            'El frontend sigue un enfoque centrado en validación, enlaces externos seguros, uso controlado del entorno y analítica enfocada en privacidad. Para reforzar un despliegue real, también recomendamos headers a nivel de hosting y autenticación backend para la publicación hospedada.',
        },
      ],
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
      workEyebrow: 'Selected work',
      workTitle: 'Designed for attention, built for trust.',
      workDescription: 'A refined mix of portfolio storytelling and product thinking — each project is designed to feel editorial, useful, and distinctly memorable.',
      trustTitle: 'Used by teams that need clarity, polish, and momentum.',
      trustDescription: 'FolioSpark was designed for people who want their work to feel premium without a slow, fragile production process. The result is a better story, less friction, and a site that helps clients take action.',
      trustPoints: [
        { value: '14', label: 'brand launches' },
        { value: '1–3w', label: 'typical delivery window' },
        { value: '4.9/5', label: 'client satisfaction' },
      ],
      trustedBy: 'Trusted by',
      experienceEyebrow: 'Experience',
      experienceTitle: 'A career shaped by systems and story.',
      experienceDescription: 'From product design to brand narrative, each chapter is built around clarity, craft, and meaningful outcomes.',
      resumeTitle: 'A concise view of the work behind the work.',
      resumeDescription: 'A practical snapshot for recruiters, collaborators, and teams looking for thoughtful design leadership with technical range.',
      printPdf: 'Print / PDF',
      contact: 'Contact',
      experience: 'Experience',
      experienceDescriptionShort: 'Selected roles and responsibilities.',
      education: 'Education',
      capabilities: 'Capabilities',
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
      selectOption: 'Select an option',
      missingEmailAddress: 'Add an email address',
      missingPhoneNumber: 'Add a phone number',
      addEmailBeforeInquiry: 'Add an email address before sending an inquiry.',
      emailClientOpening: 'Your email client is opening.',
      projectInquiryFallback: 'Project inquiry',
      notSpecified: 'Not specified',
      projectTypeOptions: ['Brand positioning', 'Portfolio experience', 'Product narrative', 'Something else'],
      budgetOptions: ['Under $2,500', '$2,500 – $5,000', '$5,000 – $10,000', '$10,000+'],
      timelineOptions: ['Exploring', 'Within 1 month', '1–3 months', '3+ months'],
      faqItems: [
        {
          question: 'What kind of projects are best suited for FolioSpark?',
          answer:
            'It is designed for creatives, founders, and product teams who need a premium online presence that feels editorial, credible, and conversion-ready without requiring a custom CMS build.',
        },
        {
          question: 'How long does a portfolio build usually take?',
          answer:
            'Most engagements run from one to three weeks depending on content depth, revisions, and how much of the editorial direction is already defined.',
        },
        {
          question: 'Can I edit the content after launch?',
          answer:
            'Yes. The product is built around structured data, so the portfolio is easy to update without rewriting the entire page structure or design system.',
        },
        {
          question: 'Is the site secure and production-ready?',
          answer:
            'The frontend follows a validation-first approach with safe external links, controlled environment usage, and a privacy-focused analytics model. For production hardening, we also recommend deployment-level headers and backend auth for hosted publishing.',
        },
      ],
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
