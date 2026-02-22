import type { FolioProject } from '../types'
import type { SortOrder } from './sortByDate'

export function sortByName(projects: FolioProject[], order: SortOrder = 'asc'): FolioProject[] {
  if (projects.length === 0) {
    return []
  }

  const multiplier = order === 'asc' ? 1 : -1

  return [...projects].sort((a, b) => {
    const nameA = a.name ?? null
    const nameB = b.name ?? null

    if (!nameA && !nameB) {
      return 0
    }

    if (!nameA) {
      return 1
    }

    if (!nameB) {
      return -1
    }

    return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' }) * multiplier
  })
}
