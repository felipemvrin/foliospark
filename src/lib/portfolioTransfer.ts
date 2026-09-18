import type { Portfolio } from '../types/portfolio'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isPortfolio(value: unknown): value is Portfolio {
  if (!isRecord(value) || !isRecord(value.profile)) {
    return false
  }

  const requiredCollections = [
    'metrics',
    'about',
    'experience',
    'education',
    'skills',
    'projects',
    'githubProjects',
    'behanceProjects',
    'socialLinks',
  ]

  return requiredCollections.every((key) => Array.isArray(value[key]))
}

export function downloadPortfolio(data: Portfolio) {
  const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = url
  link.download = 'foliospark-portfolio.json'
  link.click()
  URL.revokeObjectURL(url)
}