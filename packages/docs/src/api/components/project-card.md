# ProjectCard

Card component for displaying individual project summaries. Uses the compound component pattern for flexible composition.

## Preview

<ProjectCardPreview />

## Import

```tsx
import { ProjectCard } from '@reallukemanning/folio'
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
| project | `FolioProject` | Yes | Project data to display |

### ProjectCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### ProjectCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### ProjectCard.Stats

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.stats` is empty or contains no values.

### ProjectCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

### ProjectCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if no links are available.

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-folio-card` | - | Root card container |
| `data-folio-card-header` | - | Header section |
| `data-folio-card-description` | - | Description section |
| `data-folio-card-tags` | - | Tags container |
| `data-folio-card-stats` | - | Stats container |
| `data-folio-card-links` | - | Links container |
| `data-folio-status` | - | Status badge |
| `data-folio-status-value` | `active` \| `shipped` \| ... | Current status |
| `data-folio-type` | - | Type badge |
| `data-folio-type-value` | `github` \| `npm` \| ... | Project type |
| `data-folio-tag` | - | Individual tag |
| `data-folio-link` | - | Link element |
| `data-folio-link-type` | `github` \| `live` \| `npm` \| `product-hunt` | Link type |
| `data-folio-stat` | `stars` \| `forks` \| `downloads` \| `version` \| `upvotes` \| `comments` | Stat type |

## Example

```tsx
import { ProjectCard } from '@reallukemanning/folio'

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
