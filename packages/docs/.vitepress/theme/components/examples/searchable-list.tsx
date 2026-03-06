import { useState } from 'react'
import { ProjectSearch, ProjectList, ProjectCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'

export function SearchableListExample() {
  const [searchQuery, setSearchQuery] = useState('')

  const allProjects = Object.values(normalisedExamples)

  const filteredProjects = allProjects.filter((project) => {
    const query = searchQuery.toLowerCase()
    return (
      project.name.toLowerCase().includes(query) ||
      project.tagline?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.stack?.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  return (
    <div>
      <ProjectSearch
        onSearch={setSearchQuery}
        placeholder="Search projects..."
      />

      <ProjectList>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectList>
    </div>
  )
}
