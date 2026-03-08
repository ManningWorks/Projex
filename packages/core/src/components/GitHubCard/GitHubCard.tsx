import type { ReactNode } from 'react'
import type { ProjexProject } from '../../types'

export interface GitHubCardProps {
  project?: ProjexProject
  showForks?: boolean
  statsComponent?: ReactNode
  children?: ReactNode
}

function GitHubCard({ project, showForks = true, statsComponent, children }: GitHubCardProps) {
  if (project) {
    return (
      <div data-projex-card>
        <div data-projex-card-header>
          <h3>{project.repo || project.name}</h3>
          {project.language && (
            <span data-projex-language data-projex-language-color={project.languageColor || undefined}>
              {project.language}
            </span>
          )}
        </div>
        {project.description && <div data-projex-card-description>{project.description}</div>}
        {project.stack && project.stack.length > 0 && (
          <div data-projex-card-tags>
            {project.stack.map((tag) => (
              <span key={tag} data-projex-tag>
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
        <div data-projex-card-status data-projex-status-value={project.status}>
          {project.status}
        </div>
        <GitHubCard.Links project={project} />
        {children && <div data-projex-card-footer>{children}</div>}
      </div>
    )
  }

  return <div data-projex-card>{children}</div>
}

GitHubCard.Header = function GitHubCardHeader({ project }: { project: ProjexProject }) {
  return (
    <div data-projex-card-header>
      <h3>{project.repo || project.name}</h3>
      {project.language && (
        <span data-projex-language data-projex-language-color={project.languageColor || undefined}>
          {project.language}
        </span>
      )}
    </div>
  )
}

GitHubCard.Description = function GitHubCardDescription({ project }: { project: ProjexProject }) {
  if (!project.description) return null
  return <div data-projex-card-description>{project.description}</div>
}

GitHubCard.Tags = function GitHubCardTags({ project }: { project: ProjexProject }) {
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

GitHubCard.Stats = function GitHubCardStats({ project, showForks = true }: { project: ProjexProject; showForks?: boolean }) {
  const hasStats = project.stats?.stars || (showForks && project.stats?.forks) || project.commits?.length
  if (!hasStats) return null

  return (
    <div data-projex-card-stats>
      {project.stats?.stars && (
        <span data-projex-stat="stars">
          <span data-projex-stat-icon="stars" />
          {project.stats.stars} stars
        </span>
      )}
      {showForks && project.stats?.forks && (
        <span data-projex-stat="forks">
          <span data-projex-stat-icon="forks" />
          {project.stats.forks} forks
        </span>
      )}
      {project.commits && project.commits.length > 0 && (
        <span data-projex-stat="commits">
          <span data-projex-stat-icon="commits" />
          {project.commits.length} commits
        </span>
      )}
    </div>
  )
}

GitHubCard.Status = function GitHubCardStatus({ project }: { project: ProjexProject }) {
  return (
    <div data-projex-status data-projex-status-value={project.status}>
      {project.status}
    </div>
  )
}

GitHubCard.Links = function GitHubCardLinks({ project }: { project: ProjexProject }) {
  const hasGitHubLink = project.links.github !== undefined
  const hasLiveLink = project.links.live !== undefined

  if (!hasGitHubLink && !hasLiveLink) return null

  return (
    <div data-projex-card-links>
      {project.links.github && (
        <a href={project.links.github} data-projex-link data-projex-link-type="github">
          GitHub
        </a>
      )}
      {project.links.live && (
        <a href={project.links.live} data-projex-link data-projex-link-type="live">
          Live
        </a>
      )}
    </div>
  )
}

GitHubCard.Footer = function GitHubCardFooter({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <div data-projex-card-footer>{children}</div>
}

export { GitHubCard }
