import { useEffect } from 'react'

import { isPublicPreview } from '../lib/publicPreview'
import { getSeoMetadata } from '../lib/seo'
import { usePortfolioStore } from '../store/portfolioStore'
import { useThemeStore } from '../store/themeStore'

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.content = content
}

function setCanonicalUrl(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = url
}

function setFavicon(url: string | undefined) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[data-foliospark-favicon]')

  if (!url) {
    existing?.remove()
    return
  }

  const element = existing ?? document.createElement('link')
  element.rel = 'icon'
  element.href = url
  element.dataset.foliosparkFavicon = 'true'

  if (!existing) {
    document.head.appendChild(element)
  }
}

export function SeoHead() {
  const profile = usePortfolioStore((state) => state.data.profile)
  const siteSettings = usePortfolioStore((state) => state.data.siteSettings)
  const themeId = useThemeStore((state) => state.preset)

  useEffect(() => {
    const fallbackCanonicalUrl = new URL(window.location.href)
    fallbackCanonicalUrl.hash = ''

    const currentCanonicalUrl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
    const configuredCanonicalUrl = currentCanonicalUrl ? new URL(currentCanonicalUrl) : fallbackCanonicalUrl

    if (isPublicPreview(window.location.search)) {
      configuredCanonicalUrl.search = window.location.search
    }

    const { description: seoDescription, image, themeColor, title: seoTitle, url } = getSeoMetadata(
      profile,
      themeId,
      configuredCanonicalUrl.toString(),
    )
    const title = siteSettings?.title.trim() || seoTitle
    const description = siteSettings?.description.trim() || seoDescription
    const canonicalUrl = url || fallbackCanonicalUrl.toString()

    document.title = title
    setCanonicalUrl(canonicalUrl)
    setMeta('name', 'description', description)
    setMeta('name', 'theme-color', themeColor)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:type', 'website')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)
    setFavicon(siteSettings?.faviconUrl?.trim())
  }, [profile, siteSettings, themeId])

  return null
}