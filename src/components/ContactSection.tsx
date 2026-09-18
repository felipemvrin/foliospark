import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

import { usePortfolioStore } from '../store/portfolioStore'

export function ContactSection() {
  const portfolio = usePortfolioStore((state) => state.data)

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 text-[var(--on-strong)] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] opacity-70">Contact</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-none sm:text-5xl lg:text-6xl">
              Build the story that follows your work.
            </h2>
          </div>

          <a
            href={`mailto:${portfolio.profile.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--on-accent)] transition hover:opacity-90"
          >
            Email the studio <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-5 border-t border-[var(--border-strong)] pt-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 opacity-70" />
          <a href={`mailto:${portfolio.profile.email}`} className="text-sm">{portfolio.profile.email}</a>
          </div>
          <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 opacity-70" />
          <a href={`tel:${portfolio.profile.phone}`} className="text-sm">{portfolio.profile.phone}</a>
          </div>
          <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 opacity-70" />
          <span className="text-sm">{portfolio.profile.location}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
