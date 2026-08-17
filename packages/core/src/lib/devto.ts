export interface DevToArticleData {
  id: number
  title: string
  page_views_count?: number
  positive_reactions_count?: number
  public_reactions_count?: number
}

/** Shape of GET /api/analytics/totals — only the fields we read. */
interface DevToAnalyticsData {
  page_views?: {
    total?: number
  }
}

export interface DevToUserData {
  articleCount: number
  totalViews: number
  totalReactions: number
}

/**
 * Fetch aggregate stats for a dev.to user via a two-call strategy:
 *
 * 1. GET /api/articles?username=... — source of truth for article count and
 *    reactions. Note: article listings never include `page_views_count`
 *    (regardless of api-key auth), so views cannot come from here.
 * 2. GET /api/analytics/totals (api-key required) — lifetime page-view total
 *    across all articles. Falls back to the (always-0) article-list sum when
 *    the key is missing or the analytics call fails.
 */
export async function fetchDevToUser(username: string): Promise<DevToUserData | null> {
  try {
    const url = `https://dev.to/api/articles?username=${username}&per_page=1000&state=published`

    const headers: HeadersInit = {}

    const apiKey = process.env.DEV_TO_API_KEY
    if (apiKey) {
      headers['api-key'] = apiKey
    } else {
      console.warn(
        'DEV_TO_API_KEY not set - page view counts will not be available. Create an API key at https://dev.to/settings/extensions',
      )
    }

    const response = await fetch(url, {
      headers,
      cache: 'force-cache',
    })

    if (response.status === 404) {
      console.warn(`Dev.to user '${username}' not found.`)
      return null
    }

    if (response.status === 429) {
      console.warn('Dev.to API rate limit exceeded.')
      return null
    }

    if (!response.ok) {
      console.warn(`Dev.to API returned error status: ${response.status}`)
      return null
    }

    const data: DevToArticleData[] = await response.json()

    if (!Array.isArray(data)) {
      console.warn('Dev.to API returned unexpected data format.')
      return null
    }

    const articleCount = data.length
    // Fallback only: listings omit page_views_count, so this sums to 0 in practice.
    const articleListViews = data.reduce((sum, article) => sum + (article.page_views_count ?? 0), 0)
    const totalReactions = data.reduce((sum, article) => sum + (article.public_reactions_count ?? article.positive_reactions_count ?? 0), 0)

    // Real view totals come from the analytics endpoint when authenticated;
    // article-list sum is the unauthenticated fallback (always 0 in practice
    // because listings omit page_views_count).
    const analyticsViews = apiKey ? await fetchDevToAnalyticsTotalViews(apiKey) : null
    const totalViews = analyticsViews ?? articleListViews

    return {
      articleCount,
      totalViews,
      totalReactions,
    }
  } catch {
    console.warn('Network error while fetching Dev.to user data.')
    return null
  }
}

/**
 * Fetch the lifetime page-view total from /api/analytics/totals.
 * Returns null on any failure (401, network error, unexpected shape) so the
 * caller can fall back to the article-list summation without failing the build.
 */
async function fetchDevToAnalyticsTotalViews(apiKey: string): Promise<number | null> {
  try {
    const response = await fetch('https://dev.to/api/analytics/totals', {
      headers: { 'api-key': apiKey },
      // Analytics totals should stay fresh, unlike the build-pinned article list.
      cache: 'no-store',
    })

    if (!response.ok) {
      console.warn(`Dev.to analytics API returned error status: ${response.status}`)
      return null
    }

    const data: DevToAnalyticsData = await response.json()
    const total = data.page_views?.total

    return typeof total === 'number' ? total : null
  } catch {
    console.warn('Network error while fetching Dev.to analytics data.')
    return null
  }
}
