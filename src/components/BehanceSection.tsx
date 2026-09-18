import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import { portfolio } from '../data/portfolio'
import { SectionHeading } from './SectionHeading'

export function BehanceSection() {
  return (
    <section id="behance" className="bg-neutral-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Behance"
          title="Visual stories with a sharper rhythm."
          description="A more image-driven layer for editorial thinking and art direction, designed to feel less like a gallery and more like an intentional narrative."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {portfolio.behanceProjects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: index * 0.08 }}
              className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/5"
            >
              <img src={project.cover} alt={project.title} className="h-72 w-full object-cover" />
              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-400">{project.category}</p>
                  <span className="text-sm text-neutral-300">{project.publishedAt}</span>
                </div>
                <h3 className="text-3xl font-medium text-white">{project.title}</h3>
                <p className="text-sm leading-7 text-neutral-300">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-neutral-200">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.url}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:gap-3"
                >
                  View project <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
