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
      const [metricValue, ...labelParts] = line.split('|')
      const formattedValue = metricValue?.trim()
      const label = labelParts.join('|').trim()

      if (!formattedValue || !label) {
        return []
      }

      return [{ value: formattedValue, label }]
    })
}
