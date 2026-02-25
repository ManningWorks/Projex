export interface YouTubeChannelData {
  subscriberCount: number
  viewCount: number
  latestVideoTitle: string | null
  latestVideoUrl: string | null
  latestVideoPublishedAt: string | null
}

export async function fetchYouTubeChannel(channelId: string): Promise<YouTubeChannelData | null> {
  try {
    const token = process.env.YOUTUBE_TOKEN
    if (!token) {
      console.warn('YOUTUBE_TOKEN not set - YouTube API requires an API key. Create one at https://console.cloud.google.com/apis/credentials')
      return null
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails&id=${channelId}&key=${token}`

    const response = await fetch(url, {
      cache: 'force-cache',
    })

    if (response.status === 404) {
      console.warn(`YouTube channel not found: ${channelId}`)
      return null
    }

    if (response.status === 403) {
      console.warn('YouTube API quota exceeded or invalid API key')
      return null
    }

    if (response.status === 429) {
      console.warn('YouTube API rate limit exceeded')
      return null
    }

    if (!response.ok) {
      console.warn(`YouTube API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.warn(`YouTube channel not found: ${channelId}`)
      return null
    }

    const channel = data.items[0]
    const stats = channel.statistics

    if (!stats) {
      console.warn(`No statistics found for channel: ${channelId}`)
      return null
    }

    let latestVideoTitle: string | null = null
    let latestVideoUrl: string | null = null
    let latestVideoPublishedAt: string | null = null

    if (channel.contentDetails?.relatedPlaylists?.uploads) {
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads
      const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${uploadsPlaylistId}&key=${token}`

      const videosResponse = await fetch(videosUrl, {
        cache: 'force-cache',
      })

      if (videosResponse.ok) {
        const videosData = await videosResponse.json()
        if (videosData.items && videosData.items.length > 0) {
          const latestVideo = videosData.items[0]
          const videoId = latestVideo.snippet?.resourceId?.videoId

          if (videoId) {
            latestVideoTitle = latestVideo.snippet?.title || null
            latestVideoUrl = `https://www.youtube.com/watch?v=${videoId}`
            latestVideoPublishedAt = latestVideo.snippet?.publishedAt || null
          }
        }
      }
    }

    return {
      subscriberCount: parseInt(stats.subscriberCount) || 0,
      viewCount: parseInt(stats.viewCount) || 0,
      latestVideoTitle,
      latestVideoUrl,
      latestVideoPublishedAt,
    }
  } catch {
    console.warn('Network error while fetching YouTube channel data')
    return null
  }
}
