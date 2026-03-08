import type { ReactNode } from 'react'
import type { ProjexProject } from '../../types'

export interface ShowcaseCardProps {
  project: ProjexProject
  children?: ReactNode
}

function ShowcaseCard({ children }: { children?: ReactNode }) {
  return <div data-projex-card>{children}</div>
}

ShowcaseCard.Header = function ShowcaseCardHeader({ project }: { project: ProjexProject }) {
  return (
    <div data-projex-card-header>
      <h3>{project.name}</h3>
      {project.tagline && <p data-projex-card-tagline>{project.tagline}</p>}
    </div>
  )
}

ShowcaseCard.Description = function ShowcaseCardDescription({ project }: { project: ProjexProject }) {
  if (!project.description) return null
  return <div data-projex-card-description>{project.description}</div>
}

ShowcaseCard.Tags = function ShowcaseCardTags({ project }: { project: ProjexProject }) {
  if (!project.stack || project.stack.length === 0) return null
  return (
    <div data-projex-card-tags>
      {project.stack.map((tag) => (
        <span key={tag} data-projex-tag>
          {tag}
        </span>
      ))}
    </div>
  )
}

ShowcaseCard.Stats = function ShowcaseCardStats({ project }: { project: ProjexProject }) {
  if (
    !project.stats ||
    (!project.stats.stars &&
      !project.stats.forks &&
      !project.stats.downloads &&
      !project.stats.version &&
      !project.stats.upvotes &&
      !project.stats.comments)
  ) {
    return null
  }
  return (
    <div data-projex-card-stats>
      {project.stats.stars && <span data-projex-stat="stars">{project.stats.stars} stars</span>}
      {project.stats.forks && <span data-projex-stat="forks">{project.stats.forks} forks</span>}
      {project.stats.downloads && (
        <span data-projex-stat="downloads">{project.stats.downloads} downloads</span>
      )}
      {project.stats.version && <span data-projex-stat="version">{project.stats.version}</span>}
      {project.stats.upvotes && <span data-projex-stat="upvotes">{project.stats.upvotes} upvotes</span>}
      {project.stats.comments && (
        <span data-projex-stat="comments">{project.stats.comments} comments</span>
      )}
    </div>
  )
}

ShowcaseCard.Status = function ShowcaseCardStatus({ project }: { project: ProjexProject }) {
  return (
    <div data-projex-status data-projex-status-value={project.status}>
      {project.status}
    </div>
  )
}

ShowcaseCard.Links = function ShowcaseCardLinks({ project }: { project: ProjexProject }) {
  const standardLinks = ['github', 'live', 'docs', 'demo', 'npm', 'productHunt', 'appStore', 'playStore', 'custom'] as const

  const linkLabels: Record<string, string> = {
    github: 'GitHub',
    live: 'Live',
    docs: 'Docs',
    demo: 'Demo',
    npm: 'npm',
    productHunt: 'Product Hunt',
    appStore: 'App Store',
    playStore: 'Play Store',
  }

  const linkTypeAttr: Record<string, string> = {
    github: 'github',
    live: 'live',
    docs: 'docs',
    demo: 'demo',
    npm: 'npm',
    productHunt: 'product-hunt',
    appStore: 'app-store',
    playStore: 'play-store',
  }

  const order = project.linkOrder || standardLinks

  const hasLinks = order.some(linkType => {
    if (linkType === 'custom') return project.links.custom && project.links.custom.length > 0
    if (linkType === 'appStore' || linkType === 'playStore') return false
    return project.links[linkType as keyof typeof project.links] !== undefined
  })

  if (!hasLinks) return null

  return (
    <div data-projex-card-links>
      {order.map(linkType => {
        if (linkType === 'custom') {
          return project.links.custom?.map((link) => (
            <a
              key={link.label}
              href={link.url}
              data-projex-link
              data-projex-link-type="custom"
              data-projex-link-label={link.label}
            >
              {link.label}
            </a>
          ))
        }

        if (linkType === 'appStore' || linkType === 'playStore') return null

        const url = project.links[linkType as keyof typeof project.links] as string | undefined
        if (!url) return null

        return (
          <a key={linkType} href={url} data-projex-link data-projex-link-type={linkTypeAttr[linkType]}>
            {linkLabels[linkType]}
          </a>
        )
      })}
    </div>
  )
}

ShowcaseCard.Footer = function ShowcaseCardFooter({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <div data-projex-card-footer>{children}</div>
}

export { ShowcaseCard }
