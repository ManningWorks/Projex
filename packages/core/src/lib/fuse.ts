import Fuse from 'fuse.js'
import type { ProjexProject } from '../types'

export interface FuseOptions {
  threshold: number
  keys: Array<{ name: string; weight: number }>
}

export function getFuseOptions(threshold: number = 0.3): FuseOptions {
  return {
    threshold,
    keys: [
      { name: 'name', weight: 2 },
      { name: 'description', weight: 1.5 },
      { name: 'stack', weight: 1 },
    ],
  }
}

export function createFuseSearch(projects: ProjexProject[], threshold: number = 0.3): Fuse<ProjexProject> {
  const options = getFuseOptions(threshold)

  return new Fuse(projects, options)
}
