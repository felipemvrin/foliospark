import { useMemo, useRef, useState } from 'react'
import { Clipboard, Download, Trash2, Upload } from 'lucide-react'

import { themePresets } from '../../data/themes'
import { getPublicPreviewHref } from '../../lib/publicPreview'
import { downloadPortfolio, isPortfolio } from '../../lib/portfolioTransfer'
import { usePortfolioStore } from '../../store/portfolioStore'
import { useThemeStore } from '../../store/themeStore'
import type { BehanceProject, Education, Experience, PortfolioMetric, Profile, Project, SkillGroup, SocialLink } from '../../types/portfolio'

const panelClassName = 'rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-5'
const nestedPanelClassName = 'rounded-[1.5rem] border border-[var(--border)] bg-[var(--background-alt)] p-4'
const nestedPanelCompactClassName = 'rounded-[1.4rem] border border-[var(--border)] bg-[var(--background-alt)] p-4'
const inputClassName =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--accent)]'
const textareaClassName =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--accent)]'
const actionButtonClassName =
  'rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:opacity-90'

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-[var(--muted)]">
      <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-[var(--muted)]">{label}</span>
      {children}
    </label>
  )
}

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const input = document.createElement('textarea')
  input.value = value
  input.setAttribute('readonly', '')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.append(input)
  input.select()

  try {
    if (!document.execCommand('copy')) {
      throw new Error('Copy failed')
    }
  } finally {
    input.remove()
  }
}

