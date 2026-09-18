import { useEffect } from 'react'

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

export function SeoHead() {
  const profile = usePortfolioStore((state) => state.data.profile)
  const themeId = useThemeStore((state) => state.preset)

  useEffect(() => {
    const { description, image, themeColor, title } = getSeoMetadata(profile, themeId)

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'theme-color', themeColor)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', image)
  }, [profile, themeId])

  return null
}