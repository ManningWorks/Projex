import type { ProjexProject } from '../../types'
import type { ProjectStatus } from '../../types'

const statusColors: Record<ProjectStatus, { bg: string; text: string }> = {
  active: { bg: 'var(--projex-status-active-bg, #dcfce7)', text: 'var(--projex-status-active-text, #166534)' },
  shipped: { bg: 'var(--projex-status-shipped-bg, #dbeafe)', text: 'var(--projex-status-shipped-text, #1e40af)' },
  'in-progress': { bg: 'var(--projex-status-in-progress-bg, #fef3c7)', text: 'var(--projex-status-in-progress-text, #92400e)' },
  'coming-soon': { bg: 'var(--projex-status-coming-soon-bg, #f3e8ff)', text: 'var(--projex-status-coming-soon-text, #7c3aed)' },
  archived: { bg: 'var(--projex-status-archived-bg, #f1f5f9)', text: 'var(--projex-status-archived-text, #475569)' },
  'for-sale': { bg: 'var(--projex-status-for-sale-bg, #fee2e2)', text: 'var(--projex-status-for-sale-text, #991b1b)' },
}

interface ProjectCardProps {
  children?: React.ReactNode
  project?: ProjexProject
}

function ProjectCard({ children, project }: ProjectCardProps) {
  return (
    <div
      data-projex-card={project?.id ?? ''}
      data-projex-github-card={project?.type === 'github' ? true : undefined}
      data-projex-og-image={project?.image || undefined}
      data-projex-og-title={project?.name || undefined}
      data-projex-og-description={project?.description || undefined}
      style={{
        backgroundColor: 'var(--projex-card-bg, #ffffff)',
        borderColor: 'var(--projex-card-border, #e5e7eb)',
        borderRadius: 'var(--projex-card-radius, 8px)',
        padding: 'var(--projex-card-padding, 16px)',
        color: 'var(--projex-card-text, #374151)',
      }}
    >
      {children}
    </div>
  )
}

ProjectCard.Header = function ProjectCardHeader({ project }: { project: ProjexProject }) {
  return (
    <div data-projex-card-header>
      <h3>{project.name}</h3>
      <div data-projex-type data-projex-type-value={project.type}>
        {project.type}
      </div>
    </div>
  )
}

ProjectCard.Description = function ProjectCardDescription({ project }: { project: ProjexProject }) {
  if (!project.description) return null
  return <div data-projex-card-description>{project.description}</div>
}

