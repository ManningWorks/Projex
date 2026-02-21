import { describe, it, expect } from 'vitest'
import { normalise } from '../normalise'
import type { NpmProjectInput } from '../../types'

describe('npm config recognition', () => {
  it('should recognize an npm project when type is "npm"', async () => {
    const input: NpmProjectInput = {
      id: 'test-npm',
      type: 'npm',
      package: 'test-package',
      status: 'active',
      name: 'Test Package',
      tagline: 'A test package',
      description: 'This is a test description',
    }

    const result = await normalise(input)

    expect(result.type).toBe('npm')
    expect(result.id).toBe('test-npm')
    expect(result.package).toBe('test-package')
  })

  it('should match the package property to the npm package name', async () => {
    const input: NpmProjectInput = {
      id: 'test-npm',
      type: 'npm',
      package: 'my-awesome-package',
      status: 'active',
      name: 'My Awesome Package',
    }

    const result = await normalise(input)

    expect(result.package).toBe('my-awesome-package')
  })

  it('should handle npm project with all optional fields', async () => {
    const input: NpmProjectInput = {
      id: 'full-npm',
      type: 'npm',
      package: 'full-package',
      status: 'shipped',
      featured: true,
      name: 'Full Package',
      tagline: 'A complete npm package',
      description: 'Description of the package',
      background: 'Background info',
      why: 'Why I built it',
      struggles: [],
      timeline: [],
      posts: [],
      stack: ['TypeScript', 'React'],
      links: {
        npm: 'https://npmjs.com/package/full-package',
        github: 'https://github.com/user/full-package',
      },
      stats: {
        downloads: '10000',
        version: '1.0.0',
      },
    }

    const result = await normalise(input)

    expect(result.type).toBe('npm')
    expect(result.package).toBe('full-package')
    expect(result.name).toBe('Full Package')
    expect(result.tagline).toBe('A complete npm package')
    expect(result.description).toBe('Description of the package')
    expect(result.background).toBe('Background info')
    expect(result.why).toBe('Why I built it')
    expect(result.stack).toEqual(['TypeScript', 'React'])
    expect(result.links).toEqual({
      npm: 'https://npmjs.com/package/full-package',
      github: 'https://github.com/user/full-package',
    })
    expect(result.stats).toEqual({
      downloads: '10000',
      version: '1.0.0',
    })
  })

  it('should handle npm project with minimal config', async () => {
    const input: NpmProjectInput = {
      id: 'minimal-npm',
      type: 'npm',
      package: 'minimal-package',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.type).toBe('npm')
    expect(result.package).toBe('minimal-package')
    expect(result.name).toBe('')
    expect(result.tagline).toBe('')
    expect(result.description).toBe('')
  })
})
