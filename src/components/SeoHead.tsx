import { useEffect } from 'react'

import { themePresets } from '../data/themes'
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
  const theme = themePresets.find((preset) => preset.id === themeId) ?? themePresets[0]

  useEffect(() => {
    const title = `${profile.name} — ${profile.role}`
    const description = profile.bio || profile.headline

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'theme-color', theme.colors.background)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', profile.photo)
  }, [profile, theme])

  return null
}