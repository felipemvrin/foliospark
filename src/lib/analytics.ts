export type AnalyticsEventName = 'page_view' | 'outbound_click'

export interface AnalyticsEvent {
  name: AnalyticsEventName
  properties: Record<string, string>
}

function getEndpoint() {
  const value = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim()
  return value ? value.replace(/\/$/, '') : null
}

function isDoNotTrackEnabled() {
  return typeof navigator !== 'undefined' && navigator.doNotTrack === '1'
}

function getSessionId() {
  if (typeof window === 'undefined') {
    return 'server'
  }

  const storageKey = 'foliospark-analytics-session'
  const existing = window.sessionStorage.getItem(storageKey)

  if (existing) {
    return existing
  }

  const sessionId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  window.sessionStorage.setItem(storageKey, sessionId)
  return sessionId
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
