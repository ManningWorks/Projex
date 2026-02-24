# ShowcaseCard

Pre-built card component for manual projects. Displays project name, description, live link, tech stack, and tags in a single component.

## Installation

```bash
npx folio add showcase-card
```

## Import

```tsx
import { ShowcaseCard } from './components/folio/ShowcaseCard'
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
| project | `FolioProject` | No | Project data to display (renders children only if omitted) |
| children | `React.ReactNode` | No | Content to render in card footer |

### ShowcaseCard.Header

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

### ShowcaseCard.Description

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.description` is empty.

### ShowcaseCard.Tags

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if `project.stack` is empty.

### ShowcaseCard.Stats

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

Returns `null` if no stats are available.

### ShowcaseCard.Status

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

### ShowcaseCard.Links

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `FolioProject` | Yes | Project data to display |

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
| `data-folio-card` | - | Root card container |
| `data-folio-card-header` | - | Header section |
| `data-folio-card-tagline` | - | Tagline text |
| `data-folio-card-description` | - | Description section |
| `data-folio-card-tags` | - | Tags container |
| `data-folio-card-stats` | - | Stats container |
| `data-folio-card-footer` | - | Footer content container |
| `data-folio-status` | - | Status badge |
| `data-folio-status-value` | `active` \| `shipped` \| ... | Current status |
| `data-folio-tag` | - | Individual tag |
| `data-folio-link` | - | Link element |
| `data-folio-link-type` | `github` \| `live` \| `docs` \| `demo` \| `npm` \| `product-hunt` \| `app-store` \| `play-store` \| `custom` | Link type |
| `data-folio-link-label` | `string` | Custom link label |
| `data-folio-stat` | `stars` \| `forks` \| `downloads` \| `version` \| `upvotes` \| `comments` | Stat type |

## Example

```tsx
import { ShowcaseCard } from './components/folio/ShowcaseCard'

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
