export interface DevToArticleData {
  id: number
  title: string
  page_views_count?: number
  positive_reactions_count?: number
  public_reactions_count?: number
  published_at?: string | null
  edited_at?: string | null
}

export interface DevToUserData {
  articleCount: number
  totalViews: number
  totalReactions: number
  latestArticleUpdatedAt: string | null
  earliestArticlePublishedAt: string | null
}

/**
 * Reduces a list of date strings to the latest (or earliest) one.
 * Returns null for an empty list. Comparisons are timestamp-based, so
 * unparseable strings are ignored rather than winning by accident.
 */
function pickDate(dates: string[], mode: 'latest' | 'earliest'): string | null {
  return dates.reduce<string | null>((best, current) => {
    const currentTime = Date.parse(current)
    if (Number.isNaN(currentTime)) return best
    if (best === null) return current
    const bestTime = Date.parse(best)
    const isBetter = mode === 'latest' ? currentTime > bestTime : currentTime < bestTime
    return isBetter ? current : best
  }, null)
}

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

    let totalViews = 0
    if (apiKey) {
      try {
        const meUrl = 'https://dev.to/api/articles/me/published?per_page=1000'
        const meResponse = await fetch(meUrl, {
          headers: { 'api-key': apiKey },
          cache: 'force-cache',
        })

        if (meResponse.ok) {
          const meArticles: DevToArticleData[] = await meResponse.json()
          if (Array.isArray(meArticles)) {
            totalViews = meArticles.reduce((sum, article) => sum + (article.page_views_count ?? 0), 0)
          }
        } else {
          console.warn(`Dev.to /me endpoint returned error status: ${meResponse.status}`)
        }
      } catch {
        console.warn('Network error while fetching Dev.to user view counts.')
      }
    }

    // last activity = latest edit, falling back to publish date for unedited articles
    const updatedAtCandidates = data
      .map((article) => article.edited_at || article.published_at)
      .filter((date): date is string => typeof date === 'string')
    // first post = earliest publish date
    const publishedAtCandidates = data
      .map((article) => article.published_at)
      .filter((date): date is string => typeof date === 'string')

    return {
      articleCount: data.length,
      totalViews,
      totalReactions: data.reduce(
        (sum, article) => sum + (article.public_reactions_count ?? article.positive_reactions_count ?? 0),
        0,
      ),
      latestArticleUpdatedAt: pickDate(updatedAtCandidates, 'latest'),
      earliestArticlePublishedAt: pickDate(publishedAtCandidates, 'earliest'),
    }
  } catch {
    console.warn('Network error while fetching Dev.to user data.')
    return null
  }
}
