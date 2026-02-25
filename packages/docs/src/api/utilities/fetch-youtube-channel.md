# fetchYouTubeChannel

Fetch channel data from YouTube API.

## Signature

```tsx
function fetchYouTubeChannel(channelId: string): Promise<YouTubeChannelData | null>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| channelId | `string` | YouTube channel ID |

## Returns

`Promise<YouTubeChannelData | null>` - Channel data or `null` on error

## Types

```tsx
interface YouTubeChannelData {
  subscriberCount: number
  viewCount: number
  latestVideoTitle: string | null
  latestVideoUrl: string | null
  latestVideoPublishedAt: string | null
}
```

## Behavior

- Uses `force-cache` for build-time caching
- Returns `null` on any error (network, auth, not found)
- Logs warning if `YOUTUBE_TOKEN` is not set
- Fetches latest video from uploads playlist

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_TOKEN` | Yes | YouTube Data API v3 key |

### Getting an API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials → API key
5. Set `YOUTUBE_TOKEN` environment variable

### Rate Limits

- 10,000 quota units per day
- Channel fetch uses ~1 unit
- Video fetch uses ~1 unit

## Example

```tsx
import { fetchYouTubeChannel } from '@reallukemanning/folio'

const data = await fetchYouTubeChannel('UC_x5XG1OV2P6uZZ5FSM9Ttw')

if (data) {
  console.log(data.subscriberCount)     // 1000000+
  console.log(data.viewCount)            // 50000000+
  console.log(data.latestVideoTitle)      // 'Latest Video'
  console.log(data.latestVideoUrl)        // 'https://www.youtube.com/watch?v=...'
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchYouTubeChannel('invalid_id')
// data is null

const data = await fetchYouTubeChannel('UC_nonexistent')
// data is null (404)
```

## Usage in normalise

This function is called internally by `normalise` for `youtube` project types:

```tsx
const project = await normalise({
  id: 'my-channel',
  type: 'youtube',
  channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
  status: 'active'
})
```
