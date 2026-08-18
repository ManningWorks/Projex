'use client'

import { useMemo } from 'react'
import type { ProjexProject } from '../types'
import { createFuseSearch } from './fuse'
import type { FuseSearchOptions } from './fuse'

export type UseProjectSearchOptions = FuseSearchOptions

export function useProjectSearch(
  projects: ProjexProject[],
  query: string | undefined | null,
  options: UseProjectSearchOptions = {}
): ProjexProject[] {
  const { threshold, keys } = options

  // Index construction is memoised independently of the query so each
  // keystroke re-searches the same Fuse instance instead of rebuilding it.
  const fuse = useMemo(
    () => createFuseSearch(projects, { threshold, keys }),
    [projects, threshold, keys]
  )

  const normalizedQuery = query == null ? '' : String(query).trim()

  if (!normalizedQuery) {
    return projects
  }

  return fuse.search(normalizedQuery).map(result => result.item)
}
