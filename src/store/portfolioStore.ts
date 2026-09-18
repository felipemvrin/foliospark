import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { portfolio as defaultPortfolio } from '../data/portfolio'
import type { Portfolio } from '../types/portfolio'

type PortfolioUpdater = Portfolio | ((current: Portfolio) => Portfolio)

function createDefaultPortfolio() {
  return JSON.parse(JSON.stringify(defaultPortfolio)) as Portfolio
}

interface PortfolioState {
  data: Portfolio
  resetData: () => void
  setData: (updater: PortfolioUpdater) => void
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      data: createDefaultPortfolio(),
      resetData: () => set({ data: createDefaultPortfolio() }),
      setData: (updater) =>
        set((state) => ({
          data: typeof updater === 'function' ? (updater as (current: Portfolio) => Portfolio)(state.data) : updater,
        })),
    }),
    {
      name: 'foliospark-portfolio',
      storage: typeof window === 'undefined' ? undefined : createJSONStorage(() => window.localStorage),
    },
  ),
)
