export interface PersonSchema {
  '@context': string
  '@type': 'Person'
  name: string
  url: string
  jobTitle?: string
  image?: string
  sameAs?: string[]
}

export interface GeneratePersonSchemaOptions {
  name: string
  url: string
  jobTitle?: string
  image?: string
  sameAs?: string[]
}

export function generatePersonSchema(
  options: GeneratePersonSchemaOptions
): PersonSchema | null {
  const { name, url, jobTitle, image, sameAs } = options

  const isNameValid = name && typeof name === 'string' && name.trim() !== ''
  const isUrlValid = url && typeof url === 'string' && url.trim() !== ''

  if (!isNameValid) {
    console.warn('generatePersonSchema: name is required and must be a non-empty string')
  }

  if (!isUrlValid) {
    console.warn('generatePersonSchema: url is required and must be a non-empty string')
  }

  if (!isNameValid || !isUrlValid) {
    return null
  }

  const schema: PersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name.trim(),
    url: url.trim(),
  }

  if (jobTitle && typeof jobTitle === 'string' && jobTitle.trim() !== '') {
    schema.jobTitle = jobTitle.trim()
  }

  if (image && typeof image === 'string' && image.trim() !== '') {
    schema.image = image.trim()
  }

  if (sameAs && Array.isArray(sameAs) && sameAs.length > 0) {
    const validSameAs = sameAs
      .filter((link) => link && typeof link === 'string' && link.trim() !== '')
      .map((link) => link.trim())

    if (validSameAs.length > 0) {
      schema.sameAs = validSameAs
    }
  }

  return schema
}
