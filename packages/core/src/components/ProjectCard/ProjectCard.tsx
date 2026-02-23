import type { FolioProject } from '../../types'

function ProjectCard({ children }: { children: React.ReactNode }) {
  return <div data-folio-card>{children}</div>
}

ProjectCard.Header = function ProjectCardHeader({ project }: { project: FolioProject }) {
  return (
    <div data-folio-card-header>
      <h3>{project.name}</h3>
      <div data-folio-type data-folio-type-value={project.type}>
        {project.type}
      </div>
    </div>
  )
}

ProjectCard.Description = function ProjectCardDescription({ project }: { project: FolioProject }) {
  if (!project.description) return null
  return <div data-folio-card-description>{project.description}</div>
}

ProjectCard.Tags = function ProjectCardTags({ project }: { project: FolioProject }) {
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

ProjectCard.Stats = function ProjectCardStats({ project }: { project: FolioProject }) {
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
    <div data-folio-card-stats>
      {project.stats.stars && <span data-folio-stat="stars">{project.stats.stars} stars</span>}
      {project.stats.forks && <span data-folio-stat="forks">{project.stats.forks} forks</span>}
      {project.stats.downloads && (
        <span data-folio-stat="downloads">{project.stats.downloads} downloads</span>
      )}
      {project.stats.version && <span data-folio-stat="version">{project.stats.version}</span>}
      {project.stats.upvotes && <span data-folio-stat="upvotes">{project.stats.upvotes} upvotes</span>}
      {project.stats.comments && <span data-folio-stat="comments">{project.stats.comments} comments</span>}
    </div>
  )
}

ProjectCard.Status = function ProjectCardStatus({ project }: { project: FolioProject }) {
  return (
    <div data-folio-status data-folio-status-value={project.status}>
      {project.status}
    </div>
  )
}

ProjectCard.Links = function ProjectCardLinks({ project }: { project: FolioProject }) {
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
    <div data-folio-card-links>
      {order.map(linkType => {
        if (linkType === 'custom') {
          return project.links.custom?.map((link) => (
            <a
              key={link.label}
              href={link.url}
              data-folio-link
              data-folio-link-type="custom"
              data-folio-link-label={link.label}
            >
              {link.label}
            </a>
          ))
        }

        if (linkType === 'appStore' || linkType === 'playStore') return null

        const url = project.links[linkType as keyof typeof project.links] as string | undefined
        if (!url) return null

        return (
          <a key={linkType} href={url} data-folio-link data-folio-link-type={linkTypeAttr[linkType]}>
            {linkLabels[linkType]}
          </a>
        )
      })}
    </div>
  )
}

export { ProjectCard }
