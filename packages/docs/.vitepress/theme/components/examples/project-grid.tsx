import { useState } from 'react'
import { ProjectGrid, ProjectCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'

const projects = [
  normalisedExamples.react,
  normalisedExamples.nextjs,
  normalisedExamples.tailwindcss,
  normalisedExamples.lodash,
]

export function ProjectGridMinimalPreview() {
  return (
    <ProjectGrid>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ProjectGrid>
  )
}

export function ProjectGridRealPreview() {
  const allProjects = [
    normalisedExamples.react,
    normalisedExamples.nextjs,
    normalisedExamples.tailwindcss,
    normalisedExamples.lodash,
    normalisedExamples['date-fns'],
    normalisedExamples.zod,
  ]

  return (
    <ProjectGrid>
      {allProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ProjectGrid>
  )
}

export function ProjectGridInteractiveDemo() {
  const [isGrid, setIsGrid] = useState(true)
  const allProjects = [
    normalisedExamples.react,
    normalisedExamples.nextjs,
    normalisedExamples.tailwindcss,
    normalisedExamples.lodash,
  ]

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => setIsGrid(true)}
          style={{
            marginRight: '8px',
            padding: '8px 16px',
            background: isGrid ? '#0070f3' : '#fff',
            color: isGrid ? '#fff' : '#000',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Grid
        </button>
        <button
          onClick={() => setIsGrid(false)}
          style={{
            padding: '8px 16px',
            background: !isGrid ? '#0070f3' : '#fff',
            color: !isGrid ? '#fff' : '#000',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          List
        </button>
      </div>
      {isGrid ? (
        <ProjectGrid>
          {allProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ProjectGrid>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {allProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
