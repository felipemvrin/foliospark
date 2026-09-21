import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronDown, GitBranch, Globe } from 'lucide-react'
import { useState } from 'react'

import { trackAnalyticsEvent } from '../lib/analytics'
import { getPreferredSafeExternalHref, getSafeExternalHref } from '../lib/links'
import type { Project } from '../types/portfolio'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false)
  const websiteHref = project.website ? getSafeExternalHref(project.website) : null
  const githubHref = project.github ? getSafeExternalHref(project.github) : null
  const projectUrl = getPreferredSafeExternalHref(project.website, project.github)

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
      whileHover={{ y: -10, scale: 1.01 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)]"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/65 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          whileHover={{ scale: 1.04 }}
          className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm"
        >
          {project.category}
        </motion.div>
        <motion.div
          initial={{ y: 18 }}
          whileInView={{ y: 0 }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-full border border-white/25 bg-black/20 px-3 py-2 text-[0.65rem] uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm opacity-0 transition duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
        >
          <span>Case study</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </motion.div>
      </div>

      <div className="space-y-5 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[var(--muted)]">{project.year}</p>
            <h3 className="mt-3 text-2xl font-medium text-[var(--foreground)]">{project.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-[var(--muted)]">
            {websiteHref ? (
              <a
                href={websiteHref}
                aria-label={`Visit ${project.title}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void trackAnalyticsEvent({ name: 'outbound_click', properties: { destination: 'project_website' } })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] transition hover:text-[var(--foreground)]"
              >
                <Globe className="h-4 w-4" />
              </a>
            ) : null}
            {githubHref ? (
              <a
                href={githubHref}
                aria-label={`${project.title} on GitHub`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => void trackAnalyticsEvent({ name: 'outbound_click', properties: { destination: 'project_github' } })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] transition hover:text-[var(--foreground)]"
              >
                <GitBranch className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <p className="text-sm leading-7 text-[var(--muted)]">{project.description}</p>

        {project.caseStudy ? (
          <div className="border-y border-[var(--border)] py-4">
            <button
              type="button"
              aria-expanded={isCaseStudyOpen}
              onClick={() => setIsCaseStudyOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-4 text-left text-sm font-medium text-[var(--foreground)]"
            >
              <span>Read the case study</span>
              <ChevronDown className={`h-4 w-4 transition ${isCaseStudyOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCaseStudyOpen ? (
              <div className="mt-5 space-y-5 text-sm leading-7 text-[var(--muted)]">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[var(--foreground)]">Challenge</p>
                  <p className="mt-2">{project.caseStudy.challenge}</p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[var(--foreground)]">Approach</p>
                  <p className="mt-2">{project.caseStudy.approach}</p>
                </div>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[var(--foreground)]">Outcome</p>
                  <p className="mt-2">{project.caseStudy.outcome}</p>
                </div>
                {project.caseStudy.metrics.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {project.caseStudy.metrics.map((metric) => (
                      <div key={`${metric.value}-${metric.label}`} className="rounded-xl bg-[var(--background-alt)] p-3">
                        <p className="text-lg font-medium text-[var(--foreground)]">{metric.value}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((technology, technologyIndex) => (
            <motion.span
              key={`${technology}-${technologyIndex}`}
              whileHover={{ y: -2, color: 'var(--foreground)' }}
              className="rounded-full border border-[var(--border)] bg-[var(--background-alt)] px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[var(--muted)] transition"
            >
              {technology}
            </motion.span>
          ))}
        </div>

        {projectUrl ? (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void trackAnalyticsEvent({ name: 'outbound_click', properties: { destination: 'project_primary' } })}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] transition hover:gap-3"
          >
            View project <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </motion.article>
  )
}
