export interface Metadata {
  title?: string
  description?: string
  openGraph?: {
    title?: string
    description?: string
    url?: string
    type?: string
    images?: Array<{ url: string }>
  }
  other?: {
    sameAs?: string[]
    'schema:person'?: string
  }
}

export interface GeneratePortfolioMetadataOptions {
  name: string
  description: string
  url: string
  image?: string
  sameAs?: string[]
}

export function generatePortfolioMetadata(
  options: GeneratePortfolioMetadataOptions
): Metadata | null {
  const { name, description, url, image, sameAs } = options

  const isNameValid = name && typeof name === 'string' && name.trim() !== ''
  const isDescriptionValid =
    description && typeof description === 'string' && description.trim() !== ''
  const isUrlValid = url && typeof url === 'string' && url.trim() !== ''

  if (!isNameValid) {
    console.warn('generatePortfolioMetadata: name is required and must be a non-empty string')
  }

  if (!isDescriptionValid) {
    console.warn('generatePortfolioMetadata: description is required and must be a non-empty string')
  }

  if (!isUrlValid) {
    console.warn('generatePortfolioMetadata: url is required and must be a non-empty string')
  }

  if (!isNameValid || !isDescriptionValid || !isUrlValid) {
    return null
  }

  const trimmedName = name.trim()
  const trimmedDescription = description.trim()
  const trimmedUrl = url.trim()

  const metadata: Metadata = {
    title: trimmedName,
    description: trimmedDescription,
    openGraph: {
      title: trimmedName,
      description: trimmedDescription,
      url: trimmedUrl,
      type: 'website',
    },
  }

  if (image && typeof image === 'string' && image.trim() !== '') {
    metadata.openGraph!.images = [{ url: image.trim() }]
  }

  const other: Metadata['other'] = {}

  if (sameAs && Array.isArray(sameAs) && sameAs.length > 0) {
    const validSameAs = sameAs
      .filter((link) => link && typeof link === 'string' && link.trim() !== '')
      .map((link) => link.trim())

    if (validSameAs.length > 0) {
      other.sameAs = validSameAs
    }
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: trimmedName,
    url: trimmedUrl,
  }

  other['schema:person'] = JSON.stringify(personSchema)

  metadata.other = other

  return metadata
}
