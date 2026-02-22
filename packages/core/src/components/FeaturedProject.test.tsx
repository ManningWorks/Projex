import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { FeaturedProject } from './FeaturedProject'
import type { FolioProject } from '../types'

afterEach(() => {
  cleanup()
})

const createProject = (overrides: Partial<FolioProject> = {}): FolioProject => ({
  id: 'test-project',
  type: 'github',
  status: 'active',
  featured: true,
  name: 'Featured Project',
  tagline: 'A featured project',
  description: 'This is a featured project description',
  background: 'Background of the featured project.',
  why: 'Why this project is featured.',
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
    stars: 1000,
    forks: 200,
  },
  language: 'TypeScript',
  languageColor: '#3178c6',
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
  ...overrides,
})

describe('FeaturedProject', () => {
  it('displays project prominently with project data', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Featured Project')
    expect(container.querySelector('[data-folio-view-section-name="background"]')).toHaveTextContent(/Background of the featured project/)
    expect(screen.getByText('Why this project is featured.')).toBeInTheDocument()
  })

  it('renders nothing without project', () => {
    const { container } = render(<FeaturedProject project={undefined} />)

    expect(container.querySelector('[data-folio-featured]')).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing with null project', () => {
    const { container } = render(<FeaturedProject project={null} />)

    expect(container.querySelector('[data-folio-featured]')).not.toBeInTheDocument()
  })

  it('displays image when project has image', () => {
    const project = createProject({ image: 'https://example.com/image.png' })

    const { container } = render(<FeaturedProject project={project} />)

    const image = container.querySelector('[data-folio-featured-image]')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.png')
    expect(image).toHaveAttribute('alt', 'Featured Project')
  })

  it('does not display image when project has no image', () => {
    const project = createProject({ image: null })

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-featured-image]')).not.toBeInTheDocument()
  })

  it('displays stats when available', () => {
    const project = createProject()

    render(<FeaturedProject project={project} />)

    expect(screen.getByText('1000 stars')).toBeInTheDocument()
    expect(screen.getByText('200 forks')).toBeInTheDocument()
  })

  it('displays links when available', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-link-type="github"]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-link-type="live"]')).toBeInTheDocument()
  })
})

describe('FeaturedProject data attributes', () => {
  it('has correct data-folio-featured attribute on root', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-featured]')).toBeInTheDocument()
  })

  it('has correct data-folio-featured-image attribute', () => {
    const project = createProject({ image: 'https://example.com/image.png' })

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-featured-image]')).toBeInTheDocument()
  })

  it('has correct data-folio-view attribute from ProjectView', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-view]')).toBeInTheDocument()
  })

  it('has correct data-folio-view-section attributes', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-view-section-name="background"]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-view-section-name="why"]')).toBeInTheDocument()
  })

  it('has correct data-folio-view-stats attribute', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-view-stats]')).toBeInTheDocument()
  })

  it('has correct data-folio-view-links attribute', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-view-links]')).toBeInTheDocument()
  })
})

describe('FeaturedProject composition', () => {
  it('uses ProjectView internally for project display', () => {
    const project = createProject()

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-view]')).toBeInTheDocument()
  })

  it('renders background section via ProjectView.Section', () => {
    const project = createProject({ background: 'Custom background' })

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-view-section-name="background"]')).toHaveTextContent('Custom background')
  })

  it('renders why section via ProjectView.Section', () => {
    const project = createProject({ why: 'Custom why' })

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-view-section-name="why"]')).toHaveTextContent('Custom why')
  })

  it('handles project with no background gracefully', () => {
    const project = createProject({ background: null })

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-featured]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-view-section-name="background"]')).not.toBeInTheDocument()
  })

  it('handles project with no why gracefully', () => {
    const project = createProject({ why: null })

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-featured]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-view-section-name="why"]')).not.toBeInTheDocument()
  })

  it('handles project with no stats gracefully', () => {
    const project = createProject({ stats: null })

    const { container } = render(<FeaturedProject project={project} />)

    expect(container.querySelector('[data-folio-featured]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-view-stats]')).not.toBeInTheDocument()
  })
})
