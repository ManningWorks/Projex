import type { ProjexProject } from '../types'

export type SortOrder = 'asc' | 'desc'

export function sortByDate(projects: ProjexProject[], order: SortOrder = 'desc'): ProjexProject[] {
  if (projects.length === 0) {
    return []
  }

  const multiplier = order === 'asc' ? 1 : -1

  return [...projects].sort((a, b) => {
    const dateA = a.updatedAt || a.createdAt || null
    const dateB = b.updatedAt || b.createdAt || null

    if (!dateA && !dateB) {
      return 0
    }

    if (!dateA) {
      return 1 * multiplier
    }

    if (!dateB) {
      return -1 * multiplier
    }

    return (new Date(dateA).getTime() - new Date(dateB).getTime()) * multiplier
  })
}
