import { bench, describe, beforeAll } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectView } from '../../components/ProjectView'
import type { ProjexProject } from '../../types'

const createProject = (id: number): ProjexProject => ({
  id: `test-project-${id}`,
  type: 'github',
  status: 'active',
  featured: false,
  name: `Test Project ${id}`,
  tagline: `A test project ${id}`,
  description: `This is a test project description ${id} with some longer text to make it more realistic.`,
  background: `This is the background story for project ${id}. It explains the motivation and context.`,
  why: `Why this project matters ${id}.`,
  image: null,
  struggles: [
    { type: 'warn', text: 'First challenge faced' },
    { type: 'error', text: 'Major obstacle encountered' },
  ],
  timeline: [
    { date: '2024-01', note: 'Project started' },
    { date: '2024-03', note: 'MVP completed' },
    { date: '2024-06', note: 'Public launch' },
  ],
  posts: [
    { title: 'Launch announcement', date: '2024-06-01', url: 'https://blog.example.com/launch' },
    { title: 'Technical deep dive', date: '2024-07-15' },
  ],
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

describe('ProjectView render performance', () => {
  let projects: ProjexProject[]

  beforeAll(() => {
    projects = Array.from({ length: 100 }, (_, i) => createProject(i))
  })

  bench('render 100 ProjectView components', () => {
    for (const project of projects) {
      render(
        <ProjectView project={project} onBack={() => {}}>
          <ProjectView.Section project={project} name="background" />
          <ProjectView.Section project={project} name="why" />
          <ProjectView.Section project={project} name="stack" />
          <ProjectView.Section project={project} name="struggles" />
          <ProjectView.Section project={project} name="timeline" />
          <ProjectView.Section project={project} name="posts" />
          <ProjectView.Stats project={project} />
          <ProjectView.Links project={project} />
        </ProjectView>
      )
    }
  })

  bench('render single ProjectView (full composition)', () => {
    const project = projects[0]
    render(
      <ProjectView project={project} onBack={() => {}}>
        <ProjectView.Section project={project} name="background" />
        <ProjectView.Section project={project} name="why" />
        <ProjectView.Section project={project} name="stack" />
        <ProjectView.Section project={project} name="struggles" />
        <ProjectView.Section project={project} name="timeline" />
        <ProjectView.Section project={project} name="posts" />
        <ProjectView.Stats project={project} />
        <ProjectView.Links project={project} />
      </ProjectView>
    )
  })

  bench('render ProjectView (no onBack)', () => {
    const project = projects[0]
    render(
      <ProjectView project={project}>
        <ProjectView.Section project={project} name="background" />
        <ProjectView.Stats project={project} />
        <ProjectView.Links project={project} />
      </ProjectView>
    )
  })

  bench('render ProjectView.Section (string content)', () => {
    const project = projects[0]
    render(<ProjectView.Section project={project} name="background" />)
  })

  bench('render ProjectView.Section (array - stack)', () => {
    const project = projects[0]
    render(<ProjectView.Section project={project} name="stack" />)
  })

  bench('render ProjectView.Section (array - struggles)', () => {
    const project = projects[0]
    render(<ProjectView.Section project={project} name="struggles" />)
  })

  bench('render ProjectView.Section (array - timeline)', () => {
    const project = projects[0]
    render(<ProjectView.Section project={project} name="timeline" />)
  })

  bench('render ProjectView.Section (array - posts)', () => {
    const project = projects[0]
    render(<ProjectView.Section project={project} name="posts" />)
  })

  bench('render ProjectView.Stats', () => {
    const project = projects[0]
    render(<ProjectView.Stats project={project} />)
  })

  bench('render ProjectView.Links', () => {
    const project = projects[0]
    render(<ProjectView.Links project={project} />)
  })
})
