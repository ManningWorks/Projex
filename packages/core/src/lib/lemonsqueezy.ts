export interface LemonSqueezyStoreData {
  formattedMRR: string
  orderCount: number
  customerCount: number
}

export async function fetchLemonSqueezyStore(storeId: string): Promise<LemonSqueezyStoreData | null> {
  try {
    const token = process.env.LS_TOKEN
    if (!token) {
      console.warn('LS_TOKEN not set - Lemon Squeezy API requires authentication. Create an API key at https://app.lemonsqueezy.com/settings/api')
      return null
    }

    const url = `https://api.lemonsqueezy.com/v1/stores/${storeId}/metrics`

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.api+json',
    }

    const response = await fetch(url, {
      headers,
      cache: 'force-cache',
    })

    if (response.status === 404) {
      console.warn(`Lemon Squeezy store not found: ${storeId}`)
      return null
    }

    if (response.status === 401) {
      console.warn('Lemon Squeezy API authentication failed - invalid or expired token')
      return null
    }

    if (response.status === 403) {
      console.warn('Lemon Squeezy API forbidden - insufficient permissions')
      return null
    }

    if (response.status === 429) {
      console.warn('Lemon Squeezy API rate limit exceeded')
      return null
    }

    if (!response.ok) {
      console.warn(`Lemon Squeezy API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    if (!data.data || !data.data.attributes) {
      console.warn(`No store data found for store ID: ${storeId}`)
      return null
    }

    const attributes = data.data.attributes
    const formattedMRR = attributes.formatted_mrr || '$0'
    const orderCount = attributes.order_count || 0
    const customerCount = attributes.customer_count || 0

    return {
      formattedMRR,
      orderCount,
      customerCount,
    }
  } catch {
    console.warn('Network error while fetching Lemon Squeezy store data')
    return null
  }
}
