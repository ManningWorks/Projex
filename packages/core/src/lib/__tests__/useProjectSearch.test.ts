import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProjectSearch } from '../useProjectSearch'
import { createFuseSearch } from '../fuse'
import type { ProjexProject } from '../../types'

// Wrap createFuseSearch in a spy (delegating to the real implementation) so
// index rebuilds can be counted in the memoisation tests below.
vi.mock('../fuse', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../fuse')>()
  return { ...actual, createFuseSearch: vi.fn(actual.createFuseSearch) }
})

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
    // 'ract' (one deletion from 'React') is within fuzzy tolerance at 0.4
    // but not at 0.1, so the two thresholds must produce different sets.
    const { result: strict } = renderHook(() =>
      useProjectSearch(projects, 'ract', { threshold: 0.1 })
    )
    const { result: lenient } = renderHook(() =>
      useProjectSearch(projects, 'ract', { threshold: 0.4 })
    )

    expect(strict.current).toHaveLength(0)
    expect(lenient.current).toHaveLength(1)
    expect(lenient.current[0].id).toBe('1')
  })

  it('should find projects by tagline by default', () => {
    const projectsWithTaglines = [
      createProject({ id: '1', name: 'Project One', tagline: 'Show everything you ship' }),
      createProject({ id: '2', name: 'Project Two', tagline: 'A calm todo list' }),
    ]

    const { result } = renderHook(() => useProjectSearch(projectsWithTaglines, 'everything'))

    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('should restrict search to custom keys option', () => {
    const { result } = renderHook(() =>
      useProjectSearch(projects, 'authentication', {
        keys: [{ name: 'name', weight: 1 }],
      })
    )

    expect(result.current).toHaveLength(0)
  })

  it('should not rebuild the search index when inline keys have stable content', () => {
    const spy = vi.mocked(createFuseSearch)
    spy.mockClear()

    const { rerender, result } = renderHook(
      ({ query }) =>
        useProjectSearch(projects, query, {
          keys: [{ name: 'name', weight: 2 }],
        }),
      { initialProps: { query: '' } }
    )

    spy.mockClear()

    // Each rerender passes a fresh inline keys array with identical content
    rerender({ query: 'dash' })
    rerender({ query: 'dashb' })
    rerender({ query: 'dashboard' })

    expect(spy).not.toHaveBeenCalled()
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('should rebuild the search index when key content changes', () => {
    const spy = vi.mocked(createFuseSearch)
    spy.mockClear()

    const { rerender } = renderHook(
      ({ keys }) => useProjectSearch(projects, 'authentication', { keys }),
      { initialProps: { keys: [{ name: 'name', weight: 1 }] } }
    )

    spy.mockClear()

    rerender({ keys: [{ name: 'name', weight: 1 }] })
    expect(spy).not.toHaveBeenCalled()

    rerender({ keys: [{ name: 'description', weight: 1 }] })
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
