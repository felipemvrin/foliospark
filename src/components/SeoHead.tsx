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

export function SeoHead() {
  const profile = usePortfolioStore((state) => state.data.profile)
  const themeId = useThemeStore((state) => state.preset)

  useEffect(() => {
    const fallbackCanonicalUrl = new URL(window.location.href)
    fallbackCanonicalUrl.hash = ''

    const currentCanonicalUrl = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href
    const configuredCanonicalUrl = currentCanonicalUrl ? new URL(currentCanonicalUrl) : fallbackCanonicalUrl

    if (isPublicPreview(window.location.search)) {
      configuredCanonicalUrl.search = window.location.search
    }

    const { description, image, themeColor, title, url } = getSeoMetadata(
      profile,
      themeId,
      configuredCanonicalUrl.toString(),
    )
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
  }, [profile, themeId])

  return null
}