import { describe, expect, it } from 'vitest'

import { getPublicPreviewHref, normalizePublicSlug } from './publicPreview'
import { buildRobotsTxt, buildSitemapXml, getCanonicalSiteUrl, getSeoMetadata, getSiteBasePath, shouldGenerateRobotsTxt } from './seo'

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

  it('falls back to the runtime canonical url when profile site url is invalid', () => {
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
        siteUrl: 'https://exa mple.com',
        photo: '',
      },
      'Minimal',
      'https://preview.example.com/portfolio',
    )

    expect(metadata.url).toBe('https://preview.example.com/portfolio')
  })

  it('rejects non-http protocols for canonical metadata urls', () => {
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
        siteUrl: 'javascript:alert(1)',
        photo: '',
      },
      'Minimal',
      'ftp://preview.example.com/portfolio',
    )

    expect(metadata.url).toBe('')
  })

  it('reuses the canonical site url for static seo files', () => {
    const siteUrl = getCanonicalSiteUrl('https://www.astervale.studio', 'https://preview.example.com/portfolio')

    expect(buildSitemapXml(siteUrl)).toContain('<loc>https://www.astervale.studio/</loc>')
    expect(buildRobotsTxt(siteUrl)).toContain('Sitemap: https://www.astervale.studio/sitemap.xml')
  })

  it('derives the build base path from the deployment site url', () => {
    expect(getSiteBasePath('https://www.astervale.studio')).toBe('/')
    expect(getSiteBasePath('https://felipemvrin.github.io/foliospark/')).toBe('/foliospark/')
  })

  it('only generates robots files for root-hosted deployments', () => {
    expect(shouldGenerateRobotsTxt('https://www.astervale.studio')).toBe(true)
    expect(shouldGenerateRobotsTxt('https://felipemvrin.github.io/foliospark/')).toBe(false)
    expect(shouldGenerateRobotsTxt('https://www.astervale.studio/portfolio/')).toBe(false)
  })

  it('generates a sitemap with the configured production site url', () => {
    expect(buildSitemapXml('https://www.astervale.studio')).toContain('<loc>https://www.astervale.studio/</loc>')
  })

  it('generates a robots file that references the sitemap', () => {
    expect(buildRobotsTxt('https://www.astervale.studio')).toContain('Sitemap: https://www.astervale.studio/sitemap.xml')
  })
})
