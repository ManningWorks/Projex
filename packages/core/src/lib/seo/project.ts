import type { FolioProject } from '../../types'

export interface SoftwareApplicationSchema {
  '@context': string
  '@type': 'SoftwareApplication'
  name: string
  description: string
  url: string
  applicationCategory?: string
  aggregateRating?: {
    '@type': string
    ratingValue: number
    ratingCount: number
  }
  interactionStatistic?: {
    '@type': string
    interactionType: {
      '@type': string
    }
    userInteractionCount: number
  }
}

export function generateProjectSchema(
  project: FolioProject
): SoftwareApplicationSchema | null {
  const isNameValid = project.name && typeof project.name === 'string' && project.name.trim() !== ''
  const isDescriptionValid = project.description && typeof project.description === 'string' && project.description.trim() !== ''

  if (!isNameValid) {
    console.warn('generateProjectSchema: project.name is required and must be a non-empty string')
  }

  if (!isDescriptionValid) {
    console.warn('generateProjectSchema: project.description is required and must be a non-empty string')
  }

  if (!isNameValid || !isDescriptionValid) {
    return null
  }

  const url = project.links?.github || project.links?.live || project.links?.npm || project.links?.docs || project.links?.demo || project.links?.appStore || project.links?.playStore || project.links?.productHunt

  if (!url) {
    console.warn('generateProjectSchema: project must have at least one link (github, live, npm, docs, demo, appStore, playStore, productHunt)')
    return null
  }

  const schema: SoftwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name.trim(),
    description: project.description.trim(),
    url,
  }

  if (project.type === 'github' || project.type === 'npm') {
    schema.applicationCategory = 'DeveloperApplication'
  }

  const stars = project.stats?.stars
  if (stars && typeof stars === 'number' && stars > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: 5,
      ratingCount: stars,
    }
  }

  const downloads = project.stats?.downloads
  if (downloads && typeof downloads === 'string' && downloads.trim() !== '') {
    const downloadsNumber = parseInt(downloads, 10)
    if (!isNaN(downloadsNumber) && downloadsNumber > 0) {
      schema.interactionStatistic = {
        '@type': 'InteractionCounter',
        interactionType: {
          '@type': 'DownloadAction',
        },
        userInteractionCount: downloadsNumber,
      }
    }
  }

  return schema
}
