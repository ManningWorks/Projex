import { FeaturedProject } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'

export function FeaturedProjectMinimalPreview() {
  const project = normalisedExamples.nextjs

  return <FeaturedProject project={project} />
}

export function FeaturedProjectRealPreview() {
  const project = normalisedExamples.react

  return <FeaturedProject project={project} />
}
