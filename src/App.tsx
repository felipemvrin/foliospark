import { useEffect, useState } from 'react'

import { AboutSection } from './components/AboutSection'
import { trackAnalyticsEvent } from './lib/analytics'
import { BehanceSection } from './components/BehanceSection'
import { ContactSection } from './components/ContactSection'
import { ExperienceSection } from './components/ExperienceSection'
import { GitHubSection } from './components/GitHubSection'
import { Hero } from './components/Hero'
import { useBehanceProjects } from './hooks/useBehanceProjects'
import { isPublicPreview } from './lib/publicPreview'
import { fetchPublishedPortfolio, isPublishedView } from './lib/publishingApi'
import { JournalSection } from './components/JournalSection'
import { ProcessSection } from './components/ProcessSection'
import { NavBar } from './components/NavBar'
import { PortfolioEditor } from './components/editor/PortfolioEditor'
import { ThemePanel } from './components/editor/ThemePanel'
import { SkillsSection } from './components/SkillsSection'
import { SeoHead } from './components/SeoHead'
import { ThemeWrapper } from './components/ThemeWrapper'
import { WorkSection } from './components/WorkSection'
import { usePortfolioStore } from './store/portfolioStore'
import { useThemeStore } from './store/themeStore'

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
  const isPublicView = isPublicPreview(window.location.search)
  const isPublished = isPublishedView(window.location.search)

  useEffect(() => {
    void trackAnalyticsEvent({
      name: 'page_view',
      properties: {
        mode: isPublished ? 'published' : isPublicView ? 'preview' : 'editor',
      },
    })
  }, [isPublished, isPublicView])

  if (isPublished) {
    return <PublishedPortfolioLoader><PortfolioPage isPublicView /></PublishedPortfolioLoader>
  }

  return <PortfolioPage isPublicView={isPublicView} />
}

function PortfolioPage({ isPublicView }: { isPublicView: boolean }) {
  const behanceProjects = useBehanceProjects()

  return (
    <ThemeWrapper>
      <SeoHead />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <NavBar />
        <main>
          <Hero />
          <AboutSection />
          <WorkSection />
          <ProcessSection />
          <GitHubSection />
          <JournalSection projects={behanceProjects.projects} />
          <BehanceSection {...behanceProjects} />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection />
          {!isPublicView && (
            <>
              <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
                <ThemePanel />
              </div>
              <PortfolioEditor />
            </>
          )}
        </main>
        <footer className="border-t border-[var(--border)] bg-[var(--background)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-[var(--muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>FolioSpark © 2026</p>
            <p className="uppercase tracking-[0.2em] text-[var(--muted)]">Your professional story, in motion.</p>
          </div>
        </footer>
      </div>
    </ThemeWrapper>
  )
}

export default App
