import type { ProjexProject, ProjectStatus } from '../types'

export const PROJECT_STATUSES = [
  'active',
  'shipped',
  'in-progress',
  'coming-soon',
  'archived',
  'for-sale',
] as const

export function getUniqueStatuses(projects: ProjexProject[]): ProjectStatus[] {
  const seen = new Set<ProjectStatus>()
  for (const project of projects) {
    seen.add(project.status)
  }

  return PROJECT_STATUSES.filter(status => seen.has(status))
}
