import { describe, it, expect } from 'vitest'
import { sortByDate, type SortOrder } from '../sortByDate'
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

describe('sortByDate', () => {
  describe('empty array handling', () => {
    it('should return empty array when input is empty', () => {
      expect(sortByDate([])).toEqual([])
    })

    it('should return empty array with asc order when input is empty', () => {
      expect(sortByDate([], 'asc')).toEqual([])
    })
  })

  describe('sorting with updatedAt', () => {
    it('should sort by updatedAt descending by default', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-06-15' }),
        createProject({ id: '3', updatedAt: '2024-03-10' }),
      ]

      const result = sortByDate(projects)

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })

    it('should sort by updatedAt ascending when order is asc', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-06-15' }),
        createProject({ id: '3', updatedAt: '2024-03-10' }),
      ]

      const result = sortByDate(projects, 'asc')

      expect(result.map(p => p.id)).toEqual(['1', '3', '2'])
    })
  })

  describe('fallback to createdAt', () => {
    it('should fallback to createdAt when updatedAt is missing', () => {
      const projects = [
        createProject({ id: '1', createdAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-06-15', createdAt: '2024-01-01' }),
        createProject({ id: '3', createdAt: '2024-03-10' }),
      ]

      const result = sortByDate(projects, 'desc')

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })

    it('should use createdAt when updatedAt is null', () => {
      const projects = [
        createProject({ id: '1', updatedAt: null, createdAt: '2024-05-01' }),
        createProject({ id: '2', updatedAt: '2024-03-01', createdAt: '2024-01-01' }),
      ]

      const result = sortByDate(projects, 'desc')

      expect(result.map(p => p.id)).toEqual(['1', '2'])
    })
  })

  describe('handling missing dates', () => {
    it('should place projects without dates at the beginning in desc order', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: null, createdAt: null }),
        createProject({ id: '3', updatedAt: '2024-06-01' }),
      ]

      const result = sortByDate(projects, 'desc')

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })

    it('should place projects without dates at the end in asc order', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: null, createdAt: null }),
        createProject({ id: '3', updatedAt: '2024-06-01' }),
      ]

      const result = sortByDate(projects, 'asc')

      expect(result.map(p => p.id)).toEqual(['1', '3', '2'])
    })

    it('should handle all projects without dates', () => {
      const projects = [
        createProject({ id: '1', updatedAt: null, createdAt: null }),
        createProject({ id: '2', updatedAt: null, createdAt: null }),
      ]

      const result = sortByDate(projects)

      expect(result).toHaveLength(2)
    })

    it('should return 0 for comparison when both dates are missing', () => {
      const projects = [
        createProject({ id: '1', updatedAt: null, createdAt: null }),
        createProject({ id: '2', updatedAt: null, createdAt: null }),
      ]

      const result = sortByDate(projects, 'desc')

      expect(result).toHaveLength(2)
    })
  })

  describe('date parsing', () => {
    it('should correctly parse ISO date strings', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-12-31T23:59:59Z' }),
        createProject({ id: '2', updatedAt: '2024-01-01T00:00:00Z' }),
      ]

      const result = sortByDate(projects, 'desc')

      expect(result.map(p => p.id)).toEqual(['1', '2'])
    })

    it('should handle different date formats', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-06-15' }),
        createProject({ id: '2', updatedAt: '2024-03-20' }),
        createProject({ id: '3', updatedAt: '2024-01-05' }),
      ]

      const result = sortByDate(projects, 'asc')

      expect(result.map(p => p.id)).toEqual(['3', '2', '1'])
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-06-01' }),
      ]

      const originalOrder = projects.map(p => p.id)
      sortByDate(projects, 'desc')

      expect(projects.map(p => p.id)).toEqual(originalOrder)
    })

    it('should return a new array instance', () => {
      const projects = [createProject({ updatedAt: '2024-01-01' })]

      const result = sortByDate(projects)

      expect(result).not.toBe(projects)
    })
  })

  describe('order parameter types', () => {
    it('should accept asc order', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-06-01' }),
        createProject({ id: '2', updatedAt: '2024-01-01' }),
      ]

      const result = sortByDate(projects, 'asc' as SortOrder)

      expect(result.map(p => p.id)).toEqual(['2', '1'])
    })

    it('should accept desc order', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-06-01' }),
      ]

      const result = sortByDate(projects, 'desc' as SortOrder)

      expect(result.map(p => p.id)).toEqual(['2', '1'])
    })

    it('should default to desc when order is not provided', () => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: '2024-06-01' }),
      ]

      const result = sortByDate(projects)

      expect(result.map(p => p.id)).toEqual(['2', '1'])
    })
  })
})
