import { motion } from 'framer-motion'

import { portfolio } from '../data/portfolio'
import { SectionHeading } from './SectionHeading'

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title="An identity that moves with the work."
        description="FolioSpark blends narrative, systems thinking, and motion into a portfolio experience designed for modern creative professionals."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="rounded-[2rem] border border-neutral-200 bg-white p-6 sm:p-8"
        >
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-neutral-500">Profile</p>
          <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
            {portfolio.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
          className="rounded-[2rem] border border-neutral-200 bg-neutral-950 p-6 text-white sm:p-8"
        >
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-neutral-300">Overview</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {portfolio.skills.slice(0, 4).map((group) => (
              <div key={group.category} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-neutral-400">{group.category}</p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-200">
                  {group.items.map((item) => (
                    <li key={item}>— {item}</li>
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
