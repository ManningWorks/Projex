import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProjectCard } from './ProjectCard'
import type { ProjexProject } from '../../types'

afterEach(() => {
  cleanup()
})

const createProject = (overrides: Partial<ProjexProject> = {}): ProjexProject => ({
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
    expect(container.querySelector('[data-projex-card-description]')).toHaveTextContent('This is a test project description')
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
    expect(container.querySelector('[data-projex-stat="downloads"]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-projex-stat="upvotes"]')).not.toBeInTheDocument()
  })

  it('displays npm-specific stats', () => {
    const project = createProject({
      type: 'npm',
      stats: { downloads: '10000', version: '2.0.0' },
    })

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(screen.getByText('10000 downloads')).toBeInTheDocument()
    expect(screen.getByText('2.0.0')).toBeInTheDocument()
    expect(container.querySelector('[data-projex-stat="stars"]')).not.toBeInTheDocument()
  })

  it('displays product-hunt-specific stats', () => {
    const project = createProject({
      type: 'product-hunt',
      stats: { upvotes: 250, comments: 30 },
    })

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(screen.getByText('250 upvotes')).toBeInTheDocument()
    expect(screen.getByText('30 comments')).toBeInTheDocument()
    expect(container.querySelector('[data-projex-stat="stars"]')).not.toBeInTheDocument()
  })

  it('renders nothing when Description has no description', () => {
    const project = createProject({ description: '' })

    const { container } = render(<ProjectCard.Description project={project} />)

    expect(container.querySelector('[data-projex-card-description]')).not.toBeInTheDocument()
  })

  it('renders nothing when Tags has empty stack', () => {
    const project = createProject({ stack: [] })

    const { container } = render(<ProjectCard.Tags project={project} />)

    expect(container.querySelector('[data-projex-card-tags]')).not.toBeInTheDocument()
  })

  it('renders nothing when Stats has no stats', () => {
    const project = createProject({ stats: null })

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(container.querySelector('[data-projex-card-stats]')).not.toBeInTheDocument()
  })

  it('renders nothing when Links has no links', () => {
    const project = createProject({ links: {} })

    const { container } = render(<ProjectCard.Links project={project} />)

    expect(container.querySelector('[data-projex-card-links]')).not.toBeInTheDocument()
  })
})

