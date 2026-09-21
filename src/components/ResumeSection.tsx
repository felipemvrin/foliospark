import { motion } from 'framer-motion'
import { Download, Mail } from 'lucide-react'

import { getMailtoHref } from '../lib/links'
import { usePortfolioStore } from '../store/portfolioStore'

export function ResumeSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const emailHref = getMailtoHref(portfolio.profile.email)

  return (
    <section id="resume" className="resume-section bg-[var(--surface-strong)] py-20 text-[var(--on-strong)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-[var(--border-strong)] pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] opacity-70">Resume</p>
            <h2 className="mt-5 font-display text-4xl leading-none sm:text-5xl lg:text-6xl">A concise view of the work behind the work.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">A practical snapshot for recruiters, collaborators, and teams looking for thoughtful design leadership with technical range.</p>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden">
            <motion.button
              type="button"
              onClick={() => window.print()}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:opacity-90"
            >
              Print / PDF <Download className="h-4 w-4" />
            </motion.button>
            {emailHref ? (
              <a href={emailHref} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--on-accent)] transition hover:opacity-90">
                Contact <Mail className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="grid gap-12 pt-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-medium">Experience</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">Selected roles and responsibilities.</p>
              </div>
              <p className="text-sm text-[var(--muted)]">{portfolio.profile.location}</p>
            </div>
            <div className="mt-8 space-y-8">
              {portfolio.experience.map((item) => (
                <article key={`${item.company}-${item.period}`} className="grid gap-3 border-l border-[var(--accent)] pl-5 sm:grid-cols-[0.7fr_1.5fr] sm:gap-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{item.period}</p>
                  <div>
                    <h4 className="text-xl font-medium">{item.role}</h4>
                    <p className="mt-1 text-base text-[var(--accent)]">{item.company}</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-medium">Education</h3>
              <div className="mt-6 space-y-6">
                {portfolio.education.map((item) => (
                  <article key={`${item.institution}-${item.period}`}>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{item.period}</p>
                    <h4 className="mt-2 text-lg font-medium">{item.degree}</h4>
                    <p className="mt-1 text-sm text-[var(--accent)]">{item.institution}</p>
                  </article>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-medium">Capabilities</h3>
              <div className="mt-6 space-y-5">
                {portfolio.skills.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{group.category}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{group.items.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
