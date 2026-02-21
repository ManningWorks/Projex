import { fetchGitHubRepo, LANGUAGE_COLORS } from './github'
import type { FolioProject, FolioProjectInput } from '../types'

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
    struggles: inputStruggles,
    timeline: inputTimeline,
    posts: inputPosts,
    override,
  } = input

  const repo = 'repo' in input ? input.repo : undefined

  let githubData = null

  if (type === 'github' || type === 'hybrid') {
    if (repo) {
      githubData = await fetchGitHubRepo(repo)
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
  } else {
    finalLinks = inputLinks || {}
  }

  let finalStats: FolioProject['stats'] | null = null
  if (type === 'github' || type === 'hybrid') {
    if (githubData) {
      finalStats = {
        stars: githubData.stargazers_count,
        forks: githubData.forks_count,
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

  if (type === 'github') {
    finalLanguage = githubData?.language || null
    finalLanguageColor = githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null
  } else if (type === 'hybrid') {
    finalLanguage = githubData?.language || null
    finalLanguageColor = githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null
  } else {
    finalLanguage = null
    finalLanguageColor = null
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
    struggles: inputStruggles || [],
    timeline: inputTimeline || [],
    posts: inputPosts || [],
    stack: finalStack,
    links: finalLinks,
    stats: finalStats,
    language: finalLanguage,
    languageColor: finalLanguageColor,
  }
}
