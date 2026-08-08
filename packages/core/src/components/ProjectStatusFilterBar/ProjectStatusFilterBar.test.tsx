import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { ProjectStatusFilterBar } from './ProjectStatusFilterBar'
import { PROJECT_STATUSES } from '../../lib/getUniqueStatuses'
import type { ProjexProject } from '../../types'

function createProject(overrides: Partial<ProjexProject> = {}): ProjexProject {
  return {
    id: 'test-id',
    type: 'github',
    status: 'active',
    featured: false,
    name: 'Test Project',
    tagline: '',
    description: '',
    background: null,
    why: null,
    image: null,
    struggles: [],
    timeline: [],
    posts: [],
    stack: [],
    links: {},
    stats: null,
    language: null,
    languageColor: null,
    createdAt: null,
    updatedAt: null,
    ...overrides,
  }
}

const projects: ProjexProject[] = [
  createProject({ id: '1', status: 'archived' }),
  createProject({ id: '2', status: 'active' }),
  createProject({ id: '3', status: 'shipped' }),
]

afterEach(() => {
  cleanup()
})

describe('ProjectStatusFilterBar', () => {
  it('renders nothing when projects is empty', () => {
    const { container } = render(
      <ProjectStatusFilterBar projects={[]} value="all" onChange={vi.fn()} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('wraps tags in ProjectFilterBar (inherits data-projex-filter-bar)', () => {
    const { container } = render(
      <ProjectStatusFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    expect(container.querySelector('[data-projex-filter-bar]')).toBeInTheDocument()
  })

  it('renders "All" first, then one tag per available lifecycle state in PROJECT_STATUSES order', () => {
    const { container } = render(
      <ProjectStatusFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    const tags = container.querySelectorAll('[data-projex-filter-tag]')
    const labels = Array.from(tags).map(tag => tag.textContent)

    expect(labels).toEqual(['All', 'active', 'shipped', 'archived'])
  })

  it('renders a full set of lifecycle states exactly in PROJECT_STATUSES order', () => {
    const fullProjects = PROJECT_STATUSES.map((status, i) =>
      createProject({ id: String(i), status })
    )

    const { container } = render(
      <ProjectStatusFilterBar projects={fullProjects} value="all" onChange={vi.fn()} />
    )

    const labels = Array.from(
      container.querySelectorAll('[data-projex-filter-tag]')
    ).map(tag => tag.textContent)

    expect(labels).toEqual(['All', ...PROJECT_STATUSES])
  })

  it('marks the "All" tag active when value is "all"', () => {
    const { container } = render(
      <ProjectStatusFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    const tags = container.querySelectorAll('[data-projex-filter-tag]')
    expect(tags[0]).toHaveAttribute('data-projex-filter-tag-active', 'true')
    expect(tags[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('marks exactly one tag active for the matching lifecycle state', () => {
    const { container } = render(
      <ProjectStatusFilterBar projects={projects} value="shipped" onChange={vi.fn()} />
    )

    const tags = container.querySelectorAll('[data-projex-filter-tag]')
    const active = Array.from(tags).filter(tag =>
      tag.hasAttribute('data-projex-filter-tag-active')
    )

    expect(active).toHaveLength(1)
    expect(active[0]).toHaveTextContent('shipped')
    expect(active[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange with the lifecycle state value when an inactive tag is clicked', () => {
    const onChange = vi.fn()
    render(
      <ProjectStatusFilterBar projects={projects} value="all" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'shipped' }))

    expect(onChange).toHaveBeenCalledWith('shipped')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('calls onChange("all") when the "All" tag is clicked from an active lifecycle state', () => {
    const onChange = vi.fn()
    render(
      <ProjectStatusFilterBar projects={projects} value="shipped" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(onChange).toHaveBeenCalledWith('all')
  })

  it('is a no-op when clicking the already-active tag', () => {
    const onChange = vi.fn()
    render(
      <ProjectStatusFilterBar projects={projects} value="shipped" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'shipped' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('is a no-op when clicking the already-active "All" tag', () => {
    const onChange = vi.fn()
    render(
      <ProjectStatusFilterBar projects={projects} value="all" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('overrides the "All" label via allLabel', () => {
    render(
      <ProjectStatusFilterBar
        projects={projects}
        value="all"
        onChange={vi.fn()}
        allLabel="Everything"
      />
    )

    expect(screen.getByRole('button', { name: 'Everything' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'All' })).not.toBeInTheDocument()
  })

  it('overrides the group aria-label via ariaLabel', () => {
    const { container } = render(
      <ProjectStatusFilterBar
        projects={projects}
        value="all"
        onChange={vi.fn()}
        ariaLabel="Filter by lifecycle state"
      />
    )

    expect(container.querySelector('[data-projex-status-filter-bar]')).toHaveAttribute(
      'aria-label',
      'Filter by lifecycle state'
    )
  })

  it('uses the default aria-label when ariaLabel is not provided', () => {
    const { container } = render(
      <ProjectStatusFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    expect(container.querySelector('[data-projex-status-filter-bar]')).toHaveAttribute(
      'aria-label',
      'Filter by status'
    )
  })

  it('carries the distinguishing attribute, role="group", and aria-label on the group wrapper', () => {
    const { container } = render(
      <ProjectStatusFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    const group = container.querySelector('[data-projex-status-filter-bar]')
    expect(group).toBeInTheDocument()
    expect(group).toHaveAttribute('role', 'group')
    expect(group).toHaveAttribute('aria-label', 'Filter by status')
  })
})
