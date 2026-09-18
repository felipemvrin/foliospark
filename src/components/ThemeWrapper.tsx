import { useEffect, useMemo } from 'react'

import { themePresets } from '../data/themes'
import { useThemeStore } from '../store/themeStore'

function getReadableTextColor(color: string) {
  const normalized = color.replace('#', '')
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((value) => `${value}${value}`)
          .join('')
      : normalized

  if (expanded.length !== 6) {
    return '#171717'
  }

  const red = Number.parseInt(expanded.slice(0, 2), 16)
  const green = Number.parseInt(expanded.slice(2, 4), 16)
  const blue = Number.parseInt(expanded.slice(4, 6), 16)
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255

  return luminance > 0.6 ? '#171717' : '#f7f5f1'
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
    document.documentElement.style.setProperty('--on-accent', onAccent)
  }, [selectedTheme])

  return <>{children}</>
}
