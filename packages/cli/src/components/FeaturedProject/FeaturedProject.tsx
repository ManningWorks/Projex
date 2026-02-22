import type { FolioProject } from '../../types'

function FeaturedProject({ project }: { project: FolioProject | null | undefined }) {
  if (!project) {
    return null
  }

  return (
    <div data-folio-featured>
      {project.image && <img data-folio-featured-image src={project.image} alt={project.name} />}
      <div data-folio-view>
        <h2>{project.name}</h2>
        {project.background && <div data-folio-view-section data-folio-view-section-name="background">{project.background}</div>}
        {project.why && <div data-folio-view-section data-folio-view-section-name="why">{project.why}</div>}
        {project.stats && (project.stats.stars || project.stats.forks || project.stats.downloads) && (
          <div data-folio-card-stats>
            {project.stats.stars && <span data-folio-stat="stars">{project.stats.stars} stars</span>}
            {project.stats.forks && <span data-folio-stat="forks">{project.stats.forks} forks</span>}
            {project.stats.downloads && <span data-folio-stat="downloads">{project.stats.downloads} downloads</span>}
          </div>
        )}
        <div data-folio-view-links>
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
          {project.links.npm && (
            <a href={project.links.npm} data-folio-link data-folio-link-type="npm">
              npm
            </a>
          )}
          {project.links.appStore && (
            <a href={project.links.appStore} data-folio-link data-folio-link-type="app-store">
              App Store
            </a>
          )}
          {project.links.playStore && (
            <a href={project.links.playStore} data-folio-link data-folio-link-type="play-store">
              Play Store
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export { FeaturedProject }
