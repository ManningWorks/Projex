'use client'

import { useState } from 'react'
import { ProjectGrid } from './ProjectGrid'
import { ProjectDetail } from './ProjectDetail'
import type { FolioProject } from '@reallukemanning/folio'

export function ProjectContainer({ projects }: { projects: FolioProject[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedProject = projects.find((p) => p.id === selectedId)

  if (selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={() => setSelectedId(null)} />
  }

  return (
    <div>
      <h2 className="projects-count">Projects ({projects.length})</h2>
      <ProjectGrid projects={projects} onSelect={setSelectedId} />
    </div>
  )
}
