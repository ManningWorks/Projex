import { describe, it, expect, afterEach, vi } from 'vitest'
import { generateProjectSchema, type SoftwareApplicationSchema } from '../project'
import type { FolioProject } from '../../../types'
import { cleanup } from '@testing-library/react'

const createProject = (overrides: Partial<FolioProject> = {}): FolioProject => ({
  id: 'test-project',
  type: 'github',
  status: 'active',
  featured: false,
  name: 'Test Project',
  tagline: 'Test Tagline',
  description: 'Test description',
  background: null,
  why: null,
  image: null,
  struggles: [],
  timeline: [],
  posts: [],
  stack: [],
  links: {
    github: 'https://github.com/test/project',
  },
  stats: null,
  language: null,
  languageColor: null,
  createdAt: null,
  updatedAt: null,
  repo: 'test/project',
  ...overrides,
})

describe('generateProjectSchema', () => {
  afterEach(() => {
    cleanup()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('valid inputs', () => {
    it('should return valid SoftwareApplication schema with required fields', () => {
      const project = createProject()
      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result).toEqual({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Test Project',
        description: 'Test description',
        url: 'https://github.com/test/project',
        applicationCategory: 'DeveloperApplication',
      })
    })

    it('should include name, description, and url', () => {
      const project = createProject({
        name: 'My App',
        description: 'An amazing application',
        links: {
          live: 'https://myapp.com',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.name).toBe('My App')
      expect(result?.description).toBe('An amazing application')
      expect(result?.url).toBe('https://myapp.com')
    })

    it('should use GitHub URL as application URL when available', () => {
      const project = createProject({
        links: {
          github: 'https://github.com/user/repo',
          live: 'https://myapp.com',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.url).toBe('https://github.com/user/repo')
    })

    it('should include applicationCategory for github type', () => {
      const project = createProject({
        type: 'github',
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.applicationCategory).toBe('DeveloperApplication')
    })

    it('should include applicationCategory for npm type', () => {
      const project = createProject({
        type: 'npm',
        package: 'test-package',
        links: {
          npm: 'https://npmjs.com/package/test-package',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.applicationCategory).toBe('DeveloperApplication')
    })

    it('should not include applicationCategory for manual type', () => {
      const project = createProject({
        type: 'manual',
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.applicationCategory).toBeUndefined()
    })

    it('should include aggregateRating when stars are available', () => {
      const project = createProject({
        stats: {
          stars: 1234,
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.aggregateRating).toEqual({
        '@type': 'AggregateRating',
        ratingValue: 5,
        ratingCount: 1234,
      })
    })

    it('should include interactionStatistic when downloads are available', () => {
      const project = createProject({
        stats: {
          downloads: '5678',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.interactionStatistic).toEqual({
        '@type': 'InteractionCounter',
        interactionType: {
          '@type': 'DownloadAction',
        },
        userInteractionCount: 5678,
      })
    })

    it('should include both aggregateRating and interactionStatistic when both stats are available', () => {
      const project = createProject({
        stats: {
          stars: 100,
          downloads: '500',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.aggregateRating).toEqual({
        '@type': 'AggregateRating',
        ratingValue: 5,
        ratingCount: 100,
      })
      expect(result?.interactionStatistic).toEqual({
        '@type': 'InteractionCounter',
        interactionType: {
          '@type': 'DownloadAction',
        },
        userInteractionCount: 500,
      })
    })

    it('should conform to schema.org SoftwareApplication specification', () => {
      const project = createProject()
      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()

      const schema = result as SoftwareApplicationSchema

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('SoftwareApplication')
      expect(schema.name).toBe('Test Project')
      expect(schema.description).toBe('Test description')
      expect(schema.url).toBe('https://github.com/test/project')
    })
  })

  describe('URL selection priority', () => {
    it('should prioritize github URL over others', () => {
      const project = createProject({
        links: {
          github: 'https://github.com/user/repo',
          live: 'https://live.com',
          npm: 'https://npmjs.com/package',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://github.com/user/repo')
    })

    it('should use live URL when github is not available', () => {
      const project = createProject({
        links: {
          live: 'https://live.com',
          npm: 'https://npmjs.com/package',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://live.com')
    })

    it('should use npm URL when github and live are not available', () => {
      const project = createProject({
        links: {
          npm: 'https://npmjs.com/package',
          docs: 'https://docs.com',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://npmjs.com/package')
    })

    it('should use docs URL when others are not available', () => {
      const project = createProject({
        links: {
          docs: 'https://docs.com',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://docs.com')
    })

    it('should use demo URL when others are not available', () => {
      const project = createProject({
        links: {
          demo: 'https://demo.com',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://demo.com')
    })

    it('should use appStore URL when others are not available', () => {
      const project = createProject({
        links: {
          appStore: 'https://apps.apple.com/app',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://apps.apple.com/app')
    })

    it('should use playStore URL when others are not available', () => {
      const project = createProject({
        links: {
          playStore: 'https://play.google.com/store',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://play.google.com/store')
    })

    it('should use productHunt URL when others are not available', () => {
      const project = createProject({
        links: {
          productHunt: 'https://producthunt.com/posts/app',
        },
      })

      const result = generateProjectSchema(project)

      expect(result?.url).toBe('https://producthunt.com/posts/app')
    })
  })

  describe('invalid required fields', () => {
    it('should return null and warn when name is empty', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const project = createProject({
        name: '',
      })

      const result = generateProjectSchema(project)

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generateProjectSchema: project.name is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when name is whitespace only', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const project = createProject({
        name: '   ',
      })

      const result = generateProjectSchema(project)

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generateProjectSchema: project.name is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when description is empty', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const project = createProject({
        description: '',
      })

      const result = generateProjectSchema(project)

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generateProjectSchema: project.description is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when description is whitespace only', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const project = createProject({
        description: '   ',
      })

      const result = generateProjectSchema(project)

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generateProjectSchema: project.description is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when both name and description are invalid', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const project = createProject({
        name: '',
        description: '',
      })

      const result = generateProjectSchema(project)

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledTimes(2)

      warnSpy.mockRestore()
    })

    it('should return null and warn when no links are available', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const project = createProject({
        links: {},
      })

      const result = generateProjectSchema(project)

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generateProjectSchema: project must have at least one link (github, live, npm, docs, demo, appStore, playStore, productHunt)'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when all links are empty', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const project = createProject({
        links: {
          github: '',
          live: '',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generateProjectSchema: project must have at least one link (github, live, npm, docs, demo, appStore, playStore, productHunt)'
      )

      warnSpy.mockRestore()
    })
  })

  describe('optional stats handling', () => {
    it('should not include aggregateRating when stars are 0', () => {
      const project = createProject({
        stats: {
          stars: 0,
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.aggregateRating).toBeUndefined()
    })

    it('should not include aggregateRating when stars are negative', () => {
      const project = createProject({
        stats: {
          stars: -10,
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.aggregateRating).toBeUndefined()
    })

    it('should not include aggregateRating when stars are undefined', () => {
      const project = createProject({
        stats: {
          forks: 5,
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.aggregateRating).toBeUndefined()
    })

    it('should not include interactionStatistic when downloads are 0', () => {
      const project = createProject({
        stats: {
          downloads: '0',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.interactionStatistic).toBeUndefined()
    })

    it('should not include interactionStatistic when downloads are not a number', () => {
      const project = createProject({
        stats: {
          downloads: 'not-a-number',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.interactionStatistic).toBeUndefined()
    })

    it('should not include interactionStatistic when downloads are empty string', () => {
      const project = createProject({
        stats: {
          downloads: '',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.interactionStatistic).toBeUndefined()
    })

    it('should not include interactionStatistic when downloads are undefined', () => {
      const project = createProject({
        stats: {
          version: '1.0.0',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.interactionStatistic).toBeUndefined()
    })
  })

  describe('trimming whitespace', () => {
    it('should trim whitespace from name', () => {
      const project = createProject({
        name: '  Test Project  ',
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.name).toBe('Test Project')
    })

    it('should trim whitespace from description', () => {
      const project = createProject({
        description: '  Test description  ',
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.description).toBe('Test description')
    })

    it('should not trim URL (uses as-is)', () => {
      const project = createProject({
        links: {
          live: '  https://example.com  ',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()
      expect(result?.url).toBe('  https://example.com  ')
    })
  })

  describe('Next.js metadata compatibility', () => {
    it('should produce schema compatible with Next.js metadata', () => {
      const project = createProject({
        name: 'My App',
        description: 'An amazing app',
        links: {
          live: 'https://myapp.com',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()

      const jsonString = JSON.stringify(result)
      expect(jsonString).toContain('"@context":"https://schema.org"')
      expect(jsonString).toContain('"@type":"SoftwareApplication"')
      expect(jsonString).toContain('"name":"My App"')
      expect(jsonString).toContain('"description":"An amazing app"')
      expect(jsonString).toContain('"url":"https://myapp.com"')
    })

    it('should include applicationCategory in JSON output', () => {
      const project = createProject({
        type: 'github',
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()

      const jsonString = JSON.stringify(result)
      expect(jsonString).toContain('"applicationCategory":"DeveloperApplication"')
    })

    it('should include aggregateRating in JSON output', () => {
      const project = createProject({
        stats: {
          stars: 100,
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()

      const jsonString = JSON.stringify(result)
      expect(jsonString).toContain('"aggregateRating"')
      expect(jsonString).toContain('"ratingValue":5')
      expect(jsonString).toContain('"ratingCount":100')
    })

    it('should include interactionStatistic in JSON output', () => {
      const project = createProject({
        stats: {
          downloads: '500',
        },
      })

      const result = generateProjectSchema(project)

      expect(result).not.toBeNull()

      const jsonString = JSON.stringify(result)
      expect(jsonString).toContain('"interactionStatistic"')
      expect(jsonString).toContain('"userInteractionCount":500')
    })
  })
})
