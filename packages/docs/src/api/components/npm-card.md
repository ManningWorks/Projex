# NpmCard

Compound card component for npm packages. Use subcomponents to build custom npm package cards with full control over layout and styling.

## Installation

```bash
npx @manningworks/projex add npm-card
```

## Import

```tsx
import { NpmCard } from '@manningworks/projex'
```

## Usage

### Basic Usage

```tsx
<NpmCard>
  <NpmCard.Header project={project} />
  <NpmCard.Description project={project} />
  <NpmCard.Stats project={project} />
  <NpmCard.Status project={project} />
  <NpmCard.Links project={project} />
</NpmCard>
```

### Hide Version

```tsx
<NpmCard>
  <NpmCard.Header project={project} />
  <NpmCard.Description project={project} />
  <NpmCard.Stats project={project} showVersion={false} />
  <NpmCard.Status project={project} />
  <NpmCard.Links project={project} />
</NpmCard>
```

### With Footer Content

```tsx
<NpmCard>
  <NpmCard.Header project={project} />
  <NpmCard.Description project={project} />
  <NpmCard.Stats project={project} />
  <NpmCard.Status project={project} />
  <NpmCard.Links project={project} />
  <NpmCard.Footer>
    <div className="mt-4">
      <button>Read Documentation</button>
    </div>
  </NpmCard.Footer>
</NpmCard>
```

## Props

### NpmCard (Root)

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | `React.ReactNode` | No | - | Card subcomponents (Header, Description, Stats, Status, Links, Footer) |

### NpmCard.Header

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### NpmCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### NpmCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### NpmCard.Stats

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| project | `ProjexProject` | Yes | - | Project data to display |
| showVersion | `boolean` | No | `true` | Whether to display version string |

Returns `null` if no stats are available.

### NpmCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### NpmCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if no links are available.

### NpmCard.Footer

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
| `data-projex-tag` | - | Individual tag |
| `data-projex-link` | - | Link element |
| `data-projex-link-type` | `npm` \| `github` \| `docs` | Link type |
| `data-projex-stat` | `downloads` \| `version` | Stat type |
| `data-projex-stat-icon` | `downloads` | Stat icon indicator |

## Example

```tsx
import { NpmCard } from '@manningworks/projex'

function NpmPackages({ projects }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects
        .filter((p) => p.type === 'npm' || p.type === 'hybrid')
        .map((project) => (
          <NpmCard key={project.id}>
            <NpmCard.Header project={project} />
            <NpmCard.Description project={project} />
            <NpmCard.Stats project={project} />
            <NpmCard.Status project={project} />
            <NpmCard.Links project={project} />
          </NpmCard>
        ))}
    </div>
  )
}
```

## Customization

`NpmCard` is copied to your project and can be freely modified to customize card structure and behavior:

```tsx
// components/projex/NpmCard/NpmCard.tsx
function NpmCard({ children }: { children?: ReactNode }) {
  // Your customizations here
}
```
