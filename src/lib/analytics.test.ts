import { afterEach, describe, expect, it, vi } from 'vitest'

import { isAnalyticsEnabled, trackAnalyticsEvent } from './analytics'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
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
})
