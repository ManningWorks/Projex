import { describe, it, expect } from 'vitest'
import { getFuseOptions, createFuseSearch } from '../fuse'
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

describe('getFuseOptions', () => {
  it('should return default threshold of 0.2', () => {
    const options = getFuseOptions()

    expect(options.threshold).toBe(0.2)
  })

  it('should accept custom threshold', () => {
    const options = getFuseOptions(0.5)

    expect(options.threshold).toBe(0.5)
  })

  it('should include name, description, and stack keys', () => {
    const options = getFuseOptions()

    const keyNames = options.keys.map(k => k.name)

    expect(keyNames).toContain('name')
    expect(keyNames).toContain('description')
    expect(keyNames).toContain('stack')
  })

  it('should assign higher weight to name', () => {
    const options = getFuseOptions()

    const nameKey = options.keys.find(k => k.name === 'name')

    expect(nameKey?.weight).toBe(2)
  })

  it('should assign higher weight to description than stack', () => {
    const options = getFuseOptions()

    const descKey = options.keys.find(k => k.name === 'description')
    const stackKey = options.keys.find(k => k.name === 'stack')

    expect(descKey?.weight).toBe(1.5)
    expect(stackKey?.weight).toBe(1)
  })
})

describe('createFuseSearch', () => {
  it('should create Fuse instance with projects', () => {
    const projects = [
      createProject({ id: '1', name: 'React Dashboard', description: 'A React dashboard', stack: ['react', 'typescript'] }),
      createProject({ id: '2', name: 'Vue Todo', description: 'A Vue todo app', stack: ['vue'] }),
    ]

    const fuse = createFuseSearch(projects)

    expect(fuse).toBeDefined()
  })

  it('should find projects by exact name match', () => {
    const projects = [
      createProject({ id: '1', name: 'React Dashboard' }),
      createProject({ id: '2', name: 'Vue Todo' }),
    ]

    const fuse = createFuseSearch(projects)
    const results = fuse.search('React Dashboard')

    expect(results).toHaveLength(1)
    expect(results[0].item.id).toBe('1')
  })

  it('should find projects by partial name match', () => {
    const projects = [
      createProject({ id: '1', name: 'React Dashboard' }),
      createProject({ id: '2', name: 'Vue Todo' }),
    ]

    const fuse = createFuseSearch(projects)
    const results = fuse.search('React')

    expect(results).toHaveLength(1)
    expect(results[0].item.id).toBe('1')
  })

  it('should find projects by description', () => {
    const projects = [
      createProject({ id: '1', name: 'Project One', description: 'A modern dashboard' }),
      createProject({ id: '2', name: 'Project Two', description: 'A simple todo app' }),
    ]

    const fuse = createFuseSearch(projects)
    const results = fuse.search('dashboard')

    expect(results).toHaveLength(1)
    expect(results[0].item.id).toBe('1')
  })

  it('should find projects by stack tag', () => {
    const projects = [
      createProject({ id: '1', name: 'Project One', stack: ['react', 'typescript'] }),
      createProject({ id: '2', name: 'Project Two', stack: ['vue', 'javascript'] }),
    ]

    const fuse = createFuseSearch(projects)
    const results = fuse.search('react')

    expect(results).toHaveLength(1)
    expect(results[0].item.id).toBe('1')
  })

  it('should handle fuzzy matching with typos', () => {
    const projects = [
      createProject({ id: '1', name: 'React Dashboard' }),
      createProject({ id: '2', name: 'Vue Todo' }),
    ]

    const fuse = createFuseSearch(projects, 0.4)
    const results = fuse.search('Ract')

    expect(results.length).toBeGreaterThan(0)
    expect(results[0].item.name).toContain('React')
  })

  it('should respect custom threshold', () => {
    const projects = [
      createProject({ id: '1', name: 'React Dashboard' }),
    ]

    const fuseStrict = createFuseSearch(projects, 0.1)
    const fuseLoose = createFuseSearch(projects, 0.5)

    const strictResults = fuseStrict.search('Ract')
    const looseResults = fuseLoose.search('Ract')

    expect(looseResults.length).toBeGreaterThanOrEqual(strictResults.length)
  })

  it('should return empty array for no matches', () => {
    const projects = [
      createProject({ id: '1', name: 'React Dashboard' }),
    ]

    const fuse = createFuseSearch(projects)
    const results = fuse.search('xyznonexistent')

    expect(results).toHaveLength(0)
  })
})
