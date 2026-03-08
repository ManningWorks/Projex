import { bench, describe, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectCard } from '../../components/ProjectCard'
import type { ProjexProject } from '../../types'

const createProject = (id: number): ProjexProject => ({
  id: `test-project-${id}`,
  type: 'github',
  status: 'active',
  featured: false,
  name: `Test Project ${id}`,
  tagline: `A test project ${id}`,
  description: `This is a test project description ${id} with some longer text to make it more realistic.`,
  background: null,
  why: null,
  image: null,
  struggles: [],
  timeline: [],
  posts: [],
  stack: ['React', 'TypeScript', 'Node.js', 'CSS', 'Jest'],
  links: {
    github: `https://github.com/test/project-${id}`,
    live: `https://test-project-${id}.com`,
    npm: `https://npmjs.com/package/test-${id}`,
  },
  stats: {
    stars: Math.floor(Math.random() * 10000),
    forks: Math.floor(Math.random() * 1000),
    downloads: `${Math.floor(Math.random() * 100000)}`,
    version: '1.0.0',
  },
  language: 'TypeScript',
  languageColor: '#3178c6',
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
})

describe('ProjectCard render performance', () => {
  let projects: ProjexProject[]

  beforeAll(() => {
    projects = Array.from({ length: 100 }, (_, i) => createProject(i))
  })

  bench('render 100 ProjectCard components', () => {
    for (const project of projects) {
      render(
        <ProjectCard>
          <ProjectCard.Header project={project} />
          <ProjectCard.Description project={project} />
          <ProjectCard.Tags project={project} />
          <ProjectCard.Stats project={project} />
          <ProjectCard.Status project={project} />
          <ProjectCard.Links project={project} />
        </ProjectCard>
      )
    }
  })

  bench('render single ProjectCard (full composition)', () => {
    const project = projects[0]
    render(
      <ProjectCard>
        <ProjectCard.Header project={project} />
        <ProjectCard.Description project={project} />
        <ProjectCard.Tags project={project} />
        <ProjectCard.Stats project={project} />
        <ProjectCard.Status project={project} />
        <ProjectCard.Links project={project} />
      </ProjectCard>
    )
  })

  bench('render ProjectCard.Header only', () => {
    const project = projects[0]
    render(<ProjectCard.Header project={project} />)
  })

  bench('render ProjectCard.Tags (5 tags)', () => {
    const project = projects[0]
    render(<ProjectCard.Tags project={project} />)
  })

  bench('render ProjectCard.Stats (4 stats)', () => {
    const project = projects[0]
    render(<ProjectCard.Stats project={project} />)
  })

  bench('render ProjectCard.Links (3 links)', () => {
    const project = projects[0]
    render(<ProjectCard.Links project={project} />)
  })
})
