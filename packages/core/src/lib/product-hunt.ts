export interface ProductHuntPostData {
  name: string
  tagline: string
  description: string
  votes_count: number
  comments_count: number
  featured_at: string | null
  website: string
  url: string
}

export async function fetchProductHuntPost(slug: string): Promise<ProductHuntPostData | null> {
  try {
    const url = `https://api.producthunt.com/v2/posts/${slug}`

    const token = process.env.PRODUCT_HUNT_TOKEN
    if (!token) {
      console.warn('PRODUCT_HUNT_TOKEN not set - cannot fetch Product Hunt data')
      return null
    }

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }

    const response = await fetch(url, {
      headers,
      cache: 'force-cache',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    const post = data.post

    if (!post) {
      return null
    }

    return {
      name: post.name,
      tagline: post.tagline,
      description: post.description || '',
      votes_count: post.votes_count || 0,
      comments_count: post.comments_count || 0,
      featured_at: post.featured_at || null,
      website: post.website || '',
      url: post.url || '',
    }
  } catch {
    return null
  }
}
