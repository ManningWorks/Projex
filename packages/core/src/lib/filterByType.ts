import type { ProjexProject, ProjectType } from '../types'

export function filterByType(
  projects: ProjexProject[],
  type: ProjectType | 'all' | undefined
): ProjexProject[] {
  if (projects.length === 0) {
    return []
  }

  if (type === 'all' || type === undefined) {
    return [...projects]
  }

  return projects.filter(project => project.type === type)
}
