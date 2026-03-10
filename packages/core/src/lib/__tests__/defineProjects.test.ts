import { describe, it, expect } from 'vitest'
import { defineProjects } from '../defineProjects'
import type { ProjexProjectInput } from '../../types'

describe('defineProjects', () => {
  it('should return the input array unchanged', () => {
    const projects: ProjexProjectInput[] = [
      {
        id: 'project-1',
        type: 'github',
        repo: 'user/repo1',
        status: 'active',
      },
      {
        id: 'project-2',
        type: 'manual',
        status: 'shipped',
        name: 'Manual Project',
      },
    ]

    const result = defineProjects(projects)

    expect(result.projects).toBe(projects)
    expect(result.projects).toHaveLength(2)
  })

  it('should return an empty array when given an empty array', () => {
    const result = defineProjects([])

    expect(result.projects).toEqual([])
    expect(result.projects).toHaveLength(0)
  })

  it('should handle single project', () => {
    const projects: ProjexProjectInput[] = [
      {
        id: 'single',
        type: 'npm',
        package: 'my-package',
        status: 'active',
      },
    ]

    const result = defineProjects(projects)

    expect(result.projects).toHaveLength(1)
    expect(result.projects[0].id).toBe('single')
    expect(result.projects[0].type).toBe('npm')
  })

  it('should handle all project types', () => {
    const projects: ProjexProjectInput[] = [
      { id: 'gh', type: 'github', repo: 'user/repo', status: 'active' },
      { id: 'man', type: 'manual', status: 'active' },
      { id: 'npm', type: 'npm', package: 'pkg', status: 'active' },
      { id: 'ph', type: 'product-hunt', slug: 'product', status: 'active' },
      { id: 'hyb', type: 'hybrid', repo: 'user/repo', package: 'pkg', status: 'active' },
    ]

    const result = defineProjects(projects)

    expect(result.projects).toHaveLength(5)
    expect(result.projects.map(p => p.type)).toEqual(['github', 'manual', 'npm', 'product-hunt', 'hybrid'])
  })

  it('should preserve all project properties', () => {
    const projects: ProjexProjectInput[] = [
      {
        id: 'full-project',
        type: 'github',
        repo: 'user/repo',
        status: 'shipped',
        featured: true,
        name: 'Full Project',
        tagline: 'A complete project',
        description: 'Full description',
        background: 'Background',
        why: 'Why',
        image: 'image.png',
        struggles: [{ type: 'challenge', text: 'Warning' }],
        timeline: [{ date: '2024-01-01', note: 'Start' }],
        posts: [{ title: 'Post', date: '2024-01-01' }],
        stack: ['React', 'TypeScript'],
        links: { live: 'https://example.com' },
        stats: { stars: 100 },
        createdAt: '2024-01-01',
        updatedAt: '2024-06-01',
      },
    ]

    const result = defineProjects(projects)

    expect(result.projects[0]).toEqual(projects[0])
  })

  it('should provide type safety for project configs', () => {
    const githubProject: ProjexProjectInput = {
      id: 'typed-project',
      type: 'github',
      repo: 'user/repo',
      status: 'active',
    }

    const result = defineProjects([githubProject])

    expect(result.projects[0].type).toBe('github')
    if (result.projects[0].type === 'github') {
      expect(result.projects[0].repo).toBe('user/repo')
    }
  })

  it('should accept optional options parameter with commits config', () => {
    const projects: ProjexProjectInput[] = [
      { id: 'test', type: 'github', repo: 'user/repo', status: 'active' },
    ]

    const result = defineProjects(projects, { commits: 10 })

    expect(result.projects).toHaveLength(1)
    expect(result.options.commits).toBe(10)
  })

  it('should default options.commits to 0 when not provided', () => {
    const projects: ProjexProjectInput[] = [
      { id: 'test', type: 'github', repo: 'user/repo', status: 'active' },
    ]

    const result = defineProjects(projects)

    expect(result.options.commits).toBe(0)
  })

  it('should return empty options when called with empty projects', () => {
    const result = defineProjects([])

    expect(result.projects).toEqual([])
    expect(result.options.commits).toBe(0)
  })

  describe('validation', () => {
    it('should throw an error for invalid project data', () => {
      const invalidProjects = [
        {
          id: 'invalid-project',
          type: 'github',
          status: 'active',
        },
      ] as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should throw an error for missing required field id', () => {
      const invalidProjects = [
        {
          type: 'manual',
          status: 'active',
        },
      ] as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should throw an error for invalid status value', () => {
      const invalidProjects = [
        {
          id: 'test',
          type: 'manual',
          status: 'invalid-status',
        },
      ] as unknown as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should throw an error for missing repo on github type', () => {
      const invalidProjects = [
        {
          id: 'test',
          type: 'github',
          status: 'active',
        },
      ] as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should throw an error for missing package on npm type', () => {
      const invalidProjects = [
        {
          id: 'test',
          type: 'npm',
          status: 'active',
        },
      ] as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should throw an error for invalid URL in links', () => {
      const invalidProjects = [
        {
          id: 'test',
          type: 'manual',
          status: 'active',
          links: {
            live: 'not-a-url',
          },
        },
      ] as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should include validation error details in thrown error', () => {
      const invalidProjects = [
        {
          id: 'test',
          type: 'github',
          status: 'active',
        },
      ] as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow(/repo/)
      expect(() => defineProjects(invalidProjects)).toThrow(/Validation failed/)
    })

    it('should throw for invalid enum values in array', () => {
      const invalidProjects = [
        {
          id: 'test',
          type: 'manual',
          status: 'bad-status',
        },
      ] as unknown as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should throw for multiple validation errors', () => {
      const invalidProjects = [
        {
          type: 'manual',
          status: 'bad-status',
        },
      ] as unknown as ProjexProjectInput[]

      expect(() => defineProjects(invalidProjects)).toThrow()
    })

    it('should throw for invalid project in array with multiple projects', () => {
      const mixedProjects = [
        {
          id: 'valid-project',
          type: 'github',
          repo: 'user/repo',
          status: 'active',
        },
        {
          id: 'invalid-project',
          type: 'github',
          status: 'active',
        },
      ] as ProjexProjectInput[]

      expect(() => defineProjects(mixedProjects)).toThrow()
    })
  })
})
