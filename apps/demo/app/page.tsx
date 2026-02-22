import { normalise } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'
import { projects as projectInputs } from '../folio.config'
import { ProjectContainer } from './components/ProjectContainer'

async function getProjects(): Promise<FolioProject[]> {
  const projects = await Promise.all(
    projectInputs.map((projectInput) => normalise(projectInput))
  )

  return projects
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <div className="page-container">
      <h1 className="page-title">Folio Demo</h1>
      <p className="page-subtitle">Welcome to the Folio component library demo</p>
      <ProjectContainer projects={projects} />
    </div>
  )
}
