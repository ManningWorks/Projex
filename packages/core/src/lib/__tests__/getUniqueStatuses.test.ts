import { describe, it, expect } from 'vitest'
import { getUniqueStatuses, PROJECT_STATUSES } from '../getUniqueStatuses'
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

describe('getUniqueStatuses', () => {
  describe('PROJECT_STATUSES constant', () => {
    it('should be exported and match ProjectStatus union declaration order', () => {
      expect(PROJECT_STATUSES).toEqual([
        'active',
        'shipped',
        'in-progress',
        'coming-soon',
        'archived',
        'for-sale',
      ])
    })
  })

  describe('empty input handling', () => {
    it('should return an empty array for an empty project list', () => {
      expect(getUniqueStatuses([])).toEqual([])
    })
  })

  describe('dedup', () => {
    it('should return each present status exactly once', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
        createProject({ id: '3', status: 'active' }),
        createProject({ id: '4', status: 'shipped' }),
        createProject({ id: '5', status: 'active' }),
      ]

      const result = getUniqueStatuses(projects)

      expect(result).toHaveLength(2)
      expect(result).toEqual(['active', 'shipped'])
    })

    it('should return a single entry when all projects share one status', () => {
      const projects = [
        createProject({ id: '1', status: 'archived' }),
        createProject({ id: '2', status: 'archived' }),
      ]

      expect(getUniqueStatuses(projects)).toEqual(['archived'])
    })
  })

  describe('ordering by union declaration order', () => {
    it('should return statuses in ProjectStatus declaration order, not input order', () => {
      const projects = [
        createProject({ id: '1', status: 'for-sale' }),
        createProject({ id: '2', status: 'active' }),
        createProject({ id: '3', status: 'archived' }),
        createProject({ id: '4', status: 'shipped' }),
      ]

      const result = getUniqueStatuses(projects)

      expect(result).toEqual(['active', 'shipped', 'archived', 'for-sale'])
    })

    it('should order a full set of statuses exactly as PROJECT_STATUSES', () => {
      const projects = PROJECT_STATUSES.map((status, i) =>
        createProject({ id: String(i), status })
      )

      expect(getUniqueStatuses(projects)).toEqual([...PROJECT_STATUSES])
    })
  })

  describe('mixed-status input', () => {
    it('should surface every distinct status present', () => {
      const projects = [
        createProject({ id: '1', status: 'coming-soon' }),
        createProject({ id: '2', status: 'in-progress' }),
        createProject({ id: '3', status: 'active' }),
      ]

      const result = getUniqueStatuses(projects)

      expect(result).toEqual(['active', 'in-progress', 'coming-soon'])
    })

    it('should omit a status that has no matching project', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
      ]

      expect(getUniqueStatuses(projects)).not.toContain('archived')
    })
  })

  describe('stats.type divergence', () => {
    it('should ignore the stats.type field and derive only from project.status', () => {
      const divergentStats = { type: 'devto', articleCount: 5 } as ProjectStats
      const projects = [
        createProject({ id: '1', status: 'active', stats: divergentStats }),
      ]

      expect(getUniqueStatuses(projects)).toEqual(['active'])
    })
  })

  describe('"all" sentinel', () => {
    it('should never return an "all" value', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
      ]

      expect(getUniqueStatuses(projects)).not.toContain('all')
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
      ]
      const originalLength = projects.length

      getUniqueStatuses(projects)

      expect(projects.length).toBe(originalLength)
      expect(projects.map(p => p.status)).toEqual(['active', 'shipped'])
    })

    it('should return a new array instance', () => {
      const projects = [createProject({ status: 'active' })]

      expect(getUniqueStatuses(projects)).not.toBe(projects)
    })
  })
})
