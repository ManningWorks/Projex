import { describe, it, expect } from 'vitest'
import { filterByType } from '../filterByType'
import type { FolioProject, ProjectType } from '../../types'

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

describe('filterByType', () => {
  describe('empty array handling', () => {
    it('should return empty array when input is empty', () => {
      expect(filterByType([], 'github')).toEqual([])
    })

    it('should return empty array when input is empty and type is undefined', () => {
      expect(filterByType([], undefined)).toEqual([])
    })

    it('should return empty array when input is empty and type is all', () => {
      expect(filterByType([], 'all')).toEqual([])
    })
  })

  describe('type filtering', () => {
    it('should filter projects by github type', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'manual' }),
        createProject({ id: '3', type: 'github' }),
      ]

      const result = filterByType(projects, 'github')

      expect(result).toHaveLength(2)
      expect(result.map(p => p.id)).toEqual(['1', '3'])
    })

    it('should filter projects by npm type', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'npm' }),
        createProject({ id: '3', type: 'npm' }),
      ]

      const result = filterByType(projects, 'npm')

      expect(result).toHaveLength(2)
      expect(result.map(p => p.id)).toEqual(['2', '3'])
    })

    it('should filter projects by product-hunt type', () => {
      const projects = [
        createProject({ id: '1', type: 'product-hunt' }),
        createProject({ id: '2', type: 'github' }),
      ]

      const result = filterByType(projects, 'product-hunt')

      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('product-hunt')
    })

    it('should filter projects by hybrid type', () => {
      const projects = [
        createProject({ id: '1', type: 'hybrid' }),
        createProject({ id: '2', type: 'github' }),
        createProject({ id: '3', type: 'hybrid' }),
      ]

      const result = filterByType(projects, 'hybrid')

      expect(result).toHaveLength(2)
      expect(result.map(p => p.type)).toEqual(['hybrid', 'hybrid'])
    })

    it('should filter projects by manual type', () => {
      const projects = [
        createProject({ id: '1', type: 'manual' }),
        createProject({ id: '2', type: 'github' }),
      ]

      const result = filterByType(projects, 'manual')

      expect(result).toHaveLength(1)
      expect(result[0].type).toBe('manual')
    })

    it('should return empty array when no projects match type', () => {
      const projects = [
        createProject({ type: 'github' }),
        createProject({ type: 'npm' }),
      ]

      const result = filterByType(projects, 'manual')

      expect(result).toHaveLength(0)
    })
  })

  describe('all types coverage', () => {
    it('should correctly filter for all ProjectType values', () => {
      const allTypes: ProjectType[] = ['github', 'npm', 'product-hunt', 'hybrid', 'manual']

      allTypes.forEach(targetType => {
        const projects = allTypes.map((type, i) => createProject({ id: String(i), type }))
        const result = filterByType(projects, targetType)

        expect(result).toHaveLength(1)
        expect(result[0].type).toBe(targetType)
      })
    })
  })

  describe('special type values', () => {
    it('should return all projects when type is "all"', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'npm' }),
        createProject({ id: '3', type: 'manual' }),
      ]

      const result = filterByType(projects, 'all')

      expect(result).toHaveLength(3)
    })

    it('should return all projects when type is undefined', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'npm' }),
      ]

      const result = filterByType(projects, undefined)

      expect(result).toHaveLength(2)
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', type: 'github' }),
        createProject({ id: '2', type: 'npm' }),
      ]

      const originalLength = projects.length
      filterByType(projects, 'github')

      expect(projects.length).toBe(originalLength)
    })

    it('should return a new array instance', () => {
      const projects = [createProject({ type: 'github' })]

      const result = filterByType(projects, 'all')

      expect(result).not.toBe(projects)
    })
  })
})
