import { normalise } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'
import { projects as projectInputs } from '../folio.config'
import { DemoApp } from './components/DemoApp'

async function getProjects(): Promise<FolioProject[]> {
  const projects = await Promise.all(
    projectInputs.map((projectInput) => normalise(projectInput))
  )

  return projects
}

export default async function HomePage() {
  const projects = await getProjects()

  return <DemoApp projects={projects} />
}
