import { describe, it, expect } from 'vitest'
import { sortByName } from '../sortByName'
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

describe('sortByName', () => {
  describe('empty array handling', () => {
    it('should return empty array when input is empty', () => {
      expect(sortByName([])).toEqual([])
    })

    it('should return empty array with desc order when input is empty', () => {
      expect(sortByName([], 'desc')).toEqual([])
    })
  })

  describe('case-insensitive sorting', () => {
    it('should sort names case-insensitively by default (asc)', () => {
      const projects = [
        createProject({ id: '1', name: 'zebra' }),
        createProject({ id: '2', name: 'Apple' }),
        createProject({ id: '3', name: 'BANANA' }),
      ]

      const result = sortByName(projects)

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })

    it('should sort names case-insensitively in desc order', () => {
      const projects = [
        createProject({ id: '1', name: 'apple' }),
        createProject({ id: '2', name: 'Zebra' }),
        createProject({ id: '3', name: 'Banana' }),
      ]

      const result = sortByName(projects, 'desc')

      expect(result.map(p => p.id)).toEqual(['2', '3', '1'])
    })

    it('should handle mixed case names correctly', () => {
      const projects = [
        createProject({ id: '1', name: 'React' }),
        createProject({ id: '2', name: 'react' }),
        createProject({ id: '3', name: 'REACT' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result).toHaveLength(3)
    })
  })

  describe('handling missing names', () => {
    it('should place projects with null names at the end in asc order', () => {
      const projects = [
        createProject({ id: '1', name: 'Beta' }),
        createProject({ id: '2', name: null as unknown as string }),
        createProject({ id: '3', name: 'Alpha' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result[result.length - 1].id).toBe('2')
      expect(result.slice(0, 2).map(p => p.id)).toEqual(['3', '1'])
    })

    it('should place projects with null names at the end in desc order', () => {
      const projects = [
        createProject({ id: '1', name: 'Beta' }),
        createProject({ id: '2', name: null as unknown as string }),
        createProject({ id: '3', name: 'Alpha' }),
      ]

      const result = sortByName(projects, 'desc')

      expect(result[result.length - 1].id).toBe('2')
    })

    it('should handle all projects with null names', () => {
      const projects = [
        createProject({ id: '1', name: null as unknown as string }),
        createProject({ id: '2', name: null as unknown as string }),
      ]

      const result = sortByName(projects)

      expect(result).toHaveLength(2)
    })

    it('should return 0 for comparison when both names are null', () => {
      const projects = [
        createProject({ id: '1', name: null as unknown as string }),
        createProject({ id: '2', name: null as unknown as string }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result).toHaveLength(2)
    })
  })

  describe('alphabetical sorting', () => {
    it('should sort names alphabetically in asc order', () => {
      const projects = [
        createProject({ id: '1', name: 'Zulu' }),
        createProject({ id: '2', name: 'Alpha' }),
        createProject({ id: '3', name: 'Mike' }),
        createProject({ id: '4', name: 'Charlie' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result.map(p => p.name)).toEqual(['Alpha', 'Charlie', 'Mike', 'Zulu'])
    })

    it('should sort names reverse-alphabetically in desc order', () => {
      const projects = [
        createProject({ id: '1', name: 'Alpha' }),
        createProject({ id: '2', name: 'Zulu' }),
        createProject({ id: '3', name: 'Mike' }),
      ]

      const result = sortByName(projects, 'desc')

      expect(result.map(p => p.name)).toEqual(['Zulu', 'Mike', 'Alpha'])
    })

    it('should handle names with numbers (lexical sorting)', () => {
      const projects = [
        createProject({ id: '1', name: 'Project 2' }),
        createProject({ id: '2', name: 'Project 10' }),
        createProject({ id: '3', name: 'Project 1' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result.map(p => p.id)).toEqual(['3', '2', '1'])
    })
  })

  describe('special characters and unicode', () => {
    it('should handle names with special characters', () => {
      const projects = [
        createProject({ id: '1', name: '@project' }),
        createProject({ id: '2', name: 'A-project' }),
        createProject({ id: '3', name: '_project' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result).toHaveLength(3)
    })

    it('should handle unicode characters', () => {
      const projects = [
        createProject({ id: '1', name: 'Über' }),
        createProject({ id: '2', name: 'Apple' }),
        createProject({ id: '3', name: 'Äpfel' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result.map(p => p.id)).toEqual(['3', '2', '1'])
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', name: 'Zulu' }),
        createProject({ id: '2', name: 'Alpha' }),
      ]

      const originalOrder = projects.map(p => p.id)
      sortByName(projects, 'asc')

      expect(projects.map(p => p.id)).toEqual(originalOrder)
    })

    it('should return a new array instance', () => {
      const projects = [createProject({ name: 'Test' })]

      const result = sortByName(projects)

      expect(result).not.toBe(projects)
    })
  })

  describe('edge cases', () => {
    it('should handle duplicate names', () => {
      const projects = [
        createProject({ id: '1', name: 'Project' }),
        createProject({ id: '2', name: 'Project' }),
        createProject({ id: '3', name: 'Project' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result).toHaveLength(3)
    })

    it('should handle empty string names', () => {
      const projects = [
        createProject({ id: '1', name: '' }),
        createProject({ id: '2', name: 'Alpha' }),
      ]

      const result = sortByName(projects, 'asc')

      expect(result[result.length - 1].id).toBe('1')
    })

    it('should handle single project', () => {
      const projects = [createProject({ name: 'Solo' })]

      const result = sortByName(projects)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Solo')
    })
  })
})
