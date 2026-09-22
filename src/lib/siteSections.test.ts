import { describe, expect, it } from 'vitest'

import { getOrderedSections, sortNavigationItemsBySections } from './siteSections'

describe('getOrderedSections', () => {
  it('appends missing default sections after a partial custom order', () => {
    expect(
      getOrderedSections([
        { id: 'work', visible: true },
        { id: 'about', visible: false },
      ]).map((section) => section.id),
    ).toEqual([
      'work',
      'about',
      'process',
      'services',
      'trust',
      'github',
      'journal',
      'behance',
      'experience',
      'skills',
      'resume',
      'faq',
      'contact',
    ])
  })

  it('preserves configured visibility for reordered sections', () => {
    expect(
      getOrderedSections([
        { id: 'work', visible: false },
        { id: 'about', visible: true },
      ]).find((section) => section.id === 'work'),
    ).toEqual({ id: 'work', visible: false })
  })
})

describe('sortNavigationItemsBySections', () => {
  it('matches navigation item order to the rendered section order', () => {
    expect(
      sortNavigationItemsBySections(
        [
          { id: 'about', label: 'About', target: '#about', visible: true },
          { id: 'contact', label: 'Contact', target: '#contact', visible: true },
          { id: 'work', label: 'Work', target: '#work', visible: true },
        ],
        [
          { id: 'work', visible: true },
          { id: 'about', visible: true },
          { id: 'contact', visible: true },
        ],
      ).map((item) => item.id),
    ).toEqual(['work', 'about', 'contact'])
  })
})
