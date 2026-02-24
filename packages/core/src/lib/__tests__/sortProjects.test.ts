import { describe, it, expect } from 'vitest'
import { sortProjects } from '../sortProjects'
import type { SortValue } from '../sortProjects'
import type { FolioProject } from '../../types'

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

describe('sortProjects', () => {
  describe('sort by stars', () => {
    it('should call sortByStars and return result', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
        createProject({ id: '3', type: 'github', stats: { stars: 250 } }),
      ]

      const result = sortProjects(projects, 'stars')

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })
  })

  describe('sort by name', () => {
    it('should call sortByName with asc order and return result', () => {
      const projects = [
        createProject({ id: '1', name: 'Zebra' }),
        createProject({ id: '2', name: 'Alpha' }),
        createProject({ id: '3', name: 'Beta' }),
      ]

      const result = sortProjects(projects, 'name')

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })
  })

  describe('sort by date', () => {
    it('should call sortByDate with desc order (newest first)', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-03-01' }),
        createProject({ id: '3', updatedAt: '2024-02-01' }),
      ]

      const result = sortProjects(projects, 'date')

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })
  })

  describe('sort by date-asc', () => {
    it('should call sortByDate with asc order (oldest first)', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-03-01' }),
        createProject({ id: '3', updatedAt: '2024-02-01' }),
      ]

      const result = sortProjects(projects, 'date-asc')

      expect(result.map(p => p.id)).toEqual(['1', '3', '2'])
    })
  })

  describe('invalid sort value', () => {
    it('should return projects unsorted when given invalid sort value', () => {
      const projects = [
        createProject({ id: '1', name: 'Zebra' }),
        createProject({ id: '2', name: 'Alpha' }),
      ]

      const result = sortProjects(projects, 'invalid' as SortValue)

      expect(result).toBe(projects)
    })

    it('should return original array reference for invalid sort value', () => {
      const projects = [createProject({ id: '1' })]

      const result = sortProjects(projects, 'invalid' as SortValue)

      expect(result).toBe(projects)
    })
  })

  describe('empty array', () => {
    it('should return empty array when input is empty', () => {
      expect(sortProjects([], 'stars')).toEqual([])
    })
  })

  describe('consistency', () => {
    it('should return consistent results when called multiple times with same sort value', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
      ]

      const result1 = sortProjects(projects, 'stars')
      const result2 = sortProjects(projects, 'stars')

      expect(result1).toEqual(result2)
    })
  })
})
