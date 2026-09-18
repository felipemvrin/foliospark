import { motion } from 'framer-motion'

import { usePortfolioStore } from '../store/portfolioStore'
import { SectionHeading } from './SectionHeading'

export function ExperienceSection() {
  const portfolio = usePortfolioStore((state) => state.data)

  return (
    <section id="experience" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Experience"
        title="A career shaped by systems and story."
        description="From product design to brand narrative, each chapter is built around clarity, craft, and meaningful outcomes."
      />

      <div className="mt-12 space-y-6">
        {portfolio.experience.map((item, index) => (
          <motion.article
            key={`${item.company}-${item.period}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}
            className="grid gap-5 rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 md:grid-cols-[0.8fr_1.75fr_0.8fr] md:items-center"
          >
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">{item.period}</p>
            </div>
            <div>
              <h3 className="text-2xl font-medium text-[var(--foreground)]">{item.role}</h3>
              <p className="mt-2 text-lg text-[var(--muted)]">{item.company}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {item.technologies.map((tech, techIndex) => (
                <span key={`${tech}-${techIndex}`} className="rounded-full border border-[var(--border)] bg-[var(--background-alt)] px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                  {tech}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
