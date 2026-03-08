# ProjectView

Full page view for displaying detailed project information. Uses compound component pattern with section-based content.

## Import

```tsx
import { ProjectView } from '@manningworks/projex'
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
  <ProjectView.Commits project={project} />
</ProjectView>
```

## Props

### ProjectView (Root)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |
| onBack | `() => void` | No | Callback for back button click |
| children | `React.ReactNode` | Yes | Child components to render |

### ProjectView.Section

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |
| name | `string` | Yes | Section name: `background`, `why`, `stack`, `struggles`, `timeline`, `posts` |

Returns `null` if the specified section data is empty.

### ProjectView.Stats

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.stats` is empty.

### ProjectView.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if no links are available.

### ProjectView.Commits

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.commits` is empty or undefined. Available for GitHub and hybrid project types only.

Requires the `commits` field to be set in project configuration or global options:

```ts
// Per-project commits
{
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  commits: 10
}

// Global commits in defineProjects
defineProjects([...projects], { commits: 5 })
```

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-view` | - | Root view container |
| `data-projex-view-section` | - | Section container |
| `data-projex-view-section-name` | `background` \| `why` \| ... | Section name |
| `data-projex-view-stats` | - | Stats container |
| `data-projex-view-links` | - | Links container |
| `data-projex-tag` | - | Individual tag (for stack) |
| `data-projex-struggle` | - | Struggle item |
| `data-projex-struggle-type` | `warn` \| `error` | Struggle severity |
| `data-projex-timeline-date` | - | Timeline date |
| `data-projex-timeline-note` | - | Timeline note |
| `data-projex-post-title` | - | Post title |
| `data-projex-post-date` | - | Post date |
| `data-projex-post-link` | - | Post link |
| `data-projex-link` | - | Link element |
| `data-projex-link-type` | `github` \| `live` \| `docs` \| `demo` \| `npm` \| `app-store` \| `play-store` \| `product-hunt` \| `custom` | Link type |
| `data-projex-link-label` | `string` | Custom link label |
| `data-projex-stat` | `stars` \| `forks` \| `downloads` \| `version` \| `upvotes` \| `comments` | Stat type |
| `data-projex-commits` | - | Commits container |
| `data-projex-commits-header` | - | Commits section header |
| `data-projex-commit-list` | - | Commit list container |
| `data-projex-commit` | - | Individual commit item |
| `data-projex-commit-message` | - | Commit message |
| `data-projex-commit-date` | - | Commit date |
| `data-projex-commit-link` | - | Commit link |
| `data-projex-commit-author` | - | Commit author |

## Example

```tsx
import { ProjectView } from '@manningworks/projex'
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
      <ProjectView.Commits project={project} />
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
