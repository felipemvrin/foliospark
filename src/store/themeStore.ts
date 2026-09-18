import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { themePresets } from '../data/themes'
import type { ThemePresetName } from '../types/theme'

interface ThemeState {
  preset: ThemePresetName
  setPreset: (preset: ThemePresetName) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preset: themePresets[0].id,
      setPreset: (preset) => set({ preset: preset }),
    }),
    {
      name: 'foliospark-theme',
      storage: typeof window === 'undefined' ? undefined : createJSONStorage(() => window.localStorage),
    },
  ),
)
