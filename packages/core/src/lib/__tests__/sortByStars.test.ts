import { describe, it, expect } from 'vitest'
import { sortByStars } from '../sortByStars'
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

describe('sortByStars', () => {
  describe('empty array handling', () => {
    it('should return empty array when input is empty', () => {
      expect(sortByStars([])).toEqual([])
    })

    it('should return empty array with asc order when input is empty', () => {
      expect(sortByStars([], 'asc')).toEqual([])
    })
  })

  describe('sorting GitHub projects by stars', () => {
    it('should sort GitHub projects by stars descending by default', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
        createProject({ id: '3', type: 'github', stats: { stars: 250 } }),
      ]

      const result = sortByStars(projects)

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })

    it('should sort GitHub projects by stars ascending when order is asc', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
        createProject({ id: '3', type: 'github', stats: { stars: 250 } }),
      ]

      const result = sortByStars(projects, 'asc')

      expect(result.map(p => p.id)).toEqual(['1', '3', '2'])
    })
  })

  describe('handling non-GitHub projects', () => {
    it('should treat non-GitHub projects as having 0 stars', () => {
      const projects = [
        createProject({ id: '1', type: 'npm', stats: { downloads: '1000' } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
        createProject({ id: '3', type: 'manual' }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result[0].id).toBe('2')
      expect(result.filter(p => p.type !== 'github').every(p => result.indexOf(p) > 0)).toBe(true)
    })

    it('should place non-GitHub projects at the end in desc order', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '2', type: 'npm' }),
        createProject({ id: '3', type: 'github', stats: { stars: 500 } }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result[result.length - 1].type).toBe('npm')
    })
  })

  describe('handling missing stats', () => {
    it('should handle GitHub projects without stats', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: null }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result[0].id).toBe('2')
      expect(result[1].id).toBe('1')
    })

    it('should handle GitHub projects with stats but missing stars', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { forks: 10 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result[0].id).toBe('2')
    })

    it('should handle all projects with 0 stars', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 0 } }),
        createProject({ id: '2', type: 'npm' }),
        createProject({ id: '3', type: 'github', stats: null }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result).toHaveLength(3)
    })

    it('should return 0 for comparison when both projects have 0 stars', () => {
      const projects = [
        createProject({ id: '1', type: 'npm' }),
        createProject({ id: '2', type: 'manual' }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result).toHaveLength(2)
    })
  })

  describe('mixed project types', () => {
    it('should correctly sort mixed project types (only github counts stars)', () => {
      const projects = [
        createProject({ id: '1', type: 'npm', stats: { downloads: '1000' } }),
        createProject({ id: '2', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '3', type: 'product-hunt', stats: { upvotes: 50 } }),
        createProject({ id: '4', type: 'github', stats: { stars: 500 } }),
        createProject({ id: '5', type: 'hybrid', stats: { stars: 250 } }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result[0].id).toBe('4')
      expect(result[1].id).toBe('2')
      expect(result.filter(p => p.type !== 'github').every(p => result.indexOf(p) > 1)).toBe(true)
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
      ]

      const originalOrder = projects.map(p => p.id)
      sortByStars(projects, 'desc')

      expect(projects.map(p => p.id)).toEqual(originalOrder)
    })

    it('should return a new array instance', () => {
      const projects = [createProject({ type: 'github', stats: { stars: 100 } })]

      const result = sortByStars(projects)

      expect(result).not.toBe(projects)
    })
  })

  describe('edge cases', () => {
    it('should handle very large star counts', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 1000000 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 500 } }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result.map(p => p.id)).toEqual(['1', '2'])
    })

    it('should handle projects with same star count', () => {
      const projects = [
        createProject({ id: '1', type: 'github', stats: { stars: 100 } }),
        createProject({ id: '2', type: 'github', stats: { stars: 100 } }),
      ]

      const result = sortByStars(projects, 'desc')

      expect(result).toHaveLength(2)
    })
  })
})
