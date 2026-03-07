import type { ReactNode } from 'react'
import type { FolioProject } from '../../types'

export interface NpmCardProps {
  project: FolioProject
  showVersion?: boolean
  children?: ReactNode
}

function NpmCard({ children }: { children?: ReactNode }) {
  return <div data-folio-card>{children}</div>
}

NpmCard.Header = function NpmCardHeader({ project }: { project: FolioProject }) {
  return (
    <div data-folio-card-header>
      <h3>{project.name || project.package}</h3>
    </div>
  )
}

NpmCard.Description = function NpmCardDescription({ project }: { project: FolioProject }) {
  if (!project.description) return null
  return <div data-folio-card-description>{project.description}</div>
}

NpmCard.Tags = function NpmCardTags({ project }: { project: FolioProject }) {
  if (!project.stack || project.stack.length === 0) return null
  return (
    <div data-folio-card-tags>
      {project.stack.map((tag) => (
        <span key={tag} data-folio-tag>
          {tag}
        </span>
      ))}
    </div>
  )
}

NpmCard.Stats = function NpmCardStats({ project, showVersion = true }: NpmCardProps) {
  if (!project.stats || (!project.stats.downloads && (!showVersion || !project.stats.version))) {
    return null
  }
  return (
    <div data-folio-card-stats>
      {project.stats.downloads && (
        <span data-folio-stat="downloads">
          <span data-folio-stat-icon="downloads" />
          {project.stats.downloads} downloads
        </span>
      )}
      {showVersion && project.stats.version && (
        <span data-folio-stat="version">v{project.stats.version}</span>
      )}
    </div>
  )
}

NpmCard.Status = function NpmCardStatus({ project }: { project: FolioProject }) {
  return (
    <div data-folio-status data-folio-status-value={project.status}>
      {project.status}
    </div>
  )
}

NpmCard.Links = function NpmCardLinks({ project }: { project: FolioProject }) {
  const hasNpmLink = project.links.npm !== undefined
  const hasGitHubLink = project.links.github !== undefined
  const hasDocsLink = project.links.docs !== undefined

  if (!hasNpmLink && !hasGitHubLink && !hasDocsLink) return null

  return (
    <div data-folio-card-links>
      {project.links.npm && (
        <a href={project.links.npm} data-folio-link data-folio-link-type="npm">
          npm
        </a>
      )}
      {project.links.github && (
        <a href={project.links.github} data-folio-link data-folio-link-type="github">
          GitHub
        </a>
      )}
      {project.links.docs && (
        <a href={project.links.docs} data-folio-link data-folio-link-type="docs">
          Docs
        </a>
      )}
    </div>
  )
}

NpmCard.Footer = function NpmCardFooter({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <div data-folio-card-footer>{children}</div>
}

export { NpmCard }
