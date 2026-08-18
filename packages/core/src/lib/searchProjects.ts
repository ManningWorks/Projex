import type { ProjexProject } from '../types'
import { createFuseSearch } from './fuse'
import type { FuseSearchOptions } from './fuse'

/**
 * Pure fuzzy search over projects — the non-React sibling of `useProjectSearch`,
 * fitting the `filterByStatus` / `sortProjects` family of helpers. Usable in
 * server components, scripts and tests where a hook is not available.
 *
 * Returns the input array unchanged when the query is empty or whitespace-only;
 * otherwise returns matching projects ranked by Fuse relevance.
 */
export function searchProjects(
  projects: ProjexProject[],
  query: string | undefined | null,
  options: FuseSearchOptions = {}
): ProjexProject[] {
  const normalizedQuery = query == null ? '' : String(query).trim()

  if (!normalizedQuery) {
    return projects
  }

  return createFuseSearch(projects, options)
    .search(normalizedQuery)
    .map(result => result.item)
}
