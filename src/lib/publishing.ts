import { getSafeExternalHref, getMailtoHref } from './links'
import { normalizePublicSlug } from './publicPreview'
import type { Portfolio } from '../types/portfolio'

export type PublishingCheckStatus = 'ready' | 'warning' | 'blocked'

export interface PublishingCheck {
  id: string
  label: string
  detail: string
  status: PublishingCheckStatus
}

export interface PublishingReadiness {
  checks: PublishingCheck[]
  completed: number
  total: number
  status: PublishingCheckStatus
}

function hasText(value: string | undefined) {
  return Boolean(value?.trim())
}

export function getPublishingReadiness(data: Portfolio): PublishingReadiness {
  const checks: PublishingCheck[] = [
    {
      id: 'identity',
      label: 'Profile identity',
      detail: hasText(data.profile.name) && hasText(data.profile.role)
        ? 'Name and role are ready to appear in the hero.'
        : 'Add your name and role before sharing the portfolio.',
      status: hasText(data.profile.name) && hasText(data.profile.role) ? 'ready' : 'blocked',
    },
    {
      id: 'story',
      label: 'Portfolio story',
      detail: hasText(data.profile.bio) && data.about.some(hasText)
        ? 'Your profile has a clear introduction and supporting story.'
        : 'Add a bio and at least one About paragraph for context.',
      status: hasText(data.profile.bio) && data.about.some(hasText) ? 'ready' : 'warning',
    },
    {
      id: 'work',
      label: 'Featured work',
      detail: data.projects.some((project) => hasText(project.title) && hasText(project.description) && hasText(project.image))
        ? 'At least one project has the content needed for a strong card.'
        : 'Add one complete project with a title, description, and image.',
      status: data.projects.some((project) => hasText(project.title) && hasText(project.description) && hasText(project.image))
        ? 'ready'
        : 'blocked',
    },
    {
      id: 'contact',
      label: 'Contact path',
      detail: getMailtoHref(data.profile.email) || data.socialLinks.some((link) => Boolean(getSafeExternalHref(link.url)))
        ? 'Visitors have a valid way to reach or follow you.'
        : 'Add a valid email or social link so visitors can take the next step.',
      status: getMailtoHref(data.profile.email) || data.socialLinks.some((link) => Boolean(getSafeExternalHref(link.url)))
        ? 'ready'
        : 'warning',
    },
    {
      id: 'url',
      label: 'Public URL',
      detail: normalizePublicSlug(data.profile.slug || data.profile.name)
        ? 'Your public preview has a stable, shareable slug.'
        : 'Add a name or custom slug to generate a public URL.',
      status: normalizePublicSlug(data.profile.slug || data.profile.name) !== 'portfolio' || hasText(data.profile.name)
        ? 'ready'
        : 'warning',
    },
  ]

  const completed = checks.filter((check) => check.status === 'ready').length
  const status = checks.some((check) => check.status === 'blocked')
    ? 'blocked'
    : checks.some((check) => check.status === 'warning')
      ? 'warning'
      : 'ready'

  return { checks, completed, total: checks.length, status }
}
