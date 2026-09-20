import { describe, expect, it } from 'vitest'

import { getPublishingReadiness } from './publishing'
import { portfolio } from '../data/portfolio'

function createEmptyPortfolio() {
  return {
    ...portfolio,
    profile: {
      ...portfolio.profile,
      name: '',
      role: '',
      bio: '',
      email: '',
      slug: '',
      photo: '',
    },
    about: [],
    projects: [],
    socialLinks: [],
  }
}

describe('publishing readiness', () => {
  it('marks the sample portfolio as ready', () => {
    const readiness = getPublishingReadiness(portfolio)

    expect(readiness.status).toBe('ready')
    expect(readiness.completed).toBe(readiness.total)
  })

  it('blocks publication when identity and featured work are missing', () => {
    const readiness = getPublishingReadiness(createEmptyPortfolio())

    expect(readiness.status).toBe('blocked')
    expect(readiness.checks.find((check) => check.id === 'identity')?.status).toBe('blocked')
    expect(readiness.checks.find((check) => check.id === 'work')?.status).toBe('blocked')
  })

  it('keeps a complete portfolio publishable when optional contact details are incomplete', () => {
    const data = {
      ...portfolio,
      profile: { ...portfolio.profile, email: '' },
      socialLinks: [],
    }
    const readiness = getPublishingReadiness(data)

    expect(readiness.status).toBe('warning')
    expect(readiness.checks.find((check) => check.id === 'contact')?.status).toBe('warning')
  })

  it('warns when no custom public URL slug can be generated', () => {
    const readiness = getPublishingReadiness(createEmptyPortfolio())
    const publicUrlCheck = readiness.checks.find((check) => check.id === 'url')

    expect(publicUrlCheck?.status).toBe('warning')
    expect(publicUrlCheck?.detail).toContain('Add a name or custom slug')
  })

  it('warns when provided identity cannot produce a stable public slug', () => {
    const readiness = getPublishingReadiness({
      ...portfolio,
      profile: {
        ...portfolio.profile,
        name: '!!!',
        slug: '',
      },
    })

    expect(readiness.checks.find((check) => check.id === 'url')?.status).toBe('warning')
  })
})
