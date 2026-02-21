'use client'

import { ProjectCard } from '@folio/core'
import type { FolioProject } from '@folio/core'

export function ProjectGrid({ projects, onSelect }: { projects: FolioProject[]; onSelect: (id: string) => void }) {
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
          onClick={() => onSelect(project.id)}
          style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backgroundColor: 'white',
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
