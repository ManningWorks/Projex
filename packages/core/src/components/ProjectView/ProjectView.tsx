import type { ProjexProject } from '../../types'
import { CommitList } from '../CommitList'
import { hasStatValues } from '../../lib/hasStatValues'

type SectionName = keyof Pick<ProjexProject, 'description' | 'background' | 'why' | 'stack' | 'struggles' | 'timeline' | 'posts' | 'commits'>

function isValidSectionName(name: string): name is SectionName {
  return ['description', 'background', 'why', 'stack', 'struggles', 'timeline', 'posts', 'commits'].includes(name)
}

function ProjectView({
  project,
  onBack,
  children
}: {
  project: ProjexProject
  onBack?: () => void
  children: React.ReactNode
}) {
  return (
    <div data-projex-view>
      {onBack && <button onClick={onBack}>Back</button>}
      <h2>{project.name}</h2>
      {children}
    </div>
  )
}

ProjectView.Section = function ProjectViewSection({
  project,
  name
}: {
  project: ProjexProject
  name: string
}) {
  if (!isValidSectionName(name)) return null

  const sectionData = project[name]

  if (!sectionData) return null

  return (
    <div data-projex-view-section data-projex-view-section-name={name}>
      {typeof sectionData === 'string' && <>{sectionData}</>}
      {Array.isArray(sectionData) &&
        sectionData.map((item, index) => {
          if (typeof item === 'string') {
            return <span key={index} data-projex-tag>{item}</span>
          }
          if ('type' in item && 'text' in item) {
            const struggle = item as { type: string; text: string }
            return (
              <div key={index} data-projex-struggle data-projex-struggle-type={struggle.type}>
                {struggle.text}
              </div>
            )
          }
          if ('date' in item && ('note' in item || 'title' in item)) {
            if ('note' in item) {
              const timeline = item as { date: string; note: string }
              return (
                <div key={index}>
                  <span data-projex-timeline-date>{timeline.date}</span>
                  <span data-projex-timeline-note>{timeline.note}</span>
                </div>
              )
            }
            if ('title' in item) {
              const post = item as { title: string; date: string; url?: string }
              return (
                <div key={index}>
                  <span data-projex-post-title>{post.title}</span>
                  <span data-projex-post-date>{post.date}</span>
                  {post.url && (
                    <a href={post.url} data-projex-post-link>
                      Link
                    </a>
                  )}
                </div>
              )
            }
          }
          if ('message' in item && 'date' in item) {
            return null
          }
          return null
        })}
    </div>
  )
}

ProjectView.Links = function ProjectViewLinks({ project }: { project: ProjexProject }) {
  const links = project.links
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
    if (linkType === 'custom') return links.custom && links.custom.length > 0
    return links[linkType as keyof typeof links] !== undefined
  })

  if (!hasLinks) return null

  return (
    <div data-projex-view-links>
      {order.map(linkType => {
        if (linkType === 'custom') {
          return links.custom?.map((link) => (
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

        const url = links[linkType as keyof typeof links] as string | undefined
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

ProjectView.Stats = function ProjectViewStats({ project }: { project: ProjexProject }) {
  if (!project.stats) {
    return null
  }

  const stats = project.stats as any

  if (!hasStatValues(stats)) {
    return null
  }

  return (
    <div data-projex-view-stats>
      {stats.stars && <span data-projex-stat="stars">{stats.stars} stars</span>}
      {stats.forks && <span data-projex-stat="forks">{stats.forks} forks</span>}
      {stats.downloads && (
        <span data-projex-stat="downloads">{stats.downloads} downloads</span>
      )}
      {stats.version && <span data-projex-stat="version">{stats.version}</span>}
      {stats.upvotes && <span data-projex-stat="upvotes">{stats.upvotes} upvotes</span>}
      {stats.comments && <span data-projex-stat="comments">{stats.comments} comments</span>}
      {stats.subscribers && <span data-projex-stat="subscribers">{stats.subscribers} subscribers</span>}
      {stats.views && <span data-projex-stat="views">{stats.views} views</span>}
      {stats.latestVideoTitle && stats.latestVideoUrl && (
        <a href={stats.latestVideoUrl} data-projex-link data-projex-link-type="youtube">
          {stats.latestVideoTitle}
        </a>
      )}
      {stats.formattedRevenue && <span data-projex-stat="revenue">{stats.formattedRevenue}</span>}
      {stats.salesCount && <span data-projex-stat="sales">{stats.salesCount} sales</span>}
      {stats.subscriberCount && (
        <span data-projex-stat="subscribers">{stats.subscriberCount} subscribers</span>
      )}
      {stats.formattedMRR && <span data-projex-stat="mrr">{stats.formattedMRR} MRR</span>}
      {stats.orderCount && <span data-projex-stat="orders">{stats.orderCount} orders</span>}
      {stats.customerCount && (
        <span data-projex-stat="customers">{stats.customerCount} customers</span>
      )}
      {stats.articleCount && <span data-projex-stat="articles">{stats.articleCount} articles</span>}
      {stats.totalViews && <span data-projex-stat="total-views">{stats.totalViews} views</span>}
      {stats.totalReactions && <span data-projex-stat="reactions">{stats.totalReactions} reactions</span>}
    </div>
  )
}

ProjectView.Commits = function ProjectViewCommits({ project }: { project: ProjexProject }) {
  if (!project.commits || project.commits.length === 0) {
    return null
  }

  return (
    <div data-projex-commits>
      <div data-projex-commits-header>Commits</div>
      <CommitList commits={project.commits} />
    </div>
  )
}

export { ProjectView }
