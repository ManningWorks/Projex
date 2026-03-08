import { useMemo } from 'react'
import type { ProjexProject } from '../types'

export interface UseProjectFiltersOptions {
  field?: 'stack'
}

export function useProjectFilters(
  projects: ProjexProject[],
  selectedTags: string[],
  options: UseProjectFiltersOptions = {}
): ProjexProject[] {
  const { field = 'stack' } = options

  return useMemo(() => {
    if (!selectedTags.length) {
      return projects
    }

    const normalizedTags = selectedTags.map(tag => tag.toLowerCase())

    return projects.filter(project => {
      const projectTags = project[field]
      if (!projectTags || !Array.isArray(projectTags)) {
        return false
      }

      return projectTags.some(tag => 
        normalizedTags.includes(tag.toLowerCase())
      )
    })
  }, [projects, selectedTags, field])
}
