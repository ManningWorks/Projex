import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProjectSearch } from '../useProjectSearch'
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

describe('useProjectSearch', () => {
  const projects = [
    createProject({ id: '1', name: 'React Dashboard', description: 'A modern dashboard', stack: ['react', 'typescript'] }),
    createProject({ id: '2', name: 'Vue Todo', description: 'A simple Vue app', stack: ['vue', 'javascript'] }),
    createProject({ id: '3', name: 'Auth Lib', description: 'Authentication library', stack: ['node', 'auth'] }),
  ]

  it('should return filtered projects when query is provided', () => {
    const { result } = renderHook(() => useProjectSearch(projects, 'react'))

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('should return all projects when query is empty string', () => {
    const { result } = renderHook(() => useProjectSearch(projects, ''))

    expect(result.current).toHaveLength(3)
  })

  it('should return all projects when query is undefined', () => {
    const { result } = renderHook(() => useProjectSearch(projects, undefined))

    expect(result.current).toHaveLength(3)
  })

  it('should return all projects when query is null', () => {
    const { result } = renderHook(() => useProjectSearch(projects, null))

    expect(result.current).toHaveLength(3)
  })

  it('should return all projects when query is only whitespace', () => {
    const { result } = renderHook(() => useProjectSearch(projects, '   '))

    expect(result.current).toHaveLength(3)
  })

  it('should find projects by name', () => {
    const { result } = renderHook(() => useProjectSearch(projects, 'auth'))

    expect(result.current).toHaveLength(1)
    expect(result.current[0].name).toBe('Auth Lib')
  })

  it('should find projects by description', () => {
    const { result } = renderHook(() => useProjectSearch(projects, 'authentication'))

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('3')
  })

  it('should find projects by stack tag', () => {
    const { result } = renderHook(() => useProjectSearch(projects, 'typescript'))

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('should return empty array when no projects provided', () => {
    const { result } = renderHook(() => useProjectSearch([], 'react'))

    expect(result.current).toHaveLength(0)
  })

  it('should return empty array when no matches found', () => {
    const { result } = renderHook(() => useProjectSearch(projects, 'nonexistent'))

    expect(result.current).toHaveLength(0)
  })

  it('should handle projects with missing description', () => {
    const projectsWithMissingFields = [
      createProject({ id: '1', name: 'Test', description: undefined }),
      createProject({ id: '2', name: 'Test2', stack: undefined }),
    ]

    const { result } = renderHook(() => useProjectSearch(projectsWithMissingFields, 'test'))

    expect(result.current).toHaveLength(2)
  })

  it('should filter directly without debounce on rapid query changes', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useProjectSearch(projects, query),
      { initialProps: { query: '' } }
    )

    expect(result.current).toHaveLength(3)

    rerender({ query: 'dash' })
    expect(result.current).toHaveLength(1)

    rerender({ query: 'dashb' })
    expect(result.current).toHaveLength(1)

    rerender({ query: 'dashbo' })
    expect(result.current).toHaveLength(1)

    rerender({ query: 'dashboard' })
    expect(result.current).toHaveLength(1)
  })

  it('should use custom threshold option', () => {
    const { result } = renderHook(() => useProjectSearch(projects, 'ract', { threshold: 0.4 }))

    expect(result.current.length).toBeGreaterThan(0)
  })
})
