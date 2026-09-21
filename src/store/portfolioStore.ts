import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createReadonlyStorage, getPublicPreviewPortfolioStorage } from '../lib/publicPreview'
import { isPublishedView } from '../lib/publishingApi'
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

const portfolioStorePersistOptions =
  typeof window === 'undefined'
    ? { name: 'foliospark-portfolio' }
    : {
        name: 'foliospark-portfolio',
        storage: createJSONStorage(() => {
          if (isPublishedView(window.location.search)) {
            return createReadonlyStorage({ data: createDefaultPortfolio() })
          }

          return getPublicPreviewPortfolioStorage() ?? window.localStorage
        }),
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
    portfolioStorePersistOptions,
  ),
)
