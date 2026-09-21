import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('portfolio store persistence', () => {
  it('hydrates legacy persisted portfolios that predate services', async () => {
    vi.stubGlobal('window', {
      location: {
        search: '',
      },
      localStorage: {
        getItem: vi.fn().mockReturnValue(JSON.stringify({
          state: {
            data: {
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
              },
              metrics: [],
              about: [],
              process: [],
              testimonials: [],
              experience: [],
              education: [],
              skills: [],
              projects: [],
              githubProjects: [],
              behanceProjects: [],
              socialLinks: [],
            },
          },
          version: 0,
        })),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
    })

    const { usePortfolioStore } = await import('./portfolioStore')

    expect(usePortfolioStore.getState().data.services).toEqual([])
  })
})
