'use client'

import { ProjectCard } from '@folio/core'
import type { FolioProject } from '@folio/core'

export function ProjectGrid({ projects, onSelect }: { projects: FolioProject[]; onSelect: (id: string) => void }) {
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onSelect(project.id)}
          className="project-card-wrapper"
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
