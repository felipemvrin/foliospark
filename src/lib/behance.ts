import type { BehanceProject } from '../types/portfolio'
import { getSafeExternalHref } from './links'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function getTags(value: unknown) {
  return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === 'string' && Boolean(tag.trim())) : []
}

function normalizeProject(value: unknown): BehanceProject | null {
  if (!isRecord(value)) {
    return null
  }

  const title = getString(value.title, '')
  const cover = getString(value.cover, '')
  const url = getString(value.url, '')

  if (!title || !cover || !url) {
    return null
  }

  return {
    title,
    description: getString(value.description, 'A visual project from Behance.'),
    cover,
    url,
    category: getString(value.category, 'Visual Design'),
    publishedAt: getString(value.publishedAt, 'Recently published'),
    tags: getTags(value.tags),
  }
}

export function getBehanceProxyUrl() {
  const value = import.meta.env.VITE_BEHANCE_PROXY_URL?.trim()

  if (!value) {
    return null
  }

  return getSafeExternalHref(value)
}

export function getResolvedBehanceProjects({
  savedProjects,
  remoteProjects,
  remoteEndpoint,
  activeEndpoint,
}: {
  savedProjects: BehanceProject[]
  remoteProjects?: BehanceProject[] | null
  remoteEndpoint?: string | null
  activeEndpoint?: string | null
}) {
  if (Array.isArray(remoteProjects) && remoteEndpoint && activeEndpoint && remoteEndpoint === activeEndpoint) {
    return remoteProjects
  }

  return savedProjects
}

export async function fetchBehanceProjects(endpoint: string, signal?: AbortSignal): Promise<BehanceProject[]> {
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Behance proxy request failed with ${response.status}`)
  }

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new Error('Behance proxy returned invalid JSON')
  }
  const rawProjects = isRecord(payload) && Array.isArray(payload.projects) ? payload.projects : payload

  if (!Array.isArray(rawProjects)) {
    throw new Error('Behance proxy returned an invalid project list')
  }

  return rawProjects.flatMap((project) => {
    const normalized = normalizeProject(project)
    return normalized ? [normalized] : []
  })
}
