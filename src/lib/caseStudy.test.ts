import { describe, expect, it } from 'vitest'

import { formatCaseStudyMetrics, parseCaseStudyMetrics } from './caseStudy'

describe('case study metrics helpers', () => {
  it('formats metrics for editor textareas', () => {
    expect(
      formatCaseStudyMetrics([
        { value: '32%', label: 'faster comprehension' },
        { value: '2.4x', label: 'more demo requests' },
      ]),
    ).toBe('32% | faster comprehension\n2.4x | more demo requests')
  })

  it('parses valid metric rows and ignores incomplete lines', () => {
    expect(
      parseCaseStudyMetrics(
        '32% | faster comprehension\nmissing delimiter\n | empty value\n2.4x | more demo requests\n32% | faster | comprehension',
      ),
    ).toEqual([
      { value: '32%', label: 'faster comprehension' },
      { value: '2.4x', label: 'more demo requests' },
    ])
  })
})
