import { themePresets } from '../data/themes.js'
import type { Profile } from '../types/portfolio.js'
import type { ThemePresetName } from '../types/theme.js'

function firstNonEmpty(...values: string[]) {
  return values.find((value) => value.trim().length > 0) ?? ''
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

  return {
    title: titleParts.join(' — ') || 'FolioSpark',
    description: firstNonEmpty(profile.bio, profile.headline, profile.role, profile.name, 'Your professional story, in motion.'),
    image: profile.photo.trim(),
    themeColor: theme.colors.background,
    url: siteUrl,
  }
}
