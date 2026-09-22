export type SectionVisibilityChange = {
  id: string
  isIntersecting: boolean
  top: number
}

export function getNextVisibleSectionTops(
  current: ReadonlyMap<string, number>,
  changes: readonly SectionVisibilityChange[],
) {
  const next = new Map(current)

  for (const change of changes) {
    if (change.isIntersecting) {
      next.set(change.id, change.top)
      continue
    }

    next.delete(change.id)
  }

  return next
}

export function getTopmostVisibleSectionId(visibleSectionTops: ReadonlyMap<string, number>) {
  let activeSectionId: string | null = null
  let activeSectionTop = Number.POSITIVE_INFINITY

  for (const [id, top] of visibleSectionTops.entries()) {
    if (top < activeSectionTop) {
      activeSectionTop = top
      activeSectionId = id
    }
  }

  return activeSectionId
}
