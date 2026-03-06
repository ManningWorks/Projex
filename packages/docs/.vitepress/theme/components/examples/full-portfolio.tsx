import { useState } from 'react'
import { FeaturedProject, ProjectGrid, ProjectCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'

export function FullPortfolioExample() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const allProjects = Object.values(normalisedExamples)

  const filteredProjects = allProjects.filter((project) => {
    if (filterType && project.type !== filterType) return false
    if (filterStatus && project.status !== filterStatus) return false
    return true
  })

  const featuredProject = normalisedExamples.nextjs

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <FeaturedProject project={featuredProject} />
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <label>Layout:</label>
          <button
            onClick={() => setLayout('grid')}
            style={{
              padding: '4px 8px',
              background: layout === 'grid' ? '#0070f3' : '#fff',
              color: layout === 'grid' ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Grid
          </button>
          <button
            onClick={() => setLayout('list')}
            style={{
              padding: '4px 8px',
              background: layout === 'list' ? '#0070f3' : '#fff',
              color: layout === 'list' ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            List
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <label>Type:</label>
          <button
            onClick={() => setFilterType(null)}
            style={{
              padding: '4px 8px',
              background: filterType === null ? '#0070f3' : '#fff',
              color: filterType === null ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('github')}
            style={{
              padding: '4px 8px',
              background: filterType === 'github' ? '#0070f3' : '#fff',
              color: filterType === 'github' ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            GitHub
          </button>
          <button
            onClick={() => setFilterType('npm')}
            style={{
              padding: '4px 8px',
              background: filterType === 'npm' ? '#0070f3' : '#fff',
              color: filterType === 'npm' ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            npm
          </button>
          <button
            onClick={() => setFilterType('hybrid')}
            style={{
              padding: '4px 8px',
              background: filterType === 'hybrid' ? '#0070f3' : '#fff',
              color: filterType === 'hybrid' ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Hybrid
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <label>Status:</label>
          <button
            onClick={() => setFilterStatus(null)}
            style={{
              padding: '4px 8px',
              background: filterStatus === null ? '#0070f3' : '#fff',
              color: filterStatus === null ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            style={{
              padding: '4px 8px',
              background: filterStatus === 'active' ? '#0070f3' : '#fff',
              color: filterStatus === 'active' ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('shipped')}
            style={{
              padding: '4px 8px',
              background: filterStatus === 'shipped' ? '#0070f3' : '#fff',
              color: filterStatus === 'shipped' ? '#fff' : '#000',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Shipped
          </button>
        </div>
      </div>

      {layout === 'grid' ? (
        <ProjectGrid>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ProjectGrid>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
