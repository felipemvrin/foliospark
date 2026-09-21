import type { Portfolio } from '../types/portfolio'
import { getSafeExternalHref } from './links'

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

  if ('services' in value && value.services !== undefined) {
    return value
  }

  return {
    ...value,
    services: [],
  }
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
    )
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