# sortByStars

Sort GitHub projects by star count.

## Signature

```tsx
function sortByStars(
  projects: ProjexProject[],
  order?: SortOrder
): ProjexProject[]
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| projects | `ProjexProject[]` | - | Array of projects to sort |
| order | `SortOrder` | `'desc'` | Sort order: `'asc'` or `'desc'` |

## Returns

`ProjexProject[]` - Sorted array of projects (new array, does not mutate input)

## Types

```tsx
type SortOrder = 'asc' | 'desc'
```

## Behavior

- Returns empty array if `projects` is empty
- Only sorts GitHub projects by stars
- Non-GitHub projects and projects with 0 stars are placed at the end (for `'desc'`) or beginning (for `'asc'`)

## Example

```tsx
import { sortByStars } from '@manningworks/projex'

// Most starred first (default)
const popularFirst = sortByStars(projects)

// Least starred first
const leastPopularFirst = sortByStars(projects, 'asc')
```

## Common Usage

Show most popular GitHub projects:

```tsx
const popularProjects = sortByStars(projects, 'desc').slice(0, 5)
```

## Note

This function only considers GitHub projects. Non-GitHub projects are always placed at the end/beginning regardless of their stats.
