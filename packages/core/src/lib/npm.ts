export interface NpmPackageData {
  name: string
  version: string
  downloads: number
}

export async function fetchNpmPackage(packageName: string): Promise<NpmPackageData | null> {
  try {
    const downloadsUrl = `https://api.npmjs.org/downloads/point/last-month/${packageName}`
    const registryUrl = `https://registry.npmjs.org/${packageName}`

    const [downloadsResponse, registryResponse] = await Promise.all([
      fetch(downloadsUrl, { cache: 'force-cache' }),
      fetch(registryUrl, { cache: 'force-cache' }),
    ])

    if (!downloadsResponse.ok || !registryResponse.ok) {
      return null
    }

    const downloadsData = await downloadsResponse.json()
    const registryData = await registryResponse.json()

    const version = registryData['dist-tags']?.latest

    if (!version) {
      return null
    }

    return {
      name: downloadsData.package || packageName,
      version,
      downloads: downloadsData.downloads || 0,
    }
  } catch {
    return null
  }
}
