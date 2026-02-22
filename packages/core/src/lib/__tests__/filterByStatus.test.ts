import { describe, it, expect } from 'vitest'
import { filterByStatus } from '../filterByStatus'
import type { FolioProject, ProjectStatus } from '../../types'

function createProject(overrides: Partial<FolioProject> = {}): FolioProject {
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

describe('filterByStatus', () => {
  describe('empty array handling', () => {
    it('should return empty array when input is empty', () => {
      expect(filterByStatus([], 'active')).toEqual([])
    })

    it('should return empty array when input is empty and status is undefined', () => {
      expect(filterByStatus([], undefined)).toEqual([])
    })

    it('should return empty array when input is empty and status is all', () => {
      expect(filterByStatus([], 'all')).toEqual([])
    })
  })

  describe('status filtering with single status', () => {
    it('should filter projects by active status', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
        createProject({ id: '3', status: 'active' }),
      ]

      const result = filterByStatus(projects, 'active')

      expect(result).toHaveLength(2)
      expect(result.map(p => p.id)).toEqual(['1', '3'])
    })

    it('should filter projects by shipped status', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
        createProject({ id: '3', status: 'in-progress' }),
      ]

      const result = filterByStatus(projects, 'shipped')

      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('should filter projects by archived status', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'archived' }),
      ]

      const result = filterByStatus(projects, 'archived')

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('archived')
    })

    it('should filter projects by for-sale status', () => {
      const projects = [
        createProject({ id: '1', status: 'for-sale' }),
        createProject({ id: '2', status: 'active' }),
      ]

      const result = filterByStatus(projects, 'for-sale')

      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('for-sale')
    })

    it('should return empty array when no projects match status', () => {
      const projects = [
        createProject({ status: 'active' }),
        createProject({ status: 'shipped' }),
      ]

      const result = filterByStatus(projects, 'archived')

      expect(result).toHaveLength(0)
    })
  })

  describe('status filtering with array of statuses', () => {
    it('should filter projects by multiple statuses', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
        createProject({ id: '3', status: 'archived' }),
        createProject({ id: '4', status: 'in-progress' }),
      ]

      const result = filterByStatus(projects, ['active', 'shipped'] as ProjectStatus[])

      expect(result).toHaveLength(2)
      expect(result.map(p => p.id)).toEqual(['1', '2'])
    })

    it('should handle empty status array', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
      ]

      const result = filterByStatus(projects, [])

      expect(result).toHaveLength(0)
    })

    it('should filter by all valid status values', () => {
      const allStatuses: ProjectStatus[] = ['active', 'shipped', 'in-progress', 'coming-soon', 'archived', 'for-sale']
      const projects = allStatuses.map((status, i) => createProject({ id: String(i), status }))

      const result = filterByStatus(projects, ['active', 'shipped', 'archived'] as ProjectStatus[])

      expect(result).toHaveLength(3)
      expect(result.map(p => p.status)).toEqual(['active', 'shipped', 'archived'])
    })
  })

  describe('special status values', () => {
    it('should return all projects when status is "all"', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
        createProject({ id: '3', status: 'archived' }),
      ]

      const result = filterByStatus(projects, 'all')

      expect(result).toHaveLength(3)
    })

    it('should return all projects when status is undefined', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
      ]

      const result = filterByStatus(projects, undefined)

      expect(result).toHaveLength(2)
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', status: 'active' }),
        createProject({ id: '2', status: 'shipped' }),
      ]

      const originalLength = projects.length
      filterByStatus(projects, 'active')

      expect(projects.length).toBe(originalLength)
    })

    it('should return a new array instance', () => {
      const projects = [
        createProject({ status: 'active' }),
      ]

      const result = filterByStatus(projects, 'all')

      expect(result).not.toBe(projects)
    })
  })
})
