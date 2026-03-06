import { ProjectList, ProjectCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'

const projects = [
  normalisedExamples.react,
  normalisedExamples.nextjs,
  normalisedExamples.tailwindcss,
]

export function ProjectListMinimalPreview() {
  return (
    <ProjectList>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ProjectList>
  )
}

export function ProjectListRealPreview() {
  const allProjects = [
    normalisedExamples.react,
    normalisedExamples.nextjs,
    normalisedExamples.tailwindcss,
    normalisedExamples.lodash,
    normalisedExamples['date-fns'],
  ]

  return (
    <ProjectList>
      {allProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ProjectList>
  )
}
