import { fetchGitHubRepo, LANGUAGE_COLORS } from './github'
import type { FolioProject, FolioProjectInput } from '../types'

export async function normalise(input: FolioProjectInput): Promise<FolioProject> {
  const {
    id,
    name,
    description,
    type,
    status,
    links: inputLinks,
    tags: inputTags,
    stats: inputStats,
    background: inputBackground,
    struggles: inputStruggles,
    timeline: inputTimeline,
    posts: inputPosts,
    techStack: inputTechStack,
    language: inputLanguage,
    languageColor: inputLanguageColor,
  } = input

  let githubData = null

  if (type === 'github' || type === 'hybrid') {
    if (inputLinks?.github) {
      const repo = inputLinks.github.replace('https://github.com/', '')
      githubData = await fetchGitHubRepo(repo)
    }
  }

  let finalLinks: FolioProject['links'] = {}
  if (type === 'github') {
    if (githubData) {
      finalLinks = {
        github: githubData.html_url,
        live: githubData.homepage || undefined,
      }
    } else {
      finalLinks = inputLinks || {}
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

  let finalStats: FolioProject['stats'] = {}
  if (type === 'github' || type === 'hybrid') {
    if (githubData) {
      finalStats = {
        stars: githubData.stargazers_count.toString(),
        forks: githubData.forks_count.toString(),
      }
    }
    finalStats = { ...finalStats, ...inputStats }
  } else {
    finalStats = inputStats || {}
  }

  let finalTags: FolioProject['tags'] = []
  if (type === 'github') {
    finalTags = githubData?.topics || []
  } else if (type === 'hybrid') {
    finalTags = inputTags || []
    if (githubData && githubData.topics.length > 0 && (!inputTags || inputTags.length === 0)) {
      finalTags = githubData.topics
    }
  } else {
    finalTags = inputTags || []
  }

  let finalTechStack: FolioProject['techStack'] = []
  if (type === 'github') {
    finalTechStack = inputTechStack || []
  } else {
    finalTechStack = inputTechStack || []
  }

  let finalLanguage: FolioProject['language'] = null
  let finalLanguageColor: FolioProject['languageColor'] = null

  if (type === 'github') {
    finalLanguage = githubData?.language || null
    finalLanguageColor = githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null
  } else if (type === 'hybrid') {
    finalLanguage = inputLanguage || githubData?.language || null
    finalLanguageColor = inputLanguageColor || (githubData?.language ? LANGUAGE_COLORS[githubData.language] || null : null)
  } else {
    finalLanguage = inputLanguage || null
    finalLanguageColor = inputLanguageColor || null
  }

  return {
    id,
    name,
    description,
    type,
    status,
    links: finalLinks,
    tags: finalTags,
    stats: finalStats,
    background: inputBackground || null,
    struggles: inputStruggles || [],
    timeline: inputTimeline || [],
    posts: inputPosts || [],
    techStack: finalTechStack,
    language: finalLanguage,
    languageColor: finalLanguageColor,
  }
}
