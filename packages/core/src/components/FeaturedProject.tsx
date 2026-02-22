import type { FolioProject } from '../types'
import { ProjectView } from './ProjectView'

interface FeaturedProjectProps {
  project: FolioProject | null | undefined
}

function FeaturedProject({ project }: FeaturedProjectProps) {
  if (!project) {
    return null
  }

  return (
    <div data-folio-featured>
      {project.image && <img data-folio-featured-image src={project.image} alt={project.name} />}
      <ProjectView project={project}>
        <ProjectView.Section name="background" project={project} />
        <ProjectView.Section name="why" project={project} />
        <ProjectView.Stats project={project} />
        <ProjectView.Links project={project} />
      </ProjectView>
    </div>
  )
}

export { FeaturedProject }
