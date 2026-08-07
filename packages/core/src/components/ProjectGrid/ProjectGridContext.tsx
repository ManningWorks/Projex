'use client'

import { createContext, useContext } from 'react'
import type { ProjexProject } from '../../types'

const ProjectContext = createContext<ProjexProject | null>(null)

export function ProjectGridProvider({ project, children }: { project: ProjexProject; children: React.ReactNode }) {
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext(): ProjexProject | null {
  return useContext(ProjectContext)
}
