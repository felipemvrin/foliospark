import { usePortfolioStore } from '../store/portfolioStore'
import { getTranslations } from '../lib/i18n'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

export function WorkSection() {
  const portfolio = usePortfolioStore((state) => state.data)
  const copy = getTranslations(portfolio.siteSettings?.locale)

  return (
    <section id="work" className="bg-[var(--background-alt)] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={copy.home.workEyebrow}
          title={copy.home.workTitle}
          description={copy.home.workDescription}
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {portfolio.projects.map((project, index) => (
            <ProjectCard
              key={`${project.title}-${index}`}
              project={project}
              index={index}
              copy={{
                viewProject: copy.home.viewProject,
                readCaseStudy: copy.home.readCaseStudy,
                readTheCaseStudy: copy.home.readTheCaseStudy,
                challenge: copy.home.challenge,
                approach: copy.home.approach,
                outcome: copy.home.outcome,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
