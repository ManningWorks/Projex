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

    // Treat missing dates as older than any real date so dateless projects sort
    // last in newest-first order and first in oldest-first order, consistently
    // in both directions (issue #23). Unparseable date strings yield NaN from
    // getTime(), so coerce to epoch 0 to keep the comparator NaN-free and the
    // order deterministic (issue #29).
    const timeA = dateA ? new Date(dateA).getTime() || 0 : Number.NEGATIVE_INFINITY
    const timeB = dateB ? new Date(dateB).getTime() || 0 : Number.NEGATIVE_INFINITY

    return (timeA - timeB) * multiplier
  })
}
