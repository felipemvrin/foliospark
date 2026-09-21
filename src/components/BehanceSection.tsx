import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, RefreshCw } from 'lucide-react'

import { getSafeExternalHref } from '../lib/links'
import { fetchBehanceProjects, getBehanceProxyUrl } from '../lib/behance'
import { usePortfolioStore } from '../store/portfolioStore'
import type { BehanceProject } from '../types/portfolio'
import { SectionHeading } from './SectionHeading'

type BehanceState =
  | { status: 'idle' }
  | { status: 'loading'; endpoint: string }
  | { status: 'success'; endpoint: string; projects: BehanceProject[]; syncedAt: Date }
  | { status: 'error'; endpoint: string; message: string }

export function BehanceSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const proxyUrl = getBehanceProxyUrl()
  const [refreshToken, setRefreshToken] = useState(0)
  const [behanceState, setBehanceState] = useState<BehanceState>({ status: 'idle' })
  const hasRemoteProjects = behanceState.status === 'success' && behanceState.endpoint === proxyUrl
  const projects = hasRemoteProjects ? behanceState.projects : portfolio.behanceProjects

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

  const isLoading = Boolean(proxyUrl) && (behanceState.status === 'idle' || behanceState.status === 'loading' || behanceState.endpoint !== proxyUrl)
  const errorMessage = behanceState.status === 'error' && behanceState.endpoint === proxyUrl ? behanceState.message : null
  const syncedAt = behanceState.status === 'success' && behanceState.endpoint === proxyUrl ? behanceState.syncedAt : null

  const refreshProjects = () => {
    if (!proxyUrl || isLoading) {
      return
    }

    setBehanceState({ status: 'loading', endpoint: proxyUrl })
    setRefreshToken((current) => current + 1)
  }

  return (
    <section id="behance" className="bg-[var(--surface-strong)] py-20 text-[var(--on-strong)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Behance"
          title="Visual stories with a sharper rhythm."
          description="A more image-driven layer for editorial thinking and art direction, designed to feel less like a gallery and more like an intentional narrative."
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border-strong)] py-4">
          <div className="text-xs opacity-70" role="status" aria-live="polite">
            {isLoading
              ? 'Refreshing visual projects…'
              : syncedAt
                ? `Last refreshed ${syncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                : proxyUrl
                  ? errorMessage ? 'Showing saved projects' : 'Proxy-connected visual projects'
                  : 'Saved project snapshot'}
          </div>
          <button
            type="button"
            onClick={refreshProjects}
            disabled={!proxyUrl || isLoading}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-[0.62rem] uppercase tracking-[0.2em] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            {isLoading ? 'Refreshing' : 'Refresh projects'}
          </button>
        </div>

        {errorMessage ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 text-sm leading-6 text-amber-950" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{errorMessage} We&apos;re showing your saved project snapshot instead.</p>
          </div>
        ) : null}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => {
            const safeProjectHref = getSafeExternalHref(project.url)

            return (
              <motion.article
                key={`${project.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
                className="overflow-hidden rounded-[1.9rem] border border-[var(--border-strong)]"
                style={{ background: 'var(--accent-soft)' }}
              >
                {safeProjectHref ? (
                  <a href={safeProjectHref} target="_blank" rel="noopener noreferrer" className="block">
                    <img src={project.cover} alt={project.title} className="h-72 w-full object-cover" />
                  </a>
                ) : (
                  <img src={project.cover} alt={project.title} className="h-72 w-full object-cover" />
                )}
                <div className="space-y-5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[0.62rem] uppercase tracking-[0.28em] opacity-70">{project.category}</p>
                    <span className="text-sm opacity-70">{project.publishedAt}</span>
                  </div>
                  {safeProjectHref ? (
                    <a
                      href={safeProjectHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-3xl font-medium transition hover:opacity-80"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="h-5 w-5" />
                    </a>
                  ) : (
                    <h3 className="text-3xl font-medium">{project.title}</h3>
                  )}
                  <p className="text-sm leading-7 opacity-80">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={`${tag}-${tagIndex}`} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--foreground)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {projects.length === 0 ? (
          <div className="mt-12 rounded-[1.8rem] border border-dashed border-[var(--border-strong)] p-8 text-sm leading-7 opacity-75">
            No visual projects are available yet. Add projects in the editor or connect a Behance proxy.
          </div>
        ) : null}
      </div>
    </section>
  )
}
