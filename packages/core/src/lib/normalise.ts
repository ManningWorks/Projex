import { fetchGitHubRepo, LANGUAGE_COLORS } from './github'
import { fetchNpmPackage } from './npm'
import { fetchProductHuntPost } from './product-hunt'
import type { FolioProject, FolioProjectInput, NormalizedStat, ProjectType } from '../types'

export async function normalise(input: FolioProjectInput): Promise<FolioProject> {
  const {
    id,
    type,
    status,
    featured,
    name: inputName,
    tagline: inputTagline,
    description: inputDescription,
    links: inputLinks,
    stack: inputStack,
    stats: inputStats,
    background: inputBackground,
    why: inputWhy,
    image: inputImage,
    struggles: inputStruggles,
    timeline: inputTimeline,
    posts: inputPosts,
    createdAt: inputCreatedAt,
    updatedAt: inputUpdatedAt,
    override,
  } = input

  const repo = 'repo' in input ? input.repo : undefined

  let githubData = null

  if (type === 'github' || type === 'hybrid') {
    if (repo) {
      githubData = await fetchGitHubRepo(repo)
    }
  }

  const npmPackage = 'package' in input ? input.package : undefined

  let npmData = null

  if (type === 'npm' || type === 'hybrid') {
    if (npmPackage) {
      npmData = await fetchNpmPackage(npmPackage)
    }
  }

  const slug = 'slug' in input ? input.slug : undefined

  let productHuntData = null

  if (type === 'product-hunt') {
    if (slug) {
      productHuntData = await fetchProductHuntPost(slug)
    }
  }

  let finalName: string
  let finalTagline: string
  let finalDescription: string
  let finalStack: string[]

  if (type === 'github') {
    finalName = override?.name || githubData?.name || inputName || ''
    finalTagline = override?.tagline || inputTagline || ''
    finalDescription = override?.description || githubData?.description || inputDescription || ''
    finalStack = override?.stack || inputStack || []
  } else if (type === 'hybrid') {
    finalName = override?.name || inputName || githubData?.name || ''
    finalTagline = override?.tagline || inputTagline || ''
    finalDescription = override?.description || inputDescription || githubData?.description || ''
    finalStack = override?.stack || inputStack || []
  } else {
    finalName = inputName || ''
    finalTagline = inputTagline || ''
    finalDescription = inputDescription || ''
    finalStack = inputStack || []
  }

  let finalLinks: FolioProject['links'] = {}
  if (type === 'github') {
    if (githubData) {
      finalLinks = {
        github: githubData.html_url,
        live: githubData.homepage || undefined,
      }
    }
    if (inputLinks) {
      finalLinks = { ...finalLinks, ...inputLinks }
    }
  } else if (type === 'hybrid') {
    finalLinks = inputLinks || {}
    if (githubData) {
      finalLinks.github = finalLinks.github || githubData.html_url
      finalLinks.live = finalLinks.live || githubData.homepage || undefined
    }
    if (npmData && npmPackage) {
      finalLinks.npm = finalLinks.npm || `https://npmjs.com/package/${npmPackage}`
    }
  } else {
    finalLinks = inputLinks || {}
  }

  let finalStats: FolioProject['stats'] | null = null
  if (type === 'github' || type === 'hybrid' || type === 'npm' || type === 'product-hunt') {
    if (githubData) {
      finalStats = {
        stars: githubData.stargazers_count,
        forks: githubData.forks_count,
      }
    }
    if (npmData) {
      finalStats = {
        ...finalStats,
        downloads: String(npmData.downloads),
        version: npmData.version,
      }
    }
    if (productHuntData) {
      finalStats = {
        ...finalStats,
        upvotes: productHuntData.votes_count,
        comments: productHuntData.comments_count,
        launchDate: productHuntData.featured_at || undefined,
      }
    }
    if (inputStats) {
      finalStats = { ...finalStats, ...inputStats }
    }
  } else {
    finalStats = inputStats || null
  }

  let finalLanguage: FolioProject['language'] = null
  let finalLanguageColor: FolioProject['languageColor'] = null
  let finalCreatedAt: FolioProject['createdAt'] = null
  let finalUpdatedAt: FolioProject['updatedAt'] = null

  if (type === 'github') {
    finalLanguage = githubData?.language || null
    finalLanguageColor = githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null
    finalCreatedAt = githubData?.created_at || inputCreatedAt || null
    finalUpdatedAt = githubData?.updated_at || inputUpdatedAt || null
  } else if (type === 'hybrid') {
    finalLanguage = githubData?.language || null
    finalLanguageColor = githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null
    finalCreatedAt = githubData?.created_at || inputCreatedAt || null
    finalUpdatedAt = githubData?.updated_at || inputUpdatedAt || null
  } else {
    finalLanguage = null
    finalLanguageColor = null
    finalCreatedAt = inputCreatedAt || null
    finalUpdatedAt = inputUpdatedAt || null
  }

  return {
    id,
    type,
    status,
    featured: featured || false,
    name: finalName,
    tagline: finalTagline,
    description: finalDescription,
    background: inputBackground || null,
    why: inputWhy || null,
    image: inputImage || null,
    struggles: inputStruggles || [],
    timeline: inputTimeline || [],
    posts: inputPosts || [],
    stack: finalStack,
    links: finalLinks,
    stats: finalStats,
    language: finalLanguage,
    languageColor: finalLanguageColor,
    createdAt: finalCreatedAt,
    updatedAt: finalUpdatedAt,
    repo,
    package: npmPackage,
    slug: 'slug' in input ? input.slug : undefined,
  }
}

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}

function formatDate(value: string | number): string {
  try {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      return String(value)
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return String(value)
  }
}

export function normalizeStats(stats: Record<string, unknown>, _type: ProjectType): NormalizedStat[] {
  const result: NormalizedStat[] = []

  if (stats.stars !== undefined && stats.stars !== null) {
    const value = Number(stats.stars)
    if (!isNaN(value)) {
      result.push({ label: 'Stars', value: formatNumber(value) })
    }
  }

  if (stats.forks !== undefined && stats.forks !== null) {
    const value = Number(stats.forks)
    if (!isNaN(value)) {
      result.push({ label: 'Forks', value: formatNumber(value) })
    }
  }

  if (stats.downloads !== undefined && stats.downloads !== null) {
    const value = Number(stats.downloads)
    if (!isNaN(value)) {
      result.push({ label: 'Downloads', value: formatNumber(value), unit: 'month' })
    }
  }

  if (stats.version !== undefined && stats.version !== null) {
    let version = String(stats.version)
    if (version && !version.startsWith('v')) {
      version = 'v' + version
    }
    result.push({ label: 'Version', value: version })
  }

  if (stats.upvotes !== undefined && stats.upvotes !== null) {
    const value = Number(stats.upvotes)
    if (!isNaN(value)) {
      result.push({ label: 'Upvotes', value: formatNumber(value) })
    }
  }

  if (stats.comments !== undefined && stats.comments !== null) {
    const value = Number(stats.comments)
    if (!isNaN(value)) {
      result.push({ label: 'Comments', value: formatNumber(value) })
    }
  }

  if (stats.launchDate !== undefined && stats.launchDate !== null) {
    result.push({ label: 'Launched', value: formatDate(String(stats.launchDate)) })
  }

  return result
}
