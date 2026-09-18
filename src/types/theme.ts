export type ThemePresetName = 'Minimal' | 'Mono' | 'Editorial' | 'Dark' | 'Experimental'

export interface ThemePreset {
  id: ThemePresetName
  name: string
  description: string
  colors: {
    background: string
    backgroundAlt: string
    foreground: string
    muted: string
    surface: string
    surfaceStrong: string
    border: string
    accent: string
    accentSoft: string
  }
}
