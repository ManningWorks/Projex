import type { ProjexProject } from '../types'
import { sortByStars } from './sortByStars'
import { sortByName } from './sortByName'
import { sortByDate } from './sortByDate'

export type SortValue = 'stars' | 'stars-asc' | 'name' | 'name-desc' | 'date' | 'date-asc'

export function sortProjects(projects: ProjexProject[], sortValue: SortValue): ProjexProject[] {
  if (projects.length === 0) {
    return projects
  }

  switch (sortValue) {
    case 'stars':
      return sortByStars(projects)
    case 'stars-asc':
      return sortByStars(projects, 'asc')
    case 'name':
      return sortByName(projects, 'asc')
    case 'name-desc':
      return sortByName(projects, 'desc')
    case 'date':
      return sortByDate(projects, 'desc')
    case 'date-asc':
      return sortByDate(projects, 'asc')
    default:
      return projects
  }
}
