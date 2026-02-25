import { describe, it, expect, afterEach, vi } from 'vitest'
import { generatePersonSchema, type PersonSchema } from '../person'
import { cleanup } from '@testing-library/react'

describe('generatePersonSchema', () => {
  afterEach(() => {
    cleanup()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('valid inputs', () => {
    it('should return valid Person schema with all fields', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        url: 'https://johndoe.com',
        jobTitle: 'Software Engineer',
        image: 'https://johndoe.com/avatar.jpg',
        sameAs: ['https://github.com/johndoe', 'https://linkedin.com/in/johndoe'],
      })

      expect(result).not.toBeNull()
      expect(result).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'John Doe',
        url: 'https://johndoe.com',
        jobTitle: 'Software Engineer',
        image: 'https://johndoe.com/avatar.jpg',
        sameAs: ['https://github.com/johndoe', 'https://linkedin.com/in/johndoe'],
      })
    })

    it('should return valid Person schema with required fields only', () => {
      const result = generatePersonSchema({
        name: 'Jane Smith',
        url: 'https://janesmith.com',
      })

      expect(result).not.toBeNull()
      expect(result).toEqual({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Jane Smith',
        url: 'https://janesmith.com',
      })
    })

    it('should include sameAs array with GitHub and LinkedIn URLs', () => {
      const result = generatePersonSchema({
        name: 'Developer',
        url: 'https://developer.io',
        sameAs: [
          'https://github.com/developer',
          'https://linkedin.com/in/developer',
          'https://twitter.com/developer',
        ],
      })

      expect(result).not.toBeNull()
      expect(result?.sameAs).toEqual([
        'https://github.com/developer',
        'https://linkedin.com/in/developer',
        'https://twitter.com/developer',
      ])
    })

    it('should include jobTitle when provided', () => {
      const result = generatePersonSchema({
        name: 'Alice Johnson',
        url: 'https://alicejohnson.dev',
        jobTitle: 'Senior Developer',
      })

      expect(result).not.toBeNull()
      expect(result?.jobTitle).toBe('Senior Developer')
    })

    it('should include image when provided', () => {
      const result = generatePersonSchema({
        name: 'Bob Wilson',
        url: 'https://bobwilson.io',
        image: 'https://bobwilson.io/profile.png',
      })

      expect(result).not.toBeNull()
      expect(result?.image).toBe('https://bobwilson.io/profile.png')
    })

    it('should conform to schema.org Person specification', () => {
      const result = generatePersonSchema({
        name: 'Test Person',
        url: 'https://testperson.com',
        jobTitle: 'Developer',
        image: 'https://testperson.com/img.jpg',
        sameAs: ['https://github.com/testperson'],
      })

      expect(result).not.toBeNull()

      const schema = result as PersonSchema

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Person')
      expect(schema.name).toBe('Test Person')
      expect(schema.url).toBe('https://testperson.com')
    })
  })

  describe('optional fields', () => {
    it('should generate valid schema without jobTitle', () => {
      const result = generatePersonSchema({
        name: 'No Title Person',
        url: 'https://notitle.com',
        image: 'https://notitle.com/img.jpg',
        sameAs: ['https://github.com/notitle'],
      })

      expect(result).not.toBeNull()
      expect(result?.jobTitle).toBeUndefined()
      expect(result?.image).toBe('https://notitle.com/img.jpg')
      expect(result?.sameAs).toEqual(['https://github.com/notitle'])
    })

    it('should generate valid schema without image', () => {
      const result = generatePersonSchema({
        name: 'No Image Person',
        url: 'https://noimage.com',
        jobTitle: 'Developer',
        sameAs: ['https://linkedin.com/in/noimage'],
      })

      expect(result).not.toBeNull()
      expect(result?.image).toBeUndefined()
      expect(result?.jobTitle).toBe('Developer')
      expect(result?.sameAs).toEqual(['https://linkedin.com/in/noimage'])
    })

    it('should generate valid schema without sameAs', () => {
      const result = generatePersonSchema({
        name: 'No Links Person',
        url: 'https://nolinks.com',
        jobTitle: 'Engineer',
        image: 'https://nolinks.com/avatar.jpg',
      })

      expect(result).not.toBeNull()
      expect(result?.sameAs).toBeUndefined()
      expect(result?.jobTitle).toBe('Engineer')
      expect(result?.image).toBe('https://nolinks.com/avatar.jpg')
    })

    it('should generate valid schema without optional fields', () => {
      const result = generatePersonSchema({
        name: 'Minimal Person',
        url: 'https://minimal.com',
      })

      expect(result).not.toBeNull()
      expect(result?.jobTitle).toBeUndefined()
      expect(result?.image).toBeUndefined()
      expect(result?.sameAs).toBeUndefined()
    })
  })

  describe('invalid required fields', () => {
    it('should return null and warn when name is missing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generatePersonSchema({
        name: '',
        url: 'https://test.com',
      })

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generatePersonSchema: name is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when name is whitespace only', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generatePersonSchema({
        name: '   ',
        url: 'https://test.com',
      })

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generatePersonSchema: name is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when name is undefined', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generatePersonSchema({
        name: undefined as any,
        url: 'https://test.com',
      })

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generatePersonSchema: name is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when url is missing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generatePersonSchema({
        name: 'Test Person',
        url: '',
      })

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generatePersonSchema: url is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when url is whitespace only', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generatePersonSchema({
        name: 'Test Person',
        url: '  ',
      })

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith(
        'generatePersonSchema: url is required and must be a non-empty string'
      )

      warnSpy.mockRestore()
    })

    it('should return null and warn when both name and url are missing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = generatePersonSchema({
        name: '',
        url: '',
      })

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledTimes(2)

      warnSpy.mockRestore()
    })
  })

  describe('url validation', () => {
    it('should include URL as-is without validation', () => {
      const result = generatePersonSchema({
        name: 'Invalid URL Person',
        url: 'not-a-valid-url',
      })

      expect(result).not.toBeNull()
      expect(result?.url).toBe('not-a-valid-url')
    })

    it('should include URL with special characters', () => {
      const result = generatePersonSchema({
        name: 'Special URL Person',
        url: 'https://example.com/path?query=value&other=test#fragment',
      })

      expect(result).not.toBeNull()
      expect(result?.url).toBe('https://example.com/path?query=value&other=test#fragment')
    })
  })

  describe('sameAs array handling', () => {
    it('should filter empty strings from sameAs array', () => {
      const result = generatePersonSchema({
        name: 'Mixed Links Person',
        url: 'https://mixed.com',
        sameAs: ['https://github.com/mixed', '', 'https://linkedin.com/in/mixed', '  '],
      })

      expect(result).not.toBeNull()
      expect(result?.sameAs).toEqual([
        'https://github.com/mixed',
        'https://linkedin.com/in/mixed',
      ])
    })

    it('should handle sameAs with only invalid entries', () => {
      const result = generatePersonSchema({
        name: 'Invalid Links Person',
        url: 'https://invalid.com',
        sameAs: ['', '  ', null as any, undefined as any],
      })

      expect(result).not.toBeNull()
      expect(result?.sameAs).toBeUndefined()
    })

    it('should include sameAs when array has valid entries', () => {
      const result = generatePersonSchema({
        name: 'Valid Links Person',
        url: 'https://valid.com',
        sameAs: ['https://github.com/valid', 'https://twitter.com/valid'],
      })

      expect(result).not.toBeNull()
      expect(result?.sameAs).toEqual([
        'https://github.com/valid',
        'https://twitter.com/valid',
      ])
    })
  })

  describe('trimming whitespace', () => {
    it('should trim whitespace from name', () => {
      const result = generatePersonSchema({
        name: '  John Doe  ',
        url: 'https://johndoe.com',
      })

      expect(result).not.toBeNull()
      expect(result?.name).toBe('John Doe')
    })

    it('should trim whitespace from url', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        url: '  https://johndoe.com  ',
      })

      expect(result).not.toBeNull()
      expect(result?.url).toBe('https://johndoe.com')
    })

    it('should trim whitespace from jobTitle', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        url: 'https://johndoe.com',
        jobTitle: '  Software Engineer  ',
      })

      expect(result).not.toBeNull()
      expect(result?.jobTitle).toBe('Software Engineer')
    })

    it('should trim whitespace from image', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        url: 'https://johndoe.com',
        image: '  https://johndoe.com/avatar.jpg  ',
      })

      expect(result).not.toBeNull()
      expect(result?.image).toBe('https://johndoe.com/avatar.jpg')
    })

    it('should trim whitespace from sameAs entries', () => {
      const result = generatePersonSchema({
        name: 'John Doe',
        url: 'https://johndoe.com',
        sameAs: ['  https://github.com/johndoe  ', '  https://linkedin.com/in/johndoe  '],
      })

      expect(result).not.toBeNull()
      expect(result?.sameAs).toEqual([
        'https://github.com/johndoe',
        'https://linkedin.com/in/johndoe',
      ])
    })
  })

  describe('Next.js metadata compatibility', () => {
    it('should produce schema compatible with Next.js metadata', () => {
      const result = generatePersonSchema({
        name: 'Next.js Person',
        url: 'https://nextjsperson.com',
        jobTitle: 'Developer',
        image: 'https://nextjsperson.com/avatar.jpg',
        sameAs: ['https://github.com/nextjsperson'],
      })

      expect(result).not.toBeNull()

      const jsonString = JSON.stringify(result)
      expect(jsonString).toContain('"@context":"https://schema.org"')
      expect(jsonString).toContain('"@type":"Person"')
      expect(jsonString).toContain('"name":"Next.js Person"')
      expect(jsonString).toContain('"url":"https://nextjsperson.com"')
    })
  })
})
