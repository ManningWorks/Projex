export interface NpmPackageData {
  name: string
  version: string
  downloads: number
  createdAt?: string
  modifiedAt?: string
}

export type FetchNpmErrorType = 'not_found' | 'network' | 'other'

export interface FetchNpmError {
  type: FetchNpmErrorType
  message: string
}

export interface FetchNpmResult {
  data: NpmPackageData | null
  error: FetchNpmError | null
}

export async function fetchNpmPackage(packageName: string): Promise<FetchNpmResult> {
  try {
    const downloadsUrl = `https://api.npmjs.org/downloads/point/last-month/${packageName}`
    const registryUrl = `https://registry.npmjs.org/${packageName}`

    const [downloadsResponse, registryResponse] = await Promise.all([
      fetch(downloadsUrl, { cache: 'force-cache' }),
      fetch(registryUrl, { cache: 'force-cache' }),
    ])

    if (downloadsResponse.status === 404 || registryResponse.status === 404) {
      return { data: null, error: { type: 'not_found', message: `Package '${packageName}' not found` } }
    }

    if (!downloadsResponse.ok || !registryResponse.ok) {
      return { data: null, error: { type: 'other', message: `npm API error` } }
    }

    const downloadsData = await downloadsResponse.json()
    const registryData = await registryResponse.json()

    const version = registryData['dist-tags']?.latest

    if (!version) {
      return { data: null, error: { type: 'other', message: `No latest version found for '${packageName}'` } }
    }

    return {
      data: {
        name: downloadsData.package || packageName,
        version,
        downloads: downloadsData.downloads || 0,
        createdAt: registryData.time?.created,
        modifiedAt: registryData.time?.modified,
      },
      error: null,
    }
  } catch {
    return { data: null, error: { type: 'network', message: `Network error fetching package '${packageName}'` } }
  }
}
