import type { ProjexProject, ProjectStatus } from '../types'

export function filterByStatus(
  projects: ProjexProject[],
  status: ProjectStatus | 'all' | ProjectStatus[] | undefined
): ProjexProject[] {
  if (projects.length === 0) {
    return []
  }

  if (status === 'all' || status === undefined) {
    return [...projects]
  }

  if (Array.isArray(status)) {
    return projects.filter(project => status.includes(project.status))
  }

  return projects.filter(project => project.status === status)
}
