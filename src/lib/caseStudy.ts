import type { PortfolioMetric } from '../types/portfolio'

export function formatCaseStudyMetrics(metrics: PortfolioMetric[]) {
  return metrics.map((metric) => `${metric.value} | ${metric.label}`).join('\n')
}

export function parseCaseStudyMetrics(value: string): PortfolioMetric[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const separatorIndex = line.indexOf('|')

      if (separatorIndex === -1 || separatorIndex !== line.lastIndexOf('|')) {
        return []
      }

      const formattedValue = line.slice(0, separatorIndex).trim()
      const label = line.slice(separatorIndex + 1).trim()

      if (!formattedValue || !label) {
        return []
      }

      return [{ value: formattedValue, label }]
    })
}
