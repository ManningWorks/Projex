import { describe, it, expect } from 'vitest'
import { normalise } from '../normalise'
import type { ProductHuntProjectInput } from '../../types'

describe('product-hunt config recognition', () => {
  it('should recognize a Product Hunt project when type is "product-hunt"', async () => {
    const input: ProductHuntProjectInput = {
      id: 'test-ph',
      type: 'product-hunt',
      slug: 'test-product',
      status: 'active',
      name: 'Test Product',
      tagline: 'A test product',
      description: 'This is a test description',
    }

    const result = await normalise(input)

    expect(result.type).toBe('product-hunt')
    expect(result.id).toBe('test-ph')
    expect(result.slug).toBe('test-product')
  })

  it('should match the slug property to the Product Hunt post slug', async () => {
    const input: ProductHuntProjectInput = {
      id: 'test-ph',
      type: 'product-hunt',
      slug: 'my-awesome-product',
      status: 'active',
      name: 'My Awesome Product',
    }

    const result = await normalise(input)

    expect(result.slug).toBe('my-awesome-product')
  })

  it('should handle Product Hunt project with all optional fields', async () => {
    const input: ProductHuntProjectInput = {
      id: 'full-ph',
      type: 'product-hunt',
      slug: 'full-product',
      status: 'shipped',
      featured: true,
      name: 'Full Product',
      tagline: 'A complete Product Hunt product',
      description: 'Description of the product',
      background: 'Background info',
      why: 'Why I built it',
      struggles: [],
      timeline: [],
      posts: [],
      stack: ['TypeScript', 'React'],
      links: {
        productHunt: 'https://www.producthunt.com/products/full-product',
        github: 'https://github.com/user/full-product',
        live: 'https://full-product.com',
      },
      stats: {
        upvotes: 100,
        comments: 25,
        launchDate: '2024-01-15',
      },
    }

    const result = await normalise(input)

    expect(result.type).toBe('product-hunt')
    expect(result.slug).toBe('full-product')
    expect(result.name).toBe('Full Product')
    expect(result.tagline).toBe('A complete Product Hunt product')
    expect(result.description).toBe('Description of the product')
    expect(result.background).toBe('Background info')
    expect(result.why).toBe('Why I built it')
    expect(result.stack).toEqual(['TypeScript', 'React'])
    expect(result.links).toEqual({
      productHunt: 'https://www.producthunt.com/products/full-product',
      github: 'https://github.com/user/full-product',
      live: 'https://full-product.com',
    })
    expect(result.stats).toEqual({
      upvotes: 100,
      comments: 25,
      launchDate: '2024-01-15',
    })
  })

  it('should handle Product Hunt project with minimal config', async () => {
    const input: ProductHuntProjectInput = {
      id: 'minimal-ph',
      type: 'product-hunt',
      slug: 'minimal-product',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.type).toBe('product-hunt')
    expect(result.slug).toBe('minimal-product')
    expect(result.name).toBe('')
    expect(result.tagline).toBe('')
    expect(result.description).toBe('')
  })
})
