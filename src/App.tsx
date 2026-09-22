import { useEffect, useState, type MouseEvent } from 'react'

import { AboutSection } from './components/AboutSection'
import { trackAnalyticsEvent } from './lib/analytics'
import { BehanceSection } from './components/BehanceSection'
import { ContactSection } from './components/ContactSection'
import { ExperienceSection } from './components/ExperienceSection'
import { FaqSection } from './components/FaqSection'
import { FinalCtaSection } from './components/FinalCtaSection'
import { GitHubSection } from './components/GitHubSection'
import { Hero } from './components/Hero'
import { useBehanceProjects } from './hooks/useBehanceProjects'
import { isPublicPreview } from './lib/publicPreview'
import { fetchPublishedPortfolio, isPublishedView } from './lib/publishingApi'
import { JournalSection } from './components/JournalSection'
import { ProcessSection } from './components/ProcessSection'
import { ResumeSection } from './components/ResumeSection'
import { ServicesSection } from './components/ServicesSection'
import { NavBar } from './components/NavBar'
import { AdminSectionNav, PortfolioEditor } from './components/editor/PortfolioEditor'
import { ThemePanel } from './components/editor/ThemePanel'
import { SkillsSection } from './components/SkillsSection'
import { SeoHead } from './components/SeoHead'
import { TrustSection } from './components/TrustSection'
import { ThemeWrapper } from './components/ThemeWrapper'
import { WorkSection } from './components/WorkSection'
import { getOrderedSections } from './lib/siteSections'
import { usePortfolioStore } from './store/portfolioStore'
import { useThemeStore } from './store/themeStore'
import type { SiteSectionId } from './types/portfolio'
import { getSafeExternalHref, getSafeFooterHref } from './lib/links'
import { getTranslations, resolveLocalizedFooterTagline } from './lib/i18n'

function PublishedPortfolioLoader({ children }: { children: React.ReactNode }) {
  const setData = usePortfolioStore((state) => state.setData)
  const setPreset = useThemeStore((state) => state.setPreset)
  const publishedSlug = new URLSearchParams(window.location.search).get('slug')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!publishedSlug) {
      return
    }

    const controller = new AbortController()

    fetchPublishedPortfolio(publishedSlug, controller.signal)
      .then((published) => {
        setData(published.portfolio)
        setPreset(published.theme)
        setStatus('ready')
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'This published portfolio could not be loaded.')
          setStatus('error')
        }
      })

    return () => controller.abort()
  }, [publishedSlug, setData, setPreset])

  if (!publishedSlug) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-center text-sm text-[var(--muted)]">This published portfolio URL is missing its slug.</div>
  }

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-sm text-[var(--muted)]">Loading published portfolio…</div>
  }

  if (status === 'error') {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-center text-sm text-[var(--muted)]">{error}</div>
  }

  return children
}

function App() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/'
  const isPublicView = isPublicPreview(window.location.search)
  const isPublished = isPublishedView(window.location.search)
  const isAdminRoute = pathname === '/admin' || pathname.endsWith('/admin')

  useEffect(() => {
    void trackAnalyticsEvent({
      name: 'page_view',
      properties: {
        mode: isPublished ? 'published' : isPublicView ? 'preview' : isAdminRoute ? 'admin' : 'public',
      },
    })
  }, [isAdminRoute, isPublished, isPublicView])

  if (isPublished) {
    return <PublishedPortfolioLoader><PortfolioPage isPublicView isAdminRoute={false} /></PublishedPortfolioLoader>
  }

  return <PortfolioPage isPublicView={isPublicView || !isAdminRoute} isAdminRoute={isAdminRoute} />
}

