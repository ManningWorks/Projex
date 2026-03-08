import { describe, it, expect } from 'vitest'
import { projexProjectInputSchema as schema } from '../config-schema'
import { formatZodError } from '../format-error'

describe('config-schema', () => {
  describe('valid configs for all 5 project types', () => {
    it('should validate a valid GitHub project', () => {
      const result = schema.safeParse({
        id: 'github-project',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const data = result.data as { type: string; repo?: string; package?: string; slug?: string }
        expect(data.type).toBe('github')
        expect(data.repo).toBe('user/repo')
      }
    })

    it('should validate a valid manual project', () => {
      const result = schema.safeParse({
        id: 'manual-project',
        type: 'manual',
        status: 'shipped',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('manual')
      }
    })

    it('should validate a valid npm project', () => {
      const result = schema.safeParse({
        id: 'npm-project',
        type: 'npm',
        package: 'my-package',
        status: 'in-progress',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const data = result.data as { type: string; package?: string }
        expect(data.type).toBe('npm')
        expect(data.package).toBe('my-package')
      }
    })

    it('should validate a valid product-hunt project', () => {
      const result = schema.safeParse({
        id: 'ph-project',
        type: 'product-hunt',
        slug: 'my-product',
        status: 'coming-soon',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const data = result.data as { type: string; slug?: string }
        expect(data.type).toBe('product-hunt')
        expect(data.slug).toBe('my-product')
      }
    })

    it('should validate a valid hybrid project', () => {
      const result = schema.safeParse({
        id: 'hybrid-project',
        type: 'hybrid',
        repo: 'user/repo',
        package: 'my-package',
        status: 'archived',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        const data = result.data as { type: string; repo: string; package: string }
        expect(data.type).toBe('hybrid')
        expect(data.repo).toBe('user/repo')
        expect(data.package).toBe('my-package')
      }
    })

    it('should validate a project with all optional fields', () => {
      const result = schema.safeParse({
        id: 'full-project',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        featured: true,
        name: 'Full Project',
        tagline: 'A tagline',
        description: 'A description',
        background: 'Background info',
        why: 'Why I built this',
        image: 'https://example.com/image.png',
        struggles: [
          { type: 'warn', text: 'Warning text' },
          { type: 'error', text: 'Error text' },
        ],
        timeline: [{ date: '2024-01-01', note: 'Started' }],
        posts: [{ title: 'Post', date: '2024-01-01', url: 'https://example.com/post' }],
        stack: ['React', 'TypeScript'],
        links: {
          github: 'https://github.com/user/repo',
          live: 'https://example.com',
          npm: 'https://npmjs.com/package',
          docs: 'https://docs.example.com',
          demo: 'https://demo.example.com',
          appStore: 'https://apps.apple.com/app',
          playStore: 'https://play.google.com/store/apps',
          productHunt: 'https://producthunt.com/posts/product',
          custom: [
            { label: 'Custom Link', url: 'https://custom.example.com' },
          ],
        },
        stats: {
          stars: 100,
          forks: 50,
          downloads: '10000',
          version: '1.0.0',
          upvotes: 500,
          comments: 50,
          launchDate: '2024-01-01',
        },
        createdAt: '2024-01-01',
        updatedAt: '2024-06-01',
        linkOrder: ['github', 'live', 'custom'],
        commits: 10,
        override: {
          name: 'Override Name',
          tagline: 'Override Tagline',
          description: 'Override Description',
          stack: ['Next.js'],
        },
      })

      expect(result.success).toBe(true)
    })
  })

  describe('missing required fields for each type', () => {
    it('should fail when id is missing', () => {
      const result = schema.safeParse({
        type: 'github',
        repo: 'user/repo',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('id')
      }
    })

    it('should fail when status is missing', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('status')
      }
    })

    it('should fail when type is missing', () => {
      const result = schema.safeParse({
        id: 'test',
        repo: 'user/repo',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('type')
      }
    })

    it('should fail when repo is missing for github type', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('repo')
      }
    })

    it('should fail when package is missing for npm type', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'npm',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('package')
      }
    })

    it('should fail when slug is missing for product-hunt type', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'product-hunt',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('slug')
      }
    })

    it('should fail when repo is missing for hybrid type', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'hybrid',
        package: 'my-package',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('repo')
      }
    })

    it('should fail when package is missing for hybrid type', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'hybrid',
        repo: 'user/repo',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('package')
      }
    })
  })

  describe('invalid enum values', () => {
    it('should fail for invalid status value', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'manual',
        status: 'invalid-status',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('active')
        expect(error).toContain('shipped')
        expect(error).toContain('in-progress')
        expect(error).toContain('coming-soon')
        expect(error).toContain('archived')
        expect(error).toContain('for-sale')
      }
    })

    it('should fail for invalid struggle type', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'manual',
        status: 'active',
        struggles: [{ type: 'invalid-type', text: 'Some text' }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('struggles')
        expect(error).toContain('warn')
        expect(error).toContain('error')
      }
    })

    it('should fail for invalid type value', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'invalid-type',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('github')
        expect(error).toContain('manual')
        expect(error).toContain('npm')
        expect(error).toContain('product-hunt')
        expect(error).toContain('hybrid')
      }
    })
  })

  describe('invalid URL format', () => {
    it('should fail for invalid URL in links.live', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'manual',
        status: 'active',
        links: {
          live: 'not-a-url',
        },
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('live')
        expect(error).toContain('URL')
      }
    })

    it('should fail for invalid URL in links.github', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'manual',
        status: 'active',
        links: {
          github: 'invalid',
        },
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('github')
      }
    })

    it('should fail for invalid URL in custom link', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'manual',
        status: 'active',
        links: {
          custom: [{ label: 'Link', url: 'not-url' }],
        },
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('custom')
      }
    })

    it('should fail for invalid URL in posts.url', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'manual',
        status: 'active',
        posts: [{ title: 'Post', date: '2024-01-01', url: 'bad-url' }],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('posts')
      }
    })
  })

  describe('multiple errors aggregation', () => {
    it('should report multiple errors at once', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
        status: 'bad-status',
        links: {
          live: 'not-a-url',
        },
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
        expect(error).toContain('status')
        expect(error).toContain('live')
      }
    })

    it('should report missing required fields', () => {
      const result = schema.safeParse({
        type: 'manual',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(result.error.issues.length).toBeGreaterThanOrEqual(1)
        expect(error).toContain('id')
      }
    })
  })

  describe('error formatter produces correct output', () => {
    it('should produce formatted error with path and message', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        status: 'active',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('✖ Validation failed')
        expect(error).toContain('repo')
        expect(error).toContain('Required')
        expect(error).toContain('Tip:')
      }
    })

    it('should indicate number of issues', () => {
      const result = schema.safeParse({
        type: 'invalid',
        status: 'bad',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('issue')
        expect(error).toContain('found:')
      }
    })

    it('should include docs link for type and enum errors', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
        status: 'invalid-status',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('https://folio.dev/docs/config')
      }
    })
  })

  describe('type-specific validations', () => {
    it('should validate commits is a number for github', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        commits: 'not-a-number',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('commits')
      }
    })

    it('should validate stats fields are correct types', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        stats: {
          stars: 'not-a-number',
        },
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('stars')
      }
    })

    it('should validate stack is an array of strings', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        stack: ['React', 123],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('stack')
      }
    })

    it('should validate linkOrder is an array of strings', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        linkOrder: ['github', 123],
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('linkOrder')
      }
    })

    it('should validate custom links have required fields', () => {
      const result = schema.safeParse({
        id: 'test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        links: {
          custom: [{ url: 'https://example.com' }],
        },
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const error = formatZodError(result.error)
        expect(error).toContain('custom')
        expect(error).toContain('label')
      }
    })
  })
})
