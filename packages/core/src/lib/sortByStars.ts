import type { ProjexProject } from '../types'
import type { SortOrder } from './sortByDate'

export function sortByStars(projects: ProjexProject[], order: SortOrder = 'desc'): ProjexProject[] {
  if (projects.length === 0) {
    return []
  }

  const multiplier = order === 'asc' ? 1 : -1

  return [...projects].sort((a, b) => {
    const starsA = a.type === 'github' ? (a.stats?.stars ?? 0) : 0
    const starsB = b.type === 'github' ? (b.stats?.stars ?? 0) : 0

    if (starsA === 0 && starsB === 0) {
      return 0
    }

    if (starsA === 0) {
      return 1
    }

    if (starsB === 0) {
      return -1
    }

    return (starsA - starsB) * multiplier
  })
}
