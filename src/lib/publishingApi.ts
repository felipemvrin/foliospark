import type { Portfolio } from '../types/portfolio'
import type { ThemePresetName } from '../types/theme'
import { isPortfolio } from './portfolioTransfer'
import { normalizePublicSlug } from './publicPreview'

export interface PublishedPortfolio {
  portfolio: Portfolio
  theme: ThemePresetName
  slug: string
}

function getEndpoint() {
  const value = import.meta.env.VITE_PUBLISHING_API_URL?.trim()
  return value ? value.replace(/\/$/, '') : null
}

function isThemePreset(value: unknown): value is ThemePresetName {
  return value === 'Minimal' || value === 'Mono' || value === 'Editorial' || value === 'Dark' || value === 'Experimental'
}

function parsePublishedPortfolio(value: unknown, fallbackSlug: string): PublishedPortfolio {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('portfolio' in value) ||
    !('theme' in value) ||
    !isPortfolio(value.portfolio) ||
    !isThemePreset(value.theme)
  ) {
    throw new Error('Publishing API returned an invalid portfolio')
  }

  const rawSlug = 'slug' in value && typeof value.slug === 'string' ? value.slug : fallbackSlug

  return {
    portfolio: value.portfolio,
    theme: value.theme,
    slug: normalizePublicSlug(rawSlug),
  }
}

function getPublishedUrl(endpoint: string, slug: string) {
  return `${endpoint}/portfolios/${encodeURIComponent(normalizePublicSlug(slug))}`
}

function getRequiredPublishedSlugSource(slug: string) {
  if (normalizePublicSlug(slug) === 'portfolio') {
    throw new Error('Add a name or custom slug before publishing.')
  }

  return slug
}

export function getPublishingApiUrl() {
  return getEndpoint()
}

export function isPublishedView(search: string) {
  return new URLSearchParams(search).get('view') === 'published'
}

export function getPublishedPortfolioHref(slug: string, baseUrl = typeof window !== 'undefined' ? window.location.href : 'https://example.com') {
  const endpoint = getEndpoint()

  if (!endpoint) {
    return null
  }

  const url = new URL(baseUrl)

  url.hash = ''
  url.search = ''
  url.searchParams.set('view', 'published')
  url.searchParams.set('slug', normalizePublicSlug(slug))
  return url.toString()
}

export async function fetchPublishedPortfolio(slug: string, signal?: AbortSignal): Promise<PublishedPortfolio> {
  const endpoint = getEndpoint()

  if (!endpoint) {
    throw new Error('Publishing API is not configured')
  }

  const response = await fetch(getPublishedUrl(endpoint, slug), {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Published portfolio request failed with ${response.status}`)
  }

  return parsePublishedPortfolio(await response.json(), slug)
}

export async function publishPortfolio(
  slug: string,
  portfolio: Portfolio,
  theme: ThemePresetName,
  signal?: AbortSignal,
): Promise<PublishedPortfolio> {
  const endpoint = getEndpoint()

  if (!endpoint) {
    throw new Error('Publishing API is not configured')
  }

  const publishSlugSource = getRequiredPublishedSlugSource(slug)
  const normalizedSlug = normalizePublicSlug(publishSlugSource)
  const response = await fetch(getPublishedUrl(endpoint, publishSlugSource), {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolio, theme, slug: normalizedSlug }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Portfolio publish request failed with ${response.status}`)
  }

  return parsePublishedPortfolio(await response.json(), publishSlugSource)
}
