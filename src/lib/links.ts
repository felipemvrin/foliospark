const allowedExternalProtocols = new Set(['http:', 'https:'])

export function getMailtoHref(value: string, subject?: string, body?: string) {
  const email = value.trim()

  if (!email) {
    return null
  }

  const params = new URLSearchParams()

  if (subject) {
    params.set('subject', subject)
  }

  if (body) {
    params.set('body', body)
  }

  const query = params.toString()

  return `mailto:${email}${query ? `?${query}` : ''}`
}

export function getSafeExternalHref(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  const candidate = trimmedValue.includes('://') ? trimmedValue : `https://${trimmedValue}`

  try {
    const url = new URL(candidate)

    if (!allowedExternalProtocols.has(url.protocol)) {
      return null
    }

    return url.href
  } catch {
    return null
  }
}
