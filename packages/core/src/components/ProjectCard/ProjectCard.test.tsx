import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'
import type { FolioProject } from '../../types'

afterEach(() => {
  cleanup()
})

const createProject = (overrides: Partial<FolioProject> = {}): FolioProject => ({
  id: 'test-project',
  type: 'github',
  status: 'active',
  featured: false,
  name: 'Test Project',
  tagline: 'A test project',
  description: 'This is a test project description',
  background: null,
  why: null,
  image: null,
  struggles: [],
  timeline: [],
  posts: [],
  stack: ['React', 'TypeScript'],
  links: {
    github: 'https://github.com/test/project',
    live: 'https://test-project.com',
  },
  stats: {
    stars: 100,
    forks: 20,
  },
  language: 'TypeScript',
  languageColor: '#3178c6',
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
  ...overrides,
})

describe('ProjectCard', () => {
  it('renders with valid project displaying name, description, and stats', () => {
    const project = createProject()

    const { container } = render(
      <ProjectCard>
        <ProjectCard.Header project={project} />
        <ProjectCard.Description project={project} />
        <ProjectCard.Tags project={project} />
        <ProjectCard.Stats project={project} />
        <ProjectCard.Status project={project} />
        <ProjectCard.Links project={project} />
      </ProjectCard>
    )

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Test Project')
    expect(container.querySelector('[data-folio-card-description]')).toHaveTextContent('This is a test project description')
    expect(screen.getByText('100 stars')).toBeInTheDocument()
    expect(screen.getByText('20 forks')).toBeInTheDocument()
  })

  it('displays GitHub-specific stats', () => {
    const project = createProject({
      type: 'github',
      stats: { stars: 500, forks: 50 },
    })

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(screen.getByText('500 stars')).toBeInTheDocument()
    expect(screen.getByText('50 forks')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-stat="downloads"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-folio-stat="upvotes"]')).not.toBeInTheDocument()
  })

  it('displays npm-specific stats', () => {
    const project = createProject({
      type: 'npm',
      stats: { downloads: '10000', version: '2.0.0' },
    })

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(screen.getByText('10000 downloads')).toBeInTheDocument()
    expect(screen.getByText('2.0.0')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-stat="stars"]')).not.toBeInTheDocument()
  })

  it('displays product-hunt-specific stats', () => {
    const project = createProject({
      type: 'product-hunt',
      stats: { upvotes: 250, comments: 30 },
    })

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(screen.getByText('250 upvotes')).toBeInTheDocument()
    expect(screen.getByText('30 comments')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-stat="stars"]')).not.toBeInTheDocument()
  })

  it('renders nothing when Description has no description', () => {
    const project = createProject({ description: '' })

    const { container } = render(<ProjectCard.Description project={project} />)

    expect(container.querySelector('[data-folio-card-description]')).not.toBeInTheDocument()
  })

  it('renders nothing when Tags has empty stack', () => {
    const project = createProject({ stack: [] })

    const { container } = render(<ProjectCard.Tags project={project} />)

    expect(container.querySelector('[data-folio-card-tags]')).not.toBeInTheDocument()
  })

  it('renders nothing when Stats has no stats', () => {
    const project = createProject({ stats: null })

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(container.querySelector('[data-folio-card-stats]')).not.toBeInTheDocument()
  })

  it('renders nothing when Links has no links', () => {
    const project = createProject({ links: {} })

    const { container } = render(<ProjectCard.Links project={project} />)

    expect(container.querySelector('[data-folio-card-links]')).not.toBeInTheDocument()
  })
})

