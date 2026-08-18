'use client'

import { useMemo, useRef } from 'react'
import type { ProjexProject } from '../types'
import { createFuseSearch } from './fuse'
import type { FuseSearchOptions } from './fuse'

export type UseProjectSearchOptions = FuseSearchOptions

type FuseKey = NonNullable<FuseSearchOptions['keys']>[number]

/** Content equality for key sets, so arrays with the same entries are treated as equal. */
function sameKeys(a: FuseKey[] | undefined, b: FuseKey[] | undefined): boolean {
  if (a === b) {
    return true
  }

  if (!a || !b || a.length !== b.length) {
    return false
  }

  return a.every((key, i) => key.name === b[i].name && key.weight === b[i].weight)
}

export function useProjectSearch(
  projects: ProjexProject[],
  query: string | undefined | null,
  options: UseProjectSearchOptions = {}
): ProjexProject[] {
  const { threshold, keys } = options

  // Pin `keys` to a stable identity based on content, so consumers passing an
  // inline array don't rebuild the Fuse index on every render.
  const keysRef = useRef<FuseKey[] | undefined>(keys)
  if (!sameKeys(keysRef.current, keys)) {
    keysRef.current = keys
  }
  const stableKeys = keysRef.current

  // Index construction is memoised independently of the query so each
  // keystroke re-searches the same Fuse instance instead of rebuilding it.
  const fuse = useMemo(
    () => createFuseSearch(projects, { threshold, keys: stableKeys }),
    [projects, threshold, stableKeys]
  )

  const normalizedQuery = query == null ? '' : String(query).trim()

  if (!normalizedQuery) {
    return projects
  }

  return fuse.search(normalizedQuery).map(result => result.item)
}
