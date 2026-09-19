import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react'

import { getMailtoHref, getSafeExternalHref } from '../lib/links'
import { usePortfolioStore } from '../store/portfolioStore'

export function ContactSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const [formMessage, setFormMessage] = useState('')
  const email = portfolio.profile.email.trim()
  const emailHref = getMailtoHref(portfolio.profile.email)
  const socialLinks = portfolio.socialLinks.reduce<Array<{ href: string; key: string; label: string }>>((links, link, index) => {
    const href = getSafeExternalHref(link.url)

    if (!href) {
      return links
    }

    links.push({
      href,
      key: `${link.platform}-${index}`,
      label: link.label.trim() || link.platform,
    })

    return links
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const senderName = String(form.get('name') ?? '').trim()
    const senderEmail = String(form.get('email') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()
    const subject = `Project inquiry from ${senderName}`
    const body = `Name: ${senderName}\nEmail: ${senderEmail}\n\n${message}`

    const inquiryHref = getMailtoHref(portfolio.profile.email, subject, body)

    if (!inquiryHref) {
      setFormMessage('Add an email address before sending an inquiry.')
      return
    }

    window.location.href = inquiryHref
    setFormMessage('Your email client is opening.')
  }

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

          {emailHref ? (
            <a
              href={emailHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--on-accent)] transition hover:opacity-90"
            >
              Email the studio <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <span className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--on-accent)] opacity-60">
              Email the studio <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-4 border-t border-[var(--border-strong)] pt-8 md:grid-cols-2">
          <label className="text-sm opacity-80">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Name</span>
            <input name="name" required className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)]" />
          </label>
          <label className="text-sm opacity-80">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Email</span>
            <input name="email" type="email" required className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)]" />
          </label>
          <label className="text-sm opacity-80 md:col-span-2">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Project brief</span>
            <textarea name="message" required rows={4} className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)]" />
          </label>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <button type="submit" disabled={!emailHref} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
              Send inquiry <Send className="h-4 w-4" />
            </button>
            {formMessage ? <p role="status" className="text-sm opacity-70">{formMessage}</p> : null}
          </div>
        </form>

        <div className="mt-10 grid gap-5 border-t border-[var(--border-strong)] pt-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 opacity-70" />
            {emailHref ? (
              <a href={emailHref} className="text-sm">
                {email}
              </a>
            ) : (
              <span className="text-sm opacity-70">Add an email address</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 opacity-70" />
            <a href={`tel:${portfolio.profile.phone}`} className="text-sm">
              {portfolio.profile.phone}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 opacity-70" />
            <span className="text-sm">
              {portfolio.profile.location}
            </span>
          </div>
        </div>
        {socialLinks.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--border-strong)] pt-6">
            {socialLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm opacity-80 transition hover:opacity-100"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