function PortfolioPage({ isPublicView, isAdminRoute }: { isPublicView: boolean; isAdminRoute: boolean }) {
  const behanceProjects = useBehanceProjects()
  const siteSettings = usePortfolioStore((state) => state.data.siteSettings)
  const profile = usePortfolioStore((state) => state.data.profile)
  const socialLinks = usePortfolioStore((state) => state.data.socialLinks)
  const visibleSocialLinks = socialLinks
    .map((link) => ({ ...link, href: getSafeExternalHref(link.url) }))
    .filter((link): link is typeof link & { href: string } => Boolean(link.href))
  const footerLinks = (siteSettings?.footer.links ?? [])
    .filter((link) => link.visible)
    .map((link) => ({
      ...link,
      href: getSafeFooterHref(link.target),
    }))
    .filter((link): link is typeof link & { href: string } => Boolean(link.href))
  const sections = getOrderedSections(siteSettings?.sections)
  const copy = getTranslations(siteSettings?.locale)
  const footerTagline = resolveLocalizedFooterTagline(siteSettings?.footer.tagline, siteSettings?.locale)

  const renderSection = (id: SiteSectionId) => {
    switch (id) {
      case 'about': return <AboutSection key={id} />
      case 'work': return <WorkSection key={id} />
      case 'process': return <ProcessSection key={id} />
      case 'services': return <ServicesSection key={id} />
      case 'trust': return <TrustSection key={id} />
      case 'github': return <GitHubSection key={id} />
      case 'journal': return <JournalSection key={id} projects={behanceProjects.projects} />
      case 'behance': return <BehanceSection key={id} {...behanceProjects} />
      case 'experience': return <ExperienceSection key={id} />
      case 'skills': return <SkillsSection key={id} />
      case 'resume': return <ResumeSection key={id} />
      case 'faq': return <FaqSection key={id} />
      case 'contact': return <ContactSection key={id} />
      default: return null
    }
  }
  const handleSkipLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const mainContent = document.getElementById('main-content')

    if (!mainContent) {
      return
    }

    mainContent.focus()
    event.currentTarget.blur()
  }

  return (
    <ThemeWrapper>
      <SeoHead />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <a href="#main-content" className="skip-link" onClick={handleSkipLinkClick}>{copy.shell.skipToContent}</a>
        <NavBar />
        <main id="main-content" tabIndex={-1}>
          <Hero />
          {sections.filter((section) => section.visible || section.id === 'contact').map((section) => renderSection(section.id))}
          <FinalCtaSection />
          {isAdminRoute && !isPublicView && (
            <>
              <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">
                <AdminSectionNav />
              </div>
              <div id="appearance-settings" className="mx-auto max-w-7xl scroll-mt-40 px-5 pb-20 sm:px-6 lg:px-8">
                <ThemePanel />
              </div>
              <PortfolioEditor />
            </>
          )}
        </main>
        {siteSettings?.footer.visible !== false ? <footer className="border-t border-[var(--border)] bg-[var(--background)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[var(--muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>{siteSettings?.footer.copyright || 'FolioSpark © 2026'}</p>
            <p className="uppercase tracking-[0.2em] text-[var(--muted)]">{footerTagline}</p>
            {siteSettings?.footer.showLocation !== false ? <p>{profile.location}</p> : null}
          </div>
          {siteSettings?.footer.showSocialLinks !== false && visibleSocialLinks.length > 0 ? (
            <div className="mx-auto flex max-w-7xl flex-wrap gap-4 px-5 pb-8 text-xs text-[var(--muted)] sm:px-6 lg:px-8">
              {visibleSocialLinks.map((link) => (
                <a key={`${link.platform}-${link.label}`} href={link.href} target="_blank" rel="noreferrer" className="transition hover:text-[var(--foreground)]">
                  {link.label || link.platform}
                </a>
              ))}
            </div>
          ) : null}
          {footerLinks.length > 0 ? (
            <div className="mx-auto flex max-w-7xl flex-wrap gap-4 px-5 pb-8 text-xs text-[var(--muted)] sm:px-6 lg:px-8">
              {footerLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  target={link.href.startsWith('http://') || link.href.startsWith('https://') ? '_blank' : undefined}
                  rel={link.href.startsWith('http://') || link.href.startsWith('https://') ? 'noreferrer' : undefined}
                  className="transition hover:text-[var(--foreground)]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </footer> : null}
      </div>
    </ThemeWrapper>
  )
}

export default App
