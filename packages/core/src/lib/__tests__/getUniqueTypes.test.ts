import { describe, it, expect } from 'vitest'
import { getUniqueTypes, PROJECT_TYPES } from '../getUniqueTypes'
import type { ProjexProject, ProjectStats } from '../../types'

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

describe('getUniqueTypes', () => {
  describe('PROJECT_TYPES constant', () => {
    it('should be exported and match ProjectType union declaration order', () => {
      expect(PROJECT_TYPES).toEqual([
        'github',
        'manual',
        'npm',
        'product-hunt',
        'youtube',
        'gumroad',
        'lemonsqueezy',
        'devto',
        'hybrid',
      ])
    })
  })

  describe('empty input handling', () => {
    it('should return an empty array for an empty project list', () => {
      expect(getUniqueTypes([])).toEqual([])
    })
  })

  describe('dedup', () => {
    it('should return each present type exactly once', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'github' }),
        createProject({ id: '3', type: 'npm' }),
        createProject({ id: '4', type: 'github' }),
        createProject({ id: '5', type: 'npm' }),
      ]

      const result = getUniqueTypes(projects)

      expect(result).toHaveLength(2)
      expect(result).toEqual(['github', 'npm'])
    })

    it('should return a single entry when all projects share one type', () => {
      const projects = [
        createProject({ id: '1', type: 'manual' }),
        createProject({ id: '2', type: 'manual' }),
      ]

      expect(getUniqueTypes(projects)).toEqual(['manual'])
    })
  })

  describe('ordering by union declaration order', () => {
    it('should return types in ProjectType declaration order, not input order', () => {
      const projects = [
        createProject({ id: '1', type: 'hybrid' }),
        createProject({ id: '2', type: 'github' }),
        createProject({ id: '3', type: 'devto' }),
        createProject({ id: '4', type: 'npm' }),
      ]

      const result = getUniqueTypes(projects)

      expect(result).toEqual(['github', 'npm', 'devto', 'hybrid'])
    })

    it('should order a full set of types exactly as PROJECT_TYPES', () => {
      const projects = PROJECT_TYPES.map((type, i) =>
        createProject({ id: String(i), type })
      )

      expect(getUniqueTypes(projects)).toEqual([...PROJECT_TYPES])
    })
  })

  describe('mixed-kind input', () => {
    it('should surface devto when a devto project is present', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'devto' }),
        createProject({ id: '3', type: 'hybrid' }),
      ]

      const result = getUniqueTypes(projects)

      expect(result).toContain('devto')
      expect(result).toEqual(['github', 'devto', 'hybrid'])
    })

    it('should omit a type that has no matching project', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'npm' }),
      ]

      expect(getUniqueTypes(projects)).not.toContain('devto')
    })
  })

  describe('stats.type divergence', () => {
    it('should ignore the stats.type field and derive only from project.type', () => {
      const divergentStats = { type: 'devto', articleCount: 5 } as ProjectStats
      const projects = [
        createProject({ id: '1', type: 'github', stats: divergentStats }),
      ]

      const result = getUniqueTypes(projects)

      expect(result).toEqual(['github'])
      expect(result).not.toContain('devto')
    })

    it('should surface a declared type even when stats.type agrees with another value', () => {
      const projects = [
        createProject({
          id: '1',
          type: 'npm',
          stats: { type: 'github', stars: 10 } as ProjectStats,
        }),
        createProject({ id: '2', type: 'devto' }),
      ]

      expect(getUniqueTypes(projects)).toEqual(['npm', 'devto'])
    })
  })

  describe('"all" sentinel', () => {
    it('should never return an "all" value', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'npm' }),
      ]

      expect(getUniqueTypes(projects)).not.toContain('all')
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'npm' }),
      ]
      const originalLength = projects.length

      getUniqueTypes(projects)

      expect(projects.length).toBe(originalLength)
      expect(projects.map(p => p.type)).toEqual(['github', 'npm'])
    })

    it('should return a new array instance', () => {
      const projects = [createProject({ type: 'github' })]

      expect(getUniqueTypes(projects)).not.toBe(projects)
    })
  })
})
