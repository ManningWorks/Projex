# filterByFeatured

Filter projects by their featured status.

## Signature

```tsx
function filterByFeatured(
  projects: FolioProject[],
  featured: boolean | null | undefined
): FolioProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `FolioProject[]` | Array of projects to filter |
| featured | `boolean \| null \| undefined` | Featured status to filter by |

## Returns

`FolioProject[]` - Filtered array of projects (new array, does not mutate input)

## Behavior

- Returns empty array if `projects` is empty
- Returns copy of all projects if `featured` is `null` or `undefined`
- Filters by featured status if `featured` is a boolean

## Example

```tsx
import { filterByFeatured } from '@reallukemanning/folio'

// Featured projects only
const featuredProjects = filterByFeatured(projects, true)

// Non-featured projects
const regularProjects = filterByFeatured(projects, false)

// All projects
const allProjects = filterByFeatured(projects, null)
```

## Common Usage

Get the first featured project for a hero section:

```tsx
const featured = filterByFeatured(projects, true)[0]
```
