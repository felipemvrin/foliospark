import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { usePortfolioStore } from '../store/portfolioStore'

export function NavBar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const siteSettings = usePortfolioStore((state) => state.data.siteSettings)
  const navItems = siteSettings?.navigation.items.filter((item) => item.visible) ?? []
  const navigation = siteSettings?.navigation

  useEffect(() => {
    const hero = document.getElementById('top')
    const updateScrolledState = () => setScrolled(window.scrollY > 18)

    if (!hero || !('IntersectionObserver' in window)) {
      updateScrolledState()
      window.addEventListener('scroll', updateScrolledState, { passive: true })

      return () => window.removeEventListener('scroll', updateScrolledState)
    }

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-18px 0px 0px' },
    )
    observer.observe(hero)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false)
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled ? 'border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a href="#top" onClick={() => setOpen(false)} className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.35em] text-[var(--foreground)]">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[0.55rem] tracking-[0.2em]">
            {siteSettings?.logoMark || 'F'}
          </span>
          {siteSettings?.logoText || 'FolioSpark'}
        </a>

        {navigation?.visible !== false ? <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={item.target}
              whileHover={{ y: -2 }}
              className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {item.label}
            </motion.a>
          ))}
        </div> : null}

        <div className="hidden items-center gap-3 md:flex">
          {navigation?.visible !== false ? (
            <motion.a
              href={navigation?.ctaTarget || '#contact'}
              whileHover={{ y: -2, scale: 1.02, rotate: -1 }}
              whileTap={{ scale: 0.98 }}
              className="button-shine inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:shadow-[0_18px_35px_rgba(17,17,17,0.08)]"
            >
              {navigation?.ctaLabel || 'Start a project'} <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.a>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--background-alt)] md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5">
              {navItems.map((item) => (
                <motion.a
                  key={item.id}
                  href={item.target}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--foreground)]"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
