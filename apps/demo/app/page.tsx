import { normalise } from '@folio/core'
import type { FolioProject } from '@folio/core'
import { projects as projectInputs } from '../folio.config'
import { ProjectGrid } from './components/ProjectGrid'

async function getProjects(): Promise<FolioProject[]> {
  const projects = await Promise.all(
    projectInputs.map((projectInput) => normalise(projectInput))
  )

  return projects
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Folio Demo</h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Welcome to the Folio component library demo</p>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Projects ({projects.length})</h2>
        <ProjectGrid projects={projects} />
      </div>
    </div>
  )
}
