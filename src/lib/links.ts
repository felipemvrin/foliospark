const allowedExternalProtocols = new Set(['http:', 'https:'])
const mailtoProtocol = 'mailto:'

function getSafeEmailAddress(value: string) {
  const email = value.trim()

  if (!email || /[\r\n]/.test(email)) {
    return null
  }

  try {
    const url = new URL(`${mailtoProtocol}${email}`)

    if (url.protocol !== mailtoProtocol || url.search || url.hash) {
      return null
    }

    if (!url.pathname) {
      return null
    }

    return url.pathname
  } catch {
    return null
  }
}

export function getSafePhoneHref(value: string) {
  const phone = value.trim()

  if (!phone || !/^[\d\s()+-]+$/.test(phone)) {
    return null
  }

  const normalizedPhone = phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')

  if (!normalizedPhone || !/\d/.test(normalizedPhone)) {
    return null
  }

  return `tel:${normalizedPhone}`
}

export function getMailtoHref(value: string, subject?: string, body?: string) {
  const email = getSafeEmailAddress(value)

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

export function getSafeFooterHref(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  if (trimmedValue.startsWith('#')) {
    return trimmedValue
  }

  if (trimmedValue.startsWith('//')) {
    return null
  }

  if (trimmedValue.startsWith('/')) {
    return trimmedValue
  }

  return getSafeExternalHref(trimmedValue)
}

export function getPreferredSafeExternalHref(...values: Array<string | undefined>) {
  for (const value of values) {
    if (!value) {
      continue
    }

    const href = getSafeExternalHref(value)

    if (href) {
      return href
    }
  }

  return null
}
