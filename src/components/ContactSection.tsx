import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'

import { portfolio } from '../data/portfolio'

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-neutral-200 bg-neutral-950 p-6 text-white sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-neutral-400">Contact</p>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-none sm:text-5xl lg:text-6xl">
              Build the story that follows your work.
            </h2>
          </div>

          <a
            href={`mailto:${portfolio.profile.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-900 transition hover:bg-neutral-200"
          >
            Email the studio <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-neutral-300" />
            <a href={`mailto:${portfolio.profile.email}`} className="text-sm text-neutral-200">{portfolio.profile.email}</a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-neutral-300" />
            <a href={`tel:${portfolio.profile.phone}`} className="text-sm text-neutral-200">{portfolio.profile.phone}</a>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-neutral-300" />
            <span className="text-sm text-neutral-200">{portfolio.profile.location}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
