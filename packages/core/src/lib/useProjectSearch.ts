import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { FolioProject } from '../types'
import { getFuseOptions } from './fuse'

export interface UseProjectSearchOptions {
  threshold?: number
}

export function useProjectSearch(
  projects: FolioProject[],
  query: string | undefined | null,
  options: UseProjectSearchOptions = {}
): FolioProject[] {
  const { threshold = 0.3 } = options

  const fuse = useMemo(() => {
    return new Fuse(projects, getFuseOptions(threshold))
  }, [projects, threshold])

  const normalizedQuery = query == null ? '' : String(query).trim()

  if (!normalizedQuery) {
    return projects
  }

  const results = fuse.search(normalizedQuery)

  return results.map(result => result.item)
}
