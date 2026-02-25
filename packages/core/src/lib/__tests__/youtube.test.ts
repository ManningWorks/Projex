import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchYouTubeChannel, YouTubeChannelData } from '../youtube'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const originalEnv = process.env

describe('fetchYouTubeChannel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.YOUTUBE_TOKEN
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('valid channel', () => {
    it('should return correct channel data for valid channel', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
            statistics: {
              subscriberCount: '1000000',
              viewCount: '50000000',
            },
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UU_x5XG1OV2P6uZZ5FSM9Ttw',
              },
            },
          },
        ],
      }

      const mockVideosData = {
        items: [
          {
            snippet: {
              title: 'Test Video Title',
              resourceId: {
                videoId: 'abc123xyz',
              },
              publishedAt: '2024-01-01T00:00:00Z',
            },
          },
        ],
      }

      process.env.YOUTUBE_TOKEN = 'test_token_12345'

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockChannelData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockVideosData),
        })

      const result = await fetchYouTubeChannel('UC_x5XG1OV2P6uZZ5FSM9Ttw')

      expect(result).toEqual({
        subscriberCount: 1000000,
        viewCount: 50000000,
        latestVideoTitle: 'Test Video Title',
        latestVideoUrl: 'https://www.youtube.com/watch?v=abc123xyz',
        latestVideoPublishedAt: '2024-01-01T00:00:00Z',
      })
    })

    it('should handle channel without videos', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_test_channel',
            statistics: {
              subscriberCount: '1000',
              viewCount: '50000',
            },
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UU_test_channel',
              },
            },
          },
        ],
      }

      const mockVideosData = {
        items: [],
      }

      process.env.YOUTUBE_TOKEN = 'test_token_12345'

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockChannelData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockVideosData),
        })

      const result = await fetchYouTubeChannel('UC_test_channel')

      expect(result).toEqual({
        subscriberCount: 1000,
        viewCount: 50000,
        latestVideoTitle: null,
        latestVideoUrl: null,
        latestVideoPublishedAt: null,
      })
    })
  })

  describe('no API key', () => {
    it('should return null when YOUTUBE_TOKEN is not set', async () => {
      delete process.env.YOUTUBE_TOKEN

      const result = await fetchYouTubeChannel('UC_test_channel')

      expect(result).toBeNull()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should warn when YOUTUBE_TOKEN is not set', async () => {
      delete process.env.YOUTUBE_TOKEN

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchYouTubeChannel('UC_test_channel')

      expect(warnSpy).toHaveBeenCalledWith(
        'YOUTUBE_TOKEN not set - YouTube API requires an API key. Create one at https://console.cloud.google.com/apis/credentials'
      )

      warnSpy.mockRestore()
    })
  })

  describe('invalid channel', () => {
    beforeEach(() => {
      process.env.YOUTUBE_TOKEN = 'test_token_12345'
    })

    it('should return null for 404 not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_nonexistent')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('YouTube channel not found: UC_nonexistent')

      warnSpy.mockRestore()
    })

    it('should return null for 403 forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_forbidden')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('YouTube API quota exceeded or invalid API key')

      warnSpy.mockRestore()
    })

    it('should return null for 429 rate limit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_ratelimited')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('YouTube API rate limit exceeded')

      warnSpy.mockRestore()
    })

    it('should return null for other non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_servererror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('YouTube API error: 500 Internal Server Error')

      warnSpy.mockRestore()
    })

    it('should return null for empty items array', async () => {
      const mockChannelData = {
        items: [],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChannelData),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_empty')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('YouTube channel not found: UC_empty')

      warnSpy.mockRestore()
    })

    it('should return null for missing statistics', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_no_stats',
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UU_no_stats',
              },
            },
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChannelData),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_no_stats')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('No statistics found for channel: UC_no_stats')

      warnSpy.mockRestore()
    })
  })

  describe('network error', () => {
    beforeEach(() => {
      process.env.YOUTUBE_TOKEN = 'test_token_12345'
    })

    it('should return null for network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_networkerror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching YouTube channel data')

      warnSpy.mockRestore()
    })

    it('should return null for timeout error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_timeout')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching YouTube channel data')

      warnSpy.mockRestore()
    })

    it('should return null for DNS resolution failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ENOTFOUND'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchYouTubeChannel('UC_dnserror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching YouTube channel data')

      warnSpy.mockRestore()
    })
  })

  describe('caching strategy', () => {
    beforeEach(() => {
      process.env.YOUTUBE_TOKEN = 'test_token_12345'
    })

    it('should use force-cache for build-time caching', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_cached',
            statistics: { subscriberCount: '100', viewCount: '1000' },
            contentDetails: { relatedPlaylists: { uploads: 'UU_cached' } },
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChannelData),
      })

      await fetchYouTubeChannel('UC_cached')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://www.googleapis.com/youtube/v3/channels'),
        expect.objectContaining({
          cache: 'force-cache',
        })
      )
    })
  })

  describe('authentication', () => {
    it('should include API key in URL when YOUTUBE_TOKEN is set', async () => {
      process.env.YOUTUBE_TOKEN = 'youtube_test_token_12345'

      const mockChannelData = {
        items: [
          {
            id: 'UC_test',
            statistics: { subscriberCount: '100', viewCount: '1000' },
            contentDetails: { relatedPlaylists: { uploads: 'UU_test' } },
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChannelData),
      })

      await fetchYouTubeChannel('UC_test')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('key=youtube_test_token_12345'),
        expect.any(Object)
      )
    })
  })

  describe('video fetching', () => {
    beforeEach(() => {
      process.env.YOUTUBE_TOKEN = 'test_token_12345'
    })

    it('should fetch latest video from uploads playlist', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_with_videos',
            statistics: { subscriberCount: '1000', viewCount: '10000' },
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UU_with_videos',
              },
            },
          },
        ],
      }

      const mockVideosData = {
        items: [
          {
            snippet: {
              title: 'Latest Video',
              resourceId: { videoId: 'vid123' },
              publishedAt: '2024-01-15T00:00:00Z',
            },
          },
        ],
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockChannelData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockVideosData),
        })

      const result = await fetchYouTubeChannel('UC_with_videos')

      expect(result?.latestVideoTitle).toBe('Latest Video')
      expect(result?.latestVideoUrl).toBe('https://www.youtube.com/watch?v=vid123')
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('playlistItems?part=snippet&maxResults=1&playlistId=UU_with_videos'),
        expect.any(Object)
      )
    })

    it('should handle failed video fetch gracefully', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_video_fetch_fail',
            statistics: { subscriberCount: '1000', viewCount: '10000' },
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UU_video_fetch_fail',
              },
            },
          },
        ],
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockChannelData),
        })
        .mockResolvedValueOnce({
          ok: false,
        })

      const result = await fetchYouTubeChannel('UC_video_fetch_fail')

      expect(result).toEqual({
        subscriberCount: 1000,
        viewCount: 10000,
        latestVideoTitle: null,
        latestVideoUrl: null,
        latestVideoPublishedAt: null,
      })
    })

    it('should handle video without videoId gracefully', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_no_video_id',
            statistics: { subscriberCount: '1000', viewCount: '10000' },
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UU_no_video_id',
              },
            },
          },
        ],
      }

      const mockVideosData = {
        items: [
          {
            snippet: {
              title: 'Video without ID',
              resourceId: {},
              publishedAt: '2024-01-01T00:00:00Z',
            },
          },
        ],
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockChannelData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockVideosData),
        })

      const result = await fetchYouTubeChannel('UC_no_video_id')

      expect(result?.latestVideoTitle).toBeNull()
      expect(result?.latestVideoUrl).toBeNull()
    })
  })

  describe('API contract verification', () => {
    beforeEach(() => {
      process.env.YOUTUBE_TOKEN = 'test_token_12345'
    })

    it('should map all required fields from YouTube API response', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_full_api',
            statistics: {
              subscriberCount: '999999',
              viewCount: '88888888',
              videoCount: '100',
              hiddenSubscriberCount: false,
            },
            contentDetails: {
              relatedPlaylists: {
                uploads: 'UU_full_api',
                likes: 'LL_full_api',
                favorites: 'FL_full_api',
              },
            },
          },
        ],
      }

      const mockVideosData = {
        items: [
          {
            snippet: {
              title: 'Full API Video',
              resourceId: { videoId: 'full123' },
              publishedAt: '2024-12-31T23:59:59Z',
              description: 'Video description',
              channelId: 'UC_full_api',
              channelTitle: 'Full API Channel',
            },
          },
        ],
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockChannelData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockVideosData),
        })

      const result = await fetchYouTubeChannel('UC_full_api')

      expect(result).toEqual<YouTubeChannelData>({
        subscriberCount: 999999,
        viewCount: 88888888,
        latestVideoTitle: 'Full API Video',
        latestVideoUrl: 'https://www.youtube.com/watch?v=full123',
        latestVideoPublishedAt: '2024-12-31T23:59:59Z',
      })
    })
  })

  describe('no real API calls', () => {
    beforeEach(() => {
      process.env.YOUTUBE_TOKEN = 'test_token_12345'
    })

    it('should use mocked fetch and not hit real YouTube API', async () => {
      const mockChannelData = {
        items: [
          {
            id: 'UC_mocked',
            statistics: { subscriberCount: '100', viewCount: '1000' },
            contentDetails: { relatedPlaylists: { uploads: 'UU_mocked' } },
          },
        ],
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockChannelData),
      })

      await fetchYouTubeChannel('UC_mocked')

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining('youtube.com'),
        expect.any(Object)
      )
    })
  })
})
