import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchPublishedPortfolio, getPublishedPortfolioHref, publishPortfolio } from './publishingApi'
import { portfolio } from '../data/portfolio'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('publishing API client', () => {
  it('builds a durable public URL from a configured endpoint', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com/')

    expect(getPublishedPortfolioHref('Aster Vale Studio', 'https://folio.example.com')).toBe(
      'https://folio.example.com/?view=published&slug=aster-vale-studio',
    )
  })

  it('does not expose insecure publishing endpoints outside local development', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'http://api.example.com')

    expect(getPublishedPortfolioHref('Aster Vale Studio', 'https://folio.example.com')).toBeNull()
  })

  it('allows localhost publishing endpoints for local development', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'http://localhost:8787')

    expect(getPublishedPortfolioHref('Aster Vale Studio', 'https://folio.example.com')).toBe(
      'https://folio.example.com/?view=published&slug=aster-vale-studio',
    )
  })

  it('allows IPv6 loopback publishing endpoints for local development', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'http://[::1]:8787')

    expect(getPublishedPortfolioHref('Aster Vale Studio', 'https://folio.example.com')).toBe(
      'https://folio.example.com/?view=published&slug=aster-vale-studio',
    )
  })

  it('rejects non-http protocols even on localhost publishing endpoints', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'ftp://localhost:8787')

    expect(getPublishedPortfolioHref('Aster Vale Studio', 'https://folio.example.com')).toBeNull()
  })

  it('preserves the deployment base path when building a durable public URL', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com/')

    expect(getPublishedPortfolioHref('Aster Vale Studio', 'https://felipemvrin.github.io/foliospark/?theme=Mono#editor')).toBe(
      'https://felipemvrin.github.io/foliospark/?theme=Mono&view=published&slug=aster-vale-studio',
    )
  })

  it('supports relative deployment base paths when building a durable public URL', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com/')

    expect(getPublishedPortfolioHref('Aster Vale Studio', '/foliospark/?theme=Mono#editor')).toBe(
      'https://example.com/foliospark/?theme=Mono&view=published&slug=aster-vale-studio',
    )
  })

  it('preserves the current app path when using the runtime location by default', () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com/')
    vi.stubGlobal('window', {
      location: {
        href: 'https://felipemvrin.github.io/foliospark/?theme=Mono#editor',
        origin: 'https://felipemvrin.github.io',
      },
    })

    expect(getPublishedPortfolioHref('Aster Vale Studio')).toBe(
      'https://felipemvrin.github.io/foliospark/?theme=Mono&view=published&slug=aster-vale-studio',
    )
  })

  it('fetches and validates a published portfolio', async () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ portfolio, theme: 'Editorial', slug: 'aster-vale' }),
    }))

    await expect(fetchPublishedPortfolio('Aster Vale')).resolves.toMatchObject({ theme: 'Editorial', slug: 'aster-vale' })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/portfolios/aster-vale',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('accepts legacy published portfolios that predate services', async () => {
    const { services: _services, ...legacyPortfolio } = portfolio

    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ portfolio: legacyPortfolio, theme: 'Editorial', slug: 'aster-vale' }),
    }))

    await expect(fetchPublishedPortfolio('Aster Vale')).resolves.toMatchObject({
      portfolio: {
        services: [],
      },
      theme: 'Editorial',
      slug: 'aster-vale',
    })
  })

  it('publishes a portfolio using PUT and rejects invalid responses', async () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ invalid: true }) }))

    await expect(publishPortfolio('Aster Vale', portfolio, 'Minimal')).rejects.toThrow('Publishing API returned an invalid portfolio')
    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/portfolios/aster-vale',
      expect.objectContaining({ method: 'PUT', body: expect.stringContaining('"theme":"Minimal"') }),
    )
  })

  it('rejects publishing when no stable slug can be generated', async () => {
    vi.stubEnv('VITE_PUBLISHING_API_URL', 'https://api.example.com')
    vi.stubGlobal('fetch', vi.fn())

    await expect(publishPortfolio('', portfolio, 'Minimal')).rejects.toThrow('Add a name or custom slug before publishing.')
    expect(fetch).not.toHaveBeenCalled()
  })
})
