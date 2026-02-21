'use client'

import { useState } from 'react'
import { ProjectCard } from '@folio/core'
import type { FolioProject } from '@folio/core'

export function ProjectGrid({ projects }: { projects: FolioProject[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}
    >
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => setSelectedId(project.id)}
          style={{
            padding: '1.5rem',
            border: selectedId === project.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: selectedId === project.id ? '#eff6ff' : 'white',
            transition: 'all 0.2s'
          }}
        >
          <ProjectCard>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Status project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Tags project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        </div>
      ))}
    </div>
  )
}
