# sortByName

Sort projects alphabetically by name.

## Signature

```tsx
function sortByName(
  projects: FolioProject[],
  order?: SortOrder
): FolioProject[]
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| projects | `FolioProject[]` | - | Array of projects to sort |
| order | `SortOrder` | `'asc'` | Sort order: `'asc'` or `'desc'` |

## Returns

`FolioProject[]` - Sorted array of projects (new array, does not mutate input)

## Types

```tsx
type SortOrder = 'asc' | 'desc'
```

## Behavior

- Returns empty array if `projects` is empty
- Uses case-insensitive comparison (`localeCompare` with `sensitivity: 'base'`)
- Projects with no name are placed at the end (regardless of order)

## Example

```tsx
import { sortByName } from '@reallukemanning/folio'

// A-Z (default)
const alphabetical = sortByName(projects)

// Z-A
const reverseAlphabetical = sortByName(projects, 'desc')
```

## Common Usage

Create an alphabetical project index:

```tsx
const sortedProjects = sortByName(projects, 'asc')
```
