import type { FolioProject } from '../../types'

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
  const sectionData = project[name as keyof FolioProject]

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
          return null
        })}
    </div>
  )
}

ProjectView.Links = function ProjectViewLinks({ project }: { project: FolioProject }) {
  const links = project.links

  if (
    !links.github &&
    !links.live &&
    !links.npm &&
    !links.appStore &&
    !links.playStore &&
    !links.productHunt
  ) {
    return null
  }

  return (
    <div data-folio-view-links>
      {links.github && (
        <a href={links.github} data-folio-link data-folio-link-type="github">
          GitHub
        </a>
      )}
      {links.live && (
        <a href={links.live} data-folio-link data-folio-link-type="live">
          Live
        </a>
      )}
      {links.npm && (
        <a href={links.npm} data-folio-link data-folio-link-type="npm">
          npm
        </a>
      )}
      {links.appStore && (
        <a href={links.appStore} data-folio-link data-folio-link-type="app-store">
          App Store
        </a>
      )}
      {links.playStore && (
        <a href={links.playStore} data-folio-link data-folio-link-type="play-store">
          Play Store
        </a>
      )}
      {links.productHunt && (
        <a href={links.productHunt} data-folio-link data-folio-link-type="product-hunt">
          Product Hunt
        </a>
      )}
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

export { ProjectView }
