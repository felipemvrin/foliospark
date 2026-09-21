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
})
