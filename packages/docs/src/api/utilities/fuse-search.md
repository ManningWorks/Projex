# Fuse Search Utilities

Configuration utilities for fuzzy search using Fuse.js. These functions provide typed options and search instances for project search.

## getFuseOptions

Get Fuse.js search configuration options with default weights for project fields.

### Signature

```tsx
function getFuseOptions(options?: FuseSearchOptions | number): FuseOptions
```

Accepts an options object, or a bare threshold number for backwards compatibility with v1.3.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|----------|-------------|
| options.threshold | `number` | `0.3` | Match threshold (0.0 = perfect match, 1.0 = match anything) |
| options.keys | `Array<{ name: string; weight: number }>` | weighted defaults below | Weighted fields to search (replaces the defaults entirely) |

### Returns

`FuseOptions` - Fuse.js configuration object with weighted search keys

### Types

```tsx
interface FuseSearchOptions {
  threshold?: number
  keys?: Array<{ name: string; weight: number }>
}

interface FuseOptions {
  threshold: number
  ignoreLocation: boolean
  keys: Array<{ name: string; weight: number }>
}
```

### Default Weights

| Key | Weight | Description |
|-----|--------|-------------|
| `name` | 2 | Project name (highest priority) |
| `tagline` | 1.5 | Short, high-signal summary line |
| `description` | 1.5 | Project description |
| `stack` | 1 | Technology stack (lowest priority) |

### Default Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number` | `0.3` | Match threshold (lower = stricter) |
| `ignoreLocation` | `boolean` | `true` | Find matches anywhere in field content (not just at start) |

The `0.3` default is shared by every search entry point (`getFuseOptions`, `createFuseSearch`, `searchProjects`, and `useProjectSearch`).

### Example

```tsx
import { getFuseOptions } from '@manningworks/projex'

// Default threshold (0.3) with ignoreLocation enabled
const options = getFuseOptions()
// { threshold: 0.3, ignoreLocation: true, keys: [{ name: 'name', weight: 2 }, ...] }

// Custom threshold for stricter matching
const strictOptions = getFuseOptions({ threshold: 0.1 })

// Bare number still works (v1.3 back-compat)
const legacyOptions = getFuseOptions(0.1)
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
function createFuseSearch(
  projects: ProjexProject[],
  options?: FuseSearchOptions | number
): Fuse<ProjexProject>
```

Accepts an options object, or a bare threshold number for backwards compatibility with v1.3.

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|----------|-------------|
| projects | `ProjexProject[]` | - | Array of projects to search |
| options.threshold | `number` | `0.3` | Match threshold (0.0 = perfect, 1.0 = match anything) |
| options.keys | `Array<{ name: string; weight: number }>` | weighted defaults | Weighted fields to search |

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

### Custom Keys

Override the searchable fields without dropping down to `new Fuse(...)` yourself:

```tsx
import { createFuseSearch } from '@manningworks/projex'

// Only search names and taglines
const fuse = createFuseSearch(projects, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'tagline', weight: 1 },
  ],
})

// Custom keys and threshold together
const strictFuse = createFuseSearch(projects, {
  threshold: 0.1,
  keys: [{ name: 'stack', weight: 1 }],
})
```

## Usage in useProjectSearch

These utilities are used internally by `useProjectSearch` and `searchProjects`:

```tsx
import { useProjectSearch, ProjectCard } from '@manningworks/projex'

function ProjectSearch({ projects }) {
  const [query, setQuery] = useState('')

  // Internally uses createFuseSearch with getFuseOptions
  const filteredProjects = useProjectSearch(projects, query)

  return <ProjectGrid>
    {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
  </ProjectGrid>
}
```

## Multi-term Search

Fuse supports searching multiple terms:

```tsx
const fuse = createFuseSearch(projects)

// Matches projects with both 'react' and 'next'
const results = fuse.search('react next')
```

## Related

- `searchProjects` - Pure helper returning matching projects directly
- `useProjectSearch` - React hook for fuzzy search with Fuse.js
- Fuse.js documentation: https://fusejs.io/
