import { getSafeExternalHref } from './links'

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function getGeneratedFaviconHref(mark: string, background: string, foreground: string) {
  const safeMark = escapeXml(mark.trim().slice(0, 2) || 'F')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${escapeXml(background)}"/><text x="32" y="37" fill="${escapeXml(foreground)}" font-family="Arial,sans-serif" font-size="25" font-weight="700" text-anchor="middle">${safeMark}</text></svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function getSiteFaviconHref(faviconUrl: string | undefined, mark: string, background: string, foreground: string) {
  return getSafeExternalHref(faviconUrl?.trim() ?? '') ?? getGeneratedFaviconHref(mark, background, foreground)
}
