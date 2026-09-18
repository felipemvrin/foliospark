import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'GitHub', href: '#github' },
  { label: 'Journal', href: '#behance' },
  { label: 'Contact', href: '#contact' },
]

export function NavBar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-[rgba(250,250,248,0.82)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a href="#top" className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.35em] text-neutral-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-[0.55rem] tracking-[0.2em]">
            F
          </span>
          FolioSpark
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-neutral-600 transition hover:text-neutral-900"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-neutral-900 transition hover:border-neutral-900">
            Book a call <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-neutral-200 bg-[#f7f5f1] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-700"
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