describe('ProjectCard data attributes', () => {
  it('has correct data-folio-card attribute on root', () => {
    const { container } = render(
      <ProjectCard>
        <span>Content</span>
      </ProjectCard>
    )

    expect(container.querySelector('[data-folio-card]')).toBeInTheDocument()
  })

  it('has correct data-folio-card-header attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Header project={project} />)

    expect(container.querySelector('[data-folio-card-header]')).toBeInTheDocument()
  })

  it('has correct data-folio-type attributes', () => {
    const project = createProject({ type: 'github' })

    const { container } = render(<ProjectCard.Header project={project} />)

    const typeEl = container.querySelector('[data-folio-type]')
    expect(typeEl).toBeInTheDocument()
    expect(typeEl).toHaveAttribute('data-folio-type-value', 'github')
  })

  it('has correct data-folio-card-description attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Description project={project} />)

    expect(container.querySelector('[data-folio-card-description]')).toBeInTheDocument()
  })

  it('has correct data-folio-card-tags attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Tags project={project} />)

    expect(container.querySelector('[data-folio-card-tags]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-folio-tag]')).toHaveLength(2)
  })

  it('has correct data-folio-card-stats attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(container.querySelector('[data-folio-card-stats]')).toBeInTheDocument()
  })

  it('has correct data-folio-status attributes', () => {
    const project = createProject({ status: 'active' })

    const { container } = render(<ProjectCard.Status project={project} />)

    const statusEl = container.querySelector('[data-folio-status]')
    expect(statusEl).toBeInTheDocument()
    expect(statusEl).toHaveAttribute('data-folio-status-value', 'active')
  })

  it('has correct data-folio-card-links attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Links project={project} />)

    expect(container.querySelector('[data-folio-card-links]')).toBeInTheDocument()
  })

  it('has correct data-folio-link attributes', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Links project={project} />)

    const githubLink = container.querySelector('[data-folio-link-type="github"]')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('data-folio-link')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/project')

    const liveLink = container.querySelector('[data-folio-link-type="live"]')
    expect(liveLink).toBeInTheDocument()
    expect(liveLink).toHaveAttribute('data-folio-link')
    expect(liveLink).toHaveAttribute('href', 'https://test-project.com')
  })

  it('displays npm link with correct attributes', () => {
    const project = createProject({
      links: { npm: 'https://npmjs.com/package/test' }
    })

    const { container } = render(<ProjectCard.Links project={project} />)

    const npmLink = container.querySelector('[data-folio-link-type="npm"]')
    expect(npmLink).toBeInTheDocument()
    expect(npmLink).toHaveAttribute('href', 'https://npmjs.com/package/test')
  })

  it('displays product-hunt link with correct attributes', () => {
    const project = createProject({
      links: { productHunt: 'https://producthunt.com/posts/test' }
    })

    const { container } = render(<ProjectCard.Links project={project} />)

    const phLink = container.querySelector('[data-folio-link-type="product-hunt"]')
    expect(phLink).toBeInTheDocument()
    expect(phLink).toHaveAttribute('href', 'https://producthunt.com/posts/test')
  })
})

describe('ProjectCard status values', () => {
  const statuses: Array<'active' | 'shipped' | 'in-progress' | 'coming-soon' | 'archived' | 'for-sale'> = [
    'active', 'shipped', 'in-progress', 'coming-soon', 'archived', 'for-sale'
  ]

  for (const status of statuses) {
    it(`displays ${status} status correctly`, () => {
      const project = createProject({ status })

      const { container } = render(<ProjectCard.Status project={project} />)

      const statusEl = container.querySelector('[data-folio-status]')
      expect(statusEl).toHaveAttribute('data-folio-status-value', status)
      expect(statusEl).toHaveTextContent(status)
    })
  }
})

describe('ProjectCard type values', () => {
  const types: Array<'github' | 'npm' | 'product-hunt' | 'manual' | 'hybrid'> = [
    'github', 'npm', 'product-hunt', 'manual', 'hybrid'
  ]

  for (const type of types) {
    it(`displays ${type} type correctly`, () => {
      const project = createProject({ type })

      const { container } = render(<ProjectCard.Header project={project} />)

      const typeEl = container.querySelector('[data-folio-type]')
      expect(typeEl).toHaveAttribute('data-folio-type-value', type)
      expect(typeEl).toHaveTextContent(type)
    })
  }
})
