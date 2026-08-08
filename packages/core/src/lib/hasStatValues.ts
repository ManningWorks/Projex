import type { ProjectStats } from '../types'
import { getStatEntries } from './statEntries'

/**
 * Returns true if the stats object has at least one renderable stat value.
 *
 * Backed by the typed {@link getStatEntries} accessor, which narrows the
 * `ProjectStats` tagged union — so this never requires callers to cast.
 */
export function hasStatValues(stats: ProjectStats | null | undefined): boolean {
  return getStatEntries(stats ?? null).length > 0
}
