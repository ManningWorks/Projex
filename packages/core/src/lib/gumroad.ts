export interface GumroadProductData {
  formattedRevenue: string
  salesCount: number
  subscriberCount: number
}

export async function fetchGumroadProduct(productId: string): Promise<GumroadProductData | null> {
  try {
    const token = process.env.GUMROAD_TOKEN
    if (!token) {
      console.warn('GUMROAD_TOKEN not set - Gumroad API requires authentication. Create an access token at https://app.gumroad.com/settings/api_tokens')
      return null
    }

    const url = `https://api.gumroad.com/v2/products/${productId}`

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(url, {
      headers,
      cache: 'force-cache',
    })

    if (response.status === 404) {
      console.warn(`Gumroad product not found: ${productId}`)
      return null
    }

    if (response.status === 401) {
      console.warn('Gumroad API authentication failed - invalid or expired token')
      return null
    }

    if (response.status === 403) {
      console.warn('Gumroad API forbidden - insufficient permissions')
      return null
    }

    if (response.status === 429) {
      console.warn('Gumroad API rate limit exceeded')
      return null
    }

    if (!response.ok) {
      console.warn(`Gumroad API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    if (!data.product) {
      console.warn(`No product data found for product ID: ${productId}`)
      return null
    }

    const product = data.product
    const formattedRevenue = product.formatted_revenue || '$0'
    const salesCount = product.sales_count || 0
    const subscriberCount = product.subscriber_count || 0

    return {
      formattedRevenue,
      salesCount,
      subscriberCount,
    }
  } catch {
    console.warn('Network error while fetching Gumroad product data')
    return null
  }
}
