import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, GitBranch, Star } from 'lucide-react'

import { usePortfolioStore } from '../store/portfolioStore'
import { fetchGitHubProjects } from '../lib/github'
import type { GitHubProject } from '../types/portfolio'
import { SectionHeading } from './SectionHeading'

export function GitHubSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const githubLink = portfolio.socialLinks.find((link) => link.platform === 'github')
  const githubUrl = githubLink?.url
  const [remoteResult, setRemoteResult] = useState<{ url: string; projects: GitHubProject[] } | null>(null)
  const hasRemoteProjects = remoteResult?.url === githubUrl
  const projects = hasRemoteProjects ? remoteResult?.projects ?? portfolio.githubProjects : portfolio.githubProjects
  const source = hasRemoteProjects ? 'github' : 'sample'

  useEffect(() => {
    const controller = new AbortController()

    if (!githubUrl) {
      return () => controller.abort()
    }

    fetchGitHubProjects(githubUrl, controller.signal)
      .then((remoteProjects) => {
        if (remoteProjects) {
          setRemoteResult({ url: githubUrl, projects: remoteProjects })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setRemoteResult(null)
        }
      })

    return () => controller.abort()
  }, [githubUrl])

  return (
    <section id="github" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="GitHub"
        title="Code with structure, rhythm, and intent."
        description={source === 'github'
          ? 'Selected public repositories, refreshed from GitHub.'
          : 'A technical layer for product-minded work — connect a GitHub profile to load public repositories here.'}
      />

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
                <a href={project.url} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--foreground)]">
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
    </section>
  )
}
