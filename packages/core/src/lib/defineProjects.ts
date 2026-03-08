import type { ProjexProjectInput } from '../types'
import { projexProjectInputSchema } from './config-schema'
import { formatZodError } from './format-error'

const projectsArraySchema = projexProjectInputSchema.array()

export interface DefineProjectsOptions {
  commits?: number
}

export interface DefineProjectsResult {
  projects: ProjexProjectInput[]
  options: DefineProjectsOptions
}

export function defineProjects(
  projects: ProjexProjectInput[],
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
