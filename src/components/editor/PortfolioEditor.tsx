import { useMemo, useRef, useState } from 'react'
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Clipboard, Download, Trash2, Upload } from 'lucide-react'

import { portfolio as defaultPortfolio } from '../../data/portfolio'
import { createDefaultSiteSettings } from '../../data/siteSettings'
import { themePresets } from '../../data/themes'
import { formatCaseStudyMetrics, parseCaseStudyMetrics } from '../../lib/caseStudy'
import { getSiteFaviconHref } from '../../lib/favicon'
import { getSafeExternalHref } from '../../lib/links'
import { getPublishingReadiness, type PublishingCheckStatus } from '../../lib/publishing'
import { getPublicPreviewHref } from '../../lib/publicPreview'
import { getPublishedPortfolioHref, getPublishingApiUrl, publishPortfolio } from '../../lib/publishingApi'
import { downloadPortfolio, parsePortfolio } from '../../lib/portfolioTransfer'
import { usePortfolioStore } from '../../store/portfolioStore'
import { useThemeStore } from '../../store/themeStore'
import type { BehanceProject, CaseStudy, Education, Experience, Portfolio, PortfolioMetric, Profile, Project, SiteSettings, SkillGroup, SocialLink } from '../../types/portfolio'

const panelClassName = 'rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-5'
const nestedPanelClassName = 'rounded-[1.5rem] border border-[var(--border)] bg-[var(--background-alt)] p-4'
const nestedPanelCompactClassName = 'rounded-[1.4rem] border border-[var(--border)] bg-[var(--background-alt)] p-4'
const inputClassName =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--accent)]'
const textareaClassName =
  'mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--accent)]'
const actionButtonClassName =
  'rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-[var(--foreground)] transition hover:opacity-90'

function createProjectDraftKey() {
  return `project-${crypto.randomUUID()}`
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm text-[var(--muted)]">
      <span className="mb-2 block text-[0.62rem] uppercase tracking-[0.24em] text-[var(--muted)]">{label}</span>
      {children}
    </label>
  )
}

