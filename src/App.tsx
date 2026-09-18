import { AboutSection } from './components/AboutSection'
import { BehanceSection } from './components/BehanceSection'
import { ContactSection } from './components/ContactSection'
import { ExperienceSection } from './components/ExperienceSection'
import { GitHubSection } from './components/GitHubSection'
import { Hero } from './components/Hero'
import { NavBar } from './components/NavBar'
import { PortfolioEditor } from './components/editor/PortfolioEditor'
import { ThemePanel } from './components/editor/ThemePanel'
import { SkillsSection } from './components/SkillsSection'
import { ThemeWrapper } from './components/ThemeWrapper'
import { WorkSection } from './components/WorkSection'

function App() {
  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <NavBar />
        <main>
          <Hero />
          <AboutSection />
          <WorkSection />
          <GitHubSection />
          <BehanceSection />
          <ExperienceSection />
          <SkillsSection />
          <ContactSection />
          <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
            <ThemePanel />
          </div>
          <PortfolioEditor />
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
