import { themePresets } from '../data/themes.js'
import type { Profile } from '../types/portfolio.js'
import type { ThemePresetName } from '../types/theme.js'

function firstNonEmpty(...values: string[]) {
  return values.find((value) => value.trim().length > 0) ?? ''
}

function normalizeSiteUrl(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  const candidate = trimmedValue.includes('://') ? trimmedValue : `https://${trimmedValue}`

  try {
    const url = new URL(candidate)
    url.hash = ''

    return url.href
  } catch {
    return ''
  }
}

function resolveImageUrl(value: string, siteUrl: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  try {
    return new URL(trimmedValue).href
  } catch {
    if (!siteUrl) {
      return trimmedValue
    }

    try {
      return new URL(trimmedValue, siteUrl).href
    } catch {
      return trimmedValue
    }
  }
}

export interface SeoMetadata {
  description: string
  image: string
  themeColor: string
  title: string
  url: string
}

export function getSeoMetadata(profile: Profile, themeId: ThemePresetName, siteUrl = ''): SeoMetadata {
  const theme = themePresets.find((preset) => preset.id === themeId) ?? themePresets[0]
  const titleParts = [profile.name.trim(), profile.role.trim()].filter(Boolean)
  const normalizedSiteUrl = normalizeSiteUrl(firstNonEmpty(profile.siteUrl ?? '', siteUrl))

  return {
    title: titleParts.join(' — ') || 'FolioSpark',
    description: firstNonEmpty(profile.bio, profile.headline, profile.role, profile.name, 'Your professional story, in motion.'),
    image: resolveImageUrl(profile.photo, normalizedSiteUrl),
    themeColor: theme.colors.background,
    url: normalizedSiteUrl,
  }
}
