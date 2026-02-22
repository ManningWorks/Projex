import { describe, it, expect } from 'vitest'
import { defineProjects } from '../defineProjects'
import type { FolioProjectInput } from '../../types'

describe('defineProjects', () => {
  it('should return the input array unchanged', () => {
    const projects: FolioProjectInput[] = [
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

    expect(result).toBe(projects)
    expect(result).toHaveLength(2)
  })

  it('should return an empty array when given an empty array', () => {
    const result = defineProjects([])

    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  it('should handle single project', () => {
    const projects: FolioProjectInput[] = [
      {
        id: 'single',
        type: 'npm',
        package: 'my-package',
        status: 'active',
      },
    ]

    const result = defineProjects(projects)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('single')
    expect(result[0].type).toBe('npm')
  })

  it('should handle all project types', () => {
    const projects: FolioProjectInput[] = [
      { id: 'gh', type: 'github', repo: 'user/repo', status: 'active' },
      { id: 'man', type: 'manual', status: 'active' },
      { id: 'npm', type: 'npm', package: 'pkg', status: 'active' },
      { id: 'ph', type: 'product-hunt', slug: 'product', status: 'active' },
      { id: 'hyb', type: 'hybrid', repo: 'user/repo', package: 'pkg', status: 'active' },
    ]

    const result = defineProjects(projects)

    expect(result).toHaveLength(5)
    expect(result.map(p => p.type)).toEqual(['github', 'manual', 'npm', 'product-hunt', 'hybrid'])
  })

  it('should preserve all project properties', () => {
    const projects: FolioProjectInput[] = [
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
        struggles: [{ type: 'warn', text: 'Warning' }],
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

    expect(result[0]).toEqual(projects[0])
  })

  it('should provide type safety for project configs', () => {
    const githubProject: FolioProjectInput = {
      id: 'typed-project',
      type: 'github',
      repo: 'user/repo',
      status: 'active',
    }

    const result = defineProjects([githubProject])

    expect(result[0].type).toBe('github')
    if (result[0].type === 'github') {
      expect(result[0].repo).toBe('user/repo')
    }
  })
})
