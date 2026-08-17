export interface DevToArticleData {
  id: number
  title: string
  page_views_count?: number
  positive_reactions_count?: number
  public_reactions_count?: number
}

export interface DevToArticleWithViews extends DevToArticleData {
  page_views_count: number
}

export interface DevToUserData {
  articleCount: number
  totalViews: number
  totalReactions: number
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
          const meArticles: DevToArticleWithViews[] = await meResponse.json()
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

    return {
      articleCount: data.length,
      totalViews,
      totalReactions: data.reduce(
        (sum, article) => sum + (article.public_reactions_count ?? article.positive_reactions_count ?? 0),
        0,
      ),
    }
  } catch {
    console.warn('Network error while fetching Dev.to user data.')
    return null
  }
}
