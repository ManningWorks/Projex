import type { FolioProjectInput } from '../types'

export interface DefineProjectsOptions {
  commits?: number
}

export interface DefineProjectsResult {
  projects: FolioProjectInput[]
  options: DefineProjectsOptions
}

export function defineProjects(
  projects: FolioProjectInput[],
  options?: DefineProjectsOptions,
): DefineProjectsResult {
  return {
    projects,
    options: options ?? { commits: 0 },
  }
}
