import { describe, expect, it } from 'vitest'

import { getPublicPreviewHref, normalizePublicSlug } from './publicPreview'
import { getSeoMetadata } from './seo'

describe('public preview urls', () => {
  it('normalizes a custom slug for public links', () => {
    expect(normalizePublicSlug('Aster Vale!')).toBe('aster-vale')
    expect(normalizePublicSlug('  /studio  ')).toBe('studio')
  })

  it('includes a custom public slug in the generated preview url', () => {
    const href = getPublicPreviewHref(
      {
        profile: {
          name: 'Aster Vale',
          role: 'Design Engineer',
          headline: '',
          bio: '',
          location: '',
          email: '',
          phone: '',
          website: '',
          photo: '',
          slug: 'aster-vale',
        },
        metrics: [],
        about: [],
        experience: [],
        education: [],
        skills: [],
        projects: [],
        githubProjects: [],
        behanceProjects: [],
        socialLinks: [],
      },
      'Minimal',
      'Aster Vale Studio',
    )

    const url = new URL(href)

    expect(url.searchParams.get('view')).toBe('public')
    expect(url.hash).toBe('#aster-vale-studio')
    expect(url.searchParams.get('slug')).toBe('aster-vale-studio')
  })

  it('prefers the explicit custom slug over the profile slug fallback', () => {
    const href = getPublicPreviewHref(
      {
        profile: {
          name: 'Aster Vale',
          role: 'Design Engineer',
          headline: '',
          bio: '',
          location: '',
          email: '',
          phone: '',
          website: '',
          photo: '',
          slug: 'profile-fallback',
        },
        metrics: [],
        about: [],
        experience: [],
        education: [],
        skills: [],
        projects: [],
        githubProjects: [],
        behanceProjects: [],
        socialLinks: [],
      },
      'Minimal',
      'Launch / 2026',
    )

    const url = new URL(href)

    expect(url.hash).toBe('#launch-2026')
    expect(url.searchParams.get('slug')).toBe('launch-2026')
  })

  it('prefers a configured public site url for canonical metadata', () => {
    const metadata = getSeoMetadata(
      {
        name: 'Aster Vale',
        role: 'Design Engineer',
        headline: '',
        bio: 'Creative systems for ambitious teams.',
        location: '',
        email: '',
        phone: '',
        website: 'astervale.studio',
        siteUrl: 'https://www.astervale.studio',
        photo: '',
      },
      'Minimal',
      'https://preview.example.com/portfolio',
    )

    expect(metadata.url).toBe('https://www.astervale.studio/')
  })
})
