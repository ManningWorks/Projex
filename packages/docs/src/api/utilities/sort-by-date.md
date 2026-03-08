# sortByDate

Sort projects by their date (createdAt or updatedAt).

## Signature

```tsx
function sortByDate(
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
- Sorts by `updatedAt` if available, otherwise `createdAt`
- Projects with no date are placed at the end (for `'desc'`) or beginning (for `'asc'`)

## Example

```tsx
import { sortByDate } from '@manningworks/projex'

// Most recent first (default)
const recentFirst = sortByDate(projects)

// Oldest first
const oldestFirst = sortByDate(projects, 'asc')

// Most recent first (explicit)
const recentFirst = sortByDate(projects, 'desc')
```

## Common Usage

Show recently updated projects:

```tsx
const recentProjects = sortByDate(projects, 'desc').slice(0, 5)
```
