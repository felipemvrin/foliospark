import { createDefaultSiteSettings } from '../data/siteSettings'
import type { SiteNavigationItem, SiteSectionId, SiteSettings } from '../types/portfolio'

const defaultSections = createDefaultSiteSettings().sections
const defaultSectionIds = new Set(defaultSections.map((section) => section.id))

export function getOrderedSections(sections: SiteSettings['sections'] | undefined) {
  const configuredSections = sections ?? []
  const configuredVisibility = new Map(configuredSections.map((section) => [section.id, section.visible]))
  const seen = new Set<string>()
  const orderedSections = configuredSections.filter((section) => {
    if (seen.has(section.id) || !defaultSectionIds.has(section.id)) {
      return false
    }

    seen.add(section.id)
    return true
  })

  return [
    ...orderedSections.map((section) => ({ ...section })),
    ...defaultSections
      .filter((section) => !seen.has(section.id))
      .map((section) => ({
        ...section,
        visible: configuredVisibility.get(section.id) ?? section.visible,
      })),
  ]
}

function getSectionTargetId(target: string) {
  return target.startsWith('#') ? target.slice(1) : null
}

function isSiteSectionId(value: string): value is SiteSectionId {
  return defaultSectionIds.has(value as SiteSectionId)
}

export function sortNavigationItemsBySections(
  items: SiteNavigationItem[],
  sections: SiteSettings['sections'] | undefined,
) {
  const sectionOrder = new Map(
    getOrderedSections(sections).map((section, index) => [section.id, index]),
  )

  return items
    .map((item, index) => ({
      item,
      index,
      sectionIndex: (() => {
        const targetId = getSectionTargetId(item.target)
        return targetId && isSiteSectionId(targetId) ? sectionOrder.get(targetId) : undefined
      })(),
    }))
    .sort((left, right) => {
      if (left.sectionIndex !== undefined && right.sectionIndex !== undefined && left.sectionIndex !== right.sectionIndex) {
        return left.sectionIndex - right.sectionIndex
      }

      if (left.sectionIndex !== undefined || right.sectionIndex !== undefined) {
        return left.sectionIndex !== undefined ? -1 : 1
      }

      return left.index - right.index
    })
    .map(({ item }) => item)
}
