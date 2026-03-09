# ShowcaseCard

Pre-built card component for manual projects. Displays project name, description, live link, tech stack, and tags in a single component.

## Installation

```bash
npx projex add showcase-card
```

## Import

```tsx
import { ShowcaseCard } from '@manningworks/projex'
```

## Usage

### Basic Usage

```tsx
<ShowcaseCard project={project} />
```

### With Footer Content

```tsx
<ShowcaseCard project={project}>
  <div className="mt-4">
    <button>View Case Study</button>
  </div>
</ShowcaseCard>
```

## Props

### ShowcaseCard (Root)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | No | Project data to display (renders children only if omitted) |
| children | `React.ReactNode` | No | Content to render in card footer |

### ShowcaseCard.Header

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### ShowcaseCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### ShowcaseCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### ShowcaseCard.Stats

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if no stats are available.

### ShowcaseCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

### ShowcaseCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject` | Yes | Project data to display |

Returns `null` if no links are available.

Supports link ordering via `project.linkOrder` array.

### ShowcaseCard.Footer

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | No | Content to render in footer |

Returns `null` if no children are provided.

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-card` | - | Root card container |
| `data-projex-card-header` | - | Header section |
| `data-projex-card-tagline` | - | Tagline text |
| `data-projex-card-description` | - | Description section |
| `data-projex-card-tags` | - | Tags container |
| `data-projex-card-stats` | - | Stats container |
| `data-projex-card-footer` | - | Footer content container |
| `data-projex-status` | - | Status badge |
| `data-projex-status-value` | `active` \| `shipped` \| ... | Current status |
| `data-projex-tag` | - | Individual tag |
| `data-projex-link` | - | Link element |
| `data-projex-link-type` | `github` \| `live` \| `docs` \| `demo` \| `npm` \| `product-hunt` \| `app-store` \| `play-store` \| `custom` | Link type |
| `data-projex-link-label` | `string` | Custom link label |
| `data-projex-stat` | `stars` \| `forks` \| `downloads` \| `version` \| `upvotes` \| `comments` | Stat type |

## Example

```tsx
import { ShowcaseCard } from '@manningworks/projex'

function ManualProjects({ projects }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects
        .filter((p) => p.type === 'manual')
        .map((project) => (
          <ShowcaseCard key={project.id} project={project} />
        ))}
    </div>
  )
}
```

## Customization

As a preset component, `ShowcaseCard` is copied to your project and can be freely modified:

```tsx
// components/folio/ShowcaseCard/ShowcaseCard.tsx
function ShowcaseCard({ children }: { children?: ReactNode }) {
  // Your customizations here
}
```
