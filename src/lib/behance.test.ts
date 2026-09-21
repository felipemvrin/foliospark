import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchBehanceProjects } from './behance'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Behance proxy fetching', () => {
  it('normalizes a proxy project response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        projects: [
          {
            title: 'Signal Objects',
            description: 'A tactile interface study.',
            cover: 'https://images.example.com/signal.jpg',
            url: 'https://behance.net/gallery/123',
            category: 'Interaction Design',
            publishedAt: '2026',
            tags: ['Interface', 'Prototype'],
          },
          { title: 'Incomplete project' },
        ],
      }),
    }))

    await expect(fetchBehanceProjects('https://proxy.example.com/behance')).resolves.toEqual([
      {
        title: 'Signal Objects',
        description: 'A tactile interface study.',
        cover: 'https://images.example.com/signal.jpg',
        url: 'https://behance.net/gallery/123',
        category: 'Interaction Design',
        publishedAt: '2026',
        tags: ['Interface', 'Prototype'],
      },
    ])
  })

  it('accepts a direct project array from the proxy', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ title: 'Archive', cover: 'https://images.example.com/archive.jpg', url: 'https://behance.net/archive' }],
    }))

    await expect(fetchBehanceProjects('https://proxy.example.com/behance')).resolves.toHaveLength(1)
  })

  it('surfaces proxy errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }))

    await expect(fetchBehanceProjects('https://proxy.example.com/behance')).rejects.toThrow('Behance proxy request failed with 502')
  })
})
