# filterByType

Filter projects by their type value.

## Signature

```tsx
function filterByType(
  projects: FolioProject[],
  type: ProjectType | 'all' | undefined
): FolioProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `FolioProject[]` | Array of projects to filter |
| type | `ProjectType \| 'all' \| undefined` | Type to filter by |

## Returns

`FolioProject[]` - Filtered array of projects (new array, does not mutate input)

## Behavior

- Returns empty array if `projects` is empty
- Returns copy of all projects if `type` is `'all'` or `undefined`
- Filters by single type if `type` is a `ProjectType` value

## Example

```tsx
import { filterByType } from '@reallukemanning/folio'

// Single type
const githubProjects = filterByType(projects, 'github')

// All projects
const allProjects = filterByType(projects, 'all')

// With undefined
const allProjects = filterByType(projects, undefined)
```

## Type Values

```tsx
type ProjectType = 
  | 'github'
  | 'manual'
  | 'npm'
  | 'product-hunt'
  | 'hybrid'
```
