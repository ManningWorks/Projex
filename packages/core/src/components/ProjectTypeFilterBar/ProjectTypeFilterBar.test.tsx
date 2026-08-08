import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { ProjectTypeFilterBar } from './ProjectTypeFilterBar'
import { PROJECT_TYPES } from '../../lib/getUniqueTypes'
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
  createProject({ id: '1', type: 'hybrid' }),
  createProject({ id: '2', type: 'github' }),
  createProject({ id: '3', type: 'npm' }),
]

afterEach(() => {
  cleanup()
})

describe('ProjectTypeFilterBar', () => {
  it('renders nothing when projects is empty', () => {
    const { container } = render(
      <ProjectTypeFilterBar projects={[]} value="all" onChange={vi.fn()} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('wraps tags in ProjectFilterBar (inherits data-projex-filter-bar)', () => {
    const { container } = render(
      <ProjectTypeFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    expect(container.querySelector('[data-projex-filter-bar]')).toBeInTheDocument()
  })

  it('renders "All" first, then one tag per available kind in PROJECT_TYPES order', () => {
    const { container } = render(
      <ProjectTypeFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    const tags = container.querySelectorAll('[data-projex-filter-tag]')
    const labels = Array.from(tags).map(tag => tag.textContent)

    expect(labels).toEqual(['All', 'github', 'npm', 'hybrid'])
  })

  it('renders a full set of kinds exactly in PROJECT_TYPES order', () => {
    const fullProjects = PROJECT_TYPES.map((type, i) =>
      createProject({ id: String(i), type })
    )

    const { container } = render(
      <ProjectTypeFilterBar projects={fullProjects} value="all" onChange={vi.fn()} />
    )

    const labels = Array.from(
      container.querySelectorAll('[data-projex-filter-tag]')
    ).map(tag => tag.textContent)

    expect(labels).toEqual(['All', ...PROJECT_TYPES])
  })

  it('marks the "All" tag active when value is "all"', () => {
    const { container } = render(
      <ProjectTypeFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    const tags = container.querySelectorAll('[data-projex-filter-tag]')
    expect(tags[0]).toHaveAttribute('data-projex-filter-tag-active', 'true')
    expect(tags[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('marks exactly one tag active for the matching kind', () => {
    const { container } = render(
      <ProjectTypeFilterBar projects={projects} value="npm" onChange={vi.fn()} />
    )

    const tags = container.querySelectorAll('[data-projex-filter-tag]')
    const active = Array.from(tags).filter(tag =>
      tag.hasAttribute('data-projex-filter-tag-active')
    )

    expect(active).toHaveLength(1)
    expect(active[0]).toHaveTextContent('npm')
    expect(active[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange with the kind value when an inactive tag is clicked', () => {
    const onChange = vi.fn()
    render(
      <ProjectTypeFilterBar projects={projects} value="all" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'npm' }))

    expect(onChange).toHaveBeenCalledWith('npm')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('calls onChange("all") when the "All" tag is clicked from an active kind', () => {
    const onChange = vi.fn()
    render(
      <ProjectTypeFilterBar projects={projects} value="npm" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(onChange).toHaveBeenCalledWith('all')
  })

  it('is a no-op when clicking the already-active tag', () => {
    const onChange = vi.fn()
    render(
      <ProjectTypeFilterBar projects={projects} value="npm" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'npm' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('is a no-op when clicking the already-active "All" tag', () => {
    const onChange = vi.fn()
    render(
      <ProjectTypeFilterBar projects={projects} value="all" onChange={onChange} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'All' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('overrides the "All" label via allLabel', () => {
    render(
      <ProjectTypeFilterBar
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
      <ProjectTypeFilterBar
        projects={projects}
        value="all"
        onChange={vi.fn()}
        ariaLabel="Filter by project kind"
      />
    )

    expect(container.querySelector('[data-projex-type-filter-bar]')).toHaveAttribute(
      'aria-label',
      'Filter by project kind'
    )
  })

  it('uses the default aria-label when ariaLabel is not provided', () => {
    const { container } = render(
      <ProjectTypeFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    expect(container.querySelector('[data-projex-type-filter-bar]')).toHaveAttribute(
      'aria-label',
      'Filter by kind'
    )
  })

  it('carries the distinguishing attribute, role="group", and aria-label on the group wrapper', () => {
    const { container } = render(
      <ProjectTypeFilterBar projects={projects} value="all" onChange={vi.fn()} />
    )

    const group = container.querySelector('[data-projex-type-filter-bar]')
    expect(group).toBeInTheDocument()
    expect(group).toHaveAttribute('role', 'group')
    expect(group).toHaveAttribute('aria-label', 'Filter by kind')
  })
})
