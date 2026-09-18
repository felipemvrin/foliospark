import { AboutSection } from './components/AboutSection'
import { BehanceSection } from './components/BehanceSection'
import { ContactSection } from './components/ContactSection'
import { ExperienceSection } from './components/ExperienceSection'
import { GitHubSection } from './components/GitHubSection'
import { Hero } from './components/Hero'
import { NavBar } from './components/NavBar'
import { SkillsSection } from './components/SkillsSection'
import { WorkSection } from './components/WorkSection'

function App() {
  return (
    <div className="min-h-screen bg-[#f7f5f1] text-neutral-900 antialiased">
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
      </main>
      <footer className="border-t border-neutral-200 bg-[#f7f5f1]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-neutral-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>FolioSpark © 2026</p>
          <p className="uppercase tracking-[0.2em] text-neutral-500">Your professional story, in motion.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
