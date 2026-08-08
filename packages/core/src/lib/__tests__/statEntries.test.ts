import { describe, it, expect } from 'vitest'
import { getStatEntries } from '../statEntries'
import type { ProjectStats } from '../../types'

describe('getStatEntries', () => {
  describe('null / empty', () => {
    it('returns [] for null', () => {
      expect(getStatEntries(null)).toEqual([])
    })

    it('returns [] for manual stats', () => {
      expect(getStatEntries({ type: 'manual' })).toEqual([])
    })

    it('returns [] for a github stats object whose values are all absent', () => {
      expect(getStatEntries({ type: 'github' })).toEqual([])
    })

    it('returns [] for a github stats object whose values are all zero', () => {
      expect(getStatEntries({ type: 'github', stars: 0, forks: 0 })).toEqual([])
    })
  })

  describe('github', () => {
    it('emits stars then forks with suffixes', () => {
      const result = getStatEntries({ type: 'github', stars: 100, forks: 20 })

      expect(result).toEqual([
        { id: 'stars', value: 100, suffix: 'stars' },
        { id: 'forks', value: 20, suffix: 'forks' },
      ])
    })

    it('preserves raw numeric value (does not format)', () => {
      const result = getStatEntries({ type: 'github', stars: 1500 })

      expect(result[0].value).toBe(1500)
    })

    it('omits a zero star count but keeps forks', () => {
      const result = getStatEntries({ type: 'github', stars: 0, forks: 5 })

      expect(result).toEqual([{ id: 'forks', value: 5, suffix: 'forks' }])
    })
  })

  describe('npm', () => {
    it('emits downloads then version (version has no suffix)', () => {
      const result = getStatEntries({ type: 'npm', downloads: '10000', version: '2.0.0' })

      expect(result).toEqual([
        { id: 'downloads', value: '10000', suffix: 'downloads' },
        { id: 'version', value: '2.0.0' },
      ])
    })

    it('keeps version without v-prefix (raw value)', () => {
      const result = getStatEntries({ type: 'npm', version: '1.2.3' })

      expect(result[0].value).toBe('1.2.3')
    })

    it('omits empty-string downloads', () => {
      const result = getStatEntries({ type: 'npm', downloads: '', version: '1.0.0' })

      expect(result).toEqual([{ id: 'version', value: '1.0.0' }])
    })
  })

  describe('hybrid', () => {
    it('emits github fields followed by npm fields', () => {
      const result = getStatEntries({
        type: 'hybrid',
        stars: 50,
        forks: 10,
        downloads: '1000',
        version: '1.0.0',
      })

      expect(result.map(e => e.id)).toEqual(['stars', 'forks', 'downloads', 'version'])
    })

    it('emits only the github half when npm fields are absent', () => {
      const result = getStatEntries({ type: 'hybrid', stars: 50, forks: 10 })

      expect(result.map(e => e.id)).toEqual(['stars', 'forks'])
    })

    it('emits only the npm half when github fields are absent', () => {
      const result = getStatEntries({ type: 'hybrid', downloads: '1000', version: '1.0.0' })

      expect(result.map(e => e.id)).toEqual(['downloads', 'version'])
    })
  })

  describe('product-hunt', () => {
    it('emits upvotes then comments', () => {
      const result = getStatEntries({ type: 'product-hunt', upvotes: 250, comments: 30 })

      expect(result).toEqual([
        { id: 'upvotes', value: 250, suffix: 'upvotes' },
        { id: 'comments', value: 30, suffix: 'comments' },
      ])
    })
  })

  describe('youtube', () => {
    it('emits subscribers, views, then a link entry for the latest video', () => {
      const result = getStatEntries({
        type: 'youtube',
        subscribers: 10000,
        views: 500000,
        latestVideoTitle: 'My Latest Video',
        latestVideoUrl: 'https://youtube.com/watch?v=abc',
      })

      expect(result).toEqual([
        { id: 'subscribers', value: 10000, suffix: 'subscribers' },
        { id: 'views', value: 500000, suffix: 'views' },
        {
          id: 'latest-video',
          value: 'My Latest Video',
          href: 'https://youtube.com/watch?v=abc',
          linkType: 'youtube',
        },
      ])
    })

    it('omits the link entry when only the title is present', () => {
      const result = getStatEntries({
        type: 'youtube',
        latestVideoTitle: 'No URL',
        latestVideoUrl: null,
      })

      expect(result).toEqual([])
    })

    it('omits the link entry when only the url is present', () => {
      const result = getStatEntries({
        type: 'youtube',
        latestVideoTitle: null,
        latestVideoUrl: 'https://youtube.com/watch?v=abc',
      })

      expect(result).toEqual([])
    })
  })

  describe('gumroad', () => {
    it('emits revenue (no suffix), sales, then subscribers', () => {
      const result = getStatEntries({
        type: 'gumroad',
        formattedRevenue: '$1,234',
        salesCount: 42,
        subscriberCount: 300,
      })

      expect(result).toEqual([
        { id: 'revenue', value: '$1,234' },
        { id: 'sales', value: 42, suffix: 'sales' },
        { id: 'subscribers', value: 300, suffix: 'subscribers' },
      ])
    })
  })

  describe('lemonsqueezy', () => {
    it('emits mrr (suffix MRR), orders, then customers', () => {
      const result = getStatEntries({
        type: 'lemonsqueezy',
        formattedMRR: '$500',
        orderCount: 7,
        customerCount: 9,
      })

      expect(result).toEqual([
        { id: 'mrr', value: '$500', suffix: 'MRR' },
        { id: 'orders', value: 7, suffix: 'orders' },
        { id: 'customers', value: 9, suffix: 'customers' },
      ])
    })
  })

  describe('devto', () => {
    it('emits articles, total-views (suffix views), then reactions', () => {
      const result = getStatEntries({
        type: 'devto',
        articleCount: 12,
        totalViews: 9999,
        totalReactions: 88,
      })

      expect(result).toEqual([
        { id: 'articles', value: 12, suffix: 'articles' },
        { id: 'total-views', value: 9999, suffix: 'views' },
        { id: 'reactions', value: 88, suffix: 'reactions' },
      ])
    })
  })

  describe('type safety (compiles only because narrowing is used internally)', () => {
    it('accepts every ProjectStats member without a cast', () => {
      const all: ProjectStats[] = [
        { type: 'github', stars: 1, forks: 2 },
        { type: 'npm', downloads: '1', version: '1.0.0' },
        { type: 'hybrid', stars: 1, downloads: '1' },
        { type: 'product-hunt', upvotes: 1, comments: 1 },
        { type: 'youtube', subscribers: 1, views: 1, latestVideoTitle: 't', latestVideoUrl: 'u' },
        { type: 'gumroad', formattedRevenue: '$1', salesCount: 1, subscriberCount: 1 },
        { type: 'lemonsqueezy', formattedMRR: '$1', orderCount: 1, customerCount: 1 },
        { type: 'devto', articleCount: 1, totalViews: 1, totalReactions: 1 },
        { type: 'manual' },
      ]

      for (const stats of all) {
        expect(getStatEntries(stats)).toBeInstanceOf(Array)
      }
    })
  })
})
