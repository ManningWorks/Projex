import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProjectView } from './ProjectView'
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
  background: 'This is the background story of the project.',
  why: 'Why I built this project.',
  image: null,
  struggles: [
    { type: 'warn', text: 'First challenge faced' },
    { type: 'error', text: 'Critical issue encountered' },
  ],
  timeline: [
    { date: '2024-01-01', note: 'Project started' },
    { date: '2024-06-01', note: 'First release' },
  ],
  posts: [
    { title: 'Announcement Post', date: '2024-02-01', url: 'https://blog.com/post1' },
    { title: 'Update Post', date: '2024-07-01' },
  ],
  stack: ['React', 'TypeScript', 'Node.js'],
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

describe('ProjectView', () => {
  it('renders with project sections displaying correct content', () => {
    const project = createProject()

    const { container } = render(
      <ProjectView project={project}>
        <ProjectView.Section project={project} name="background" />
        <ProjectView.Section project={project} name="why" />
      </ProjectView>
    )

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Test Project')
    expect(container.querySelector('[data-folio-view-section-name="background"]')).toHaveTextContent(/This is the background story/)
    expect(screen.getByText('Why I built this project.')).toBeInTheDocument()
  })

  it('renders back button when onBack is provided', () => {
    const project = createProject()
    const onBack = () => {}

    render(
      <ProjectView project={project} onBack={onBack}>
        <span>Content</span>
      </ProjectView>
    )

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('does not render back button when onBack is not provided', () => {
    const project = createProject()

    const { container } = render(
      <ProjectView project={project}>
        <span>Content</span>
      </ProjectView>
    )

    expect(container.querySelector('button')).not.toBeInTheDocument()
  })
})

describe('ProjectView sections conditional rendering', () => {
  it('does not render section when data is null', () => {
    const project = createProject({ background: null })

    const { container } = render(<ProjectView.Section project={project} name="background" />)

    expect(container.querySelector('[data-folio-view-section]')).not.toBeInTheDocument()
  })

  it('does not render section when data is empty string', () => {
    const project = createProject({ background: '' })

    const { container } = render(<ProjectView.Section project={project} name="background" />)

    expect(container.querySelector('[data-folio-view-section]')).not.toBeInTheDocument()
  })

  it('renders empty section wrapper when data is empty array', () => {
    const project = createProject({ struggles: [] })

    const { container } = render(<ProjectView.Section project={project} name="struggles" />)

    expect(container.querySelector('[data-folio-view-section]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-struggle]')).not.toBeInTheDocument()
  })

  it('renders background section when present', () => {
    const project = createProject({ background: 'Background info' })

    const { container } = render(<ProjectView.Section project={project} name="background" />)

    expect(container.querySelector('[data-folio-view-section]')).toBeInTheDocument()
    expect(screen.getByText('Background info')).toBeInTheDocument()
  })

  it('renders why section when present', () => {
    const project = createProject({ why: 'Why this matters' })

    const { container } = render(<ProjectView.Section project={project} name="why" />)

    expect(container.querySelector('[data-folio-view-section]')).toBeInTheDocument()
    expect(screen.getByText('Why this matters')).toBeInTheDocument()
  })

  it('renders struggles with correct attributes', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Section project={project} name="struggles" />)

    expect(container.querySelectorAll('[data-folio-struggle]')).toHaveLength(2)
    
    const warnStruggle = container.querySelector('[data-folio-struggle-type="warn"]')
    expect(warnStruggle).toBeInTheDocument()
    expect(warnStruggle).toHaveTextContent('First challenge faced')

    const errorStruggle = container.querySelector('[data-folio-struggle-type="error"]')
    expect(errorStruggle).toBeInTheDocument()
    expect(errorStruggle).toHaveTextContent('Critical issue encountered')
  })

  it('renders timeline with correct attributes', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Section project={project} name="timeline" />)

    expect(container.querySelectorAll('[data-folio-timeline-date]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-folio-timeline-note]')).toHaveLength(2)
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    expect(screen.getByText('Project started')).toBeInTheDocument()
  })

  it('renders posts with correct attributes', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Section project={project} name="posts" />)

    expect(container.querySelectorAll('[data-folio-post-title]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-folio-post-date]')).toHaveLength(2)
    
    expect(screen.getByText('Announcement Post')).toBeInTheDocument()

    const postLink = container.querySelector('[data-folio-post-link]')
    expect(postLink).toBeInTheDocument()
    expect(postLink).toHaveAttribute('href', 'https://blog.com/post1')
  })

  it('renders posts without url without link', () => {
    const project = createProject({
      posts: [{ title: 'No URL Post', date: '2024-01-01' }]
    })

    const { container } = render(<ProjectView.Section project={project} name="posts" />)

    expect(container.querySelector('[data-folio-post-link]')).not.toBeInTheDocument()
    expect(screen.getByText('No URL Post')).toBeInTheDocument()
  })

  it('renders stack with tag attributes', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Section project={project} name="stack" />)

    expect(container.querySelectorAll('[data-folio-tag]')).toHaveLength(3)
  })
})

