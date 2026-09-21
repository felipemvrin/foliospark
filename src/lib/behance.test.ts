import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchBehanceProjects, getBehanceProxyUrl } from './behance'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
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

  it('surfaces invalid proxy JSON responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token')
      },
    }))

    await expect(fetchBehanceProjects('https://proxy.example.com/behance')).rejects.toThrow('Behance proxy returned invalid JSON')
  })
})

describe('getBehanceProxyUrl', () => {
  it('normalizes safe proxy URLs', () => {
    vi.stubEnv('VITE_BEHANCE_PROXY_URL', 'proxy.example.com/behance')

    expect(getBehanceProxyUrl()).toBe('https://proxy.example.com/behance')
  })

  it('rejects unsafe proxy URLs', () => {
    vi.stubEnv('VITE_BEHANCE_PROXY_URL', 'javascript:alert(1)')

    expect(getBehanceProxyUrl()).toBeNull()
  })
})
