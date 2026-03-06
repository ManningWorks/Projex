import { useState } from 'react'
import { ProjectFilterBar, ProjectFilterTag, ProjectGrid, ProjectCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'

export function FilteredGridExample() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const allProjects = Object.values(normalisedExamples)

  const filteredProjects = allProjects.filter((project) => {
    if (selectedType && project.type !== selectedType) return false
    if (selectedStatus && project.status !== selectedStatus) return false
    return true
  })

  const types = Array.from(new Set(allProjects.map((p) => p.type)))
  const statuses = Array.from(new Set(allProjects.map((p) => p.status)))

  return (
    <div>
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

      <ProjectGrid>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectGrid>
    </div>
  )
}
