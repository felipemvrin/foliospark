import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

import { getMailtoHref } from '../lib/links'
import { usePortfolioStore } from '../store/portfolioStore'

export function FinalCtaSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const emailHref = getMailtoHref(portfolio.profile.email)

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-[var(--on-strong)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.22em] text-[var(--foreground)]">
              <Sparkles className="h-3.5 w-3.5" />
              Ready to launch
            </div>
            <h2 className="mt-6 max-w-xl font-display text-4xl leading-none sm:text-5xl lg:text-6xl">
              Turn your work into a sharper business asset.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted)]">
              Whether you’re selling a service, outlining a studio, or positioning a next chapter, FolioSpark helps the story feel as credible as the work itself.
            </p>
          </div>

          {emailHref ? (
            <motion.a
              href={emailHref}
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="button-shine inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--on-accent)] transition hover:opacity-90"
            >
              Start a project <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          ) : (
            <span className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--on-accent)] opacity-60">
              Start a project <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
