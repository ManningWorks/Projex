# searchProjects

Pure fuzzy search over projects — the non-React sibling of `useProjectSearch`, fitting the `filterByStatus` / `sortProjects` family of helpers. Usable in server components, scripts and tests where a hook is not available.

## Signature

```tsx
function searchProjects(
  projects: ProjexProject[],
  query: string | undefined | null,
  options?: FuseSearchOptions
): ProjexProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProject[]` | Array of projects to search |
| query | `string \| undefined \| null` | Search query string |
| options | `FuseSearchOptions` | Optional configuration |

## Returns

`ProjexProject[]` - The input array unchanged when the query is empty, null, undefined, or whitespace-only; otherwise matching projects ranked by Fuse relevance.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| threshold | `number` | `0.3` | Fuse.js fuzzy match threshold (lower = stricter) |
| keys | `Array<{ name: string; weight: number }>` | `name` (2), `tagline` (1.5), `description` (1.5), `stack` (1) | Weighted fields to search |

## Example

```tsx
import { searchProjects, filterByStatus, sortProjects } from '@manningworks/projex'

// Chain it with the other pure helpers
const results = sortProjects(
  searchProjects(
    filterByStatus(projects, 'active'),
    'dashboard'
  ),
  'stars'
)
```

### Custom Keys and Threshold

```tsx
import { searchProjects } from '@manningworks/projex'

// Only search names, strictly
const nameMatches = searchProjects(projects, query, {
  threshold: 0.1,
  keys: [{ name: 'name', weight: 1 }],
})
```

## When to use which

| Situation | Use |
|-----------|-----|
| Client component with a query state | `useProjectSearch` (memoises the Fuse index) |
| Server component, script, or plain data pipeline | `searchProjects` |
| You need the raw Fuse instance (e.g. `remove()`, custom search calls) | `createFuseSearch` |

## Related

- [useProjectSearch](./use-project-search) - React hook wrapper
- [Fuse Search Utilities](./fuse-search) - `getFuseOptions` / `createFuseSearch`
