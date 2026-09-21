import { motion } from 'framer-motion'

import { usePortfolioStore } from '../store/portfolioStore'
import { SectionHeading } from './SectionHeading'

export function ProcessSection() {
  const portfolio = usePortfolioStore((state) => state.data)

  return (
    <section id="process" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Process"
        title="A creative process built to feel clear and premium."
        description="Strategy, identities, and interfaces all move together so the work feels intentional from discovery through launch."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {portfolio.process.map((step, index) => (
          <motion.div
            key={`${step.title}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-5"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-alt)] text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
              0{index + 1}
            </div>
            <h3 className="text-xl font-medium text-[var(--foreground)]">{step.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{step.description}</p>
            <p className="mt-4 border-t border-[var(--border)] pt-4 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted)]">
              {step.detail}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {portfolio.testimonials.map((testimonial, index) => (
          <motion.blockquote
            key={`${testimonial.name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
            className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-[var(--on-strong)]"
          >
            <p className="text-lg leading-8">“{testimonial.quote}”</p>
            <footer className="mt-6 border-t border-[var(--border-strong)] pt-5">
              <div className="text-base font-medium">{testimonial.name}</div>
              <div className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] opacity-70">
                {testimonial.role} · {testimonial.company}
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}
