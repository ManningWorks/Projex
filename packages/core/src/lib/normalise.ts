import { fetchGitHubCommits, fetchGitHubRepo, LANGUAGE_COLORS, type GitHubRepoData, type FetchRepoError } from './github'
import { fetchNpmPackage, type NpmPackageData, type FetchNpmError } from './npm'
import { fetchProductHuntPost, type ProductHuntPostData } from './product-hunt'
import { fetchYouTubeChannel, type YouTubeChannelData } from './youtube'
import { fetchGumroadProduct, type GumroadProductData } from './gumroad'
import { fetchLemonSqueezyStore, type LemonSqueezyStoreData } from './lemonsqueezy'
import { fetchDevToUser, type DevToUserData } from './devto'
import { projexProjectInputSchema } from './config-schema'
import { formatZodError } from './format-error'
import type { DefineProjectsOptions } from './defineProjects'
import type { ProjexProject, ProjexProjectInput, NormalizedStat, ProjectCommit, ProjectStats, ProjectType } from '../types'

export interface FetchProjectDataResult {
  githubData: GitHubRepoData | null
  npmData: NpmPackageData | null
  productHuntData: ProductHuntPostData | null
  youtubeData: YouTubeChannelData | null
  gumroadData: GumroadProductData | null
  lemonsqueezyData: LemonSqueezyStoreData | null
  devtoData: DevToUserData | null
  commits: ProjectCommit[] | null
  githubError: FetchRepoError | null
  npmError: FetchNpmError | null
}

export async function fetchProjectData(
  input: ProjexProjectInput,
  options?: DefineProjectsOptions,
): Promise<FetchProjectDataResult> {
  const { type } = input
  const repo = 'repo' in input ? input.repo : undefined
  const npmPackage = 'package' in input ? input.package : undefined
  const slug = 'slug' in input ? input.slug : undefined
  const channelId = 'channelId' in input ? input.channelId : undefined
  const productId = 'productId' in input ? input.productId : undefined
  const storeId = 'storeId' in input ? input.storeId : undefined
  const username = 'username' in input ? input.username : undefined

  const fetchers: Record<string, () => Promise<unknown>> = {
    github: () => repo ? fetchGitHubRepo(repo) : Promise.resolve({ data: null as GitHubRepoData | null, error: null as FetchRepoError | null }),
    npm: () => npmPackage ? fetchNpmPackage(npmPackage) : Promise.resolve({ data: null as NpmPackageData | null, error: null as FetchNpmError | null }),
    'product-hunt': () => slug ? fetchProductHuntPost(slug) : Promise.resolve(null),
    youtube: () => channelId ? fetchYouTubeChannel(channelId) : Promise.resolve(null),
    gumroad: () => productId ? fetchGumroadProduct(productId) : Promise.resolve(null),
    lemonsqueezy: () => storeId ? fetchLemonSqueezyStore(storeId) : Promise.resolve(null),
    devto: () => username ? fetchDevToUser(username) : Promise.resolve(null),
  }

  const [githubResult, npmResult, phResult, ytResult, gumroadResult, lsResult, devtoResult] = await Promise.all([
    (type === 'github' || type === 'hybrid') ? fetchers.github() : Promise.resolve({ data: null as GitHubRepoData | null, error: null as FetchRepoError | null }),
    (type === 'npm' || type === 'hybrid') ? fetchers.npm() : Promise.resolve({ data: null as NpmPackageData | null, error: null as FetchNpmError | null }),
    fetchers['product-hunt'](),
    fetchers['youtube'](),
    fetchers['gumroad'](),
    fetchers['lemonsqueezy'](),
    fetchers['devto'](),
  ])

  const githubData = (githubResult as { data: GitHubRepoData | null }).data
  const githubError = (githubResult as { error: FetchRepoError | null }).error
  const npmData = (npmResult as { data: NpmPackageData | null }).data
  const npmError = (npmResult as { error: FetchNpmError | null }).error
  const productHuntData = phResult as ProductHuntPostData | null
  const youtubeData = ytResult as YouTubeChannelData | null
  const gumroadData = gumroadResult as GumroadProductData | null
  const lemonsqueezyData = lsResult as LemonSqueezyStoreData | null
  const devtoData = devtoResult as DevToUserData | null

  let commitsPromise: Promise<ProjectCommit[] | null> = Promise.resolve(null)
  if ((type === 'github' || type === 'hybrid') && repo) {
    const commitsConfig = 'commits' in input ? input.commits : undefined
    const globalCommits = options?.commits ?? 0
    let commitsLimit: number | undefined = commitsConfig ?? globalCommits

    if (commitsLimit !== undefined) {
      if (commitsLimit < 0 || commitsLimit > 100) {
        console.warn(
          `Invalid commits value: ${commitsLimit}. Clamping to valid range (0-100).`,
        )
        commitsLimit = Math.max(0, Math.min(100, commitsLimit))
      }

      if (commitsLimit > 0) {
        commitsPromise = fetchGitHubCommits(repo, commitsLimit).then(
          (data) => {
            if (data === null) {
              console.warn(`Failed to fetch commits for ${repo}. Setting commits to empty array.`)
              return []
            }
            return data.map((commit) => ({
              message: commit.message,
              date: commit.date,
              url: commit.htmlUrl,
              author: commit.author
                ? { name: commit.author }
                : undefined,
            }))
          },
        )
      }
    }
  }

  const [commits] = await Promise.all([commitsPromise])

  return {
    githubData,
    npmData,
    productHuntData,
    youtubeData,
    gumroadData,
    lemonsqueezyData,
    devtoData,
    commits,
    githubError,
    npmError,
  }
}

