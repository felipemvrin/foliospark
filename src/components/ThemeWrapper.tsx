import { useEffect, useMemo } from 'react'

import { themePresets } from '../data/themes'
import { useThemeStore } from '../store/themeStore'

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const preset = useThemeStore((state) => state.preset)

  const selectedTheme = useMemo(
    () => themePresets.find((theme) => theme.id === preset) ?? themePresets[0],
    [preset],
  )

  useEffect(() => {
    document.documentElement.style.setProperty('--background', selectedTheme.colors.background)
    document.documentElement.style.setProperty('--background-alt', selectedTheme.colors.backgroundAlt)
    document.documentElement.style.setProperty('--foreground', selectedTheme.colors.foreground)
    document.documentElement.style.setProperty('--muted', selectedTheme.colors.muted)
    document.documentElement.style.setProperty('--surface', selectedTheme.colors.surface)
    document.documentElement.style.setProperty('--surface-strong', selectedTheme.colors.surfaceStrong)
    document.documentElement.style.setProperty('--border', selectedTheme.colors.border)
    document.documentElement.style.setProperty('--accent', selectedTheme.colors.accent)
    document.documentElement.style.setProperty('--accent-soft', selectedTheme.colors.accentSoft)
  }, [selectedTheme])

  return <>{children}</>
}
