import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpenText } from 'lucide-react'

import { getSafeExternalHref } from '../lib/links'
import type { BehanceProject } from '../types/portfolio'
import { SectionHeading } from './SectionHeading'

interface JournalSectionProps {
  projects: BehanceProject[]
}

export function JournalSection({ projects }: JournalSectionProps) {
  const stories = projects.slice(0, 3)

  return (
    <section id="journal" className="bg-[var(--background-alt)] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Journal"
          title="Notes from the work, not just the output."
          description="A lighter layer of thinking: the ideas, decisions, and rhythm behind the systems people remember."
        />

        {stories.length === 0 ? (
          <div className="mt-12 rounded-[1.8rem] border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-sm leading-7 text-[var(--muted)]">
            No editorial notes are available yet. Add Behance projects in the editor or connect a Behance proxy.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stories.map((story, index) => {
              const href = getSafeExternalHref(story.url)

              return (
                <motion.article
                  key={`${story.title}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="group overflow-hidden rounded-[1.9rem] border border-[var(--border)] bg-[var(--surface)]"
                  style={{ boxShadow: 'var(--shadow-soft)' }}
                >
                  <div className="relative overflow-hidden">
                    <img src={story.cover} alt={story.title} className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                      <BookOpenText className="h-3 w-3" />
                      {story.category}
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="flex items-center justify-between gap-4 text-[0.62rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                      <span>{story.publishedAt}</span>
                      <span>Essay</span>
                    </div>

                    <h3 className="text-2xl font-medium text-[var(--foreground)]">{story.title}</h3>
                    <p className="text-sm leading-7 text-[var(--muted)]">{story.description}</p>

                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] transition hover:gap-3"
                      >
                        Read the note <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