describe('ProjectView Links', () => {
  it('renders links when present', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Links project={project} />)

    expect(container.querySelector('[data-folio-view-links]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-link-type="github"]')).toBeInTheDocument()
    expect(container.querySelector('[data-folio-link-type="live"]')).toBeInTheDocument()
  })

  it('does not render when no links', () => {
    const project = createProject({ links: {} })

    const { container } = render(<ProjectView.Links project={project} />)

    expect(container.querySelector('[data-folio-view-links]')).not.toBeInTheDocument()
  })

  it('renders app store link', () => {
    const project = createProject({
      links: { appStore: 'https://apps.apple.com/app/test' }
    })

    const { container } = render(<ProjectView.Links project={project} />)

    const link = container.querySelector('[data-folio-link-type="app-store"]')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://apps.apple.com/app/test')
  })

  it('renders play store link', () => {
    const project = createProject({
      links: { playStore: 'https://play.google.com/store/apps/test' }
    })

    const { container } = render(<ProjectView.Links project={project} />)

    const link = container.querySelector('[data-folio-link-type="play-store"]')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://play.google.com/store/apps/test')
  })

  it('renders product hunt link', () => {
    const project = createProject({
      links: { productHunt: 'https://producthunt.com/posts/test' }
    })

    const { container } = render(<ProjectView.Links project={project} />)

    const link = container.querySelector('[data-folio-link-type="product-hunt"]')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://producthunt.com/posts/test')
  })
})

describe('ProjectView Stats', () => {
  it('renders stats when present', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Stats project={project} />)

    expect(container.querySelector('[data-folio-view-stats]')).toBeInTheDocument()
    expect(screen.getByText('100 stars')).toBeInTheDocument()
    expect(screen.getByText('20 forks')).toBeInTheDocument()
  })

  it('does not render when stats is null', () => {
    const project = createProject({ stats: null })

    const { container } = render(<ProjectView.Stats project={project} />)

    expect(container.querySelector('[data-folio-view-stats]')).not.toBeInTheDocument()
  })

  it('does not render when stats object has no values', () => {
    const project = createProject({ stats: {} })

    const { container } = render(<ProjectView.Stats project={project} />)

    expect(container.querySelector('[data-folio-view-stats]')).not.toBeInTheDocument()
  })

  it('renders npm stats', () => {
    const project = createProject({
      stats: { downloads: '5000', version: '3.0.0' }
    })

    render(<ProjectView.Stats project={project} />)

    expect(screen.getByText('5000 downloads')).toBeInTheDocument()
    expect(screen.getByText('3.0.0')).toBeInTheDocument()
  })

  it('renders product hunt stats', () => {
    const project = createProject({
      stats: { upvotes: 300, comments: 45 }
    })

    render(<ProjectView.Stats project={project} />)

    expect(screen.getByText('300 upvotes')).toBeInTheDocument()
    expect(screen.getByText('45 comments')).toBeInTheDocument()
  })
})

describe('ProjectView Commits', () => {
  it('renders commits section when commits are present', () => {
    const project = createProject({
      commits: [
        { message: 'First commit', date: '2024-01-01', url: 'https://github.com/test/project/commit/1' },
        { message: 'Second commit', date: '2024-01-02', url: 'https://github.com/test/project/commit/2' },
        { message: 'Third commit', date: '2024-01-03', url: 'https://github.com/test/project/commit/3' },
        { message: 'Fourth commit', date: '2024-01-04', url: 'https://github.com/test/project/commit/4' },
        { message: 'Fifth commit', date: '2024-01-05', url: 'https://github.com/test/project/commit/5' },
      ]
    })

    const { container } = render(<ProjectView.Commits project={project} />)

    expect(container.querySelector('[data-folio-commits]')).toBeInTheDocument()
  })

  it('does not render when commits is undefined', () => {
    const project = createProject({ commits: undefined })

    const { container } = render(<ProjectView.Commits project={project} />)

    expect(container.querySelector('[data-folio-commits]')).not.toBeInTheDocument()
  })

  it('does not render when commits is empty array', () => {
    const project = createProject({ commits: [] })

    const { container } = render(<ProjectView.Commits project={project} />)

    expect(container.querySelector('[data-folio-commits]')).not.toBeInTheDocument()
  })

  it('renders commits header', () => {
    const project = createProject({
      commits: [
        { message: 'First commit', date: '2024-01-01', url: 'https://github.com/test/project/commit/1' }
      ]
    })

    const { container } = render(<ProjectView.Commits project={project} />)

    expect(container.querySelector('[data-folio-commits-header]')).toHaveTextContent('Commits')
  })

  it('uses CommitList component for rendering commits', () => {
    const project = createProject({
      commits: [
        { message: 'First commit', date: '2024-01-01', url: 'https://github.com/test/project/commit/1' },
        { message: 'Second commit', date: '2024-01-02', url: 'https://github.com/test/project/commit/2' },
      ]
    })

    const { container } = render(<ProjectView.Commits project={project} />)

    expect(container.querySelectorAll('[data-folio-commit]')).toHaveLength(2)
  })
})

describe('ProjectView data attributes', () => {
  it('has correct data-folio-view attribute on root', () => {
    const project = createProject()

    const { container } = render(
      <ProjectView project={project}>
        <span>Content</span>
      </ProjectView>
    )

    expect(container.querySelector('[data-folio-view]')).toBeInTheDocument()
  })

  it('has correct data-folio-view-section attributes', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Section project={project} name="background" />)

    const section = container.querySelector('[data-folio-view-section]')
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute('data-folio-view-section-name', 'background')
  })

  it('has correct data-folio-view-links attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Links project={project} />)

    expect(container.querySelector('[data-folio-view-links]')).toBeInTheDocument()
  })

  it('has correct data-folio-view-stats attribute', () => {
    const project = createProject()

    const { container } = render(<ProjectView.Stats project={project} />)

    expect(container.querySelector('[data-folio-view-stats]')).toBeInTheDocument()
  })
})