export function PortfolioEditor() {
  const importInputRef = useRef<HTMLInputElement>(null)
  const [transferMessage, setTransferMessage] = useState('')
  const [shareMessage, setShareMessage] = useState<{ href: string; id: number; text: string } | null>(null)
  const data = usePortfolioStore((state) => state.data)
  const resetData = usePortfolioStore((state) => state.resetData)
  const setData = usePortfolioStore((state) => state.setData)
  const theme = useThemeStore((state) => state.preset)
  const selectedTheme = useMemo(
    () => themePresets.find((item) => item.id === theme) ?? themePresets[0],
    [theme],
  )
  const publicPreviewHref = useMemo(() => getPublicPreviewHref(data, theme, data.profile.slug), [data, theme])

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

  const updateMetric = (index: number, updates: Partial<PortfolioMetric>) => {
    setData((current) => ({
      ...current,
      metrics: current.metrics.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, ...updates } : entry,
      ),
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

  const removeExperience = (index: number) => {
    setData((current) => ({
      ...current,
      experience: current.experience.filter((_, itemIndex) => itemIndex !== index),
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

  const removeEducation = (index: number) => {
    setData((current) => ({
      ...current,
      education: current.education.filter((_, itemIndex) => itemIndex !== index),
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

  const removeSkillGroup = (index: number) => {
    setData((current) => ({
      ...current,
      skills: current.skills.filter((_, itemIndex) => itemIndex !== index),
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

  const removeProject = (index: number) => {
    setData((current) => ({
      ...current,
      projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateBehanceProject = (index: number, updates: Partial<BehanceProject>) => {
    setData((current) => ({
      ...current,
      behanceProjects: current.behanceProjects.map((entry, itemIndex) =>
        itemIndex === index ? { ...entry, ...updates } : entry,
      ),
    }))
  }

  const addBehanceProject = () => {
    setData((current) => ({
      ...current,
      behanceProjects: [
        ...current.behanceProjects,
        {
          title: 'New Visual Story',
          description: 'Describe the visual story and its creative direction.',
          cover: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
          url: 'https://behance.net',
          category: 'Visual Design',
          publishedAt: '2026',
          tags: ['Brand', 'Motion'],
        },
      ],
    }))
  }

  const removeBehanceProject = (index: number) => {
    setData((current) => ({
      ...current,
      behanceProjects: current.behanceProjects.filter((_, itemIndex) => itemIndex !== index),
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

  const removeSocial = (index: number) => {
    setData((current) => ({
      ...current,
      socialLinks: current.socialLinks.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const exportData = () => {
    downloadPortfolio(data)
    setTransferMessage('Portfolio exported.')
  }

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const importedData: unknown = JSON.parse(await file.text())

      if (!isPortfolio(importedData)) {
        throw new Error('Invalid portfolio')
      }

      setData(importedData)
      setTransferMessage('Portfolio imported.')
    } catch {
      setTransferMessage('Could not import that file. Use a FolioSpark JSON export.')
    } finally {
      event.target.value = ''
    }
  }

  const copyPublicLink = async () => {
    try {
      await copyTextToClipboard(new URL(publicPreviewHref, window.location.href).href)
      setShareMessage((current) => ({
        href: publicPreviewHref,
        id: (current?.id ?? 0) + 1,
        text: 'Public link copied.',
      }))
    } catch {
      setShareMessage((current) => ({
        href: publicPreviewHref,
        id: (current?.id ?? 0) + 1,
        text: 'Copy is unavailable. Use Open public preview instead.',
      }))
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Editor</p>
          <h2 className="mt-3 font-display text-4xl text-[var(--foreground)] sm:text-5xl">Portfolio administration</h2>
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

      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-y border-[var(--border)] py-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          <a
            href={publicPreviewHref}
            target="_blank"
            rel="noreferrer"
            className={actionButtonClassName}
          >
            Open public preview
          </a>
          <button type="button" onClick={copyPublicLink} className={actionButtonClassName}>
            <Clipboard className="mr-2 inline-block h-3.5 w-3.5" />
            Copy public link
          </button>
          <button type="button" onClick={exportData} className={actionButtonClassName}>
            <Download className="mr-2 inline-block h-3.5 w-3.5" />
            Export JSON
          </button>
          <button type="button" onClick={() => importInputRef.current?.click()} className={actionButtonClassName}>
            <Upload className="mr-2 inline-block h-3.5 w-3.5" />
            Import JSON
          </button>
          <input ref={importInputRef} type="file" accept="application/json,.json" onChange={importData} className="hidden" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {shareMessage?.href === publicPreviewHref ? (
            <p role="status" className="text-xs text-[var(--muted)]">{shareMessage.text}</p>
          ) : null}
          {transferMessage && (
            <p role="status" className="text-xs text-[var(--muted)]">
              {transferMessage}
            </p>
          )}
          <button
            type="button"
            onClick={resetData}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-[var(--foreground)] transition hover:opacity-90"
          >
            Reset sample data
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div className={panelClassName}>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Profile</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FieldLabel label="Name">
              <input
                value={data.profile.name}
                onChange={(event) => updateProfile('name', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Role">
              <input
                value={data.profile.role}
                onChange={(event) => updateProfile('role', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Headline">
              <input
                value={data.profile.headline}
                onChange={(event) => updateProfile('headline', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Photo URL">
              <input
                value={data.profile.photo}
                onChange={(event) => updateProfile('photo', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Location">
              <input
                value={data.profile.location}
                onChange={(event) => updateProfile('location', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Email">
              <input
                value={data.profile.email}
                onChange={(event) => updateProfile('email', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Phone">
              <input
                value={data.profile.phone}
                onChange={(event) => updateProfile('phone', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Website">
              <input
                value={data.profile.website}
                onChange={(event) => updateProfile('website', event.target.value)}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Site URL">
              <input
                value={data.profile.siteUrl ?? ''}
                onChange={(event) => updateProfile('siteUrl', event.target.value)}
                className={inputClassName}
                placeholder="https://www.astervale.studio"
              />
            </FieldLabel>
            <FieldLabel label="Public URL slug">
              <input
                value={data.profile.slug ?? ''}
                onChange={(event) => updateProfile('slug', event.target.value)}
                className={inputClassName}
                placeholder="aster-vale"
              />
            </FieldLabel>
            <div className="md:col-span-2">
              <FieldLabel label="Bio">
                <textarea
                  value={data.profile.bio}
                  onChange={(event) => updateProfile('bio', event.target.value)}
                  rows={3}
                  className={textareaClassName}
                />
              </FieldLabel>
            </div>
          </div>
        </div>

        <div className={panelClassName}>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Metrics</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {data.metrics.map((metric, index) => (
              <div key={`${metric.label}-${index}`} className={nestedPanelCompactClassName}>
                <FieldLabel label="Value">
                  <input
                    value={metric.value}
                    onChange={(event) => updateMetric(index, { value: event.target.value })}
                    className={inputClassName}
                  />
                </FieldLabel>
                <FieldLabel label="Label">
                  <input
                    value={metric.label}
                    onChange={(event) => updateMetric(index, { label: event.target.value })}
                    className={inputClassName}
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className={panelClassName}>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">About</p>
          <textarea
            value={data.about.join('\n\n')}
            onChange={(event) => updateAbout(event.target.value)}
            rows={6}
            className={`${inputClassName} mt-4 text-sm`}
          />
        </div>

        <div className={panelClassName}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Experience</p>
            <button
              type="button"
              onClick={addExperience}
              className={actionButtonClassName}
            >
              Add entry
            </button>
          </div>
          <div className="space-y-6">
            {data.experience.map((item, index) => (
              <div key={`${item.company}-${index}`} className={nestedPanelClassName}>
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className={actionButtonClassName}
                    aria-label={`Remove ${item.company} experience`}
                  >
                    <Trash2 className="mr-2 inline-block h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldLabel label="Company">
                    <input
                      value={item.company}
                      onChange={(event) => updateExperience(index, { company: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Role">
                    <input
                      value={item.role}
                      onChange={(event) => updateExperience(index, { role: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Period">
                    <input
                      value={item.period}
                      onChange={(event) => updateExperience(index, { period: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Technologies">
                    <input
                      value={item.technologies.join(', ')}
                      onChange={(event) => updateExperience(index, { technologies: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                </div>
                <FieldLabel label="Description">
                  <textarea
                    value={item.description}
                    onChange={(event) => updateExperience(index, { description: event.target.value })}
                    rows={3}
                    className={textareaClassName}
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className={panelClassName}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Education</p>
            <button
              type="button"
              onClick={addEducation}
              className={actionButtonClassName}
            >
              Add entry
            </button>
          </div>
          <div className="space-y-5">
            {data.education.map((item, index) => (
              <div key={`${item.institution}-${index}`} className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--background-alt)] p-4">
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className={actionButtonClassName}
                    aria-label={`Remove ${item.institution} education`}
                  >
                    <Trash2 className="mr-2 inline-block h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldLabel label="Institution">
                    <input
                      value={item.institution}
                      onChange={(event) => updateEducation(index, { institution: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Degree">
                    <input
                      value={item.degree}
                      onChange={(event) => updateEducation(index, { degree: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <div className="md:col-span-2">
                    <FieldLabel label="Period">
                      <input
                        value={item.period}
                        onChange={(event) => updateEducation(index, { period: event.target.value })}
                        className={inputClassName}
                      />
                    </FieldLabel>
                  </div>
                </div>
                <FieldLabel label="Description">
                  <textarea
                    value={item.description}
                    onChange={(event) => updateEducation(index, { description: event.target.value })}
                    rows={3}
                    className={textareaClassName}
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className={panelClassName}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Skills</p>
            <button
              type="button"
              onClick={addSkillGroup}
              className={actionButtonClassName}
            >
              Add group
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.skills.map((group, index) => (
              <div key={`${group.category}-${index}`} className={nestedPanelCompactClassName}>
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSkillGroup(index)}
                    className={actionButtonClassName}
                    aria-label={`Remove ${group.category} skill group`}
                  >
                    <Trash2 className="mr-2 inline-block h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <FieldLabel label="Category">
                  <input
                    value={group.category}
                    onChange={(event) => updateSkills(index, { category: event.target.value })}
                    className={inputClassName}
                  />
                </FieldLabel>
                <FieldLabel label="Items">
                  <textarea
                    value={group.items.join(', ')}
                    onChange={(event) => updateSkills(index, { items: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
                    rows={4}
                    className={textareaClassName}
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className={panelClassName}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Projects</p>
            <button
              type="button"
              onClick={addProject}
              className={actionButtonClassName}
            >
              Add project
            </button>
          </div>
          <div className="space-y-5">
            {data.projects.map((project, index) => (
              <div key={`${project.title}-${index}`} className={nestedPanelClassName}>
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className={actionButtonClassName}
                    aria-label={`Remove ${project.title} project`}
                  >
                    <Trash2 className="mr-2 inline-block h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldLabel label="Title">
                    <input
                      value={project.title}
                      onChange={(event) => updateProject(index, { title: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Category">
                    <input
                      value={project.category}
                      onChange={(event) => updateProject(index, { category: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Year">
                    <input
                      value={project.year}
                      onChange={(event) => updateProject(index, { year: event.target.value })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                  <FieldLabel label="Technologies">
                    <input
                      value={project.technologies.join(', ')}
                      onChange={(event) => updateProject(index, { technologies: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })}
                      className={inputClassName}
                    />
                  </FieldLabel>
                </div>
                <FieldLabel label="Description">
                  <textarea
                    value={project.description}
                    onChange={(event) => updateProject(index, { description: event.target.value })}
                    rows={3}
                    className={textareaClassName}
                  />
                </FieldLabel>
                <FieldLabel label="Image URL">
                  <input
                    value={project.image}
                    onChange={(event) => updateProject(index, { image: event.target.value })}
                    className={textareaClassName}
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className={panelClassName}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Social links</p>
            <button
              type="button"
              onClick={addSocial}
              className={actionButtonClassName}
            >
              Add link
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.socialLinks.map((link, index) => (
              <div key={`${link.platform}-${index}`} className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--background-alt)] p-4">
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSocial(index)}
                    className={actionButtonClassName}
                    aria-label={`Remove ${link.label} link`}
                  >
                    <Trash2 className="mr-2 inline-block h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <FieldLabel label="Label">
                  <input
                    value={link.label}
                    onChange={(event) => updateSocial(index, { label: event.target.value })}
                    className={inputClassName}
                  />
                </FieldLabel>
                <FieldLabel label="URL">
                  <input
                    value={link.url}
                    onChange={(event) => updateSocial(index, { url: event.target.value })}
                    className={textareaClassName}
                  />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>

        <div className={panelClassName}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Behance projects</p>
            <button type="button" onClick={addBehanceProject} className={actionButtonClassName}>
              Add project
            </button>
          </div>
          <div className="space-y-5">
            {data.behanceProjects.map((project, index) => (
              <div key={`${project.title}-${index}`} className={nestedPanelClassName}>
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeBehanceProject(index)}
                    className={actionButtonClassName}
                    aria-label={`Remove ${project.title} Behance project`}
                  >
                    <Trash2 className="mr-2 inline-block h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldLabel label="Title">
                    <input value={project.title} onChange={(event) => updateBehanceProject(index, { title: event.target.value })} className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Category">
                    <input value={project.category} onChange={(event) => updateBehanceProject(index, { category: event.target.value })} className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Published">
                    <input value={project.publishedAt} onChange={(event) => updateBehanceProject(index, { publishedAt: event.target.value })} className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Tags">
                    <input value={project.tags.join(', ')} onChange={(event) => updateBehanceProject(index, { tags: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Cover URL">
                    <input value={project.cover} onChange={(event) => updateBehanceProject(index, { cover: event.target.value })} className={inputClassName} />
                  </FieldLabel>
                  <FieldLabel label="Project URL">
                    <input value={project.url} onChange={(event) => updateBehanceProject(index, { url: event.target.value })} className={inputClassName} />
                  </FieldLabel>
                </div>
                <FieldLabel label="Description">
                  <textarea value={project.description} onChange={(event) => updateBehanceProject(index, { description: event.target.value })} rows={3} className={textareaClassName} />
                </FieldLabel>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
