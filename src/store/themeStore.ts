import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { themePresets } from '../data/themes'
import { getPublicPreviewThemeStorage } from '../lib/publicPreview'
import type { ThemePresetName } from '../types/theme'

interface ThemeState {
  preset: ThemePresetName
  setPreset: (preset: ThemePresetName) => void
}

const themeStorePersistOptions =
  typeof window === 'undefined'
    ? { name: 'foliospark-theme' }
    : {
        name: 'foliospark-theme',
        storage: createJSONStorage(() => getPublicPreviewThemeStorage() ?? window.localStorage),
      }

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preset: themePresets[0].id,
      setPreset: (preset) => set({ preset: preset }),
    }),
    themeStorePersistOptions,
  ),
)
