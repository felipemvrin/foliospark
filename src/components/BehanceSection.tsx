import { motion } from 'framer-motion'
import { AlertTriangle, ArrowUpRight, RefreshCw } from 'lucide-react'

import { trackAnalyticsEvent } from '../lib/analytics'
import { getSafeExternalHref } from '../lib/links'
import type { BehanceProject } from '../types/portfolio'
import { SectionHeading } from './SectionHeading'

interface BehanceSectionProps {
  canRefreshProjects: boolean
  errorMessage: string | null
  isLoading: boolean
  projects: BehanceProject[]
  refreshProjects: () => void
  syncedAt: Date | null
}

export function BehanceSection({
  canRefreshProjects,
  errorMessage,
  isLoading,
  projects,
  refreshProjects,
  syncedAt,
}: BehanceSectionProps) {

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
                : canRefreshProjects
                  ? errorMessage ? 'Showing saved projects' : 'Proxy-connected visual projects'
                  : 'Saved project snapshot'}
          </div>
          <button
            type="button"
            onClick={refreshProjects}
            disabled={!canRefreshProjects || isLoading}
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
                  <a href={safeProjectHref} target="_blank" rel="noopener noreferrer" onClick={() => void trackAnalyticsEvent({ name: 'outbound_click', properties: { destination: 'behance_project' } })} className="block">
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
                      onClick={() => void trackAnalyticsEvent({ name: 'outbound_click', properties: { destination: 'behance_project' } })}
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
