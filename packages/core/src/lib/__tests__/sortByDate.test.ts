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
    it.each<{ order: SortOrder; position: string; expected: string[] }>([
      { order: 'desc', position: 'end', expected: ['3', '1', '2'] },
      { order: 'asc', position: 'beginning', expected: ['2', '1', '3'] },
    ])('should place projects without dates at the $position in $order order', ({ order, expected }) => {
      const projects = [
        createProject({ id: '1', updatedAt: '2024-01-01' }),
        createProject({ id: '2', updatedAt: null, createdAt: null }),
        createProject({ id: '3', updatedAt: '2024-06-01' }),
      ]

      const result = sortByDate(projects, order)

      expect(result.map(p => p.id)).toEqual(expected)
    })

    it('should place projects without dates at the end when order is omitted (default desc)', () => {
      const projects = [
        createProject({ id: '1', updatedAt: null, createdAt: null }),
        createProject({ id: '2', updatedAt: '2024-06-01' }),
      ]

      const result = sortByDate(projects)

      expect(result.map(p => p.id)).toEqual(['2', '1'])
    })

    it.each<{ order: SortOrder; position: string; expected: string[] }>([
      { order: 'desc', position: 'after', expected: ['3', '2', '1'] },
      { order: 'asc', position: 'before', expected: ['1', '2', '3'] },
    ])('should sort dateless projects $position createdAt-only projects in $order order', ({ order, expected }) => {
      const projects = [
        createProject({ id: '1', updatedAt: null, createdAt: null }),
        createProject({ id: '2', updatedAt: null, createdAt: '2024-01-01' }),
        createProject({ id: '3', updatedAt: '2024-06-01' }),
      ]

      const result = sortByDate(projects, order)

      expect(result.map(p => p.id)).toEqual(expected)
    })

    it.each<{ order: SortOrder; position: string; expected: string[] }>([
      { order: 'desc', position: 'end', expected: ['2', '1'] },
      { order: 'asc', position: 'beginning', expected: ['1', '2'] },
    ])('should place projects without dates at the $position even against pre-1970 dates in $order order', ({ order, expected }) => {
      const projects = [
        createProject({ id: '1', updatedAt: null, createdAt: null }),
        createProject({ id: '2', updatedAt: '1950-06-01' }),
      ]

      const result = sortByDate(projects, order)

      expect(result.map(p => p.id)).toEqual(expected)
    })

    it('should handle all projects without dates', () => {
      const projects = [
        createProject({ id: '1', updatedAt: null, createdAt: null }),
        createProject({ id: '2', updatedAt: null, createdAt: null }),
      ]

      const result = sortByDate(projects)

      // Equal (zero) comparisons keep input order via stable sort
      expect(result.map(p => p.id)).toEqual(['1', '2'])
    })
  })

  describe('handling unparseable dates', () => {
    // getTime() returns NaN for unparseable strings, which must not leak into
    // the comparator (NaN result = unspecified order per the sort contract).
    // NaN coerces to epoch 0, so unparseable dates sit between dateless and
    // real post-1970 dates (issue #29).
    it.each<{ order: SortOrder; expected: string[] }>([
      { order: 'desc', expected: ['2', '1', '3'] },
      { order: 'asc', expected: ['3', '1', '2'] },
    ])('should treat unparseable date strings as epoch instead of poisoning the sort in $order order', ({ order, expected }) => {
      const projects = [
        createProject({ id: '1', updatedAt: 'not-a-date' }),
        createProject({ id: '2', updatedAt: '2024-06-01' }),
        createProject({ id: '3', updatedAt: null, createdAt: null }),
      ]

      const result = sortByDate(projects, order)

      expect(result.map(p => p.id)).toEqual(expected)
    })

    it('should keep a deterministic order when every date is unparseable', () => {
      const projects = [
        createProject({ id: '1', updatedAt: 'not-a-date' }),
        createProject({ id: '2', updatedAt: 'also-not-a-date' }),
      ]

      const result = sortByDate(projects)

      // Equal (epoch) comparisons keep input order via stable sort
      expect(result.map(p => p.id)).toEqual(['1', '2'])
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
