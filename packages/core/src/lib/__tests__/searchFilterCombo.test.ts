import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProjectSearch } from '../useProjectSearch'
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

describe('useProjectSearch + useProjectFilters integration', () => {
  const projects = [
    createProject({ id: '1', name: 'React Dashboard', description: 'A modern admin dashboard', stack: ['react', 'typescript'] }),
    createProject({ id: '2', name: 'Vue Todo', description: 'A simple Vue task app', stack: ['vue', 'javascript'] }),
    createProject({ id: '3', name: 'Node Auth', description: 'Authentication library for Node.js', stack: ['node', 'auth', 'express'] }),
    createProject({ id: '4', name: 'React Auth UI', description: 'Beautiful auth components', stack: ['react', 'auth', 'components'] }),
    createProject({ id: '5', name: 'Full Stack App', description: 'A full stack application', stack: ['react', 'node', 'typescript'] }),
  ]

  it('should filter by tag first, then search within filtered results', () => {
    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(projects, ['react'])
    )

    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(filteredResult.current, 'auth')
    )

    expect(searchedResult.current).toHaveLength(1)
    expect(searchedResult.current[0].id).toBe('4')
  })

  it('should search first, then filter within search results', () => {
    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(projects, 'full')
    )

    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(searchedResult.current, ['node'])
    )

    expect(filteredResult.current).toHaveLength(1)
    expect(filteredResult.current[0].id).toBe('5')
  })

  it('should return all projects when no filters active (search only)', () => {
    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(projects, [])
    )

    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(filteredResult.current, 'dashboard')
    )

    expect(searchedResult.current).toHaveLength(1)
    expect(searchedResult.current[0].name).toBe('React Dashboard')
  })

  it('should return all projects when no search query (filter only)', () => {
    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(projects, '')
    )

    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(searchedResult.current, ['vue'])
    )

    expect(filteredResult.current).toHaveLength(1)
    expect(filteredResult.current[0].id).toBe('2')
  })

  it('should return empty array when both search and filter return no matches', () => {
    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(projects, ['python'])
    )

    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(filteredResult.current, 'nonexistent')
    )

    expect(searchedResult.current).toHaveLength(0)
  })

  it('should handle multiple tags and search combined', () => {
    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(projects, ['react', 'node'])
    )

    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(filteredResult.current, 'full')
    )

    expect(searchedResult.current.length).toBeGreaterThan(0)
    expect(searchedResult.current.some(p => p.id === '5')).toBe(true)
  })

  it('should find search term in description within filtered results', () => {
    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(projects, ['node'])
    )

    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(filteredResult.current, 'authentication')
    )

    expect(searchedResult.current).toHaveLength(1)
    expect(searchedResult.current[0].id).toBe('3')
  })

  it('should find search term in stack within filtered results', () => {
    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(projects, ['react'])
    )

    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(filteredResult.current, 'typescript')
    )

    expect(searchedResult.current).toHaveLength(2)
    expect(searchedResult.current.map(p => p.id)).toContain('1')
    expect(searchedResult.current.map(p => p.id)).toContain('5')
  })

  it('should return all filtered projects when search is empty string', () => {
    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(projects, ['auth'])
    )

    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(filteredResult.current, '')
    )

    expect(searchedResult.current).toHaveLength(2)
    expect(searchedResult.current.map(p => p.id)).toContain('3')
    expect(searchedResult.current.map(p => p.id)).toContain('4')
  })

  it('should return all search results when no tags selected', () => {
    const { result: searchedResult } = renderHook(() => 
      useProjectSearch(projects, 'auth')
    )

    const { result: filteredResult } = renderHook(() => 
      useProjectFilters(searchedResult.current, [])
    )

    expect(filteredResult.current).toHaveLength(2)
    expect(filteredResult.current.map(p => p.id)).toContain('3')
    expect(filteredResult.current.map(p => p.id)).toContain('4')
  })
})
