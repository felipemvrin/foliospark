import { useMemo } from 'react'

import { portfolio } from '../../data/portfolio'
import { themePresets } from '../../data/themes'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useThemeStore } from '../../store/themeStore'
import type { Education, Experience, Portfolio, Profile, Project, SkillGroup, SocialLink } from '../../types/portfolio'

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-neutral-600">
      <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-neutral-500">{label}</span>
      {children}
    </label>
  )
}

export function PortfolioEditor() {
  const [data, setData] = useLocalStorage<Portfolio>('foliospark-portfolio', portfolio)
  const theme = useThemeStore((state) => state.preset)
  const selectedTheme = useMemo(
    () => themePresets.find((item) => item.id === theme) ?? themePresets[0],
    [theme],
  )

  const updateProfile = (field: keyof Profile, value: string) => {
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [field]: value,
      },
    }))
  }

  const updateAbout = (value: string) => {
    setData((current) => ({
      ...current,
      about: value.split(/\n\s*\n/).filter(Boolean),
    }))
  }

  const updateExperience = (index: number, updates: Partial<Experience>) => {
    setData((current) => ({
      ...current,
      experience: current.experience.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, ...updates } : entry,
      ),
    }))
  }

  const addExperience = () => {
    setData((current) => ({
      ...current,
      experience: [
        ...current.experience,
        {
          company: 'New Company',
          role: 'New Role',
          period: '2025 — Present',
          description: 'Describe the role and impact here.',
          technologies: ['Strategy', 'Design'],
        },
      ],
    }))
  }

  const updateEducation = (index: number, updates: Partial<Education>) => {
    setData((current) => ({
      ...current,
      education: current.education.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, ...updates } : entry,
      ),
    }))
  }

  const addEducation = () => {
    setData((current) => ({
      ...current,
      education: [
        ...current.education,
        {
          institution: 'New Institution',
          degree: 'New Degree',
          period: '2024',
          description: 'Add a brief summary of your education.',
        },
      ],
    }))
  }

  const updateSkills = (index: number, updates: Partial<SkillGroup>) => {
    setData((current) => ({
      ...current,
      skills: current.skills.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, ...updates } : entry,
      ),
    }))
  }

  const addSkillGroup = () => {
    setData((current) => ({
      ...current,
      skills: [...current.skills, { category: 'New Category', items: ['Skill A', 'Skill B'] }],
    }))
  }

  const updateProject = (index: number, updates: Partial<Project>) => {
    setData((current) => ({
      ...current,
      projects: current.projects.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, ...updates } : entry,
      ),
    }))
  }

  const addProject = () => {
    setData((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          title: 'New Project',
          category: 'Product',
          year: '2026',
          description: 'Tell the story behind the project.',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
          technologies: ['React', 'TypeScript'],
        },
      ],
    }))
  }

  const updateSocial = (index: number, updates: Partial<SocialLink>) => {
    setData((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, ...updates } : entry,
      ),
    }))
  }

  const addSocial = () => {
    setData((current) => ({
      ...current,
      socialLinks: [...current.socialLinks, { platform: 'website', label: 'Website', url: 'https://example.com' }],
    }))
  }

  const resetData = () => setData(portfolio)

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Editor</p>
          <h2 className="mt-3 font-display text-4xl text-neutral-900 sm:text-5xl">Portfolio administration</h2>
        </div>
        <div
          className="inline-flex w-fit rounded-full border px-3 py-2 text-[0.62rem] uppercase tracking-[0.24em]"
          style={{
            background: selectedTheme.colors.accentSoft,
            borderColor: selectedTheme.colors.border,
            color: selectedTheme.colors.foreground,
          }}
        >
          {selectedTheme.name}
        </div>
      </div>

      <div className="mb-8 flex justify-end">
        <button
          type="button"
          onClick={resetData}
          className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          Reset sample data
        </button>
      </div>

      <div className="space-y-8">
        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Profile</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FieldLabel label="Name">
              <input
                value={data.profile.name}
                onChange={(event) => updateProfile('name', event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
              />
            </FieldLabel>
            <FieldLabel label="Role">
              <input
                value={data.profile.role}
                onChange={(event) => updateProfile('role', event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
              />
            </FieldLabel>
            <FieldLabel label="Location">
              <input
                value={data.profile.location}
                onChange={(event) => updateProfile('location', event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
              />
            </FieldLabel>
            <FieldLabel label="Email">
              <input
                value={data.profile.email}
                onChange={(event) => updateProfile('email', event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
              />
            </FieldLabel>
            <FieldLabel label="Phone">
              <input
                value={data.profile.phone}
                onChange={(event) => updateProfile('phone', event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
              />
            </FieldLabel>
            <FieldLabel label="Website">
              <input
                value={data.profile.website}
                onChange={(event) => updateProfile('website', event.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
              />
            </FieldLabel>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">About</p>
          <textarea
            value={data.about.join('\n\n')}
            onChange={(event) => updateAbout(event.target.value)}
            rows={6}
            className="mt-4 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          />
        </div>

        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Experience</p>
            <button
              type="button"
              onClick={addExperience}
              className="rounded-full border border-neutral-200 px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Add entry
            </button>
          </div>
          <div className="space-y-6">
            {data.experience.map((item, index) => (
              <div key={`${item.company}-${index}`} className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldLabel label="Company">
                    <input
                      value={item.company}
                      onChange={(event) => updateExperience(index, { company: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <FieldLabel label="Role">
                    <input
                      value={item.role}
                      onChange={(event) => updateExperience(index, { role: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <FieldLabel label="Period">
                    <input
                      value={item.period}
                      onChange={(event) => updateExperience(index, { period: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <FieldLabel label="Technologies">
                    <input
                      value={item.technologies.join(', ')}
                      onChange={(event) => updateExperience(index, { technologies: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                </div>
                <FieldLabel label="Description">
                  <textarea
                    value={item.description}
                    onChange={(event) => updateExperience(index, { description: event.target.value })}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Education</p>
            <button
              type="button"
              onClick={addEducation}
              className="rounded-full border border-neutral-200 px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Add entry
            </button>
          </div>
          <div className="space-y-5">
            {data.education.map((item, index) => (
              <div key={`${item.institution}-${index}`} className="rounded-[1.3rem] border border-neutral-200 bg-neutral-50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldLabel label="Institution">
                    <input
                      value={item.institution}
                      onChange={(event) => updateEducation(index, { institution: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <FieldLabel label="Degree">
                    <input
                      value={item.degree}
                      onChange={(event) => updateEducation(index, { degree: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <div className="md:col-span-2">
                    <FieldLabel label="Period">
                      <input
                        value={item.period}
                        onChange={(event) => updateEducation(index, { period: event.target.value })}
                        className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                      />
                    </FieldLabel>
                  </div>
                </div>
                <FieldLabel label="Description">
                  <textarea
                    value={item.description}
                    onChange={(event) => updateEducation(index, { description: event.target.value })}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Skills</p>
            <button
              type="button"
              onClick={addSkillGroup}
              className="rounded-full border border-neutral-200 px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Add group
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.skills.map((group, index) => (
              <div key={`${group.category}-${index}`} className="rounded-[1.4rem] border border-neutral-200 bg-neutral-50 p-4">
                <FieldLabel label="Category">
                  <input
                    value={group.category}
                    onChange={(event) => updateSkills(index, { category: event.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
                <FieldLabel label="Items">
                  <textarea
                    value={group.items.join(', ')}
                    onChange={(event) => updateSkills(index, { items: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Projects</p>
            <button
              type="button"
              onClick={addProject}
              className="rounded-full border border-neutral-200 px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Add project
            </button>
          </div>
          <div className="space-y-5">
            {data.projects.map((project, index) => (
              <div key={`${project.title}-${index}`} className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldLabel label="Title">
                    <input
                      value={project.title}
                      onChange={(event) => updateProject(index, { title: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <FieldLabel label="Category">
                    <input
                      value={project.category}
                      onChange={(event) => updateProject(index, { category: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <FieldLabel label="Year">
                    <input
                      value={project.year}
                      onChange={(event) => updateProject(index, { year: event.target.value })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                  <FieldLabel label="Technologies">
                    <input
                      value={project.technologies.join(', ')}
                      onChange={(event) => updateProject(index, { technologies: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
                      className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </FieldLabel>
                </div>
                <FieldLabel label="Description">
                  <textarea
                    value={project.description}
                    onChange={(event) => updateProject(index, { description: event.target.value })}
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
                <FieldLabel label="Image URL">
                  <input
                    value={project.image}
                    onChange={(event) => updateProject(index, { image: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-neutral-500">Social links</p>
            <button
              type="button"
              onClick={addSocial}
              className="rounded-full border border-neutral-200 px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              Add link
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.socialLinks.map((link, index) => (
              <div key={`${link.platform}-${index}`} className="rounded-[1.3rem] border border-neutral-200 bg-neutral-50 p-4">
                <FieldLabel label="Label">
                  <input
                    value={link.label}
                    onChange={(event) => updateSocial(index, { label: event.target.value })}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
                <FieldLabel label="URL">
                  <input
                    value={link.url}
                    onChange={(event) => updateSocial(index, { url: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
