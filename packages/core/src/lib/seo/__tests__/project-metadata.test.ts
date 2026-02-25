import { describe, it, expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { generateProjectMetadata } from '../project-metadata'
import type { FolioProject } from '../../../types'

const createProject = (overrides: Partial<FolioProject> = {}): FolioProject => ({
  id: 'test-project',
  type: 'github',
  status: 'active',
  featured: false,
  name: 'Test Project',
  tagline: 'A test project',
  description: 'A test description',
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
  repo: 'test/repo',
  ...overrides,
})

afterEach(() => {
  cleanup()
})

describe('generateProjectMetadata', () => {
  describe('validation', () => {
    it('should return null when name is missing', () => {
      const result = generateProjectMetadata(createProject({ name: '' }))

      expect(result).toBeNull()
    })

    it('should return null when name is not a string', () => {
      const result = generateProjectMetadata(createProject({ name: null as any }))

      expect(result).toBeNull()
    })

    it('should return null when description is missing', () => {
      const result = generateProjectMetadata(createProject({ description: '' }))

      expect(result).toBeNull()
    })

    it('should return null when description is not a string', () => {
      const result = generateProjectMetadata(createProject({ description: null as any }))

      expect(result).toBeNull()
    })

    it('should return null when both name and description are missing', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generateProjectMetadata(createProject({ name: '', description: '' }))

      expect(result).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generateProjectMetadata: project.name is required and must be a non-empty string'
      )
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generateProjectMetadata: project.description is required and must be a non-empty string'
      )

      consoleWarnSpy.mockRestore()
    })
  })

  describe('required fields', () => {
    it('should return metadata with trimmed required fields', () => {
      const result = generateProjectMetadata(
        createProject({
          name: '  Test Project  ',
          description: '  A test description  ',
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.title).toBe('Test Project')
      expect(result!.description).toBe('A test description')
    })
  })

  describe('title and description', () => {
    it('should set title from project name', () => {
      const result = generateProjectMetadata(
        createProject({
          name: 'My Awesome Project',
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.title).toBe('My Awesome Project')
    })

    it('should set description from project description', () => {
      const result = generateProjectMetadata(
        createProject({
          description: 'An awesome project for testing',
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.description).toBe('An awesome project for testing')
    })
  })

  describe('OpenGraph fields', () => {
    it('should include OpenGraph title', () => {
      const result = generateProjectMetadata(
        createProject({
          name: 'Cool Project',
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.title).toBe('Cool Project')
    })

    it('should include OpenGraph description', () => {
      const result = generateProjectMetadata(
        createProject({
          description: 'A cool project',
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.description).toBe('A cool project')
    })

    it('should include OpenGraph type as website', () => {
      const result = generateProjectMetadata(
        createProject({
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.type).toBe('website')
    })

    describe('OpenGraph URL', () => {
      it('should prioritize live link over github', () => {
        const result = generateProjectMetadata(
          createProject({
            links: {
              github: 'https://github.com/test/repo',
              live: 'https://example.com',
            },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.url).toBe('https://example.com')
      })

      it('should use github link when live is not available', () => {
        const result = generateProjectMetadata(
          createProject({
            links: { github: 'https://github.com/test/repo' },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.url).toBe('https://github.com/test/repo')
      })

      it('should use npm link when live and github are not available', () => {
        const result = generateProjectMetadata(
          createProject({
            type: 'npm',
            package: 'test-package',
            links: { npm: 'https://npmjs.com/package/test-package' },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.url).toBe('https://npmjs.com/package/test-package')
      })

      it('should follow URL priority: live > github > npm > docs > demo', () => {
        const result = generateProjectMetadata(
          createProject({
            links: {
              demo: 'https://demo.example.com',
              docs: 'https://docs.example.com',
            },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.url).toBe('https://docs.example.com')
      })

      it('should omit URL when no links are provided', () => {
        const result = generateProjectMetadata(createProject({ links: {} }))

        expect(result).not.toBeNull()
        expect(result!.openGraph!.url).toBeUndefined()
      })
    })

    describe('OpenGraph images', () => {
      it('should include OpenGraph image when provided', () => {
        const result = generateProjectMetadata(
          createProject({
            image: 'https://example.com/project.jpg',
            links: { github: 'https://github.com/test/repo' },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.images).toBeDefined()
        expect(result!.openGraph!.images).toEqual([{ url: 'https://example.com/project.jpg' }])
      })

      it('should trim image URL', () => {
        const result = generateProjectMetadata(
          createProject({
            image: '  https://example.com/project.jpg  ',
            links: { github: 'https://github.com/test/repo' },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.images).toEqual([{ url: 'https://example.com/project.jpg' }])
      })

      it('should omit OpenGraph image when not provided', () => {
        const result = generateProjectMetadata(
          createProject({
            image: null,
            links: { github: 'https://github.com/test/repo' },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.images).toBeUndefined()
      })

      it('should omit OpenGraph image when empty string', () => {
        const result = generateProjectMetadata(
          createProject({
            image: '',
            links: { github: 'https://github.com/test/repo' },
          })
        )

        expect(result).not.toBeNull()
        expect(result!.openGraph!.images).toBeUndefined()
      })
    })
  })

  describe('keywords from stack', () => {
    it('should include keywords from stack', () => {
      const result = generateProjectMetadata(
        createProject({
          stack: ['React', 'TypeScript', 'Node.js'],
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.keywords).toBe('React, TypeScript, Node.js')
    })

    it('should trim stack items', () => {
      const result = generateProjectMetadata(
        createProject({
          stack: ['  React  ', '  TypeScript  ', '  Node.js  '],
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.keywords).toBe('React, TypeScript, Node.js')
    })

    it('should filter out empty stack items', () => {
      const result = generateProjectMetadata(
        createProject({
          stack: ['React', '', 'TypeScript', '   '],
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.keywords).toBe('React, TypeScript')
    })

    it('should omit keywords when stack is empty', () => {
      const result = generateProjectMetadata(
        createProject({
          stack: [],
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.keywords).toBeUndefined()
    })

    it('should omit keywords when stack is not provided', () => {
      const result = generateProjectMetadata(
        createProject({
          stack: undefined as any,
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.keywords).toBeUndefined()
    })
  })

  describe('SoftwareApplication schema', () => {
    it('should include SoftwareApplication schema in other metadata', () => {
      const result = generateProjectMetadata(
        createProject({
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.other).toBeDefined()
      expect(result!.other!['schema:softwareApplication']).toBeDefined()

      const schema = JSON.parse(result!.other!['schema:softwareApplication']!)
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('SoftwareApplication')
      expect(schema.name).toBe('Test Project')
      expect(schema.description).toBe('A test description')
    })

    it('should omit SoftwareApplication schema when generateProjectSchema returns null', () => {
      const result = generateProjectMetadata(
        createProject({
          name: 'Test Project',
          description: 'Test',
          links: {},
        })
      )

      expect(result).not.toBeNull()
      expect(result!.other).toBeUndefined()
    })
  })

  describe('complete metadata structure', () => {
    it('should return complete metadata with all fields', () => {
      const result = generateProjectMetadata(
        createProject({
          name: 'Full Project',
          description: 'A full project description',
          image: 'https://example.com/project.jpg',
          stack: ['React', 'TypeScript'],
          links: { live: 'https://example.com', github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.title).toBe('Full Project')
      expect(result!.description).toBe('A full project description')
      expect(result!.keywords).toBe('React, TypeScript')

      expect(result!.openGraph).toEqual({
        title: 'Full Project',
        description: 'A full project description',
        url: 'https://example.com',
        type: 'website',
        images: [{ url: 'https://example.com/project.jpg' }],
      })

      const schema = JSON.parse(result!.other!['schema:softwareApplication']!)
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('SoftwareApplication')
      expect(schema.name).toBe('Full Project')
    })
  })

  describe('console warnings', () => {
    it('should log warning for missing name', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generateProjectMetadata(createProject({ name: '' }))

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generateProjectMetadata: project.name is required and must be a non-empty string'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should log warning for missing description', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generateProjectMetadata(createProject({ description: '' }))

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generateProjectMetadata: project.description is required and must be a non-empty string'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should log all warnings when both fields are missing', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generateProjectMetadata(createProject({ name: '', description: '' }))

      expect(consoleWarnSpy).toHaveBeenCalledTimes(2)

      consoleWarnSpy.mockRestore()
    })

    it('should not log warnings when all fields are valid', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generateProjectMetadata(
        createProject({
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(consoleWarnSpy).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Next.js metadata compatibility', () => {
    it('should produce metadata compatible with Next.js', () => {
      const result = generateProjectMetadata(
        createProject({
          name: 'Next.js Project',
          description: 'A Next.js project',
          image: 'https://example.com/og.jpg',
          stack: ['Next.js', 'React'],
          links: { live: 'https://example.com' },
        })
      )

      expect(result).not.toBeNull()
      expect(result!.title).toBeDefined()
      expect(result!.description).toBeDefined()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.title).toBe('Next.js Project')
      expect(result!.openGraph!.description).toBe('A Next.js project')
      expect(result!.openGraph!.url).toBe('https://example.com')
      expect(result!.openGraph!.type).toBe('website')
      expect(result!.openGraph!.images).toEqual([{ url: 'https://example.com/og.jpg' }])
    })

    it('should produce JSON-serializable SoftwareApplication schema', () => {
      const result = generateProjectMetadata(
        createProject({
          links: { github: 'https://github.com/test/repo' },
        })
      )

      expect(result).not.toBeNull()

      const schema = JSON.parse(result!.other!['schema:softwareApplication']!)
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('SoftwareApplication')
      expect(schema.name).toBe('Test Project')
      expect(schema.description).toBe('A test description')
    })
  })
})
