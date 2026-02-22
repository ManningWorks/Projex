# filterByStatus

Filter projects by their status value.

## Signature

```tsx
function filterByStatus(
  projects: FolioProject[],
  status: ProjectStatus | 'all' | ProjectStatus[] | undefined
): FolioProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `FolioProject[]` | Array of projects to filter |
| status | `ProjectStatus \| 'all' \| ProjectStatus[] \| undefined` | Status to filter by |

## Returns

`FolioProject[]` - Filtered array of projects (new array, does not mutate input)

## Behavior

- Returns empty array if `projects` is empty
- Returns copy of all projects if `status` is `'all'` or `undefined`
- Filters by single status if `status` is a `ProjectStatus` value
- Filters by multiple statuses if `status` is an array

## Example

```tsx
import { filterByStatus } from '@reallukemanning/folio'

// Single status
const activeProjects = filterByStatus(projects, 'active')

// Multiple statuses
const visibleProjects = filterByStatus(projects, ['active', 'shipped'])

// All projects
const allProjects = filterByStatus(projects, 'all')

// With undefined
const allProjects = filterByStatus(projects, undefined)
```

## Status Values

```tsx
type ProjectStatus = 
  | 'active'
  | 'shipped'
  | 'in-progress'
  | 'coming-soon'
  | 'archived'
  | 'for-sale'
```