describe('ProjectCard data attributes', () => {
  it('has correct data-projex-card attribute on root', () => {
    const { container } = render(
      <ProjectCard>
        <span>Content</span>
      </ProjectCard>
    )

    expect(container.querySelector('[data-projex-card]')).toBeInTheDocument()
  })

  it('has data-projex-card with project id when project is provided', () => {
    const project = createProject({ id: 'my-custom-project' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    const card = container.querySelector('[data-projex-card]')
    expect(card).toHaveAttribute('data-projex-card', 'my-custom-project')
  })

  it('allows targeting specific card by project id with CSS selector', () => {
    const project = createProject({ id: 'specific-project' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    expect(container.querySelector('[data-projex-card="specific-project"]')).toBeInTheDocument()
  })

  it('has data-projex-github-card attribute when project type is github', () => {
    const project = createProject({ type: 'github' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    expect(container.querySelector('[data-projex-github-card]')).toBeInTheDocument()
  })

  it('does not have data-projex-github-card attribute when project type is not github', () => {
    const project = createProject({ type: 'npm' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    expect(container.querySelector('[data-projex-github-card]')).not.toBeInTheDocument()
  })

  it('allows targeting all github cards with CSS selector', () => {
    const project = createProject({ type: 'github' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    expect(container.querySelector('[data-projex-github-card]')).toBeInTheDocument()
  })

  it('has correct data-projex-card-header attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Header project={project} />)

    expect(container.querySelector('[data-projex-card-header]')).toBeInTheDocument()
  })

  it('has correct data-projex-type attributes', () => {
    const project = createProject({ type: 'github' })

    const { container } = render(<ProjectCard.Header project={project} />)

    const typeEl = container.querySelector('[data-projex-type]')
    expect(typeEl).toBeInTheDocument()
    expect(typeEl).toHaveAttribute('data-projex-type-value', 'github')
  })

  it('has correct data-projex-card-description attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Description project={project} />)

    expect(container.querySelector('[data-projex-card-description]')).toBeInTheDocument()
  })

  it('has correct data-projex-card-tags attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Tags project={project} />)

    expect(container.querySelector('[data-projex-card-tags]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-projex-tag]')).toHaveLength(2)
  })

  it('has correct data-projex-card-stats attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Stats project={project} />)

    expect(container.querySelector('[data-projex-card-stats]')).toBeInTheDocument()
  })

  it('has correct data-projex-status attributes', () => {
    const project = createProject({ status: 'active' })

    const { container } = render(<ProjectCard.Status project={project} />)

    const statusEl = container.querySelector('[data-projex-status]')
    expect(statusEl).toBeInTheDocument()
    expect(statusEl).toHaveAttribute('data-projex-status-value', 'active')
  })

  it('has correct data-projex-card-links attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Links project={project} />)

    expect(container.querySelector('[data-projex-card-links]')).toBeInTheDocument()
  })

  it('has correct data-projex-link attributes', () => {
    const project = createProject()

    const { container } = render(<ProjectCard.Links project={project} />)

    const githubLink = container.querySelector('[data-projex-link-type="github"]')
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('data-projex-link')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/project')

    const liveLink = container.querySelector('[data-projex-link-type="live"]')
    expect(liveLink).toBeInTheDocument()
    expect(liveLink).toHaveAttribute('data-projex-link')
    expect(liveLink).toHaveAttribute('href', 'https://test-project.com')
  })

  it('displays npm link with correct attributes', () => {
    const project = createProject({
      links: { npm: 'https://npmjs.com/package/test' }
    })

    const { container } = render(<ProjectCard.Links project={project} />)

    const npmLink = container.querySelector('[data-projex-link-type="npm"]')
    expect(npmLink).toBeInTheDocument()
    expect(npmLink).toHaveAttribute('href', 'https://npmjs.com/package/test')
  })

  it('displays product-hunt link with correct attributes', () => {
    const project = createProject({
      links: { productHunt: 'https://producthunt.com/posts/test' }
    })

    const { container } = render(<ProjectCard.Links project={project} />)

    const phLink = container.querySelector('[data-projex-link-type="product-hunt"]')
    expect(phLink).toBeInTheDocument()
    expect(phLink).toHaveAttribute('href', 'https://producthunt.com/posts/test')
  })

  it('has data-projex-og-image attribute when project has image', () => {
    const project = createProject({ image: 'https://example.com/project-image.png' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    const card = container.querySelector('[data-projex-card]')
    expect(card).toHaveAttribute('data-projex-og-image', 'https://example.com/project-image.png')
  })

  it('omits data-projex-og-image attribute when project has no image', () => {
    const project = createProject({ image: null })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    const card = container.querySelector('[data-projex-card]')
    expect(card).not.toHaveAttribute('data-projex-og-image')
  })

  it('has data-projex-og-title attribute with project name', () => {
    const project = createProject({ name: 'My Awesome Project' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    const card = container.querySelector('[data-projex-card]')
    expect(card).toHaveAttribute('data-projex-og-title', 'My Awesome Project')
  })

  it('has data-projex-og-description attribute with project description', () => {
    const project = createProject({ description: 'An amazing project for testing' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    const card = container.querySelector('[data-projex-card]')
    expect(card).toHaveAttribute('data-projex-og-description', 'An amazing project for testing')
  })

  it('omits data-projex-og-description attribute when project has no description', () => {
    const project = createProject({ description: '' })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    const card = container.querySelector('[data-projex-card]')
    expect(card).not.toHaveAttribute('data-projex-og-description')
  })

  it('allows extracting OG metadata via DOM query', () => {
    const project = createProject({
      image: 'https://example.com/image.png',
      name: 'Test Project',
      description: 'Test description',
    })

    const { container } = render(
      <ProjectCard project={project}>
        <span>Content</span>
      </ProjectCard>
    )

    const card = container.querySelector('[data-projex-card]')
    expect(card?.getAttribute('data-projex-og-image')).toBe('https://example.com/image.png')
    expect(card?.getAttribute('data-projex-og-title')).toBe('Test Project')
    expect(card?.getAttribute('data-projex-og-description')).toBe('Test description')
  })

  it('data-projex-link-type="live" exists when live link is present', () => {
    const project = createProject({
      links: { live: 'https://live-project.com' }
    })

    const { container } = render(<ProjectCard.Links project={project} />)

    const liveLink = container.querySelector('[data-projex-link-type="live"]')
    expect(liveLink).toBeInTheDocument()
    expect(liveLink).toHaveAttribute('href', 'https://live-project.com')
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

      const statusEl = container.querySelector('[data-projex-status]')
      expect(statusEl).toHaveAttribute('data-projex-status-value', status)
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

      const typeEl = container.querySelector('[data-projex-type]')
      expect(typeEl).toHaveAttribute('data-projex-type-value', type)
      expect(typeEl).toHaveTextContent(type)
    })
  }
})
