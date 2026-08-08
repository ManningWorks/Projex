import type { ProjectStats } from '../types'

export type StatId =
  | 'stars'
  | 'forks'
  | 'downloads'
  | 'version'
  | 'upvotes'
  | 'comments'
  | 'subscribers'
  | 'views'
  | 'latest-video'
  | 'revenue'
  | 'sales'
  | 'mrr'
  | 'orders'
  | 'customers'
  | 'articles'
  | 'total-views'
  | 'reactions'

export interface StatEntry {
  id: StatId
  value: string | number
  suffix?: string
  href?: string
  linkType?: string
}

function pushGithubFields(stats: { stars?: number; forks?: number }, out: StatEntry[]): void {
  if (stats.stars) {
    out.push({ id: 'stars', value: stats.stars, suffix: 'stars' })
  }
  if (stats.forks) {
    out.push({ id: 'forks', value: stats.forks, suffix: 'forks' })
  }
}

function pushNpmFields(stats: { downloads?: string; version?: string }, out: StatEntry[]): void {
  if (stats.downloads) {
    out.push({ id: 'downloads', value: stats.downloads, suffix: 'downloads' })
  }
  if (stats.version) {
    out.push({ id: 'version', value: stats.version })
  }
}

export function getStatEntries(stats: ProjectStats | null): StatEntry[] {
  if (!stats) {
    return []
  }

  const entries: StatEntry[] = []

  switch (stats.type) {
    case 'github':
      pushGithubFields(stats, entries)
      break
    case 'npm':
      pushNpmFields(stats, entries)
      break
    case 'hybrid':
      pushGithubFields(stats, entries)
      pushNpmFields(stats, entries)
      break
    case 'product-hunt':
      if (stats.upvotes) {
        entries.push({ id: 'upvotes', value: stats.upvotes, suffix: 'upvotes' })
      }
      if (stats.comments) {
        entries.push({ id: 'comments', value: stats.comments, suffix: 'comments' })
      }
      break
    case 'youtube':
      if (stats.subscribers) {
        entries.push({ id: 'subscribers', value: stats.subscribers, suffix: 'subscribers' })
      }
      if (stats.views) {
        entries.push({ id: 'views', value: stats.views, suffix: 'views' })
      }
      if (stats.latestVideoTitle && stats.latestVideoUrl) {
        entries.push({
          id: 'latest-video',
          value: stats.latestVideoTitle,
          href: stats.latestVideoUrl,
          linkType: 'youtube',
        })
      }
      break
    case 'gumroad':
      if (stats.formattedRevenue) {
        entries.push({ id: 'revenue', value: stats.formattedRevenue })
      }
      if (stats.salesCount) {
        entries.push({ id: 'sales', value: stats.salesCount, suffix: 'sales' })
      }
      if (stats.subscriberCount) {
        entries.push({ id: 'subscribers', value: stats.subscriberCount, suffix: 'subscribers' })
      }
      break
    case 'lemonsqueezy':
      if (stats.formattedMRR) {
        entries.push({ id: 'mrr', value: stats.formattedMRR, suffix: 'MRR' })
      }
      if (stats.orderCount) {
        entries.push({ id: 'orders', value: stats.orderCount, suffix: 'orders' })
      }
      if (stats.customerCount) {
        entries.push({ id: 'customers', value: stats.customerCount, suffix: 'customers' })
      }
      break
    case 'devto':
      if (stats.articleCount) {
        entries.push({ id: 'articles', value: stats.articleCount, suffix: 'articles' })
      }
      if (stats.totalViews) {
        entries.push({ id: 'total-views', value: stats.totalViews, suffix: 'views' })
      }
      if (stats.totalReactions) {
        entries.push({ id: 'reactions', value: stats.totalReactions, suffix: 'reactions' })
      }
      break
    case 'manual':
      break
  }

  return entries
}
