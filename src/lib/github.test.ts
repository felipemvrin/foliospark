import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchGitHubProjects, isGitHubProfileUrl } from './github'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('GitHub project fetching', () => {
  it('returns null for a non-profile URL without requesting the API', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    await expect(fetchGitHubProjects('https://example.com/artist')).resolves.toBeNull()
    await expect(fetchGitHubProjects('https://github.com')).resolves.toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('recognizes refreshable GitHub profile URLs', () => {
    expect(isGitHubProfileUrl('https://github.com/felipemvrin')).toBe(true)
    expect(isGitHubProfileUrl('https://github.com')).toBe(false)
  })

  it('maps GitHub repositories to portfolio projects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          name: 'folio-spark',
          description: 'A portfolio builder',
          language: 'TypeScript',
          stargazers_count: 12,
          forks_count: 3,
          html_url: 'https://github.com/felipemvrin/folio-spark',
          pushed_at: '2026-09-20T10:00:00.000Z',
        },
      ],
    }))

    await expect(fetchGitHubProjects('https://github.com/felipemvrin')).resolves.toEqual([
      expect.objectContaining({
        repository: 'folio-spark',
        description: 'A portfolio builder',
        language: 'TypeScript',
        stars: 12,
        forks: 3,
        url: 'https://github.com/felipemvrin/folio-spark',
      }),
    ])
  })

  it('throws when GitHub responds with an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }))

    await expect(fetchGitHubProjects('https://github.com/felipemvrin')).rejects.toThrow('GitHub request failed with 403')
  })
})