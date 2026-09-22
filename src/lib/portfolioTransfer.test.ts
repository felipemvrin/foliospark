import { describe, expect, it } from 'vitest'

import { isPortfolio, parsePortfolio } from './portfolioTransfer'

const basePortfolio = {
  profile: {
    name: 'Aster Vale',
    role: 'Design Engineer',
    headline: 'Crafting digital identities with motion, systems, and story.',
    bio: 'I build expressive product experiences.',
    location: 'Tokyo / Remote',
    email: 'hello@astervale.studio',
    phone: '+81 90 1234 5678',
    website: 'astervale.studio',
    photo: 'https://example.com/photo.jpg',
  },
  metrics: [],
  about: [],
  process: [],
  testimonials: [],
  services: [],
  experience: [],
  education: [],
  skills: [],
  projects: [],
  githubProjects: [],
  behanceProjects: [],
  socialLinks: [],
}

const baseSiteSettings = {
  title: 'FolioSpark',
  description: 'Portfolio builder',
  logoText: 'FolioSpark',
  logoMark: 'F',
  navigation: {
    visible: true,
    ctaLabel: 'Start a project',
    ctaTarget: '#contact',
    items: [{ id: 'about', label: 'About', target: '#about', visible: true }],
  },
  footer: {
    visible: true,
    copyright: 'FolioSpark © 2026',
    tagline: 'Your professional story, in motion.',
    showLocation: true,
    showSocialLinks: true,
  },
  sections: [{ id: 'about', visible: true }],
}

describe('isPortfolio', () => {
  it('accepts an optional profile slug when it is a string', () => {
    expect(isPortfolio({ ...basePortfolio, profile: { ...basePortfolio.profile, slug: 'aster-vale' } })).toBe(true)
  })

  it('rejects a profile slug when it is not a string', () => {
    expect(isPortfolio({ ...basePortfolio, profile: { ...basePortfolio.profile, slug: 123 } })).toBe(false)
  })

  it('rejects process entries when required fields are missing', () => {
    expect(
      isPortfolio({
        ...basePortfolio,
        process: [{ title: 'Frame', description: 'Discovery first' }],
      }),
    ).toBe(false)
  })

  it('rejects testimonials entries when required fields are missing', () => {
    expect(
      isPortfolio({
        ...basePortfolio,
        testimonials: [{ quote: 'Great work', name: 'Aster', role: 'Founder' }],
      }),
    ).toBe(false)
  })

  it('accepts service packages with the expected fields', () => {
    expect(
      isPortfolio({
        ...basePortfolio,
        services: [
          {
            name: 'Brand System',
            price: '$2,400',
            description: 'Premium positioning and visuals.',
            features: ['Identity direction', 'Design system'],
            featured: true,
          },
        ],
      }),
    ).toBe(true)
  })

  it('backfills missing services for legacy portfolios', () => {
    expect(
      parsePortfolio({
        ...basePortfolio,
        services: undefined,
      }),
    ).toMatchObject({
      services: [],
    })
  })

  it('rejects invalid services shapes after normalization', () => {
    expect(
      parsePortfolio({
        ...basePortfolio,
        services: 'not-an-array',
      }),
    ).toBeNull()
  })

  it('rejects unsafe external urls in imported portfolios', () => {
    expect(
      isPortfolio({
        ...basePortfolio,
        profile: { ...basePortfolio.profile, photo: 'javascript:alert(1)' },
      }),
    ).toBe(false)
  })

  it('accepts optional case studies with measurable outcomes', () => {
    expect(
      isPortfolio({
        ...basePortfolio,
        projects: [
          {
            title: 'Northstar Pulse',
            category: 'Product Experience',
            year: '2025',
            description: 'A product story.',
            image: 'https://example.com/image.jpg',
            technologies: ['React'],
            caseStudy: {
              challenge: 'A complex story.',
              approach: 'A focused system.',
              outcome: 'A clearer result.',
              metrics: [{ value: '32%', label: 'faster' }],
            },
          },
        ],
      }),
    ).toBe(true)
  })

  it('rejects malformed case studies', () => {
    expect(
      isPortfolio({
        ...basePortfolio,
        projects: [
          {
            title: 'Northstar Pulse',
            category: 'Product Experience',
            year: '2025',
            description: 'A product story.',
            image: 'https://example.com/image.jpg',
            technologies: ['React'],
            caseStudy: { challenge: 'Missing the rest.' },
          },
        ],
      }),
    ).toBe(false)
  })

  it('accepts legacy portfolios without site settings', () => {
    expect(parsePortfolio(basePortfolio)).toMatchObject(basePortfolio)
  })

  it('rejects malformed site settings', () => {
    expect(parsePortfolio({ ...basePortfolio, siteSettings: { title: 'Only a title' } })).toBeNull()
  })

  it('rejects unsafe navigation targets in site settings', () => {
    expect(
      parsePortfolio({
        ...basePortfolio,
        siteSettings: {
          ...baseSiteSettings,
          navigation: {
            ...baseSiteSettings.navigation,
            items: [{ id: 'about', label: 'About', target: 'javascript:alert(1)', visible: true }],
          },
        },
      }),
    ).toBeNull()
  })

  it('rejects unsafe navigation call-to-action targets in site settings', () => {
    expect(
      parsePortfolio({
        ...basePortfolio,
        siteSettings: {
          ...baseSiteSettings,
          navigation: {
            ...baseSiteSettings.navigation,
            ctaTarget: 'javascript:alert(1)',
          },
        },
      }),
    ).toBeNull()
  })

  it('accepts external navigation targets with safe protocols', () => {
    expect(
      parsePortfolio({
        ...basePortfolio,
        siteSettings: {
          ...baseSiteSettings,
          navigation: {
            ...baseSiteSettings.navigation,
            items: [{ id: 'work', label: 'Work', target: 'https://example.com/work', visible: true }],
          },
        },
      }),
    ).not.toBeNull()
  })

  it('accepts external navigation call-to-action targets with safe protocols', () => {
    expect(
      parsePortfolio({
        ...basePortfolio,
        siteSettings: {
          ...baseSiteSettings,
          navigation: {
            ...baseSiteSettings.navigation,
            ctaTarget: 'http://example.com/contact',
          },
        },
      }),
    ).not.toBeNull()
  })

  it('accepts section visibility settings', () => {
    expect(
      parsePortfolio({
        ...basePortfolio,
        siteSettings: {
          ...baseSiteSettings,
          sections: [
            { id: 'about', visible: false },
            { id: 'contact', visible: true },
          ],
        },
      }),
    ).not.toBeNull()
  })
})
