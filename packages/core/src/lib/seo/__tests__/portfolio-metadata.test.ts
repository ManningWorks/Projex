import { describe, it, expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { generatePortfolioMetadata } from '../portfolio-metadata'

afterEach(() => {
  cleanup()
})

describe('generatePortfolioMetadata', () => {
  describe('validation', () => {
    it('should return null when name is missing', () => {
      const result = generatePortfolioMetadata({
        name: '',
        description: 'Test description',
        url: 'https://example.com',
      })

      expect(result).toBeNull()
    })

    it('should return null when name is not a string', () => {
      const result = generatePortfolioMetadata({
        name: null as any,
        description: 'Test description',
        url: 'https://example.com',
      })

      expect(result).toBeNull()
    })

    it('should return null when description is missing', () => {
      const result = generatePortfolioMetadata({
        name: 'Test Name',
        description: '',
        url: 'https://example.com',
      })

      expect(result).toBeNull()
    })

    it('should return null when description is not a string', () => {
      const result = generatePortfolioMetadata({
        name: 'Test Name',
        description: null as any,
        url: 'https://example.com',
      })

      expect(result).toBeNull()
    })

    it('should return null when url is missing', () => {
      const result = generatePortfolioMetadata({
        name: 'Test Name',
        description: 'Test description',
        url: '',
      })

      expect(result).toBeNull()
    })

    it('should return null when url is not a string', () => {
      const result = generatePortfolioMetadata({
        name: 'Test Name',
        description: 'Test description',
        url: null as any,
      })

      expect(result).toBeNull()
    })

    it('should return null when all required fields are missing', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generatePortfolioMetadata({
        name: '',
        description: '',
        url: '',
      })

      expect(result).toBeNull()
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generatePortfolioMetadata: name is required and must be a non-empty string'
      )
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generatePortfolioMetadata: description is required and must be a non-empty string'
      )
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generatePortfolioMetadata: url is required and must be a non-empty string'
      )

      consoleWarnSpy.mockRestore()
    })
  })

  describe('required fields', () => {
    it('should return metadata with trimmed required fields', () => {
      const result = generatePortfolioMetadata({
        name: '  Test Name  ',
        description: '  Test description  ',
        url: '  https://example.com  ',
      })

      expect(result).not.toBeNull()
      expect(result!.title).toBe('Test Name')
      expect(result!.description).toBe('Test description')
    })
  })

  describe('title and description', () => {
    it('should set title and description from inputs', () => {
      const result = generatePortfolioMetadata({
        name: 'John Doe',
        description: 'Full-stack developer',
        url: 'https://johndoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.title).toBe('John Doe')
      expect(result!.description).toBe('Full-stack developer')
    })
  })

  describe('OpenGraph fields', () => {
    it('should include OpenGraph title', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.title).toBe('Jane Doe')
    })

    it('should include OpenGraph description', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.description).toBe('Software engineer')
    })

    it('should include OpenGraph url', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.url).toBe('https://janedoe.com')
    })

    it('should include OpenGraph type as website', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.type).toBe('website')
    })

    it('should include OpenGraph image when provided', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        image: 'https://janedoe.com/avatar.jpg',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.images).toBeDefined()
      expect(result!.openGraph!.images).toEqual([{ url: 'https://janedoe.com/avatar.jpg' }])
    })

    it('should trim image URL', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        image: '  https://janedoe.com/avatar.jpg  ',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph!.images).toEqual([{ url: 'https://janedoe.com/avatar.jpg' }])
    })

    it('should omit OpenGraph image when not provided', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.images).toBeUndefined()
    })

    it('should omit OpenGraph image when empty string', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        image: '',
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.images).toBeUndefined()
    })

    it('should omit OpenGraph image when invalid type', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        image: null as any,
      })

      expect(result).not.toBeNull()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.images).toBeUndefined()
    })
  })

  describe('sameAs links', () => {
    it('should include sameAs links in other metadata', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        sameAs: [
          'https://github.com/janedoe',
          'https://twitter.com/janedoe',
          'https://linkedin.com/in/janedoe',
        ],
      })

      expect(result).not.toBeNull()
      expect(result!.other).toBeDefined()
      expect(result!.other!.sameAs).toEqual([
        'https://github.com/janedoe',
        'https://twitter.com/janedoe',
        'https://linkedin.com/in/janedoe',
      ])
    })

    it('should trim sameAs links', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        sameAs: ['  https://github.com/janedoe  ', '  https://twitter.com/janedoe  '],
      })

      expect(result).not.toBeNull()
      expect(result!.other!.sameAs).toEqual([
        'https://github.com/janedoe',
        'https://twitter.com/janedoe',
      ])
    })

    it('should filter out empty sameAs links', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        sameAs: ['https://github.com/janedoe', '', 'https://twitter.com/janedoe'],
      })

      expect(result).not.toBeNull()
      expect(result!.other!.sameAs).toEqual([
        'https://github.com/janedoe',
        'https://twitter.com/janedoe',
      ])
    })

    it('should filter out whitespace-only sameAs links', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        sameAs: ['https://github.com/janedoe', '   ', 'https://twitter.com/janedoe'],
      })

      expect(result).not.toBeNull()
      expect(result!.other!.sameAs).toEqual([
        'https://github.com/janedoe',
        'https://twitter.com/janedoe',
      ])
    })

    it('should omit sameAs when not provided', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.other).toBeDefined()
      expect(result!.other!.sameAs).toBeUndefined()
    })

    it('should omit sameAs when empty array', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        sameAs: [],
      })

      expect(result).not.toBeNull()
      expect(result!.other).toBeDefined()
      expect(result!.other!.sameAs).toBeUndefined()
    })

    it('should omit sameAs when all links are invalid', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
        sameAs: ['', '   '],
      })

      expect(result).not.toBeNull()
      expect(result!.other).toBeDefined()
      expect(result!.other!.sameAs).toBeUndefined()
    })
  })

  describe('person schema', () => {
    it('should include person schema in other metadata', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer',
        url: 'https://janedoe.com',
      })

      expect(result).not.toBeNull()
      expect(result!.other).toBeDefined()
      expect(result!.other!['schema:person']).toBeDefined()

      const schema = JSON.parse(result!.other!['schema:person']!)
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Person')
      expect(schema.name).toBe('Jane Doe')
      expect(schema.url).toBe('https://janedoe.com')
    })

    it('should include trimmed values in person schema', () => {
      const result = generatePortfolioMetadata({
        name: '  Jane Doe  ',
        description: '  Software engineer  ',
        url: '  https://janedoe.com  ',
      })

      expect(result).not.toBeNull()
      const schema = JSON.parse(result!.other!['schema:person']!)
      expect(schema.name).toBe('Jane Doe')
      expect(schema.url).toBe('https://janedoe.com')
    })
  })

  describe('complete metadata structure', () => {
    it('should return complete metadata with all fields', () => {
      const result = generatePortfolioMetadata({
        name: 'Jane Doe',
        description: 'Software engineer specializing in React',
        url: 'https://janedoe.com',
        image: 'https://janedoe.com/avatar.jpg',
        sameAs: [
          'https://github.com/janedoe',
          'https://twitter.com/janedoe',
          'https://linkedin.com/in/janedoe',
        ],
      })

      expect(result).not.toBeNull()
      expect(result!.title).toBe('Jane Doe')
      expect(result!.description).toBe('Software engineer specializing in React')

      expect(result!.openGraph).toEqual({
        title: 'Jane Doe',
        description: 'Software engineer specializing in React',
        url: 'https://janedoe.com',
        type: 'website',
        images: [{ url: 'https://janedoe.com/avatar.jpg' }],
      })

      expect(result!.other!.sameAs).toEqual([
        'https://github.com/janedoe',
        'https://twitter.com/janedoe',
        'https://linkedin.com/in/janedoe',
      ])

      const schema = JSON.parse(result!.other!['schema:person']!)
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Person')
      expect(schema.name).toBe('Jane Doe')
      expect(schema.url).toBe('https://janedoe.com')
    })
  })

  describe('console warnings', () => {
    it('should log warning for missing name', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generatePortfolioMetadata({
        name: '',
        description: 'Test description',
        url: 'https://example.com',
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generatePortfolioMetadata: name is required and must be a non-empty string'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should log warning for missing description', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generatePortfolioMetadata({
        name: 'Test Name',
        description: '',
        url: 'https://example.com',
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generatePortfolioMetadata: description is required and must be a non-empty string'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should log warning for missing url', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generatePortfolioMetadata({
        name: 'Test Name',
        description: 'Test description',
        url: '',
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'generatePortfolioMetadata: url is required and must be a non-empty string'
      )

      consoleWarnSpy.mockRestore()
    })

    it('should log all warnings when all required fields are missing', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generatePortfolioMetadata({
        name: '',
        description: '',
        url: '',
      })

      expect(consoleWarnSpy).toHaveBeenCalledTimes(3)

      consoleWarnSpy.mockRestore()
    })

    it('should not log warnings when all fields are valid', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      generatePortfolioMetadata({
        name: 'Test Name',
        description: 'Test description',
        url: 'https://example.com',
      })

      expect(consoleWarnSpy).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Next.js metadata compatibility', () => {
    it('should produce metadata compatible with Next.js', () => {
      const result = generatePortfolioMetadata({
        name: 'Next.js Developer',
        description: 'Full-stack developer',
        url: 'https://nextjsdev.com',
        image: 'https://nextjsdev.com/og.jpg',
        sameAs: ['https://github.com/nextjsdev'],
      })

      expect(result).not.toBeNull()
      expect(result!.title).toBeDefined()
      expect(result!.description).toBeDefined()
      expect(result!.openGraph).toBeDefined()
      expect(result!.openGraph!.title).toBe('Next.js Developer')
      expect(result!.openGraph!.description).toBe('Full-stack developer')
      expect(result!.openGraph!.url).toBe('https://nextjsdev.com')
      expect(result!.openGraph!.type).toBe('website')
      expect(result!.openGraph!.images).toEqual([{ url: 'https://nextjsdev.com/og.jpg' }])
    })

    it('should produce JSON-serializable person schema', () => {
      const result = generatePortfolioMetadata({
        name: 'Next.js Developer',
        description: 'Full-stack developer',
        url: 'https://nextjsdev.com',
      })

      expect(result).not.toBeNull()

      const schema = JSON.parse(result!.other!['schema:person']!)
      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Person')
      expect(schema.name).toBe('Next.js Developer')
      expect(schema.url).toBe('https://nextjsdev.com')
    })
  })
})
