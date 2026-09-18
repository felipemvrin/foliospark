import { create } from 'zustand'

import { themePresets } from '../data/themes'
import type { ThemePresetName } from '../types/theme'

interface ThemeState {
  preset: ThemePresetName
  setPreset: (preset: ThemePresetName) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  preset: themePresets[0].id,
  setPreset: (preset) => set({ preset: preset }),
}))
