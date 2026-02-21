import { normalise } from '@folio/core'
import { projects as projectInputs } from '../folio.config'

async function getProjects() {
  const projects = await Promise.all(
    projectInputs.map((projectInput) => normalise(projectInput))
  )

  return projects
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Folio Demo</h1>
      <p>Welcome to the Folio component library demo</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Projects ({projects.length})</h2>
        <pre>{JSON.stringify(projects, null, 2)}</pre>
      </div>
    </div>
  )
}
