# NpmCard

Pre-built card component for npm packages. Displays project name, description, downloads, version, and package link in a single component.

## Installation

```bash
npx folio add npm-card
```

## Import

```tsx
import { NpmCard } from './components/folio/NpmCard'
```

## Usage

### Basic Usage

```tsx
<NpmCard project={project} />
```

### Hide Version

```tsx
<NpmCard project={project} showVersion={false} />
```

### With Footer Content

```tsx
<NpmCard project={project}>
  <div className="mt-4">
    <button>Read Documentation</button>
  </div>
</NpmCard>
```

## Props

### NpmCard (Root)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| project | `FolioProject` | No | - | Project data to display (renders children only if omitted) |
| showVersion | `boolean` | No | `true` | Whether to display version string |
| children | `React.ReactNode` | No | - | Content to render in card footer |

### NpmCard.Header

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

### NpmCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### NpmCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### NpmCard.Stats

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| project | `FolioProject` | Yes | - | Project data to display |
| showVersion | `boolean` | No | `true` | Whether to display version string |

Returns `null` if no stats are available.

### NpmCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

### NpmCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if no links are available.

### NpmCard.Footer

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
| `data-folio-tag` | - | Individual tag |
| `data-folio-link` | - | Link element |
| `data-folio-link-type` | `npm` \| `github` \| `docs` | Link type |
| `data-folio-stat` | `downloads` \| `version` | Stat type |
| `data-folio-stat-icon` | `downloads` | Stat icon indicator |

## Example

```tsx
import { NpmCard } from './components/folio/NpmCard'

function NpmPackages({ projects }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects
        .filter((p) => p.type === 'npm' || p.type === 'hybrid')
        .map((project) => (
          <NpmCard key={project.id} project={project} />
        ))}
    </div>
  )
}
```

## Customization

As a preset component, `NpmCard` is copied to your project and can be freely modified:

```tsx
// components/folio/NpmCard/NpmCard.tsx
function NpmCard({ children }: { children?: ReactNode }) {
  // Your customizations here
}
```
