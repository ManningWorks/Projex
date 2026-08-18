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
  // Vocabulary is deliberately disjoint across name, tagline, description and
  // stack so each field-specific assertion can only pass via its intended field.
  const projects = [
    createProject({
      id: '1',
      name: 'Argon Grid',
      tagline: 'Orchestrate your containers',
      description: 'A control plane for batch scheduling',
      stack: ['kafka', 'grpc'],
    }),
    createProject({
      id: '2',
      name: 'Beryl Slate',
      tagline: 'Capture fleeting thoughts',
      description: 'Markdown journal with backlinks',
      stack: ['zig', 'sqlite'],
    }),
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
    const results = searchProjects(projects, 'argon')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('should find projects by tagline', () => {
    const results = searchProjects(projects, 'orchestrate')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('should find projects by description', () => {
    const results = searchProjects(projects, 'scheduling')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('should find projects by stack tag', () => {
    const results = searchProjects(projects, 'kafka')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('1')
  })

  it('should restrict search to custom keys', () => {
    // 'orchestrate' lives only in the tagline, so name-only keys exclude it...
    const nameOnly = searchProjects(projects, 'orchestrate', {
      keys: [{ name: 'name', weight: 1 }],
    })
    expect(nameOnly).toEqual([])

    // ...and including the tagline key finds it.
    const withTagline = searchProjects(projects, 'orchestrate', {
      keys: [
        { name: 'name', weight: 1 },
        { name: 'tagline', weight: 1 },
      ],
    })
    expect(withTagline).toHaveLength(1)
    expect(withTagline[0].id).toBe('1')
  })

  it('should accept a custom threshold', () => {
    // 'schedulng' (one deletion from 'scheduling') is within fuzzy tolerance
    // at 0.4 but not at 0.1, so the two thresholds must produce different sets.
    const strict = searchProjects(projects, 'schedulng', { threshold: 0.1 })
    const lenient = searchProjects(projects, 'schedulng', { threshold: 0.4 })

    expect(strict).toEqual([])
    expect(lenient).toHaveLength(1)
    expect(lenient[0].id).toBe('1')
    expect(lenient.length).toBeGreaterThan(strict.length)
  })

  it('should return empty array when no matches found', () => {
    expect(searchProjects(projects, 'nonexistent')).toHaveLength(0)
  })

  it('should return empty array for empty projects', () => {
    expect(searchProjects([], 'react')).toHaveLength(0)
  })
})
