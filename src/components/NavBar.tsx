import { motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getMailtoHref } from '../lib/links'
import { usePortfolioStore } from '../store/portfolioStore'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'GitHub', href: '#github' },
  { label: 'Journal', href: '#behance' },
  { label: 'Contact', href: '#contact' },
]

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const email = usePortfolioStore((state) => state.data.profile.email)
  const emailHref = getMailtoHref(email)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled ? 'border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a href="#top" className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.35em] text-[var(--foreground)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[0.55rem] tracking-[0.2em]">
            F
          </span>
          FolioSpark
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <motion.a
              key={item.href}
              href={item.href}
              whileHover={{ y: -2 }}
              className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {emailHref ? (
            <motion.a
              href={emailHref}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:shadow-[0_18px_35px_rgba(17,17,17,0.08)]"
            >
              Book a call <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--foreground)] opacity-60">
              Book a call <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-[var(--border)] bg-[var(--background-alt)] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
