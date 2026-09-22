import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'

import { usePortfolioStore } from '../store/portfolioStore'
import { getTranslations } from '../lib/i18n'

export function Hero() {
  const portfolio = usePortfolioStore((state) => state.data)
  const copy = getTranslations(usePortfolioStore((state) => state.data.siteSettings?.locale))
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { amount: 0.2 })
  const reduceMotion = useReducedMotion()

  const headlineWords = ['CREATE.', 'CURATE.', 'SHARE.']
  const shouldAnimateAmbient = !reduceMotion && isInView

  return (
    <section id="top" ref={sectionRef} className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--background)]">
      <motion.div
        aria-hidden="true"
        animate={shouldAnimateAmbient ? { x: [0, 12, 0], y: [0, -14, 0], opacity: [0.7, 1, 0.7] } : { x: 0, y: 0, opacity: 0.8 }}
        transition={shouldAnimateAmbient ? { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
        className="pointer-events-none absolute inset-x-0 top-[-18%] h-[540px] opacity-80"
        style={{ background: 'radial-gradient(circle at 30% 35%, var(--accent-soft), transparent 34%)' }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--border)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8 lg:pb-24 lg:pt-20">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[var(--muted)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {copy.home.heroEyebrow}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[var(--muted)]">
              FolioSpark
            </p>
            <h1 className="max-w-4xl font-display text-[3.1rem] leading-[0.88] tracking-[-0.08em] text-[var(--foreground)] sm:text-[4.7rem] lg:text-[7.2rem]">
              {headlineWords.map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.18 + index * 0.12, ease: 'easeOut' }}
                  className={index === 1 ? 'block text-[var(--accent)]' : 'block'}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            className="max-w-xl text-lg leading-8 text-[var(--muted)]"
          >
            {portfolio.profile.headline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <motion.a
              href="#work"
              whileHover={{ y: -3, scale: 1.02, rotate: -1 }}
              whileTap={{ scale: 0.98 }}
              className="button-shine inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--on-accent)] shadow-[0_12px_26px_rgba(212,163,115,0.28)] transition hover:shadow-[0_18px_40px_rgba(212,163,115,0.36)]"
            >
              {copy.home.exploreWork} <ArrowUpRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ y: -3, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {copy.home.startProject}
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
            className="flex flex-wrap items-center gap-3 pt-3 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--muted)]"
          >
            {portfolio.metrics.map((metric, index) => (
              <motion.div
                key={`${metric.label}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.35 + index * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="cursor-default border-l border-[var(--border)] px-3 first:border-l-0 first:pl-0"
              >
                <span className="block text-lg font-medium tracking-[-0.06em] text-[var(--foreground)]">{metric.value}</span>
                <span>{metric.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }}
          className="relative"
        >
          <motion.div
            animate={shouldAnimateAmbient ? { y: [0, -8, 0], rotate: [0, 0.7, 0] } : { y: 0, rotate: 0 }}
            transition={shouldAnimateAmbient ? { duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0 }}
            className="relative"
          >
          <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            className="relative rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-4"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3 text-[0.64rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              <span>{copy.home.portfolioLabel}</span>
              <span>01 / 06</span>
            </div>
            <img
              src={portfolio.profile.photo}
              alt={portfolio.profile.name}
              className="h-[520px] w-full rounded-[1.5rem] object-cover"
            />
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
              <div>
                <p className="text-[0.64rem] uppercase tracking-[0.28em] text-[var(--muted)]">{copy.home.currentRole}</p>
                <p className="mt-2 text-xl font-medium text-[var(--foreground)]">{portfolio.profile.role}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background-alt)] text-[var(--muted)]">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
