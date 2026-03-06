import { useState } from 'react'
import {
  ProjectSearch,
  ProjectFilterBar,
  ProjectFilterTag,
  ProjectGrid,
  ProjectCard
} from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'

export function InteractiveDemoExample() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  const allProjects = Object.values(normalisedExamples)

  const filteredProjects = allProjects.filter((project) => {
    if (selectedType && project.type !== selectedType) return false
    if (selectedStatus && project.status !== selectedStatus) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        project.name.toLowerCase().includes(query) ||
        project.tagline?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.stack?.some((tag) => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  const types = Array.from(new Set(allProjects.map((p) => p.type)))
  const statuses = Array.from(new Set(allProjects.map((p) => p.status)))

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <ProjectSearch
          onSearch={setSearchQuery}
          placeholder="Search projects..."
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <ProjectFilterBar>
          <div>
            <ProjectFilterTag
              label="All"
              isActive={selectedType === null}
              onClick={() => setSelectedType(null)}
            />
            {types.map((type) => (
              <ProjectFilterTag
                key={type}
                label={type}
                isActive={selectedType === type}
                onClick={() => setSelectedType(type)}
              />
            ))}
          </div>
          <div>
            <ProjectFilterTag
              label="All"
              isActive={selectedStatus === null}
              onClick={() => setSelectedStatus(null)}
            />
            {statuses.map((status) => (
              <ProjectFilterTag
                key={status}
                label={status}
                isActive={selectedStatus === status}
                onClick={() => setSelectedStatus(status)}
              />
            ))}
          </div>
        </ProjectFilterBar>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => setLayout('grid')}
          style={{
            marginRight: '8px',
            padding: '8px 16px',
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
            padding: '8px 16px',
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
