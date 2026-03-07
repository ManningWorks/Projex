import type { ReactNode } from 'react'
import type { FolioProject } from '../../types'

export interface GitHubCardProps {
  project?: FolioProject
  showForks?: boolean
  statsComponent?: ReactNode
  children?: ReactNode
}

function GitHubCard({ project, showForks = true, statsComponent, children }: GitHubCardProps) {
  if (project) {
    return (
      <div data-folio-card>
        <div data-folio-card-header>
          <h3>{project.repo || project.name}</h3>
          {project.language && (
            <span data-folio-language data-folio-language-color={project.languageColor || undefined}>
              {project.language}
            </span>
          )}
        </div>
        {project.description && <div data-folio-card-description>{project.description}</div>}
        {project.stack && project.stack.length > 0 && (
          <div data-folio-card-tags>
            {project.stack.map((tag) => (
              <span key={tag} data-folio-tag>
                {tag}
              </span>
            ))}
          </div>
        )}
        {statsComponent ? (
          statsComponent
        ) : (
          <GitHubCard.Stats project={project} showForks={showForks} />
        )}
        <div data-folio-card-status data-folio-status-value={project.status}>
          {project.status}
        </div>
        <GitHubCard.Links project={project} />
        {children && <div data-folio-card-footer>{children}</div>}
      </div>
    )
  }

  return <div data-folio-card>{children}</div>
}

GitHubCard.Header = function GitHubCardHeader({ project }: { project: FolioProject }) {
  return (
    <div data-folio-card-header>
      <h3>{project.repo || project.name}</h3>
      {project.language && (
        <span data-folio-language data-folio-language-color={project.languageColor || undefined}>
          {project.language}
        </span>
      )}
    </div>
  )
}

GitHubCard.Description = function GitHubCardDescription({ project }: { project: FolioProject }) {
  if (!project.description) return null
  return <div data-folio-card-description>{project.description}</div>
}

GitHubCard.Tags = function GitHubCardTags({ project }: { project: FolioProject }) {
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

GitHubCard.Stats = function GitHubCardStats({ project, showForks = true }: { project: FolioProject; showForks?: boolean }) {
  const hasStats = project.stats?.stars || (showForks && project.stats?.forks) || project.commits?.length
  if (!hasStats) return null

  return (
    <div data-folio-card-stats>
      {project.stats?.stars && (
        <span data-folio-stat="stars">
          <span data-folio-stat-icon="stars" />
          {project.stats.stars} stars
        </span>
      )}
      {showForks && project.stats?.forks && (
        <span data-folio-stat="forks">
          <span data-folio-stat-icon="forks" />
          {project.stats.forks} forks
        </span>
      )}
      {project.commits && project.commits.length > 0 && (
        <span data-folio-stat="commits">
          <span data-folio-stat-icon="commits" />
          {project.commits.length} commits
        </span>
      )}
    </div>
  )
}

GitHubCard.Status = function GitHubCardStatus({ project }: { project: FolioProject }) {
  return (
    <div data-folio-status data-folio-status-value={project.status}>
      {project.status}
    </div>
  )
}

GitHubCard.Links = function GitHubCardLinks({ project }: { project: FolioProject }) {
  const hasGitHubLink = project.links.github !== undefined
  const hasLiveLink = project.links.live !== undefined

  if (!hasGitHubLink && !hasLiveLink) return null

  return (
    <div data-folio-card-links>
      {project.links.github && (
        <a href={project.links.github} data-folio-link data-folio-link-type="github">
          GitHub
        </a>
      )}
      {project.links.live && (
        <a href={project.links.live} data-folio-link data-folio-link-type="live">
          Live
        </a>
      )}
    </div>
  )
}

GitHubCard.Footer = function GitHubCardFooter({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <div data-folio-card-footer>{children}</div>
}

export { GitHubCard }
