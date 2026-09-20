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
    const protocol = url.protocol.toLowerCase()

    if (protocol !== 'http:' && protocol !== 'https:') {
      return ''
    }

    url.hash = ''

    return url.href
  } catch {
    return ''
  }
}

function resolveCanonicalUrl(...candidates: string[]) {
  for (const candidate of candidates) {
    const normalized = normalizeSiteUrl(candidate)

    if (normalized) {
      return normalized
    }
  }

  return ''
}

export function getCanonicalSiteUrl(profileSiteUrl = '', fallbackSiteUrl = '') {
  return resolveCanonicalUrl(profileSiteUrl, fallbackSiteUrl)
}

export function getSiteBasePath(siteUrl: string) {
  const normalized = normalizeSiteUrl(siteUrl)

  if (!normalized) {
    return '/'
  }

  const pathname = new URL(normalized).pathname || '/'

  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function shouldGenerateRobotsTxt(siteUrl: string) {
  return getSiteBasePath(siteUrl) === '/'
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
  const normalizedSiteUrl = getCanonicalSiteUrl(profile.siteUrl ?? '', siteUrl)

  return {
    title: titleParts.join(' — ') || 'FolioSpark',
    description: firstNonEmpty(profile.bio, profile.headline, profile.role, profile.name, 'Your professional story, in motion.'),
    image: resolveImageUrl(profile.photo, normalizedSiteUrl),
    themeColor: theme.colors.background,
    url: normalizedSiteUrl,
  }
}

export function buildSitemapXml(siteUrl: string) {
  const normalized = normalizeSiteUrl(siteUrl)

  if (!normalized) {
    return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
  }

  const base = normalized.endsWith('/') ? normalized : `${normalized}/`

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}</loc>
  </url>
</urlset>`
}

export function buildRobotsTxt(siteUrl: string) {
  const normalized = normalizeSiteUrl(siteUrl)

  if (!normalized) {
    return ['User-agent: *', 'Allow: /'].join('\n')
  }

  const base = normalized.endsWith('/') ? normalized : `${normalized}/`

  return ['User-agent: *', 'Allow: /', `Sitemap: ${base}sitemap.xml`].join('\n')
}
