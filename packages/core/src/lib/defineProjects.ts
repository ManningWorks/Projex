import type { FolioProjectInput } from '../types'
import { folioProjectInputSchema } from './config-schema'
import { formatZodError } from './format-error'

const projectsArraySchema = folioProjectInputSchema.array()

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
  const result = projectsArraySchema.safeParse(projects)

  if (!result.success) {
    const formattedError = formatZodError(result.error)
    throw new Error(formattedError)
  }

  return {
    projects,
    options: options ?? { commits: 0 },
  }
}
