import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProjectFilters } from '../useProjectFilters'
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

describe('useProjectFilters', () => {
  const projects = [
    createProject({ id: '1', name: 'React Dashboard', stack: ['react', 'typescript'] }),
    createProject({ id: '2', name: 'Vue Todo', stack: ['vue', 'javascript'] }),
    createProject({ id: '3', name: 'Node API', stack: ['node', 'express'] }),
    createProject({ id: '4', name: 'Full Stack App', stack: ['react', 'node', 'typescript'] }),
  ]

  it('should return all projects when no tags selected', () => {
    const { result } = renderHook(() => useProjectFilters(projects, []))

    expect(result.current).toHaveLength(4)
  })

  it('should return projects matching ANY selected tag (OR logic)', () => {
    const { result } = renderHook(() => useProjectFilters(projects, ['react']))

    expect(result.current).toHaveLength(2)
    expect(result.current.map(p => p.id)).toContain('1')
    expect(result.current.map(p => p.id)).toContain('4')
  })

  it('should return projects matching any of multiple tags', () => {
    const { result } = renderHook(() => useProjectFilters(projects, ['react', 'node']))

    expect(result.current).toHaveLength(3)
    expect(result.current.map(p => p.id)).toContain('1')
    expect(result.current.map(p => p.id)).toContain('3')
    expect(result.current.map(p => p.id)).toContain('4')
  })

  it('should exclude projects with no stack property', () => {
    const projectsWithMissingStack = [
      createProject({ id: '1', stack: ['react'] }),
      createProject({ id: '2' }),
    ]

    const { result } = renderHook(() => useProjectFilters(projectsWithMissingStack, ['react']))

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('should match tags case-insensitively', () => {
    const projectsWithMixedCase = [
      createProject({ id: '1', stack: ['React', 'TypeScript'] }),
      createProject({ id: '2', stack: ['react'] }),
      createProject({ id: '3', stack: ['NODE'] }),
    ]

    const { result } = renderHook(() => useProjectFilters(projectsWithMixedCase, ['react']))

    expect(result.current).toHaveLength(2)
    expect(result.current.map(p => p.id)).toContain('1')
    expect(result.current.map(p => p.id)).toContain('2')
  })

  it('should update reactively when tags change', () => {
    const { result, rerender } = renderHook(
      ({ tags }) => useProjectFilters(projects, tags),
      { initialProps: { tags: ['react'] } }
    )

    expect(result.current).toHaveLength(2)

    rerender({ tags: ['node'] })
    expect(result.current).toHaveLength(2)
    expect(result.current.map(p => p.id)).toContain('3')
    expect(result.current.map(p => p.id)).toContain('4')

    rerender({ tags: [] })
    expect(result.current).toHaveLength(4)
  })

  it('should return empty array when no projects provided', () => {
    const { result } = renderHook(() => useProjectFilters([], ['react']))

    expect(result.current).toHaveLength(0)
  })

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useProjectFilters(projects, ['python']))

    expect(result.current).toHaveLength(0)
  })

  it('should handle empty project stack array', () => {
    const projectsWithEmptyStack = [
      createProject({ id: '1', stack: [] }),
      createProject({ id: '2', stack: ['react'] }),
    ]

    const { result } = renderHook(() => useProjectFilters(projectsWithEmptyStack, ['react']))

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('2')
  })
})
