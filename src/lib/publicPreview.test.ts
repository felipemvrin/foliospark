import { describe, expect, it } from 'vitest'

import { getPublicPreviewHref, normalizePublicSlug } from './publicPreview'

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
    expect(url.searchParams.get('slug')).toBe('aster-vale-studio')
  })
})
