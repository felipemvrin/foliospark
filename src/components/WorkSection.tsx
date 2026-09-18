import { usePortfolioStore } from '../store/portfolioStore'
import { ProjectCard } from './ProjectCard'
import { SectionHeading } from './SectionHeading'

export function WorkSection() {
  const portfolio = usePortfolioStore((state) => state.data)

  return (
    <section id="work" className="bg-[var(--background-alt)] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Selected work"
          title="Designed for attention, built for trust."
          description="A refined mix of portfolio storytelling and product thinking — each project is designed to feel editorial, useful, and distinctly memorable."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {portfolio.projects.map((project, index) => (
            <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
