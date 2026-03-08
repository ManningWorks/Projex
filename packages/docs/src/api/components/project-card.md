# ProjectCard

Card component for displaying individual project summaries. Uses compound component pattern for flexible composition.

## Import

```tsx
import { ProjectCard } from '@manningworks/projex'
```

## Usage

```tsx
<ProjectCard>
  <ProjectCard.Header project={project} />
  <ProjectCard.Description project={project} />
  <ProjectCard.Tags project={project} />
  <ProjectCard.Stats project={project} />
  <ProjectCard.Status project={project} />
  <ProjectCard.Links project={project} />
</ProjectCard>
```

## Props

### ProjectCard (Root)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | Yes | Child components to render inside the card |

### ProjectCard.Header

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### ProjectCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### ProjectCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### ProjectCard.Stats

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.stats` is empty or contains no values.

### ProjectCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### ProjectCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if no links are available.

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-card` | - | Root card container |
| `data-projex-card-header` | - | Header section |
| `data-projex-card-description` | - | Description section |
| `data-projex-card-tags` | - | Tags container |
| `data-projex-card-stats` | - | Stats container |
| `data-projex-card-links` | - | Links container |
| `data-projex-status` | - | Status badge |
| `data-projex-status-value` | `active` \| `shipped` \| ... | Current status |
| `data-projex-type` | - | Type badge |
| `data-projex-type-value` | `github` \| `npm` \| ... | Project type |
| `data-projex-tag` | - | Individual tag |
| `data-projex-link` | - | Link element |
| `data-projex-link-type` | `github` \| `live` \| `docs` \| `demo` \| `npm` \| `product-hunt` \| `custom` | Link type |
| `data-projex-link-label` | `string` | Custom link label |
| `data-projex-stat` | `stars` \| `forks` \| `downloads` \| `version` \| `upvotes` \| `comments` | Stat type |
| `data-projex-github-card` | - | Present when project type is 'github' |
| `data-projex-og-image` | `string` | OpenGraph image URL (if project has image) |
| `data-projex-og-title` | `string` | OpenGraph title (project name) |
| `data-projex-og-description` | `string` | OpenGraph description (if project has description) |

## Example

```tsx
import { ProjectCard } from '@manningworks/projex'

function ProjectShowcase({ projects }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectCard.Header project={project} />
          <ProjectCard.Description project={project} />
          <ProjectCard.Tags project={project} />
          <ProjectCard.Stats project={project} />
          <ProjectCard.Status project={project} />
          <ProjectCard.Links project={project} />
        </ProjectCard>
      ))}
    </div>
  )
}
```
