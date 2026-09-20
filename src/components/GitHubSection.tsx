import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, GitBranch, RefreshCw, Star } from 'lucide-react'

import { getSafeExternalHref } from '../lib/links'
import { usePortfolioStore } from '../store/portfolioStore'
import { fetchGitHubProjects, isGitHubProfileUrl } from '../lib/github'
import type { GitHubProject } from '../types/portfolio'
import { SectionHeading } from './SectionHeading'

type GitHubState =
  | { status: 'idle' }
  | { status: 'loading'; url: string }
  | { status: 'success'; url: string; projects: GitHubProject[]; syncedAt: Date }
  | { status: 'error'; url: string; message: string }

export function GitHubSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const githubLink = portfolio.socialLinks.find((link) => link.platform === 'github')
  const githubUrl = githubLink?.url
  const [refreshToken, setRefreshToken] = useState(0)
  const [githubState, setGithubState] = useState<GitHubState>({ status: 'idle' })
  const canRefreshRepositories = githubUrl ? isGitHubProfileUrl(githubUrl) : false
  const hasRemoteProjects = githubState.status === 'success' && githubState.url === githubUrl
  const projects = hasRemoteProjects ? githubState.projects : portfolio.githubProjects
  const source = hasRemoteProjects ? 'github' : 'sample'

  useEffect(() => {
    const controller = new AbortController()

    if (!githubUrl || !canRefreshRepositories) {
      return () => controller.abort()
    }

    fetchGitHubProjects(githubUrl, controller.signal)
      .then((remoteProjects) => {
        if (remoteProjects === null) {
          return
        }

        setGithubState({ status: 'success', url: githubUrl, projects: remoteProjects, syncedAt: new Date() })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setGithubState({
            status: 'error',
            url: githubUrl,
            message: error instanceof Error ? error.message : 'GitHub could not be refreshed right now.',
          })
        }
      })

    return () => controller.abort()
  }, [canRefreshRepositories, githubUrl, refreshToken])

  const githubHref = githubUrl ? getSafeExternalHref(githubUrl) : null
  const isLoading = canRefreshRepositories && (githubState.status === 'idle' || githubState.status === 'loading' || githubState.url !== githubUrl)
  const errorMessage = githubState.status === 'error' && githubState.url === githubUrl ? githubState.message : null
  const syncedAt = githubState.status === 'success' && githubState.url === githubUrl ? githubState.syncedAt : null

  const refreshRepositories = () => {
    if (!githubUrl || !canRefreshRepositories || isLoading) {
      return
    }

    setGithubState({ status: 'loading', url: githubUrl })
    setRefreshToken((current) => current + 1)
  }

  return (
    <section id="github" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="GitHub"
        title="Code with structure, rhythm, and intent."
        description={source === 'github'
          ? 'Selected public repositories, refreshed from GitHub.'
          : 'A technical layer for product-minded work — connect a GitHub profile to load public repositories here.'}
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border)] py-4">
        <div className="text-xs text-[var(--muted)]" role="status" aria-live="polite">
          {isLoading ? 'Refreshing repositories…' : syncedAt ? `Last refreshed ${syncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : errorMessage ? 'Showing saved repositories' : 'Saved repository snapshot'}
        </div>
        <button
          type="button"
          onClick={refreshRepositories}
          disabled={!canRefreshRepositories || isLoading}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          {isLoading ? 'Refreshing' : 'Refresh repositories'}
        </button>
      </div>

      {errorMessage ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 text-sm leading-6 text-amber-900" role="alert">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{errorMessage} We&apos;re showing your saved repository snapshot instead.</p>
        </div>
      ) : null}

      {hasRemoteProjects && projects.length === 0 ? (
        <div className="mt-12 rounded-[1.8rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-sm leading-7 text-[var(--muted)]">
          No public repositories were found for this GitHub profile yet.
        </div>
      ) : (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={`${project.repository}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
              className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">{project.language}</p>
                  <h3 className="mt-3 text-2xl font-medium text-[var(--foreground)]">{project.repository}</h3>
                </div>
                <a href={getSafeExternalHref(project.url) ?? '#'} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--foreground)]" aria-label={`Open ${project.repository} on GitHub`}>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{project.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
                <span className="inline-flex items-center gap-2"><Star className="h-4 w-4" /> {project.stars}</span>
                <span className="inline-flex items-center gap-2"><GitBranch className="h-4 w-4" /> {project.forks}</span>
                <span>{project.updatedAt}</span>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {githubHref ? (
        <a href={githubHref} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] transition hover:gap-3">
          Open GitHub profile <ArrowUpRight className="h-4 w-4" />
        </a>
      ) : null}
    </section>
  )
}
