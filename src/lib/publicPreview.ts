import { themePresets } from '../data/themes'
import type { Portfolio } from '../types/portfolio'
import type { ThemePresetName } from '../types/theme'
import { isPortfolio } from './portfolioTransfer'

const publicViewParam = 'public'
const portfolioQueryParam = 'data'
const themeQueryParam = 'theme'
const slugQueryParam = 'slug'

export function normalizePublicSlug(value: string) {
  const normalized = (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/https?:\/\/?/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'portfolio'
}

function encodeJsonPayload(value: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
}

function decodeJsonPayload(value: string) {
  try {
    const bytes = Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown
  } catch {
    return null
  }
}

function isThemePresetName(value: string): value is ThemePresetName {
  return themePresets.some((preset) => preset.id === value)
}

interface PublicPreviewSnapshot {
  portfolio: Portfolio
  theme: ThemePresetName
}

function getPublicPreviewSnapshot(search: string): PublicPreviewSnapshot | null {
  if (!isPublicPreview(search)) {
    return null
  }

  const params = new URLSearchParams(search)
  const encodedPortfolio = params.get(portfolioQueryParam)
  const theme = params.get(themeQueryParam)

  if (!encodedPortfolio || !theme) {
    return null
  }

  const portfolio = decodeJsonPayload(encodedPortfolio)

  if (!isPortfolio(portfolio) || !isThemePresetName(theme)) {
    return null
  }

  return {
    portfolio,
    theme,
  }
}

export function isPublicPreview(search: string) {
  return new URLSearchParams(search).get('view') === publicViewParam
}

export function getPublicPreviewHref(
  data: Portfolio,
  theme: ThemePresetName,
  customSlug?: string,
  baseUrl = typeof window !== 'undefined' ? window.location.href : 'https://example.com',
) {
  const url = new URL(baseUrl)

  // Public preview links reserve the fragment for the canonical vanity slug.
  url.hash = ''
  url.search = ''

  const canonicalSlug = normalizePublicSlug(customSlug || data.profile.slug || data.profile.name || 'portfolio')

  url.searchParams.set('view', publicViewParam)
  url.searchParams.set(themeQueryParam, theme)
  url.searchParams.set(portfolioQueryParam, encodeJsonPayload(data))
  url.searchParams.set(slugQueryParam, canonicalSlug)
  url.hash = canonicalSlug

  return url.toString()
}

function createPreviewStorage(value: unknown) {
  return {
    getItem: () => JSON.stringify({ state: value, version: 0 }),
    setItem: () => {},
    removeItem: () => {},
  }
}

export function getPublicPreviewPortfolioStorage(search: string = window.location.search) {
  const snapshot = getPublicPreviewSnapshot(search)

  if (!snapshot) {
    return null
  }

  return createPreviewStorage({ data: snapshot.portfolio })
}

export function getPublicPreviewThemeStorage(search: string = window.location.search) {
  const snapshot = getPublicPreviewSnapshot(search)

  if (!snapshot) {
    return null
  }

  return createPreviewStorage({ preset: snapshot.theme })
}
