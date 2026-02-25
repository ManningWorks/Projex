export interface DevToArticleData {
  id: number
  title: string
  page_views_count: number
  positive_reactions_count: number
}

export interface DevToUserData {
  articleCount: number
  totalViews: number
  averageReactions: number
}

export async function fetchDevToUser(username: string): Promise<DevToUserData | null> {
  try {
    const url = `https://dev.to/api/articles?username=${username}&per_page=1000`

    const response = await fetch(url, {
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
    const totalViews = data.reduce((sum, article) => sum + article.page_views_count, 0)
    const totalReactions = data.reduce((sum, article) => sum + article.positive_reactions_count, 0)
    const averageReactions = articleCount > 0 ? Math.round(totalReactions / articleCount) : 0

    return {
      articleCount,
      totalViews,
      averageReactions,
    }
  } catch {
    console.warn('Network error while fetching Dev.to user data.')
    return null
  }
}