function getCheckTone(status: PublishingCheckStatus) {
  if (status === 'ready') {
    return {
      icon: CheckCircle2,
      className: 'border-emerald-200/70 bg-emerald-50/60 text-emerald-800',
    }
  }

  if (status === 'blocked') {
    return {
      icon: AlertTriangle,
      className: 'border-rose-200/70 bg-rose-50/60 text-rose-800',
    }
  }

  return {
    icon: AlertTriangle,
    className: 'border-amber-200/70 bg-amber-50/60 text-amber-800',
  }
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
  const data = usePortfolioStore((state) => state.data)
  const resetData = usePortfolioStore((state) => state.resetData)
  const setData = usePortfolioStore((state) => state.setData)
  const [transferMessage, setTransferMessage] = useState('')
  const [shareMessage, setShareMessage] = useState<{ href: string; id: number; text: string } | null>(null)
  const [publishMessage, setPublishMessage] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [projectDraftKeys, setProjectDraftKeys] = useState(() => data.projects.map(() => createProjectDraftKey()))
  const [projectCaseStudyMetricDrafts, setProjectCaseStudyMetricDrafts] = useState<Record<string, string>>({})
  const theme = useThemeStore((state) => state.preset)
  const selectedTheme = useMemo(
    () => themePresets.find((item) => item.id === theme) ?? themePresets[0],
    [theme],
  )
  const publicPreviewHref = useMemo(() => getPublicPreviewHref(data, theme, data.profile.slug), [data, theme])
  const publishedHref = useMemo(() => getPublishedPortfolioHref(data.profile.slug || data.profile.name), [data.profile.name, data.profile.slug])
  const publishingReadiness = useMemo(() => getPublishingReadiness(data), [data])

  const updateProfile = (field: keyof Profile, value: string) => {
    setData((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [field]: value,
      },
    }))
  }

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setData((current) => ({
      ...current,
      siteSettings: {
        ...createDefaultSiteSettings(),
        ...current.siteSettings,
        ...updates,
      },
    }))
  }

  const updateFooterSettings = (updates: Partial<NonNullable<Portfolio['siteSettings']>['footer']>) => {
    setData((current) => {
      const settings = current.siteSettings ?? createDefaultSiteSettings()

      return {
        ...current,
        siteSettings: {
          ...settings,
          footer: { ...settings.footer, ...updates },
        },
      }
    })
  }

  const updateFooterLink = (index: number, updates: Partial<NonNullable<Portfolio['siteSettings']>['footer']['links'][number]>) => {
    setData((current) => {
      const settings = current.siteSettings ?? createDefaultSiteSettings()

      return {
        ...current,
        siteSettings: {
          ...settings,
          footer: {
            ...settings.footer,
            links: settings.footer.links.map((link, linkIndex) =>
              linkIndex === index ? { ...link, ...updates } : link,
            ),
          },
        },
      }
    })
  }

  const addFooterLink = () => {
    const settings = data.siteSettings ?? createDefaultSiteSettings()
    updateFooterSettings({
      links: [
        ...settings.footer.links,
        { id: `footer-link-${settings.footer.links.length + 1}`, label: 'New link', target: '#contact', visible: true },
      ],
    })
  }

  const removeFooterLink = (index: number) => {
    const settings = data.siteSettings ?? createDefaultSiteSettings()
    updateFooterSettings({ links: settings.footer.links.filter((_, linkIndex) => linkIndex !== index) })
  }

  const updateNavigationSettings = (updates: Partial<NonNullable<Portfolio['siteSettings']>['navigation']>) => {
    setData((current) => {
      const settings = current.siteSettings ?? createDefaultSiteSettings()

      return {
        ...current,
        siteSettings: {
          ...settings,
          navigation: { ...settings.navigation, ...updates },
        },
      }
    })
  }

  const updateNavigationItem = (index: number, updates: Partial<NonNullable<Portfolio['siteSettings']>['navigation']['items'][number]>) => {
    setData((current) => {
      const settings = current.siteSettings ?? createDefaultSiteSettings()

      return {
        ...current,
        siteSettings: {
          ...settings,
          navigation: {
            ...settings.navigation,
            items: settings.navigation.items.map((item, itemIndex) =>
              itemIndex === index ? { ...item, ...updates } : item,
            ),
          },
        },
      }
    })
  }

  const updateSectionVisibility = (id: NonNullable<Portfolio['siteSettings']>['sections'][number]['id'], visible: boolean) => {
    setData((current) => {
      const settings = current.siteSettings ?? createDefaultSiteSettings()

      return {
        ...current,
        siteSettings: {
          ...settings,
          sections: settings.sections.map((section) =>
            section.id === id ? { ...section, visible } : section,
          ),
        },
      }
    })
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    setData((current) => {
      const settings = current.siteSettings ?? createDefaultSiteSettings()
      const nextIndex = index + direction

      if (nextIndex < 0 || nextIndex >= settings.sections.length) {
        return current
      }

      const sections = [...settings.sections]
      const [section] = sections.splice(index, 1)
      sections.splice(nextIndex, 0, section)

      return {
        ...current,
        siteSettings: {
          ...settings,
          sections,
        },
      }
    })
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

  const updateProjectCaseStudy = (index: number, updates: Partial<CaseStudy>) => {
    setData((current) => ({
      ...current,
      projects: current.projects.map((entry, itemIndex) => {
        if (itemIndex !== index || !entry.caseStudy) {
          return entry
        }

        return {
          ...entry,
          caseStudy: {
            ...entry.caseStudy,
            ...updates,
          },
        }
      }),
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
    setProjectDraftKeys((current) => [...current, createProjectDraftKey()])
  }

  const removeProject = (index: number) => {
    const draftKey = projectDraftKeys[index]

    setData((current) => ({
      ...current,
      projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
    }))
    setProjectDraftKeys((current) => current.filter((_, itemIndex) => itemIndex !== index))

    if (!draftKey) {
      return
    }

    setProjectCaseStudyMetricDrafts((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
  }

  const addProjectCaseStudy = (index: number) => {
    updateProject(index, {
      caseStudy: {
        challenge: 'Describe the core challenge.',
        approach: 'Explain the approach and key decisions.',
        outcome: 'Summarize the outcome and impact.',
        metrics: [],
      },
    })
  }

  const removeProjectCaseStudy = (index: number) => {
    const draftKey = projectDraftKeys[index]

    updateProject(index, { caseStudy: undefined })

    if (!draftKey) {
      return
    }
    setProjectCaseStudyMetricDrafts((current) => {
      const next = { ...current }
      delete next[draftKey]
      return next
    })
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

  const resetPortfolio = () => {
    resetData()
    setProjectDraftKeys(defaultPortfolio.projects.map(() => createProjectDraftKey()))
    setProjectCaseStudyMetricDrafts({})
  }

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const importedData: unknown = JSON.parse(await file.text())
      const portfolio = parsePortfolio(importedData)

      if (!portfolio) {
        throw new Error('Invalid portfolio')
      }

      setData(portfolio)
      setProjectDraftKeys(portfolio.projects.map(() => createProjectDraftKey()))
      setProjectCaseStudyMetricDrafts({})
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

  const publish = async () => {
    if (!getPublishingApiUrl()) {
      setPublishMessage('Configure VITE_PUBLISHING_API_URL to enable hosted publishing.')
      return
    }

    setIsPublishing(true)
    setPublishMessage('Publishing portfolio…')

    try {
      await publishPortfolio(data.profile.slug || data.profile.name, data, theme)
      setPublishMessage('Portfolio published. Use the hosted URL when ready.')
    } catch (error: unknown) {
      setPublishMessage(error instanceof Error ? error.message : 'Could not publish portfolio.')
    } finally {
      setIsPublishing(false)
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
          <button type="button" onClick={publish} disabled={isPublishing} className={actionButtonClassName}>
            {isPublishing ? 'Publishing…' : 'Publish hosted'}
          </button>
          {publishedHref ? (
            <a href={publishedHref} target="_blank" rel="noreferrer" className={actionButtonClassName}>
              Open hosted portfolio
            </a>
          ) : null}
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
          {publishMessage ? <p role="status" className="text-xs text-[var(--muted)]">{publishMessage}</p> : null}
          <button
            type="button"
            onClick={resetPortfolio}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-[var(--foreground)] transition hover:opacity-90"
          >
            Reset sample data
          </button>
        </div>
      </div>

      <section className={panelClassName} aria-labelledby="publishing-readiness-title">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Publishing</p>
            <h3 id="publishing-readiness-title" className="mt-2 text-2xl font-medium text-[var(--foreground)]">
              {publishingReadiness.status === 'ready' ? 'Ready to share' : 'Polish before sharing'}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              {publishingReadiness.completed} of {publishingReadiness.total} publishing checks are complete.
              {publishingReadiness.status === 'blocked'
                ? ' Resolve the blocked items before sending this portfolio out.'
                : publishingReadiness.status === 'warning'
                  ? ' The remaining items are optional, but they improve the visitor experience.'
                  : ' Your current content has the essentials for a confident public preview.'}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--background-alt)] px-4 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            {publishingReadiness.status === 'ready' ? 'Publishable' : 'Needs attention'}
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {publishingReadiness.checks.map((check) => {
            const tone = getCheckTone(check.status)
            const Icon = tone.icon

            return (
              <div key={check.id} className={`rounded-2xl border p-4 ${tone.className}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.16em]">{check.label}</p>
                <p className="mt-2 text-xs leading-5 opacity-80">{check.detail}</p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="space-y-8">
        <div className={panelClassName}>
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Site settings</p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Control the public site's identity and footer without changing portfolio content.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FieldLabel label="Site title">
              <input
                value={data.siteSettings?.title ?? 'FolioSpark'}
                onChange={(event) => updateSiteSettings({ title: event.target.value })}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Logo text">
              <input
                value={data.siteSettings?.logoText ?? 'FolioSpark'}
                onChange={(event) => updateSiteSettings({ logoText: event.target.value })}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Logo mark">
              <input
                value={data.siteSettings?.logoMark ?? 'F'}
                onChange={(event) => updateSiteSettings({ logoMark: event.target.value.slice(0, 2) })}
                className={inputClassName}
                maxLength={2}
              />
            </FieldLabel>
            <FieldLabel label="Favicon URL">
              <input
                value={data.siteSettings?.faviconUrl ?? ''}
                onChange={(event) => updateSiteSettings({ faviconUrl: event.target.value })}
                className={inputClassName}
                placeholder="https://example.com/favicon.svg"
              />
            </FieldLabel>
            <div className="md:col-span-2">
              <FieldLabel label="Site description">
                <textarea
                  value={data.siteSettings?.description ?? ''}
                  onChange={(event) => updateSiteSettings({ description: event.target.value })}
                  rows={3}
                  className={textareaClassName}
                />
              </FieldLabel>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--background-alt)] p-4">
            <img
              src={getSiteFaviconHref(data.siteSettings?.faviconUrl, data.siteSettings?.logoMark ?? 'F', selectedTheme.colors.accent, selectedTheme.colors.foreground)}
              alt="Favicon preview"
              className="h-14 w-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)]">{data.siteSettings?.logoText ?? 'FolioSpark'}</p>
              <p className="mt-1 truncate text-xs text-[var(--muted)]">{data.siteSettings?.description || 'Add a site description for search and social previews.'}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-2">
            <FieldLabel label="Footer copyright">
              <input
                value={data.siteSettings?.footer.copyright ?? ''}
                onChange={(event) => updateFooterSettings({ copyright: event.target.value })}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Footer tagline">
              <input
                value={data.siteSettings?.footer.tagline ?? ''}
                onChange={(event) => updateFooterSettings({ tagline: event.target.value })}
                className={inputClassName}
              />
            </FieldLabel>
            <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={data.siteSettings?.footer.visible ?? true}
                onChange={(event) => updateFooterSettings({ visible: event.target.checked })}
              />
              Show footer
            </label>
            <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={data.siteSettings?.footer.showLocation ?? true}
                onChange={(event) => updateFooterSettings({ showLocation: event.target.checked })}
              />
              Show location in footer
            </label>
            <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={data.siteSettings?.footer.showSocialLinks ?? true}
                onChange={(event) => updateFooterSettings({ showSocialLinks: event.target.checked })}
              />
              Show social links in footer
            </label>
          </div>
          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">Footer links</p>
                <p className="mt-1 text-xs text-[var(--muted)]">Add legal pages or other useful destinations.</p>
              </div>
              <button type="button" onClick={addFooterLink} className={actionButtonClassName}>Add link</button>
            </div>
            <div className="mt-4 space-y-4">
              {(data.siteSettings?.footer.links ?? []).map((link, index) => {
                const target = link.target.trim()
                const hasInvalidTarget = target.length === 0 || (!target.startsWith('#') && !getSafeExternalHref(target))

                return (
                  <div key={link.id} className={nestedPanelCompactClassName}>
                    <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                      <FieldLabel label="Label">
                        <input value={link.label} onChange={(event) => updateFooterLink(index, { label: event.target.value })} className={inputClassName} />
                      </FieldLabel>
                      <FieldLabel label="Target">
                        <input value={link.target} onChange={(event) => updateFooterLink(index, { target: event.target.value })} className={inputClassName} placeholder="/privacy or https://example.com" />
                      </FieldLabel>
                      <div className="flex items-center gap-3 pb-2">
                        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                          <input type="checkbox" checked={link.visible} onChange={(event) => updateFooterLink(index, { visible: event.target.checked })} />
                          Visible
                        </label>
                        <button type="button" onClick={() => removeFooterLink(index)} className={actionButtonClassName} aria-label={`Remove ${link.label} footer link`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {hasInvalidTarget ? <p className="mt-3 text-xs text-rose-700">Use an internal anchor or a valid HTTP/HTTPS URL.</p> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={panelClassName}>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Sections</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Choose which public sections appear and use the ordering buttons to control how they render on the page.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(data.siteSettings?.sections ?? createDefaultSiteSettings().sections).map((section, index, sections) => {
              const isRequired = section.id === 'contact'

              return (
                <div key={section.id} className="rounded-xl border border-[var(--border)] bg-[var(--background-alt)] px-3 py-3 text-sm text-[var(--muted)]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="capitalize">{section.id}</span>
                    <input
                      type="checkbox"
                      checked={section.visible}
                      disabled={isRequired}
                      onChange={(event) => updateSectionVisibility(section.id, event.target.checked)}
                      aria-label={`Show ${section.id} section`}
                    />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => moveSection(index, -1)} disabled={index === 0} className={actionButtonClassName} aria-label={`Move ${section.id} section up`}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className={actionButtonClassName} aria-label={`Move ${section.id} section down`}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">Contact stays enabled so visitors always have a path to reach you.</p>
        </div>

        <div className={panelClassName}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[var(--muted)]">Navigation</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">Edit labels, destinations, visibility, and the primary navigation action.</p>
            </div>
            <label className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={data.siteSettings?.navigation.visible ?? true}
                onChange={(event) => updateNavigationSettings({ visible: event.target.checked })}
              />
              Show navigation
            </label>
          </div>

          <div className="mt-5 grid gap-4 border-b border-[var(--border)] pb-5 md:grid-cols-2">
            <FieldLabel label="Primary CTA label">
              <input
                value={data.siteSettings?.navigation.ctaLabel ?? 'Start a project'}
                onChange={(event) => updateNavigationSettings({ ctaLabel: event.target.value })}
                className={inputClassName}
              />
            </FieldLabel>
            <FieldLabel label="Primary CTA target">
              <input
                value={data.siteSettings?.navigation.ctaTarget ?? '#contact'}
                onChange={(event) => updateNavigationSettings({ ctaTarget: event.target.value })}
                className={inputClassName}
                placeholder="#contact or https://example.com"
              />
            </FieldLabel>
          </div>

          <div className="mt-5 space-y-4">
            {(data.siteSettings?.navigation.items ?? createDefaultSiteSettings().navigation.items).map((item, index) => {
              const target = item.target.trim()
              const isInternalTarget = target.startsWith('#')
              const hasTarget = target.length > 0
              const hasSafeExternalTarget = !isInternalTarget && Boolean(getSafeExternalHref(target))
              const hasInvalidExternalTarget = hasTarget && !isInternalTarget && !hasSafeExternalTarget

              return (
                <div key={`${item.id}-${index}`} className={nestedPanelCompactClassName}>
                  <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <FieldLabel label="Label">
                      <input
                        value={item.label}
                        onChange={(event) => updateNavigationItem(index, { label: event.target.value })}
                        className={inputClassName}
                      />
                    </FieldLabel>
                    <FieldLabel label="Target">
                      <input
                        value={item.target}
                        onChange={(event) => updateNavigationItem(index, { target: event.target.value })}
                        className={inputClassName}
                        placeholder="#work"
                      />
                    </FieldLabel>
                    <label className="flex items-center gap-3 pb-2 text-sm text-[var(--muted)]">
                      <input
                        type="checkbox"
                        checked={item.visible}
                        onChange={(event) => updateNavigationItem(index, { visible: event.target.checked })}
                      />
                      Visible
                    </label>
                  </div>
                  {!hasTarget ? <p className="mt-3 text-xs text-rose-700">Add a target before showing this item.</p> : null}
                  {hasInvalidExternalTarget ? (
                    <p className="mt-3 text-xs text-rose-700">External destinations must use a valid HTTP or HTTPS URL.</p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>

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
            {data.projects.map((project, index) => {
              const projectDraftKey = projectDraftKeys[index]!

              return (
                <div key={projectDraftKey} className={nestedPanelClassName}>
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
                  <div className="mt-4 rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <p className="text-[0.62rem] uppercase tracking-[0.24em] text-[var(--muted)]">Case study</p>
                      {project.caseStudy ? (
                        <button
                          type="button"
                          onClick={() => removeProjectCaseStudy(index)}
                          className={actionButtonClassName}
                        >
                          Remove case study
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addProjectCaseStudy(index)}
                          className={actionButtonClassName}
                        >
                          Add case study
                        </button>
                      )}
                    </div>
                    {project.caseStudy ? (
                      <div className="space-y-4">
                        <FieldLabel label="Challenge">
                          <textarea
                            value={project.caseStudy.challenge}
                            onChange={(event) => updateProjectCaseStudy(index, { challenge: event.target.value })}
                            rows={3}
                            className={textareaClassName}
                          />
                        </FieldLabel>
                        <FieldLabel label="Approach">
                          <textarea
                            value={project.caseStudy.approach}
                            onChange={(event) => updateProjectCaseStudy(index, { approach: event.target.value })}
                            rows={3}
                            className={textareaClassName}
                          />
                        </FieldLabel>
                        <FieldLabel label="Outcome">
                          <textarea
                            value={project.caseStudy.outcome}
                            onChange={(event) => updateProjectCaseStudy(index, { outcome: event.target.value })}
                            rows={3}
                            className={textareaClassName}
                          />
                        </FieldLabel>
                        <FieldLabel label="Metrics (one per line: value | label)">
                          <textarea
                            value={projectCaseStudyMetricDrafts[projectDraftKey] ?? formatCaseStudyMetrics(project.caseStudy.metrics)}
                            onChange={(event) =>
                              setProjectCaseStudyMetricDrafts((current) => ({
                                ...current,
                                [projectDraftKey]: event.target.value,
                              }))
                            }
                            onBlur={(event) => {
                              updateProjectCaseStudy(index, { metrics: parseCaseStudyMetrics(event.target.value) })
                              setProjectCaseStudyMetricDrafts((current) => {
                                const next = { ...current }
                                delete next[projectDraftKey]
                                return next
                              })
                            }}
                            rows={4}
                            className={textareaClassName}
                          />
                        </FieldLabel>
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
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
