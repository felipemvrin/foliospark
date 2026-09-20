import { motion } from 'framer-motion'

import { usePortfolioStore } from '../store/portfolioStore'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  const portfolio = usePortfolioStore((state) => state.data)

  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title="An identity that moves with the work."
          description={portfolio.profile.bio}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ y: -4 }}
          className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8"
        >
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[var(--muted)]">Profile</p>
          <div className="mt-6 space-y-6 text-base leading-8 text-[var(--muted)]">
            {portfolio.about.map((paragraph, paragraphIndex) => (
              <p key={`${paragraph}-${paragraphIndex}`}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
          whileHover={{ y: -4 }}
          className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-[var(--on-strong)] sm:p-8"
        >
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] opacity-70">Overview</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {portfolio.skills.slice(0, 4).map((group, groupIndex) => (
              <div
                key={`${group.category}-${groupIndex}`}
                className="rounded-2xl border border-[var(--border-strong)] p-4"
                style={{ background: 'var(--accent-soft)' }}
              >
                <p className="text-[0.68rem] uppercase tracking-[0.22em] opacity-70">{group.category}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {group.items.map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`}>— {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
