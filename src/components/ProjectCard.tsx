import { motion } from 'framer-motion'
import { ArrowUpRight, GitBranch, Globe } from 'lucide-react'

import { getSafeExternalHref } from '../lib/links'
import type { Project } from '../types/portfolio'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const websiteHref = project.website ? getSafeExternalHref(project.website) : null
  const githubHref = project.github ? getSafeExternalHref(project.github) : null
  const projectUrl = websiteHref ?? githubHref

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
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm"
        >
          {project.category}
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
                rel="noreferrer"
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
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] transition hover:text-[var(--foreground)]"
              >
                <GitBranch className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <p className="text-sm leading-7 text-[var(--muted)]">{project.description}</p>

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
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] transition hover:gap-3"
          >
            View project <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </motion.article>
  )
}
