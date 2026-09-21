import { useEffect, useState } from 'react'

import {
  fetchBehanceProjects,
  getBehanceProxyUrl,
  getResolvedBehanceProjects,
} from '../lib/behance'
import { usePortfolioStore } from '../store/portfolioStore'
import type { BehanceProject } from '../types/portfolio'

type BehanceState =
  | { status: 'idle' }
  | { status: 'loading'; endpoint: string }
  | { status: 'success'; endpoint: string; projects: BehanceProject[]; syncedAt: Date }
  | { status: 'error'; endpoint: string; message: string }

export function useBehanceProjects() {
  const portfolio = usePortfolioStore((state) => state.data)
  const proxyUrl = getBehanceProxyUrl()
  const [refreshToken, setRefreshToken] = useState(0)
  const [behanceState, setBehanceState] = useState<BehanceState>({ status: 'idle' })

  useEffect(() => {
    if (!proxyUrl) {
      return
    }

    const controller = new AbortController()

    fetchBehanceProjects(proxyUrl, controller.signal)
      .then((remoteProjects) => {
        setBehanceState({ status: 'success', endpoint: proxyUrl, projects: remoteProjects, syncedAt: new Date() })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setBehanceState({
            status: 'error',
            endpoint: proxyUrl,
            message: error instanceof Error ? error.message : 'Behance could not be refreshed right now.',
          })
        }
      })

    return () => controller.abort()
  }, [proxyUrl, refreshToken])

  const projects = getResolvedBehanceProjects({
    savedProjects: portfolio.behanceProjects,
    remoteProjects: behanceState.status === 'success' ? behanceState.projects : null,
    remoteEndpoint: behanceState.status === 'success' ? behanceState.endpoint : null,
    activeEndpoint: proxyUrl,
  })
  const isLoading =
    Boolean(proxyUrl) &&
    (behanceState.status === 'idle' || behanceState.status === 'loading' || behanceState.endpoint !== proxyUrl)
  const errorMessage = behanceState.status === 'error' && behanceState.endpoint === proxyUrl ? behanceState.message : null
  const syncedAt = behanceState.status === 'success' && behanceState.endpoint === proxyUrl ? behanceState.syncedAt : null

  const refreshProjects = () => {
    if (!proxyUrl || isLoading) {
      return
    }

    setBehanceState({ status: 'loading', endpoint: proxyUrl })
    setRefreshToken((current) => current + 1)
  }

  return {
    canRefreshProjects: Boolean(proxyUrl),
    errorMessage,
    isLoading,
    projects,
    refreshProjects,
    syncedAt,
  }
}
