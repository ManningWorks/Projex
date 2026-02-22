import type { FolioProject } from '../types'

export function filterByFeatured(
  projects: FolioProject[],
  featured: boolean | null | undefined
): FolioProject[] {
  if (projects.length === 0) {
    return []
  }

  if (featured === null || featured === undefined) {
    return [...projects]
  }

  return projects.filter(project => project.featured === featured)
}
