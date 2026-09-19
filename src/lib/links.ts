const allowedExternalProtocols = new Set(['http:', 'https:'])

export function getMailtoHref(value: string) {
  const email = value.trim()

  return email ? `mailto:${email}` : null
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
