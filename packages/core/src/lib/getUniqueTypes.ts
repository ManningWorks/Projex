import type { ProjexProject, ProjectType } from '../types'

export const PROJECT_TYPES = [
  'github',
  'manual',
  'npm',
  'product-hunt',
  'youtube',
  'gumroad',
  'lemonsqueezy',
  'devto',
  'hybrid',
] as const

export function getUniqueTypes(projects: ProjexProject[]): ProjectType[] {
  const seen = new Set<ProjectType>()
  for (const project of projects) {
    seen.add(project.type)
  }

  return PROJECT_TYPES.filter(type => seen.has(type))
}
