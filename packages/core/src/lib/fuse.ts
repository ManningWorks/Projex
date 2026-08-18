import Fuse from 'fuse.js'
import type { ProjexProject } from '../types'

/** Full Fuse.js configuration returned by `getFuseOptions`. */
export interface FuseOptions {
  threshold: number
  ignoreLocation: boolean
  keys: Array<{ name: string; weight: number }>
}

/**
 * Consumer-facing search overrides accepted by `getFuseOptions`,
 * `createFuseSearch`, `searchProjects` and `useProjectSearch`.
 */
export interface FuseSearchOptions {
  /** Match threshold (0.0 = exact match, 1.0 = match anything). */
  threshold?: number
  /** Weighted fields to search. Replaces the default key set when provided. */
  keys?: Array<{ name: string; weight: number }>
}

/**
 * Single default threshold shared by every search entry point.
 * 0.3 was already the `useProjectSearch` default and what the docs describe,
 * so it wins over `createFuseSearch`'s old 0.2 (see issue #21).
 */
const DEFAULT_FUSE_THRESHOLD = 0.3

/**
 * Build Fuse.js options, optionally overriding the default threshold and keys.
 * Accepts a bare threshold number for backwards compatibility with v1.3.
 */
export function getFuseOptions(options: FuseSearchOptions | number = {}): FuseOptions {
  const { threshold = DEFAULT_FUSE_THRESHOLD, keys } =
    typeof options === 'number' ? { threshold: options } : options

  return {
    threshold,
    ignoreLocation: true,
    keys: keys ?? [
      { name: 'name', weight: 2 },
      { name: 'tagline', weight: 1.5 },
      { name: 'description', weight: 1.5 },
      { name: 'stack', weight: 1 },
    ],
  }
}

/**
 * Create a configured Fuse search instance for fuzzy searching projects.
 * Accepts a bare threshold number for backwards compatibility with v1.3.
 */
export function createFuseSearch(
  projects: ProjexProject[],
  options: FuseSearchOptions | number = {}
): Fuse<ProjexProject> {
  return new Fuse(projects, getFuseOptions(options))
}
