import { describe, it, expect } from 'vitest'
import { filterByFeatured } from '../filterByFeatured'
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

describe('filterByFeatured', () => {
  describe('empty array handling', () => {
    it('should return empty array when input is empty', () => {
      expect(filterByFeatured([], true)).toEqual([])
    })

    it('should return empty array when input is empty and featured is false', () => {
      expect(filterByFeatured([], false)).toEqual([])
    })

    it('should return empty array when input is empty and featured is null', () => {
      expect(filterByFeatured([], null)).toEqual([])
    })

    it('should return empty array when input is empty and featured is undefined', () => {
      expect(filterByFeatured([], undefined)).toEqual([])
    })
  })

  describe('featured filtering', () => {
    it('should filter projects with featured=true', () => {
      const projects = [
        createProject({ id: '1', featured: true }),
        createProject({ id: '2', featured: false }),
        createProject({ id: '3', featured: true }),
      ]

      const result = filterByFeatured(projects, true)

      expect(result).toHaveLength(2)
      expect(result.map(p => p.id)).toEqual(['1', '3'])
    })

    it('should filter projects with featured=false', () => {
      const projects = [
        createProject({ id: '1', featured: true }),
        createProject({ id: '2', featured: false }),
        createProject({ id: '3', featured: false }),
      ]

      const result = filterByFeatured(projects, false)

      expect(result).toHaveLength(2)
      expect(result.map(p => p.id)).toEqual(['2', '3'])
    })

    it('should return empty array when no projects match featured=true', () => {
      const projects = [
        createProject({ featured: false }),
        createProject({ featured: false }),
      ]

      const result = filterByFeatured(projects, true)

      expect(result).toHaveLength(0)
    })

    it('should return empty array when no projects match featured=false', () => {
      const projects = [
        createProject({ featured: true }),
        createProject({ featured: true }),
      ]

      const result = filterByFeatured(projects, false)

      expect(result).toHaveLength(0)
    })
  })

  describe('null and undefined featured parameter', () => {
    it('should return all projects when featured is null', () => {
      const projects = [
        createProject({ id: '1', featured: true }),
        createProject({ id: '2', featured: false }),
        createProject({ id: '3', featured: true }),
      ]

      const result = filterByFeatured(projects, null)

      expect(result).toHaveLength(3)
    })

    it('should return all projects when featured is undefined', () => {
      const projects = [
        createProject({ id: '1', featured: true }),
        createProject({ id: '2', featured: false }),
      ]

      const result = filterByFeatured(projects, undefined)

      expect(result).toHaveLength(2)
    })
  })

  describe('immutability', () => {
    it('should not mutate the original array', () => {
      const projects = [
        createProject({ id: '1', featured: true }),
        createProject({ id: '2', featured: false }),
      ]

      const originalLength = projects.length
      filterByFeatured(projects, true)

      expect(projects.length).toBe(originalLength)
    })

    it('should return a new array instance', () => {
      const projects = [createProject({ featured: true })]

      const result = filterByFeatured(projects, null)

      expect(result).not.toBe(projects)
    })
  })
})
