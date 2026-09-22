import type { Portfolio, SiteSettings } from '../types/portfolio'
import { createDefaultSiteSettings } from '../data/siteSettings'
import { getSafeExternalHref, getSafeFooterHref } from './links'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function hasStringField(value: Record<string, unknown>, key: string) {
  return typeof value[key] === 'string'
}

function hasOptionalStringField(value: Record<string, unknown>, key: string) {
  return value[key] === undefined || typeof value[key] === 'string'
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isCaseStudy(value: unknown) {
  return (
    isRecord(value) &&
    hasStringField(value, 'challenge') &&
    hasStringField(value, 'approach') &&
    hasStringField(value, 'outcome') &&
    Array.isArray(value.metrics) &&
    value.metrics.every((metric) => isRecord(metric) && hasStringField(metric, 'value') && hasStringField(metric, 'label'))
  )
}

function isSafeNavigationTarget(value: string) {
  const target = value.trim()

  if (!target) {
    return false
  }

  if (target.startsWith('#')) {
    return true
  }

  return Boolean(getSafeExternalHref(target))
}

function isSafeNavigationTargetField(value: Record<string, unknown>, key: string) {
  return typeof value[key] === 'string' && isSafeNavigationTarget(value[key])
}

function isSafeFooterTargetField(value: Record<string, unknown>, key: string) {
  return typeof value[key] === 'string' && Boolean(getSafeFooterHref(value[key]))
}

function isSiteSettings(value: unknown): value is SiteSettings {
  return (
    isRecord(value) &&
    hasStringField(value, 'title') &&
    hasStringField(value, 'description') &&
    hasStringField(value, 'logoText') &&
    hasStringField(value, 'logoMark') &&
    hasOptionalStringField(value, 'faviconUrl') &&
    isSafeUrlField(value, 'faviconUrl', false) &&
    isRecord(value.navigation) &&
    typeof value.navigation.visible === 'boolean' &&
    hasStringField(value.navigation, 'ctaLabel') &&
    hasStringField(value.navigation, 'ctaTarget') &&
    isSafeNavigationTargetField(value.navigation, 'ctaTarget') &&
    Array.isArray(value.navigation.items) &&
    value.navigation.items.every(
      (item) =>
        isRecord(item) &&
        hasStringField(item, 'id') &&
        hasStringField(item, 'label') &&
        hasStringField(item, 'target') &&
        isSafeNavigationTargetField(item, 'target') &&
        typeof item.visible === 'boolean',
    ) &&
    isRecord(value.footer) &&
    typeof value.footer.visible === 'boolean' &&
    hasStringField(value.footer, 'copyright') &&
    hasStringField(value.footer, 'tagline') &&
    typeof value.footer.showLocation === 'boolean' &&
    typeof value.footer.showSocialLinks === 'boolean' &&
    Array.isArray(value.footer.links) &&
    value.footer.links.every(
      (link) =>
        isRecord(link) &&
        hasStringField(link, 'id') &&
        hasStringField(link, 'label') &&
        isSafeFooterTargetField(link, 'target') &&
        typeof link.visible === 'boolean',
    ) &&
    Array.isArray(value.sections) &&
    value.sections.every(
      (section) =>
        isRecord(section) &&
        hasStringField(section, 'id') &&
        typeof section.visible === 'boolean',
    )
  )
}

function isSafeUrlField(value: Record<string, unknown>, key: string, required = true) {
  if (typeof value[key] !== 'string') {
    return !required && value[key] === undefined
  }

  return !value[key] || Boolean(getSafeExternalHref(value[key]))
}

function withLegacyPortfolioDefaults(value: unknown): unknown {
  if (!isRecord(value)) {
    return value
  }

  const normalized: Record<string, unknown> = { ...value }

  if (!('services' in normalized) || normalized.services === undefined) {
    normalized.services = []
  }

  if (isRecord(normalized.siteSettings) && (!('sections' in normalized.siteSettings) || normalized.siteSettings.sections === undefined)) {
    normalized.siteSettings = {
      ...normalized.siteSettings,
      sections: createDefaultSiteSettings().sections,
    }
  }

  if (isRecord(normalized.siteSettings) && isRecord(normalized.siteSettings.footer) && (!('links' in normalized.siteSettings.footer) || normalized.siteSettings.footer.links === undefined)) {
    normalized.siteSettings = {
      ...normalized.siteSettings,
      footer: {
        ...normalized.siteSettings.footer,
        links: [],
      },
    }
  }

  return normalized
}

export function isPortfolio(value: unknown): value is Portfolio {
  if (!isRecord(value) || !isRecord(value.profile)) {
    return false
  }

  if (
    !hasStringField(value.profile, 'name') ||
    !hasStringField(value.profile, 'role') ||
    !hasStringField(value.profile, 'headline') ||
    !hasStringField(value.profile, 'bio') ||
    !hasStringField(value.profile, 'location') ||
    !hasStringField(value.profile, 'email') ||
    !hasStringField(value.profile, 'phone') ||
    !hasStringField(value.profile, 'website') ||
    !hasOptionalStringField(value.profile, 'siteUrl') ||
    !hasOptionalStringField(value.profile, 'slug') ||
    !hasStringField(value.profile, 'photo') ||
    !isSafeUrlField(value.profile, 'website', false) ||
    !isSafeUrlField(value.profile, 'siteUrl', false) ||
    !isSafeUrlField(value.profile, 'photo', false)
  ) {
    return false
  }

  return (
    Array.isArray(value.metrics) &&
    value.metrics.every((entry) => isRecord(entry) && hasStringField(entry, 'value') && hasStringField(entry, 'label')) &&
    isStringArray(value.about) &&
    Array.isArray(value.process) &&
    value.process.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'title') &&
        hasStringField(entry, 'description') &&
        hasStringField(entry, 'detail'),
    ) &&
    Array.isArray(value.testimonials) &&
    value.testimonials.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'quote') &&
        hasStringField(entry, 'name') &&
        hasStringField(entry, 'role') &&
        hasStringField(entry, 'company'),
    ) &&
    Array.isArray(value.services) &&
    value.services.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'name') &&
        hasStringField(entry, 'price') &&
        hasStringField(entry, 'description') &&
        isStringArray(entry.features) &&
        (entry.featured === undefined || typeof entry.featured === 'boolean'),
    ) &&
    Array.isArray(value.experience) &&
    value.experience.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'company') &&
        hasStringField(entry, 'role') &&
        hasStringField(entry, 'period') &&
        hasStringField(entry, 'description') &&
        isStringArray(entry.technologies),
    ) &&
    Array.isArray(value.education) &&
    value.education.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'institution') &&
        hasStringField(entry, 'degree') &&
        hasStringField(entry, 'period') &&
        hasStringField(entry, 'description'),
    ) &&
    Array.isArray(value.skills) &&
    value.skills.every(
      (entry) => isRecord(entry) && hasStringField(entry, 'category') && isStringArray(entry.items),
    ) &&
    Array.isArray(value.projects) &&
    value.projects.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'title') &&
        hasStringField(entry, 'category') &&
        hasStringField(entry, 'year') &&
        hasStringField(entry, 'description') &&
        hasStringField(entry, 'image') &&
        isStringArray(entry.technologies) &&
        isSafeUrlField(entry, 'image') &&
        (entry.caseStudy === undefined || isCaseStudy(entry.caseStudy)) &&
        hasOptionalStringField(entry, 'website') &&
        hasOptionalStringField(entry, 'github') &&
        hasOptionalStringField(entry, 'behance') &&
        isSafeUrlField(entry, 'website', false) &&
        isSafeUrlField(entry, 'github', false) &&
        isSafeUrlField(entry, 'behance', false),
    ) &&
    Array.isArray(value.githubProjects) &&
    value.githubProjects.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'repository') &&
        hasStringField(entry, 'description') &&
        hasStringField(entry, 'language') &&
        typeof entry.stars === 'number' &&
        Number.isFinite(entry.stars) &&
        typeof entry.forks === 'number' &&
        Number.isFinite(entry.forks) &&
        hasStringField(entry, 'url') &&
        hasStringField(entry, 'updatedAt') &&
        isSafeUrlField(entry, 'url'),
    ) &&
    Array.isArray(value.behanceProjects) &&
    value.behanceProjects.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'title') &&
        hasStringField(entry, 'description') &&
        hasStringField(entry, 'cover') &&
        hasStringField(entry, 'url') &&
        hasStringField(entry, 'category') &&
        hasStringField(entry, 'publishedAt') &&
        isStringArray(entry.tags) &&
        isSafeUrlField(entry, 'cover') &&
        isSafeUrlField(entry, 'url'),
    ) &&
    Array.isArray(value.socialLinks) &&
    value.socialLinks.every(
      (entry) =>
        isRecord(entry) &&
        hasStringField(entry, 'platform') &&
        hasStringField(entry, 'label') &&
        hasStringField(entry, 'url') &&
        isSafeUrlField(entry, 'url'),
    ) &&
    (value.siteSettings === undefined || isSiteSettings(value.siteSettings))
  )
}

export function parsePortfolio(value: unknown): Portfolio | null {
  const normalizedValue = withLegacyPortfolioDefaults(value)
  return isPortfolio(normalizedValue) ? normalizedValue : null
}

export function downloadPortfolio(data: Portfolio) {
  const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = url
  link.download = 'foliospark-portfolio.json'
  link.click()
  URL.revokeObjectURL(url)
}