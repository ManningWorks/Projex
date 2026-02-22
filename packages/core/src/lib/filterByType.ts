import type { FolioProject, ProjectType } from '../types'

export function filterByType(
  projects: FolioProject[],
  type: ProjectType | 'all' | undefined
): FolioProject[] {
  if (projects.length === 0) {
    return []
  }

  if (type === 'all' || type === undefined) {
    return [...projects]
  }

  return projects.filter(project => project.type === type)
}
