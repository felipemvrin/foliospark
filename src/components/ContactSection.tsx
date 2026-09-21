import { motion } from 'framer-motion'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react'

import { getMailtoHref, getSafeExternalHref, getSafePhoneHref } from '../lib/links'
import { normalizeAnalyticsDimension, trackAnalyticsEvent } from '../lib/analytics'
import { usePortfolioStore } from '../store/portfolioStore'

const projectTypeAnalyticsValues = ['Brand positioning', 'Portfolio experience', 'Product narrative', 'Something else'] as const
const budgetAnalyticsValues = ['Under $2,500', '$2,500 – $5,000', '$5,000 – $10,000', '$10,000+'] as const
const timelineAnalyticsValues = ['Exploring', 'Within 1 month', '1–3 months', '3+ months'] as const

export function ContactSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const [formMessage, setFormMessage] = useState('')
  const email = portfolio.profile.email.trim()
  const emailHref = getMailtoHref(portfolio.profile.email)
  const phone = portfolio.profile.phone.trim()
  const phoneHref = getSafePhoneHref(portfolio.profile.phone)
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
    const projectType = String(form.get('projectType') ?? '').trim()
    const budget = String(form.get('budget') ?? '').trim()
    const timeline = String(form.get('timeline') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()
    const subject = `${projectType || 'Project inquiry'} from ${senderName}`
    const body = [
      `Name: ${senderName}`,
      `Email: ${senderEmail}`,
      `Project type: ${projectType || 'Not specified'}`,
      `Budget: ${budget || 'Not specified'}`,
      `Timeline: ${timeline || 'Not specified'}`,
      '',
      message,
    ].join('\n')

    const inquiryHref = getMailtoHref(portfolio.profile.email, subject, body)

    if (!inquiryHref) {
      setFormMessage('Add an email address before sending an inquiry.')
      return
    }

    void trackAnalyticsEvent({
      name: 'inquiry_started',
      properties: {
        projectType: normalizeAnalyticsDimension(projectType, projectTypeAnalyticsValues),
        budget: normalizeAnalyticsDimension(budget, budgetAnalyticsValues),
        timeline: normalizeAnalyticsDimension(timeline, timelineAnalyticsValues),
      },
    })
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

        <form onSubmit={handleSubmit} className="mt-10 grid gap-4 border-t border-[var(--border-strong)] pt-8 md:grid-cols-2">
          <label className="text-sm opacity-80">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Name</span>
            <input name="name" required className="input-shell w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none" />
          </label>
          <label className="text-sm opacity-80">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Email</span>
            <input name="email" type="email" required className="input-shell w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none" />
          </label>
          <label className="text-sm opacity-80">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Project type</span>
            <select name="projectType" className="input-shell w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none">
              <option value="">Select an option</option>
              <option value="Brand positioning">Brand positioning</option>
              <option value="Portfolio experience">Portfolio experience</option>
              <option value="Product narrative">Product narrative</option>
              <option value="Something else">Something else</option>
            </select>
          </label>
          <label className="text-sm opacity-80">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Budget range</span>
            <select name="budget" className="input-shell w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none">
              <option value="">Select an option</option>
              <option value="Under $2,500">Under $2,500</option>
              <option value="$2,500 – $5,000">$2,500 – $5,000</option>
              <option value="$5,000 – $10,000">$5,000 – $10,000</option>
              <option value="$10,000+">$10,000+</option>
            </select>
          </label>
          <label className="text-sm opacity-80">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Timeline</span>
            <select name="timeline" className="input-shell w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none">
              <option value="">Select an option</option>
              <option value="Exploring">Exploring</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="1–3 months">1–3 months</option>
              <option value="3+ months">3+ months</option>
            </select>
          </label>
          <label className="text-sm opacity-80 md:col-span-2">
            <span className="mb-2 block text-[0.65rem] uppercase tracking-[0.2em]">Project brief</span>
            <textarea name="message" required rows={4} className="input-shell w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none" />
          </label>
          <div className="flex flex-wrap items-center gap-4 md:col-span-2">
            <motion.button
              type="submit"
              disabled={!emailHref}
              whileHover={emailHref ? { y: -2, scale: 1.01 } : undefined}
              whileTap={emailHref ? { scale: 0.98 } : undefined}
              className="button-shine inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[var(--on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send inquiry <Send className="h-4 w-4" />
            </motion.button>
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
            {phoneHref ? (
              <a href={phoneHref} className="text-sm">
                {phone}
              </a>
            ) : (
              <span className="text-sm opacity-70">Add a phone number</span>
            )}
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
              <motion.a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ x: 3, y: -1 }}
                className="inline-flex items-center gap-2 text-sm opacity-80 transition hover:opacity-100"
              >
                {link.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </motion.a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
