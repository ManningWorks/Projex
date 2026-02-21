'use client'

import { ProjectView } from '@folio/core'
import type { FolioProject } from '@folio/core'

export function ProjectDetail({ project, onBack }: { project: FolioProject; onBack: () => void }) {
  return (
    <div
      style={{
        padding: '2rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        backgroundColor: 'white'
      }}
    >
      <ProjectView project={project} onBack={onBack}>
        <ProjectView.Section project={project} name="description" />
        <ProjectView.Section project={project} name="background" />
        <ProjectView.Section project={project} name="why" />
        <ProjectView.Section project={project} name="techStack" />
        <ProjectView.Section project={project} name="struggles" />
        <ProjectView.Section project={project} name="timeline" />
        <ProjectView.Section project={project} name="posts" />
        <ProjectView.Links project={project} />
      </ProjectView>
    </div>
  )
}
