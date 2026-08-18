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

    // Treat missing dates as epoch-equivalent (oldest) so dateless projects sort
    // last in newest-first order and first in oldest-first order, consistently
    // in both directions (issue #23).
    const timeA = dateA ? new Date(dateA).getTime() : 0
    const timeB = dateB ? new Date(dateB).getTime() : 0

    return (timeA - timeB) * multiplier
  })
}
