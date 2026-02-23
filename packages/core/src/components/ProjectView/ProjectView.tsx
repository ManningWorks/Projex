import type { FolioProject } from '../../types'
import { CommitList } from '../CommitList'

type SectionName = keyof Pick<FolioProject, 'description' | 'background' | 'why' | 'stack' | 'struggles' | 'timeline' | 'posts' | 'commits'>

function isValidSectionName(name: string): name is SectionName {
  return ['description', 'background', 'why', 'stack', 'struggles', 'timeline', 'posts', 'commits'].includes(name)
}

function ProjectView({
  project,
  onBack,
  children
}: {
  project: FolioProject
  onBack?: () => void
  children: React.ReactNode
}) {
  return (
    <div data-folio-view>
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
  project: FolioProject
  name: string
}) {
  if (!isValidSectionName(name)) return null

  const sectionData = project[name]

  if (!sectionData) return null

  return (
    <div data-folio-view-section data-folio-view-section-name={name}>
      {typeof sectionData === 'string' && <>{sectionData}</>}
      {Array.isArray(sectionData) &&
        sectionData.map((item, index) => {
          if (typeof item === 'string') {
            return <span key={index} data-folio-tag>{item}</span>
          }
          if ('type' in item && 'text' in item) {
            const struggle = item as { type: string; text: string }
            return (
              <div key={index} data-folio-struggle data-folio-struggle-type={struggle.type}>
                {struggle.text}
              </div>
            )
          }
          if ('date' in item && ('note' in item || 'title' in item)) {
            if ('note' in item) {
              const timeline = item as { date: string; note: string }
              return (
                <div key={index}>
                  <span data-folio-timeline-date>{timeline.date}</span>
                  <span data-folio-timeline-note>{timeline.note}</span>
                </div>
              )
            }
            if ('title' in item) {
              const post = item as { title: string; date: string; url?: string }
              return (
                <div key={index}>
                  <span data-folio-post-title>{post.title}</span>
                  <span data-folio-post-date>{post.date}</span>
                  {post.url && (
                    <a href={post.url} data-folio-post-link>
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

ProjectView.Links = function ProjectViewLinks({ project }: { project: FolioProject }) {
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
    <div data-folio-view-links>
      {order.map(linkType => {
        if (linkType === 'custom') {
          return links.custom?.map((link) => (
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

        const url = links[linkType as keyof typeof links] as string | undefined
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

ProjectView.Stats = function ProjectViewStats({ project }: { project: FolioProject }) {
  if (!project.stats) {
    return null
  }

  const hasStats =
    project.stats.stars ||
    project.stats.forks ||
    project.stats.downloads ||
    project.stats.version ||
    project.stats.upvotes ||
    project.stats.comments

  if (!hasStats) {
    return null
  }

  return (
    <div data-folio-view-stats>
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

ProjectView.Commits = function ProjectViewCommits({ project }: { project: FolioProject }) {
  if (!project.commits || project.commits.length === 0) {
    return null
  }

  return (
    <div data-folio-commits>
      <div data-folio-commits-header>Commits</div>
      <CommitList commits={project.commits} />
    </div>
  )
}

export { ProjectView }
