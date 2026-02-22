'use client'

import { ProjectView } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'

export function ProjectDetail({ project, onBack }: { project: FolioProject; onBack: () => void }) {
  return (
    <div className="project-detail-wrapper">
      <ProjectView project={project} onBack={onBack}>
        <ProjectView.Section project={project} name="description" />
        <ProjectView.Section project={project} name="background" />
        <ProjectView.Section project={project} name="why" />
        <ProjectView.Section project={project} name="stack" />
        <ProjectView.Section project={project} name="struggles" />
        <ProjectView.Section project={project} name="timeline" />
        <ProjectView.Section project={project} name="posts" />
        <ProjectView.Links project={project} />
      </ProjectView>
    </div>
  )
}
