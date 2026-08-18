import { describe, it, expect } from 'vitest'
import { searchProjects } from '../searchProjects'
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

describe('searchProjects', () => {
  const projects = [
    createProject({ id: '1', name: 'React Dashboard', tagline: 'Ship dashboards fast', description: 'A modern dashboard', stack: ['react', 'typescript'] }),
    createProject({ id: '2', name: 'Vue Todo', tagline: 'Todos made simple', description: 'A simple Vue app', stack: ['vue', 'javascript'] }),
  ]

  it('should return the input array unchanged for an empty query', () => {
    expect(searchProjects(projects, '')).toBe(projects)
  })

  it('should return the input array unchanged for whitespace-only query', () => {
    expect(searchProjects(projects, '   ')).toBe(projects)
  })

  it('should return the input array unchanged for null or undefined query', () => {
    expect(searchProjects(projects, null)).toBe(projects)
    expect(searchProjects(projects, undefined)).toBe(projects)
  })

  it('should find projects by name', () => {
    const results = searchProjects(projects, 'vue todo')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('2')
  })

  it('should find projects by tagline', () => {
    const results = searchProjects(projects, 'simple')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('2')
  })

  it('should find projects by description', () => {
    const results = searchProjects(projects, 'dashboard')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('should find projects by stack tag', () => {
    const results = searchProjects(projects, 'typescript')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('should restrict search to custom keys', () => {
    const nameOnly = searchProjects(projects, 'modern', {
      keys: [{ name: 'name', weight: 1 }],
    })

    expect(nameOnly).toHaveLength(0)
  })

  it('should accept a custom threshold', () => {
    const strict = searchProjects(projects, 'dashbord', { threshold: 0.1 })
    const lenient = searchProjects(projects, 'dashbord', { threshold: 0.4 })

    expect(lenient.length).toBeGreaterThanOrEqual(strict.length)
  })

  it('should return empty array when no matches found', () => {
    expect(searchProjects(projects, 'nonexistent')).toHaveLength(0)
  })

  it('should return empty array for empty projects', () => {
    expect(searchProjects([], 'react')).toHaveLength(0)
  })
})
