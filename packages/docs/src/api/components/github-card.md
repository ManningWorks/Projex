# GitHubCard

Pre-built card component for GitHub projects. Displays project name, description, stars, forks, language, and commits in a single component.

## Installation

```bash
npx @manningworks/projex add github-card
```

## Import

```tsx
import { GitHubCard } from '@manningworks/projex'
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
| project | `ProjexProject` | No | - | Project data to display (renders children only if omitted) |
| showForks | `boolean` | No | `true` | Whether to display fork count |
| statsComponent | `React.ReactNode` | No | - | Custom stats component to render instead of default stats |
| children | `React.ReactNode` | No | - | Content to render in card footer |

### GitHubCard.Header

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### GitHubCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### GitHubCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### GitHubCard.Stats

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| project | `ProjexProject` | Yes | - | Project data to display |
| showForks | `boolean` | No | `true` | Whether to display fork count |

Returns `null` if no stats are available.

### GitHubCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### GitHubCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if no links are available.

### GitHubCard.Footer

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | No | Content to render in footer |

Returns `null` if no children are provided.

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-card` | - | Root card container |
| `data-projex-card-header` | - | Header section |
| `data-projex-card-description` | - | Description section |
| `data-projex-card-tags` | - | Tags container |
| `data-projex-card-stats` | - | Stats container |
| `data-projex-card-footer` | - | Footer content container |
| `data-projex-status` | - | Status badge |
| `data-projex-status-value` | `active` \| `shipped` \| ... | Current status |
| `data-projex-language` | - | Language label |
| `data-projex-language-color` | `string` | Language color hex value |
| `data-projex-tag` | - | Individual tag |
| `data-projex-link` | - | Link element |
| `data-projex-link-type` | `github` \| `live` | Link type |
| `data-projex-stat` | `stars` \| `forks` \| `commits` | Stat type |
| `data-projex-stat-icon` | `stars` \| `forks` \| `commits` | Stat icon indicator |

## Example

```tsx
import { GitHubCard } from '@manningworks/projex'

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
