import type { ProjexProject } from '../types'

export function filterByFeatured(
  projects: ProjexProject[],
  featured: boolean | null | undefined
): ProjexProject[] {
  if (projects.length === 0) {
    return []
  }

  if (featured === null || featured === undefined) {
    return [...projects]
  }

  return projects.filter(project => project.featured === featured)
}
