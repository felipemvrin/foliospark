import { motion } from 'framer-motion'
import { ArrowUpRight, GitBranch, Globe } from 'lucide-react'

import type { Project } from '../types/portfolio'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const primaryUrl = project.website ?? project.behance
  const ctaUrl = primaryUrl ?? project.github

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white shadow-[0_18px_60px_rgba(17,17,17,0.06)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-[320px] w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white backdrop-blur-sm">
          {project.category}
        </div>
      </div>

      <div className="space-y-5 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-neutral-500">{project.year}</p>
            <h3 className="mt-3 text-2xl font-medium text-neutral-900">{project.title}</h3>
          </div>
          <div className="flex items-center gap-2 text-neutral-500">
            {primaryUrl ? (
              <a
                href={primaryUrl}
                aria-label={project.website ? `Visit ${project.title}` : `View ${project.title} on Behance`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                <Globe className="h-4 w-4" />
              </a>
            ) : null}
            {project.github ? (
              <a
                href={project.github}
                aria-label={`${project.title} on GitHub`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                <GitBranch className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <p className="text-sm leading-7 text-neutral-600">{project.description}</p>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-neutral-600"
            >
              {technology}
            </span>
          ))}
        </div>

        {ctaUrl ? (
          <a
            href={ctaUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 transition hover:gap-3"
          >
            View project <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </motion.article>
  )
}
