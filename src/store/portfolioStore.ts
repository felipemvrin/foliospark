import { create } from 'zustand'
import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware'

import { createReadonlyStorage, getPublicPreviewPortfolioStorage } from '../lib/publicPreview'
import { parsePortfolio } from '../lib/portfolioTransfer'
import { isPublishedView } from '../lib/publishingApi'
import { portfolio as defaultPortfolio } from '../data/portfolio'
import { createDefaultSiteSettings } from '../data/siteSettings'
import type { Portfolio } from '../types/portfolio'

type PortfolioUpdater = Portfolio | ((current: Portfolio) => Portfolio)

function createDefaultPortfolio() {
  return {
    ...JSON.parse(JSON.stringify(defaultPortfolio)),
    siteSettings: createDefaultSiteSettings(),
  } as Portfolio
}

interface PortfolioState {
  data: Portfolio
  resetData: () => void
  setData: (updater: PortfolioUpdater) => void
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

const portfolioStorePersistOptions: PersistOptions<PortfolioState> =
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
        merge: (persistedState: unknown, currentState: PortfolioState) => {
          const state = isRecord(persistedState) ? persistedState : {}
          const parsedData = parsePortfolio(state.data) ?? currentState.data
          const data = {
            ...parsedData,
            siteSettings: parsedData.siteSettings ?? currentState.data.siteSettings ?? createDefaultSiteSettings(),
          }

          return {
            ...currentState,
            ...state,
            data,
          }
        },
      }

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      data: createDefaultPortfolio(),
      resetData: () => set({ data: createDefaultPortfolio() }),
      setData: (updater) =>
        set((state: PortfolioState) => ({
          data: typeof updater === 'function' ? (updater as (current: Portfolio) => Portfolio)(state.data) : updater,
        })),
    }),
    portfolioStorePersistOptions,
  ),
)
