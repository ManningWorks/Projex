import type { ReactNode } from 'react'
import type { ProjexProject } from '../../types'

export interface NpmCardProps {
  project: ProjexProject
  showVersion?: boolean
  children?: ReactNode
}

function NpmCard({ children }: { children?: ReactNode }) {
  return <div data-projex-card>{children}</div>
}

NpmCard.Header = function NpmCardHeader({ project }: { project: ProjexProject }) {
  return (
    <div data-projex-card-header>
      <h3>{project.name || project.package}</h3>
    </div>
  )
}

NpmCard.Description = function NpmCardDescription({ project }: { project: ProjexProject }) {
  if (!project.description) return null
  return <div data-projex-card-description>{project.description}</div>
}

NpmCard.Tags = function NpmCardTags({ project }: { project: ProjexProject }) {
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

NpmCard.Stats = function NpmCardStats({ project, showVersion = true }: NpmCardProps) {
  if (!project.stats || (!project.stats.downloads && (!showVersion || !project.stats.version))) {
    return null
  }
  return (
    <div data-projex-card-stats>
      {project.stats.downloads && (
        <span data-projex-stat="downloads">
          <span data-projex-stat-icon="downloads" />
          {project.stats.downloads} downloads
        </span>
      )}
      {showVersion && project.stats.version && (
        <span data-projex-stat="version">v{project.stats.version}</span>
      )}
    </div>
  )
}

NpmCard.Status = function NpmCardStatus({ project }: { project: ProjexProject }) {
  return (
    <div data-projex-status data-projex-status-value={project.status}>
      {project.status}
    </div>
  )
}

NpmCard.Links = function NpmCardLinks({ project }: { project: ProjexProject }) {
  const hasNpmLink = project.links.npm !== undefined
  const hasGitHubLink = project.links.github !== undefined
  const hasDocsLink = project.links.docs !== undefined

  if (!hasNpmLink && !hasGitHubLink && !hasDocsLink) return null

  return (
    <div data-projex-card-links>
      {project.links.npm && (
        <a href={project.links.npm} data-projex-link data-projex-link-type="npm">
          npm
        </a>
      )}
      {project.links.github && (
        <a href={project.links.github} data-projex-link data-projex-link-type="github">
          GitHub
        </a>
      )}
      {project.links.docs && (
        <a href={project.links.docs} data-projex-link data-projex-link-type="docs">
          Docs
        </a>
      )}
    </div>
  )
}

NpmCard.Footer = function NpmCardFooter({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <div data-projex-card-footer>{children}</div>
}

export { NpmCard }