ProjectCard.Tags = function ProjectCardTags({ project }: { project: ProjexProject }) {
  if (!project.stack || project.stack.length === 0) return null
  return (
    <div data-projex-card-tags>
      {project.stack.map((tag) => (
        <span
          key={tag}
          data-projex-tag
          style={{
            backgroundColor: 'var(--projex-tag-bg, #f3f4f6)',
            color: 'var(--projex-tag-text, #374151)',
            borderRadius: 'var(--projex-tag-radius, 4px)',
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

ProjectCard.Stats = function ProjectCardStats({ project }: { project: ProjexProject }) {
  if (
    !project.stats ||
    (!project.stats.stars &&
      !project.stats.forks &&
      !project.stats.downloads &&
      !project.stats.version &&
      !project.stats.upvotes &&
      !project.stats.comments &&
      !project.stats.subscribers &&
      !project.stats.views &&
      !project.stats.latestVideoTitle &&
      !project.stats.formattedRevenue &&
      !project.stats.salesCount &&
      !project.stats.subscriberCount &&
      !project.stats.formattedMRR &&
      !project.stats.orderCount &&
      !project.stats.customerCount &&
      !project.stats.articleCount &&
      !project.stats.totalViews &&
      !project.stats.averageReactions)
  ) {
    return null
  }
  return (
    <div
      data-projex-card-stats
      style={{
        color: 'var(--projex-stats-label, #6b7280)',
      }}
    >
      {project.stats.stars && (
        <span
          data-projex-stat="stars"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.stars} stars
        </span>
      )}
      {project.stats.forks && (
        <span
          data-projex-stat="forks"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.forks} forks
        </span>
      )}
      {project.stats.downloads && (
        <span
          data-projex-stat="downloads"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.downloads} downloads
        </span>
      )}
      {project.stats.version && (
        <span
          data-projex-stat="version"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.version}
        </span>
      )}
      {project.stats.upvotes && (
        <span
          data-projex-stat="upvotes"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.upvotes} upvotes
        </span>
      )}
      {project.stats.comments && (
        <span
          data-projex-stat="comments"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.comments} comments
        </span>
      )}
      {project.stats.subscribers && (
        <span
          data-projex-stat="subscribers"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.subscribers} subscribers
        </span>
      )}
      {project.stats.views && (
        <span
          data-projex-stat="views"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.views} views
        </span>
      )}
      {project.stats.latestVideoTitle && project.stats.latestVideoUrl && (
        <a
          href={project.stats.latestVideoUrl}
          data-projex-link
          data-projex-link-type="youtube"
          style={{ color: 'var(--projex-link-text, #374151)' }}
          className="projex-link"
        >
          {project.stats.latestVideoTitle}
        </a>
      )}
      {project.stats.formattedRevenue && (
        <span
          data-projex-stat="revenue"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.formattedRevenue}
        </span>
      )}
      {project.stats.salesCount && (
        <span
          data-projex-stat="sales"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.salesCount} sales
        </span>
      )}
      {project.stats.subscriberCount && (
        <span
          data-projex-stat="subscribers"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.subscriberCount} subscribers
        </span>
      )}
      {project.stats.formattedMRR && (
        <span
          data-projex-stat="mrr"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.formattedMRR} MRR
        </span>
      )}
      {project.stats.orderCount && (
        <span
          data-projex-stat="orders"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.orderCount} orders
        </span>
      )}
      {project.stats.customerCount && (
        <span
          data-projex-stat="customers"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.customerCount} customers
        </span>
      )}
      {project.stats.articleCount && (
        <span
          data-projex-stat="articles"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.articleCount} articles
        </span>
      )}
      {project.stats.totalViews && (
        <span
          data-projex-stat="total-views"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.totalViews} views
        </span>
      )}
      {project.stats.averageReactions && (
        <span
          data-projex-stat="reactions"
          style={{ color: 'var(--projex-stats-value, #374151)' }}
        >
          {project.stats.averageReactions} reactions
        </span>
      )}
    </div>
  )
}

ProjectCard.Status = function ProjectCardStatus({ project }: { project: ProjexProject }) {
  const colors = statusColors[project.status]
  return (
    <div
      data-projex-status
      data-projex-status-value={project.status}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {project.status}
    </div>
  )
}

ProjectCard.Links = function ProjectCardLinks({ project }: { project: ProjexProject }) {
  const standardLinks = ['github', 'live', 'docs', 'demo', 'npm', 'productHunt', 'youtube', 'custom'] as const

  const linkLabels: Record<string, string> = {
    github: 'GitHub',
    live: 'Live',
    docs: 'Docs',
    demo: 'Demo',
    npm: 'npm',
    productHunt: 'Product Hunt',
    youtube: 'YouTube',
  }

  const linkTypeAttr: Record<string, string> = {
    github: 'github',
    live: 'live',
    docs: 'docs',
    demo: 'demo',
    npm: 'npm',
    productHunt: 'product-hunt',
    youtube: 'youtube',
  }

  const order = project.linkOrder || standardLinks

  const hasLinks = order.some(linkType => {
    if (linkType === 'custom') return project.links.custom && project.links.custom.length > 0
    return project.links[linkType as keyof typeof project.links] !== undefined
  })

  if (!hasLinks) return null

  return (
    <div
      data-projex-card-links
      style={{
        color: 'var(--projex-link-text, #374151)',
      }}
    >
      {order.map(linkType => {
        if (linkType === 'custom') {
          return project.links.custom?.map((link) => (
            <a
              key={link.label}
              href={link.url}
              data-projex-link
              data-projex-link-type="custom"
              data-projex-link-label={link.label}
              style={{
                color: 'var(--projex-link-text, #374151)',
              }}
              className="projex-link"
            >
              {link.label}
            </a>
          ))
        }

        const url = project.links[linkType as keyof typeof project.links] as string | undefined
        if (!url) return null

        return (
          <a
            key={linkType}
            href={url}
            data-projex-link
            data-projex-link-type={linkTypeAttr[linkType]}
            style={{
              color: 'var(--projex-link-text, #374151)',
            }}
            className="projex-link"
          >
            {linkLabels[linkType]}
          </a>
        )
      })}
    </div>
  )
}

export { ProjectCard }
