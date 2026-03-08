import type { ProjexProject } from '../types'
import { sortByStars } from './sortByStars'
import { sortByName } from './sortByName'
import { sortByDate } from './sortByDate'

export type SortValue = 'stars' | 'name' | 'date' | 'date-asc'

export function sortProjects(projects: ProjexProject[], sortValue: SortValue): ProjexProject[] {
  if (projects.length === 0) {
    return projects
  }

  switch (sortValue) {
    case 'stars':
      return sortByStars(projects)
    case 'name':
      return sortByName(projects, 'asc')
    case 'date':
      return sortByDate(projects, 'desc')
    case 'date-asc':
      return sortByDate(projects, 'asc')
    default:
      return projects
  }
}
