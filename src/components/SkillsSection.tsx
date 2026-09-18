import { motion } from 'framer-motion'

import { usePortfolioStore } from '../store/portfolioStore'
import { SectionHeading } from './SectionHeading'

export function SkillsSection() {
  const portfolio = usePortfolioStore((state) => state.data)

  return (
    <section className="bg-[var(--background-alt)] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="A practice grounded in craft and systems."
          description="The portfolio spans product thinking, visual direction, and technical execution — crafted to be both expressive and reliable."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {portfolio.skills.map((group, index) => (
            <motion.div
              key={`${group.category}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
              className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <p className="text-[0.66rem] uppercase tracking-[0.28em] text-[var(--muted)]">{group.category}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--muted)]">
                {group.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`} className="border-b border-[var(--border)] pb-2 last:border-b-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
