import { bench, describe, beforeAll, vi } from 'vitest'

const mockProductHuntResponse = {
  post: {
    name: 'Folio',
    tagline: 'Beautiful project showcases',
    description: 'A component library for developers and solopreneurs building project showcase pages.',
    votes_count: 456,
    comments_count: 78,
    featured_at: '2024-06-01T00:00:00Z',
    website: 'https://folio.dev',
    url: 'https://producthunt.com/posts/folio',
  },
}

describe('fetchProductHuntPost performance', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => mockProductHuntResponse,
    })))
  })

  bench('fetchProductHuntPost (authenticated)', async () => {
    const response = await fetch('https://api.producthunt.com/v2/posts/folio', {
      headers: {
        Authorization: 'Bearer test-token',
        Accept: 'application/json',
      },
      cache: 'force-cache',
    })
    const data = await response.json()
    const post = data.post

    void post.name
    void post.tagline
    void post.description
    void post.votes_count
    void post.comments_count
    void post.featured_at
    void post.website
    void post.url
  })

  bench('parse Product Hunt API response', () => {
    const data = mockProductHuntResponse
    const post = data.post

    void post.name
    void post.tagline
    void post.description
    void post.votes_count
    void post.comments_count
    void post.featured_at
    void post.website
    void post.url
  })
})
