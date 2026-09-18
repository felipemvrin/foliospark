import { motion } from 'framer-motion'
import { ArrowUpRight, GitBranch, Star } from 'lucide-react'

import { portfolio } from '../data/portfolio'
import { SectionHeading } from './SectionHeading'

export function GitHubSection() {
  return (
    <section id="github" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="GitHub"
        title="Code with structure, rhythm, and intent."
        description="A technical layer for product-minded work — modular, readable, and ready to expand into a richer GitHub-integrated portfolio."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {portfolio.githubProjects.map((project, index) => (
          <motion.article
            key={project.repository}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
            className="rounded-[1.8rem] border border-neutral-200 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">{project.language}</p>
                <h3 className="mt-3 text-2xl font-medium text-neutral-900">{project.repository}</h3>
              </div>
              <a href={project.url} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900">
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-5 text-sm leading-7 text-neutral-600">{project.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4" /> {project.stars}</span>
              <span className="inline-flex items-center gap-2"><GitBranch className="h-4 w-4" /> {project.forks}</span>
              <span>{project.updatedAt}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
