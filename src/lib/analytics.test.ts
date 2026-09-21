import { afterEach, describe, expect, it, vi } from 'vitest'

import { isAnalyticsEnabled, normalizeAnalyticsDimension, trackAnalyticsEvent } from './analytics'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  Object.defineProperty(navigator, 'doNotTrack', { configurable: true, value: undefined })
  Object.defineProperty(navigator, 'msDoNotTrack', { configurable: true, value: undefined })
})

describe('privacy-first analytics', () => {
  it('stays disabled without an endpoint', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    expect(isAnalyticsEnabled()).toBe(false)
    await expect(trackAnalyticsEvent({ name: 'page_view', properties: {} })).resolves.toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('sends a minimal event to the configured endpoint', async () => {
    vi.stubEnv('VITE_ANALYTICS_ENDPOINT', 'https://metrics.example.com/events/')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    expect(isAnalyticsEnabled()).toBe(true)
    await expect(trackAnalyticsEvent({ name: 'outbound_click', properties: { destination: 'github' } })).resolves.toBe(true)
    expect(fetch).toHaveBeenCalledWith(
      'https://metrics.example.com/events',
      expect.objectContaining({ method: 'POST', body: expect.stringContaining('"destination":"github"') }),
    )
  })

  it('does not send events when Do Not Track is enabled', async () => {
    vi.stubEnv('VITE_ANALYTICS_ENDPOINT', 'https://metrics.example.com/events')
    Object.defineProperty(navigator, 'doNotTrack', { configurable: true, value: '1' })
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    expect(isAnalyticsEnabled()).toBe(false)
    await expect(trackAnalyticsEvent({ name: 'page_view', properties: {} })).resolves.toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('treats legacy Do Not Track values as enabled', () => {
    vi.stubEnv('VITE_ANALYTICS_ENDPOINT', 'https://metrics.example.com/events')
    vi.stubGlobal('window', { doNotTrack: 'yes' })

    expect(isAnalyticsEnabled()).toBe(false)
  })

  it('respects the legacy msDoNotTrack signal', () => {
    vi.stubEnv('VITE_ANALYTICS_ENDPOINT', 'https://metrics.example.com/events')
    Object.defineProperty(navigator, 'msDoNotTrack', { configurable: true, value: '1' })

    expect(isAnalyticsEnabled()).toBe(false)
  })

  it('falls back to an in-memory session id when session storage is unavailable', async () => {
    vi.stubEnv('VITE_ANALYTICS_ENDPOINT', 'https://metrics.example.com/events')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('window', {
      location: { pathname: '/portfolio' },
      sessionStorage: {
        getItem: vi.fn(() => {
          throw new Error('sessionStorage unavailable')
        }),
        setItem: vi.fn(),
      },
    })

    await expect(trackAnalyticsEvent({ name: 'outbound_click', properties: { destination: 'github' } })).resolves.toBe(true)
    await expect(trackAnalyticsEvent({ name: 'page_view', properties: { mode: 'editor' } })).resolves.toBe(true)

    expect(fetchMock).toHaveBeenCalledTimes(2)

    const firstPayload = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string) as { sessionId: string }
    const secondPayload = JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string) as { sessionId: string }

    expect(firstPayload.sessionId).toBe(secondPayload.sessionId)
  })

  it('normalizes analytics dimensions to allowed values', () => {
    const allowedValues = ['allowed', 'other'] as const

    expect(normalizeAnalyticsDimension('allowed', allowedValues)).toBe('allowed')
    expect(normalizeAnalyticsDimension('custom-value', allowedValues)).toBe('unspecified')
    expect(normalizeAnalyticsDimension('custom-value', allowedValues, 'other')).toBe('other')
  })
})
