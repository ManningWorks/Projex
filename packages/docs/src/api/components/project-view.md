# ProjectView

Full page view for displaying detailed project information. Uses the compound component pattern with section-based content.

## Preview

<ProjectViewPreview />

## Import

```tsx
import { ProjectView } from '@folio/core'
```

## Usage

```tsx
<ProjectView project={project} onBack={() => router.push('/')}>
  <ProjectView.Section name="background" project={project} />
  <ProjectView.Section name="why" project={project} />
  <ProjectView.Section name="stack" project={project} />
  <ProjectView.Section name="struggles" project={project} />
  <ProjectView.Section name="timeline" project={project} />
  <ProjectView.Section name="posts" project={project} />
  <ProjectView.Stats project={project} />
  <ProjectView.Links project={project} />
</ProjectView>
```

## Props

### ProjectView (Root)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |
| onBack | `() => void` | No | Callback for back button click |
| children | `React.ReactNode` | Yes | Child components to render |

### ProjectView.Section

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |
| name | `string` | Yes | Section name: `background`, `why`, `stack`, `struggles`, `timeline`, `posts` |

Returns `null` if the specified section data is empty.

### ProjectView.Stats

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.stats` is empty.

### ProjectView.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if no links are available.

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-folio-view` | - | Root view container |
| `data-folio-view-section` | - | Section container |
| `data-folio-view-section-name` | `background` \| `why` \| ... | Section name |
| `data-folio-view-stats` | - | Stats container |
| `data-folio-view-links` | - | Links container |
| `data-folio-tag` | - | Individual tag (for stack) |
| `data-folio-struggle` | - | Struggle item |
| `data-folio-struggle-type` | `warn` \| `error` | Struggle severity |
| `data-folio-timeline-date` | - | Timeline date |
| `data-folio-timeline-note` | - | Timeline note |
| `data-folio-post-title` | - | Post title |
| `data-folio-post-date` | - | Post date |
| `data-folio-post-link` | - | Post link |
| `data-folio-link` | - | Link element |
| `data-folio-link-type` | `github` \| `live` \| `npm` \| `app-store` \| `play-store` \| `product-hunt` | Link type |
| `data-folio-stat` | `stars` \| `forks` \| `downloads` \| `version` \| `upvotes` \| `comments` | Stat type |

## Example

```tsx
import { ProjectView } from '@folio/core'
import { useRouter } from 'next/navigation'

function ProjectPage({ project }) {
  const router = useRouter()
  
  return (
    <ProjectView project={project} onBack={() => router.push('/')}>
      <ProjectView.Section name="background" project={project} />
      <ProjectView.Section name="why" project={project} />
      <ProjectView.Section name="stack" project={project} />
      <ProjectView.Section name="struggles" project={project} />
      <ProjectView.Section name="timeline" project={project} />
      <ProjectView.Stats project={project} />
      <ProjectView.Links project={project} />
    </ProjectView>
  )
}
```

## Section Content Handling

The Section component handles different data types:

- **String** (background, why): Renders as text
- **String array** (stack): Renders as tags
- **Struggle array**: Renders with type styling
- **Timeline array**: Renders date/note pairs
- **Posts array**: Renders title, date, and optional link
