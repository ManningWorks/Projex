function ProjectCard({ children }) {
    return <div data-folio-card>{children}</div>;
}
ProjectCard.Header = function ProjectCardHeader({ project }) {
    return (<div data-folio-card-header>
      <h3>{project.name}</h3>
      <div data-folio-type data-folio-type-value={project.type}>
        {project.type}
      </div>
    </div>);
};
ProjectCard.Description = function ProjectCardDescription({ project }) {
    if (!project.description)
        return null;
    return <div data-folio-card-description>{project.description}</div>;
};
ProjectCard.Tags = function ProjectCardTags({ project }) {
    if (!project.stack || project.stack.length === 0)
        return null;
    return (<div data-folio-card-tags>
      {project.stack.map((tag) => (<span key={tag} data-folio-tag>
          {tag}
        </span>))}
    </div>);
};
ProjectCard.Stats = function ProjectCardStats({ project }) {
    if (!project.stats || (!project.stats.stars && !project.stats.forks && !project.stats.downloads)) {
        return null;
    }
    return (<div data-folio-card-stats>
      {project.stats.stars && <span data-folio-stat="stars">{project.stats.stars} stars</span>}
      {project.stats.forks && <span data-folio-stat="forks">{project.stats.forks} forks</span>}
      {project.stats.downloads && (<span data-folio-stat="downloads">{project.stats.downloads} downloads</span>)}
    </div>);
};
ProjectCard.Status = function ProjectCardStatus({ project }) {
    return (<div data-folio-status data-folio-status-value={project.status}>
      {project.status}
    </div>);
};
ProjectCard.Links = function ProjectCardLinks({ project }) {
    if (!project.links.github && !project.links.live && !project.links.npm)
        return null;
    return (<div data-folio-card-links>
      {project.links.github && (<a href={project.links.github} data-folio-link data-folio-link-type="github">
          GitHub
        </a>)}
      {project.links.live && (<a href={project.links.live} data-folio-link data-folio-link-type="live">
          Live
        </a>)}
      {project.links.npm && (<a href={project.links.npm} data-folio-link data-folio-link-type="npm">
          npm
        </a>)}
    </div>);
};
export { ProjectCard };
//# sourceMappingURL=ProjectCard.js.map