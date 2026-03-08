# Fuse Search Utilities

Configuration utilities for fuzzy search using Fuse.js. These functions provide typed options and search instances for project search.

## getFuseOptions

Get Fuse.js search configuration options with default weights for project fields.

### Signature

```tsx
function getFuseOptions(threshold?: number): FuseOptions
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|----------|-------------|
| threshold | `number` | `0.3` | Match threshold (0.0 = perfect match, 1.0 = match anything) |

### Returns

`FuseOptions` - Fuse.js configuration object with weighted search keys

### Types

```tsx
interface FuseOptions {
  threshold: number
  keys: Array<{ name: string; weight: number }>
}
```

### Default Weights

| Key | Weight | Description |
|-----|--------|-------------|
| `name` | 2 | Project name (highest priority) |
| `description` | 1.5 | Project description (medium priority) |
| `stack` | 1 | Technology stack (lowest priority) |

### Example

```tsx
import { getFuseOptions } from '@manningworks/projex'

// Default threshold (0.3)
const options = getFuseOptions()
// { threshold: 0.3, keys: [{ name: 'name', weight: 2 }, ...] }

// Custom threshold for stricter matching
const strictOptions = getFuseOptions(0.1)
// { threshold: 0.1, keys: [{ name: 'name', weight: 2 }, ...] }
```

### Threshold Values

| Value | Behavior |
|-------|----------|
| `0.0` | Perfect match only (exact matches) |
| `0.1` | Very strict (near-exact matches) |
| `0.3` | Balanced (default, good balance) |
| `0.5` | Moderate (fuzzy matching) |
| `1.0` | Very lenient (matches anything) |

## createFuseSearch

Create a configured Fuse search instance for fuzzy searching projects.

### Signature

```tsx
function createFuseSearch(projects: ProjexProject[], threshold?: number): Fuse<ProjexProject>
```

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|----------|-------------|
| projects | `ProjexProject[]` | - | Array of projects to search |
| threshold | `number` | `0.3` | Match threshold (0.0 = perfect, 1.0 = match anything) |

### Returns

`Fuse<ProjexProject>` - Fuse search instance ready for searching

### Example

```tsx
import { createFuseSearch } from '@manningworks/projex'

const fuse = createFuseSearch(projects)

// Search for projects
const results = fuse.search('react')

// Each result has item (project) and refIndex
results.forEach(({ item, refIndex }) => {
  console.log(item.name, refIndex)
})
```

## Usage in useProjectSearch

These utilities are used internally by `useProjectSearch` hook:

```tsx
import { useProjectSearch } from '@manningworks/projex'

function ProjectSearch({ projects }) {
  const [query, setQuery] = useState('')

  // Internally uses createFuseSearch with getFuseOptions
  const filteredProjects = useProjectSearch(projects, query)

  return <ProjectGrid projects={filteredProjects} />
}
```

## Advanced Usage

### Custom Weights

For custom search behavior, create your own options:

```tsx
import Fuse from 'fuse.js'
import type { ProjexProject } from '@manningworks/projex'

const fuse = new Fuse(projects, {
  threshold: 0.2,
  keys: [
    { name: 'name', weight: 3 },
    { name: 'description', weight: 1 },
    { name: 'stack', weight: 0.5 }
  ]
})
```

### Multi-term Search

Fuse supports searching multiple terms:

```tsx
const fuse = createFuseSearch(projects)

// Matches projects with both 'react' and 'next'
const results = fuse.search('react next')
```

## Related

- `useProjectSearch` - React hook for fuzzy search with Fuse.js
- Fuse.js documentation: https://fusejs.io/
