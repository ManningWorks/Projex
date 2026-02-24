# GitHubCard

Pre-built card component for GitHub projects. Displays project name, description, stars, forks, language, and commits in a single component.

## Installation

```bash
npx folio add github-card
```

## Import

```tsx
import { GitHubCard } from './components/folio/GitHubCard'
```

## Usage

### Basic Usage

```tsx
<GitHubCard project={project} />
```

### Hide Forks

```tsx
<GitHubCard project={project} showForks={false} />
```

### Custom Stats Component

```tsx
<GitHubCard project={project} statsComponent={<MyCustomStats />} />
```

### With Footer Content

```tsx
<GitHubCard project={project}>
  <div className="mt-4">
    <button>View Details</button>
  </div>
</GitHubCard>
```

## Props

### GitHubCard (Root)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| project | `FolioProject` | No | - | Project data to display (renders children only if omitted) |
| showForks | `boolean` | No | `true` | Whether to display fork count |
| statsComponent | `React.ReactNode` | No | - | Custom stats component to render instead of default stats |
| children | `React.ReactNode` | No | - | Content to render in card footer |

### GitHubCard.Header

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

### GitHubCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### GitHubCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### GitHubCard.Stats

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| project | `FolioProject` | Yes | - | Project data to display |
| showForks | `boolean` | No | `true` | Whether to display fork count |

Returns `null` if no stats are available.

### GitHubCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

### GitHubCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if no links are available.

### GitHubCard.Footer

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | No | Content to render in footer |

Returns `null` if no children are provided.

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-folio-card` | - | Root card container |
| `data-folio-card-header` | - | Header section |
| `data-folio-card-description` | - | Description section |
| `data-folio-card-tags` | - | Tags container |
| `data-folio-card-stats` | - | Stats container |
| `data-folio-card-footer` | - | Footer content container |
| `data-folio-status` | - | Status badge |
| `data-folio-status-value` | `active` \| `shipped` \| ... | Current status |
| `data-folio-language` | - | Language label |
| `data-folio-language-color` | `string` | Language color hex value |
| `data-folio-tag` | - | Individual tag |
| `data-folio-link` | - | Link element |
| `data-folio-link-type` | `github` \| `live` | Link type |
| `data-folio-stat` | `stars` \| `forks` \| `commits` | Stat type |
| `data-folio-stat-icon` | `stars` \| `forks` \| `commits` | Stat icon indicator |

## Example

```tsx
import { GitHubCard } from './components/folio/GitHubCard'

function GitHubProjects({ projects }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects
        .filter((p) => p.type === 'github')
        .map((project) => (
          <GitHubCard key={project.id} project={project} />
        ))}
    </div>
  )
}
```

## Customization

As a preset component, `GitHubCard` is copied to your project and can be freely modified:

```tsx
// components/folio/GitHubCard/GitHubCard.tsx
function GitHubCard({ project, showForks = true, statsComponent, children }: GitHubCardProps) {
  // Your customizations here
}
```
