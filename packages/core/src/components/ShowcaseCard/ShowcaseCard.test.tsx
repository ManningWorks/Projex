import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ShowcaseCard } from './ShowcaseCard'
import type { ProjexProject } from '../../types'

afterEach(() => {
  cleanup()
})

const createProject = (overrides: Partial<ProjexProject> = {}): ProjexProject => ({
  id: 'showcase-project',
  type: 'github',
  status: 'active',
  featured: false,
  name: 'Showcase Project',
  tagline: 'A showcase project',
  description: 'Showcase description',
  background: null,
  why: null,
  image: null,
  struggles: [],
  timeline: [],
  posts: [],
  stack: ['React'],
  links: { github: 'https://github.com/test/project' },
  stats: null,
  language: null,
  languageColor: null,
  createdAt: null,
  updatedAt: null,
  ...overrides,
})

describe('ShowcaseCard.Stats', () => {
  it('renders the github subset (stars, forks)', () => {
    const project = createProject({
      stats: { type: 'github', stars: 100, forks: 20 },
    })

    const { container } = render(<ShowcaseCard.Stats project={project} />)

    expect(screen.getByText('100 stars')).toBeInTheDocument()
    expect(screen.getByText('20 forks')).toBeInTheDocument()
    expect(container.querySelector('[data-projex-stat="stars"]')).toBeInTheDocument()
    expect(container.querySelector('[data-projex-stat="forks"]')).toBeInTheDocument()
  })

  it('renders the npm subset (downloads, version)', () => {
    const project = createProject({
      type: 'npm',
      stats: { type: 'npm', downloads: '10000', version: '2.0.0' },
    })

    render(<ShowcaseCard.Stats project={project} />)

    expect(screen.getByText('10000 downloads')).toBeInTheDocument()
    expect(screen.getByText('2.0.0')).toBeInTheDocument()
  })

  it('renders the product-hunt subset (upvotes, comments)', () => {
    const project = createProject({
      type: 'product-hunt',
      stats: { type: 'product-hunt', upvotes: 250, comments: 30 },
    })

    render(<ShowcaseCard.Stats project={project} />)

    expect(screen.getByText('250 upvotes')).toBeInTheDocument()
    expect(screen.getByText('30 comments')).toBeInTheDocument()
  })

  it('renders nothing for a hybrid project (no curated fields are emphasised, but stars/forks/downloads/version still are)', () => {
    const project = createProject({
      type: 'hybrid',
      stats: {
        type: 'hybrid',
        stars: 50,
        forks: 5,
        downloads: '500',
        version: '1.0.0',
      },
    })

    render(<ShowcaseCard.Stats project={project} />)

    expect(screen.getByText('50 stars')).toBeInTheDocument()
    expect(screen.getByText('500 downloads')).toBeInTheDocument()
    expect(screen.getByText('1.0.0')).toBeInTheDocument()
  })

  it('renders nothing for youtube stats (outside the curated subset)', () => {
    const project = createProject({
      type: 'youtube',
      stats: {
        type: 'youtube',
        subscribers: 10000,
        views: 500000,
        latestVideoTitle: 'Video',
        latestVideoUrl: 'https://youtube.com/watch?v=abc',
      },
    })

    const { container } = render(<ShowcaseCard.Stats project={project} />)

    expect(container.querySelector('[data-projex-card-stats]')).not.toBeInTheDocument()
    expect(container.querySelector('[data-projex-link-type="youtube"]')).not.toBeInTheDocument()
  })

  it('renders nothing for gumroad stats (outside the curated subset)', () => {
    const project = createProject({
      type: 'gumroad',
      stats: { type: 'gumroad', formattedRevenue: '$1,234', salesCount: 42 },
    })

    const { container } = render(<ShowcaseCard.Stats project={project} />)

    expect(container.querySelector('[data-projex-card-stats]')).not.toBeInTheDocument()
  })

  it('renders nothing when stats is null', () => {
    const project = createProject({ stats: null })

    const { container } = render(<ShowcaseCard.Stats project={project} />)

    expect(container.querySelector('[data-projex-card-stats]')).not.toBeInTheDocument()
  })

  it('renders nothing when curated stat values are all zero/absent', () => {
    const project = createProject({
      stats: { type: 'github', stars: 0, forks: 0 },
    })

    const { container } = render(<ShowcaseCard.Stats project={project} />)

    expect(container.querySelector('[data-projex-card-stats]')).not.toBeInTheDocument()
  })
})

describe('ShowcaseCard (smoke)', () => {
  it('renders header, description and tags', () => {
    const project = createProject()

    render(
      <ShowcaseCard>
        <ShowcaseCard.Header project={project} />
        <ShowcaseCard.Description project={project} />
        <ShowcaseCard.Tags project={project} />
      </ShowcaseCard>,
    )

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Showcase Project')
    expect(screen.getByText('Showcase description')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