export async function normalise(
  input: ProjexProjectInput,
  options?: DefineProjectsOptions,
): Promise<ProjexProject> {
  const validationResult = projexProjectInputSchema.safeParse(input)

  if (!validationResult.success) {
    throw new Error(formatZodError(validationResult.error))
  }

  const fetched = await fetchProjectData(input, options)
  const { githubData, npmData, productHuntData, youtubeData, gumroadData, lemonsqueezyData, devtoData } = fetched
  const finalCommits = fetched.commits

  const onError = options?.onError ?? 'warn'

  const fetchErrors: string[] = []
  if (fetched.githubError) fetchErrors.push(fetched.githubError.message)
  if (fetched.npmError) fetchErrors.push(fetched.npmError.message)

  if (fetchErrors.length > 0) {
    if (onError === 'throw') {
      throw new Error(fetchErrors.join('; '))
    }
    if (onError === 'warn') {
      for (const msg of fetchErrors) {
        console.warn(msg)
      }
    }
  }

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
  const npmPackage = 'package' in input ? input.package : undefined
  // Opt-out flags for GitHub-derived links; default true for backward compatibility
  const useGithubLinkFromRepo = 'useGithubLinkFromRepo' in input ? input.useGithubLinkFromRepo ?? true : true
  const useLiveLinkFromGithub = 'useLiveLinkFromGithub' in input ? input.useLiveLinkFromGithub ?? true : true

  let finalName: string
  let finalTagline: string
  let finalDescription: string
  let finalStack: string[]

  const usesOverrides = type === 'github' || type === 'hybrid'

  finalName = (usesOverrides && override?.name) || inputName || githubData?.name || npmData?.name || productHuntData?.name || ''
  finalTagline = (usesOverrides && override?.tagline) || inputTagline || productHuntData?.tagline || ''
  finalDescription = (usesOverrides && override?.description) || inputDescription || githubData?.description || productHuntData?.description || ''
  finalStack = (usesOverrides && override?.stack) || inputStack || []

  let finalLinks: ProjexProject['links'] = {}
  if (type === 'github') {
    if (githubData) {
      finalLinks = {
        github: useGithubLinkFromRepo ? githubData.html_url : undefined,
        live: useLiveLinkFromGithub ? (githubData.homepage || undefined) : undefined,
      }
    }
    if (inputLinks) {
      finalLinks = { ...finalLinks, ...inputLinks }
    }
  } else if (type === 'hybrid') {
    finalLinks = inputLinks || {}
    if (githubData) {
      if (useGithubLinkFromRepo) {
        finalLinks.github = finalLinks.github || githubData.html_url
      }
      if (useLiveLinkFromGithub) {
        finalLinks.live = finalLinks.live || githubData.homepage || undefined
      }
    }
    if (npmData && npmPackage) {
      finalLinks.npm = finalLinks.npm || `https://npmjs.com/package/${npmPackage}`
    }
  } else {
    finalLinks = inputLinks || {}
  }

  const { linkOrder } = input
  if (linkOrder && !linkOrder.includes('live')) {
    delete finalLinks.live
  }

  let finalStats: ProjexProject['stats'] | null = null
  if (type === 'github' || type === 'hybrid' || type === 'npm' || type === 'product-hunt' || type === 'youtube' || type === 'gumroad' || type === 'lemonsqueezy' || type === 'devto') {
    const baseStats = inputStats ?? {}
    if (githubData) {
      finalStats = {
        ...baseStats,
        type: 'github' as const,
        stars: githubData.stargazers_count,
        forks: githubData.forks_count,
      }
    }
    if (npmData) {
      finalStats = {
        ...baseStats,
        type: 'npm' as const,
        downloads: String(npmData.downloads),
        version: npmData.version,
      }
    }
    if (productHuntData) {
      finalStats = {
        ...baseStats,
        type: 'product-hunt' as const,
        upvotes: productHuntData.votes_count,
        comments: productHuntData.comments_count,
        launchDate: productHuntData.featured_at || undefined,
      }
    }
    if (youtubeData) {
      finalStats = {
        ...baseStats,
        type: 'youtube' as const,
        subscribers: youtubeData.subscriberCount,
        views: youtubeData.viewCount,
        latestVideoTitle: youtubeData.latestVideoTitle,
        latestVideoUrl: youtubeData.latestVideoUrl,
        latestVideoPublishedAt: youtubeData.latestVideoPublishedAt,
      }
    }
    if (gumroadData) {
      finalStats = {
        ...baseStats,
        type: 'gumroad' as const,
        formattedRevenue: gumroadData.formattedRevenue,
        salesCount: gumroadData.salesCount,
        subscriberCount: gumroadData.subscriberCount,
      }
    }
    if (lemonsqueezyData) {
      finalStats = {
        ...baseStats,
        type: 'lemonsqueezy' as const,
        formattedMRR: lemonsqueezyData.formattedMRR,
        orderCount: lemonsqueezyData.orderCount,
        customerCount: lemonsqueezyData.customerCount,
      }
    }
    if (devtoData) {
      finalStats = {
        ...baseStats,
        type: 'devto' as const,
        articleCount: devtoData.articleCount,
        totalViews: devtoData.totalViews,
        totalReactions: devtoData.totalReactions,
      }
    }
    if (type === 'hybrid' && (githubData || npmData)) {
      const hybridStats: { stars?: number; forks?: number; downloads?: string; version?: string } = {}
      if (githubData) {
        hybridStats.stars = githubData.stargazers_count
        hybridStats.forks = githubData.forks_count
      }
      if (npmData) {
        hybridStats.downloads = String(npmData.downloads)
        hybridStats.version = npmData.version
      }
      finalStats = {
        ...hybridStats,
        ...baseStats,
        type: 'hybrid' as const,
      }
    }
    if (!finalStats) {
      finalStats = inputStats
        ? ({ ...inputStats, type: type as 'github' | 'npm' | 'product-hunt' | 'youtube' | 'gumroad' | 'lemonsqueezy' | 'devto' | 'hybrid' } as ProjectStats)
        : null
    }
  } else {
    finalStats = inputStats ? ({ ...inputStats, type: 'manual' as const } as ProjectStats) : null
  }

  let finalLanguage: ProjexProject['language'] = null
  let finalLanguageColor: ProjexProject['languageColor'] = null
  let finalCreatedAt: ProjexProject['createdAt'] = null
  let finalUpdatedAt: ProjexProject['updatedAt'] = null

  const fetchNpmTimestamps = options?.fetchNpmTimestamps ?? false

  if (type === 'github') {
    finalLanguage = githubData?.language || null
    finalLanguageColor = githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null
    finalCreatedAt = githubData?.created_at || inputCreatedAt || null
    finalUpdatedAt = githubData?.updated_at || inputUpdatedAt || null
  } else if (type === 'hybrid') {
    finalLanguage = githubData?.language || null
    finalLanguageColor = githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null
    finalCreatedAt = githubData?.created_at || npmData?.createdAt || inputCreatedAt || null
    if (fetchNpmTimestamps && npmData?.modifiedAt && githubData?.updated_at) {
      finalUpdatedAt = new Date(npmData.modifiedAt) > new Date(githubData.updated_at)
        ? npmData.modifiedAt
        : githubData.updated_at
    } else if (fetchNpmTimestamps && npmData?.modifiedAt) {
      finalUpdatedAt = npmData.modifiedAt || githubData?.updated_at || inputUpdatedAt || null
    } else {
      finalUpdatedAt = githubData?.updated_at || inputUpdatedAt || null
    }
  } else if (type === 'npm') {
    finalLanguage = null
    finalLanguageColor = null
    finalCreatedAt = fetchNpmTimestamps ? npmData?.createdAt || inputCreatedAt || null : inputCreatedAt || null
    finalUpdatedAt = fetchNpmTimestamps ? npmData?.modifiedAt || inputUpdatedAt || null : inputUpdatedAt || null
  } else if (type === 'product-hunt') {
    finalLanguage = null
    finalLanguageColor = null
    finalCreatedAt = inputCreatedAt || null
    finalUpdatedAt = productHuntData?.featured_at || inputUpdatedAt || null
  } else if (type === 'youtube') {
    finalLanguage = null
    finalLanguageColor = null
    finalCreatedAt = inputCreatedAt || null
    finalUpdatedAt = youtubeData?.latestVideoPublishedAt || inputUpdatedAt || null
  } else if (type === 'devto') {
    finalLanguage = null
    finalLanguageColor = null
    finalCreatedAt = devtoData?.earliestArticlePublishedAt || inputCreatedAt || null
    finalUpdatedAt = devtoData?.latestArticleUpdatedAt || inputUpdatedAt || null
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
    commits: finalCommits,
    channelId: 'channelId' in input ? input.channelId : undefined,
    productId: 'productId' in input ? input.productId : undefined,
    storeId: 'storeId' in input ? input.storeId : undefined,
    username: 'username' in input ? input.username : undefined,
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

export function normaliseStats(stats: Record<string, unknown>, _type: ProjectType): NormalizedStat[] {
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

  if (stats.subscribers !== undefined && stats.subscribers !== null) {
    const value = Number(stats.subscribers)
    if (!isNaN(value)) {
      result.push({ label: 'Subscribers', value: formatNumber(value) })
    }
  }

  if (stats.views !== undefined && stats.views !== null) {
    const value = Number(stats.views)
    if (!isNaN(value)) {
      result.push({ label: 'Views', value: formatNumber(value) })
    }
  }

  if (stats.formattedRevenue !== undefined && stats.formattedRevenue !== null) {
    result.push({ label: 'Revenue', value: String(stats.formattedRevenue) })
  }

  if (stats.salesCount !== undefined && stats.salesCount !== null) {
    const value = Number(stats.salesCount)
    if (!isNaN(value)) {
      result.push({ label: 'Sales', value: formatNumber(value) })
    }
  }

  if (stats.formattedMRR !== undefined && stats.formattedMRR !== null) {
    result.push({ label: 'MRR', value: String(stats.formattedMRR) })
  }

  if (stats.orderCount !== undefined && stats.orderCount !== null) {
    const value = Number(stats.orderCount)
    if (!isNaN(value)) {
      result.push({ label: 'Orders', value: formatNumber(value) })
    }
  }

  if (stats.customerCount !== undefined && stats.customerCount !== null) {
    const value = Number(stats.customerCount)
    if (!isNaN(value)) {
      result.push({ label: 'Customers', value: formatNumber(value) })
    }
  }

  if (stats.articleCount !== undefined && stats.articleCount !== null) {
    const value = Number(stats.articleCount)
    if (!isNaN(value)) {
      result.push({ label: 'Articles', value: formatNumber(value) })
    }
  }

  if (stats.totalViews !== undefined && stats.totalViews !== null) {
    const value = Number(stats.totalViews)
    if (!isNaN(value)) {
      result.push({ label: 'Views', value: formatNumber(value) })
    }
  }

  if (stats.totalReactions !== undefined && stats.totalReactions !== null) {
    const value = Number(stats.totalReactions)
    if (!isNaN(value)) {
      result.push({ label: 'Reactions', value: formatNumber(value) })
    }
  }

  return result
}

/**
 * @deprecated Use `normaliseStats` instead.
 */
export const normalizeStats = normaliseStats
