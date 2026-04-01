import { bench, describe, beforeAll, vi } from 'vitest'

const mockDownloadsResponse = {
  package: 'projex',
  downloads: 123456,
}

const mockRegistryResponse = {
  name: 'projex',
  'dist-tags': {
    latest: '1.2.3',
  },
  versions: {
    '1.2.3': {
      version: '1.2.3',
    },
  },
}

describe('fetchNpmPackage performance', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url.includes('downloads')) {
        return {
          ok: true,
          json: async () => mockDownloadsResponse,
        }
      }
      return {
        ok: true,
        json: async () => mockRegistryResponse,
      }
    }))
  })

  bench('fetchNpmPackage (parallel fetch simulation)', async () => {
    const [downloadsResponse, registryResponse] = await Promise.all([
      fetch('https://api.npmjs.org/downloads/point/last-month/projex', {
        cache: 'force-cache',
      }),
      fetch('https://registry.npmjs.org/projex', {
        cache: 'force-cache',
      }),
    ])

    const downloadsData = await downloadsResponse.json()
    const registryData = await registryResponse.json()

    void registryData['dist-tags']?.latest
    void downloadsData.package
    void downloadsData.downloads
  })

  bench('parse npm API responses', () => {
    const downloadsData = mockDownloadsResponse
    const registryData = mockRegistryResponse

    void registryData['dist-tags']?.latest
    void downloadsData.package
    void downloadsData.downloads
  })
})
