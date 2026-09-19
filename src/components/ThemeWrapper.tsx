import { useEffect, useMemo } from 'react'

import { themePresets } from '../data/themes'
import { useThemeStore } from '../store/themeStore'

function parseColorChannels(color: string) {
  const normalized = color.replace('#', '')
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((value) => `${value}${value}`)
          .join('')
      : normalized

  if (expanded.length !== 6) {
    return null
  }

  return {
    blue: Number.parseInt(expanded.slice(4, 6), 16),
    green: Number.parseInt(expanded.slice(2, 4), 16),
    red: Number.parseInt(expanded.slice(0, 2), 16),
  }
}

function getRelativeLuminance(color: string) {
  const channels = parseColorChannels(color)

  if (!channels) {
    return 0
  }

  const { blue, green, red } = channels
  const toLinear = (channel: number) => {
    const normalized = channel / 255

    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue)
}

function getContrastRatio(background: string, foreground: string) {
  const backgroundLuminance = getRelativeLuminance(background)
  const foregroundLuminance = getRelativeLuminance(foreground)
  const lighter = Math.max(backgroundLuminance, foregroundLuminance)
  const darker = Math.min(backgroundLuminance, foregroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

function getReadableTextColor(color: string) {
  const darkText = '#171717'
  const lightText = '#f7f5f1'

  return getContrastRatio(color, darkText) >= getContrastRatio(color, lightText) ? darkText : lightText
}

function withAlpha(color: string, alpha: number) {
  const channels = parseColorChannels(color)

  if (!channels) {
    return `rgba(23, 23, 23, ${alpha})`
  }

  const { blue, green, red } = channels

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const preset = useThemeStore((state) => state.preset)

  const selectedTheme = useMemo(
    () => themePresets.find((theme) => theme.id === preset) ?? themePresets[0],
    [preset],
  )

  useEffect(() => {
    const onStrong = getReadableTextColor(selectedTheme.colors.surfaceStrong)
    const onAccent = getReadableTextColor(selectedTheme.colors.accent)

    document.documentElement.style.setProperty('--background', selectedTheme.colors.background)
    document.documentElement.style.setProperty('--background-alt', selectedTheme.colors.backgroundAlt)
    document.documentElement.style.setProperty('--foreground', selectedTheme.colors.foreground)
    document.documentElement.style.setProperty('--muted', selectedTheme.colors.muted)
    document.documentElement.style.setProperty('--surface', selectedTheme.colors.surface)
    document.documentElement.style.setProperty('--surface-strong', selectedTheme.colors.surfaceStrong)
    document.documentElement.style.setProperty('--border', selectedTheme.colors.border)
    document.documentElement.style.setProperty('--accent', selectedTheme.colors.accent)
    document.documentElement.style.setProperty('--accent-soft', selectedTheme.colors.accentSoft)
    document.documentElement.style.setProperty('--on-strong', onStrong)
    document.documentElement.style.setProperty('--border-strong', withAlpha(onStrong, 0.16))
    document.documentElement.style.setProperty('--on-accent', onAccent)
  }, [selectedTheme])

  return <>{children}</>
}
