export interface NpmPackageData {
  name: string
  version: string
  description: string | null
  keywords: string[]
  homepage: string | null
  repository: string | null
  downloadsLastWeek: number | null
}

export async function fetchNpmPackage(packageName: string): Promise<NpmPackageData | null> {
  try {
    const url = `https://registry.npmjs.org/${packageName}`

    const response = await fetch(url, {
      cache: 'force-cache',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    let downloadsLastWeek = null

    try {
      const period = 'last-week'
      const downloadsUrl = `https://api.npmjs.org/downloads/point/${period}/${packageName}`
      const downloadsResponse = await fetch(downloadsUrl, {
        cache: 'force-cache',
      })

      if (downloadsResponse.ok) {
        const downloadsData = await downloadsResponse.json()
        downloadsLastWeek = downloadsData.downloads || null
      }
    } catch {
      console.warn(`Failed to fetch downloads for ${packageName}`)
    }

    return {
      name: data.name,
      version: data['dist-tags']?.latest || '',
      description: data.description || null,
      keywords: data.keywords || [],
      homepage: data.homepage || null,
      repository: data.repository?.url || null,
      downloadsLastWeek,
    }
  } catch {
    return null
  }
}
