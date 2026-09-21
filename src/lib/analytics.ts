export type AnalyticsEventName = 'page_view' | 'outbound_click' | 'inquiry_started'

export interface AnalyticsEvent {
  name: AnalyticsEventName
  properties: Record<string, string>
}

export function normalizeAnalyticsDimension(value: string, allowedValues: readonly string[], fallback = 'unspecified') {
  return allowedValues.includes(value) ? value : fallback
}

let fallbackSessionId: string | null = null
let fallbackSessionCounter = 0

function getEndpoint() {
  const value = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim()
  return value ? value.replace(/\/$/, '') : null
}

function isDoNotTrackEnabled() {
  if (typeof navigator === 'undefined') {
    return false
  }

  const windowWithDnt = typeof window !== 'undefined'
    ? (window as Window & typeof globalThis & { doNotTrack?: string })
    : undefined
  const navigatorWithLegacyDnt = navigator as Navigator & { msDoNotTrack?: string }
  const dntValue = navigatorWithLegacyDnt.doNotTrack
    ?? windowWithDnt?.doNotTrack
    ?? navigatorWithLegacyDnt.msDoNotTrack

  return dntValue === '1' || dntValue === 'yes'
}

function createSessionId() {
  const crypto = globalThis.crypto

  if (crypto?.randomUUID) {
    return crypto.randomUUID()
  }

  if (crypto?.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  fallbackSessionCounter += 1
  return `${Date.now().toString(36)}-${globalThis.performance?.now?.().toString(36).replace('.', '') ?? '0'}-${fallbackSessionCounter.toString(36)}`
}

function getSessionId() {
  if (typeof window === 'undefined') {
    return 'server'
  }

  const storageKey = 'foliospark-analytics-session'

  try {
    const sessionStorage = window.sessionStorage
    const existing = sessionStorage.getItem(storageKey)

    if (existing) {
      return existing
    }

    const sessionId = createSessionId()
    sessionStorage.setItem(storageKey, sessionId)
    return sessionId
  } catch {
    fallbackSessionId ??= createSessionId()
    return fallbackSessionId
  }
}

export function getAnalyticsEndpoint() {
  return getEndpoint()
}

export function isAnalyticsEnabled() {
  return Boolean(getEndpoint()) && !isDoNotTrackEnabled()
}

export async function trackAnalyticsEvent(event: AnalyticsEvent) {
  const endpoint = getEndpoint()

  if (!endpoint || isDoNotTrackEnabled()) {
    return false
  }

  const payload = JSON.stringify({
    ...event,
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
  })

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    })

    return response.ok
  } catch {
    return false
  }
}
