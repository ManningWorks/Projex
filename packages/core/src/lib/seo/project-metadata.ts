import type { ProjexProject } from '../../types'
import { generateProjectSchema } from './project'

export interface Metadata {
  title?: string
  description?: string
  keywords?: string
  openGraph?: {
    title?: string
    description?: string
    url?: string
    type?: string
    images?: Array<{ url: string }>
  }
  other?: {
    'schema:softwareApplication'?: string
  }
}

export function generateProjectMetadata(
  project: ProjexProject
): Metadata | null {
  const isNameValid = project.name && typeof project.name === 'string' && project.name.trim() !== ''
  const isDescriptionValid = project.description && typeof project.description === 'string' && project.description.trim() !== ''

  if (!isNameValid) {
    console.warn('generateProjectMetadata: project.name is required and must be a non-empty string')
  }

  if (!isDescriptionValid) {
    console.warn('generateProjectMetadata: project.description is required and must be a non-empty string')
  }

  if (!isNameValid || !isDescriptionValid) {
    return null
  }

  const url = project.links?.live || project.links?.github || project.links?.npm || project.links?.docs || project.links?.demo || project.links?.appStore || project.links?.playStore || project.links?.productHunt

  const trimmedName = project.name.trim()
  const trimmedDescription = project.description.trim()

  const metadata: Metadata = {
    title: trimmedName,
    description: trimmedDescription,
    openGraph: {
      title: trimmedName,
      description: trimmedDescription,
      type: 'website',
    },
  }

  if (url && typeof url === 'string' && url.trim() !== '') {
    metadata.openGraph!.url = url
  }

  if (project.image && typeof project.image === 'string' && project.image.trim() !== '') {
    metadata.openGraph!.images = [{ url: project.image.trim() }]
  }

  if (project.stack && Array.isArray(project.stack) && project.stack.length > 0) {
    const validTags = project.stack.filter((tag) => tag && typeof tag === 'string' && tag.trim() !== '').map((tag) => tag.trim())

    if (validTags.length > 0) {
      metadata.keywords = validTags.join(', ')
    }
  }

  const other: Metadata['other'] = {}

  const schema = generateProjectSchema(project)
  if (schema) {
    other['schema:softwareApplication'] = JSON.stringify(schema)
  }

  if (Object.keys(other).length > 0) {
    metadata.other = other
  }

  return metadata
}
