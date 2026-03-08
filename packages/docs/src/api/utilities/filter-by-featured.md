# filterByFeatured

Filter projects by their featured status.

## Signature

```tsx
function filterByFeatured(
  projects: ProjexProject[],
  featured: boolean | null | undefined
): ProjexProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProject[]` | Array of projects to filter |
| featured | `boolean \| null \| undefined` | Featured status to filter by |

## Returns

`ProjexProject[]` - Filtered array of projects (new array, does not mutate input)

## Behavior

- Returns empty array if `projects` is empty
- Returns copy of all projects if `featured` is `null` or `undefined`
- Filters by featured status if `featured` is a boolean

## Example

```tsx
import { filterByFeatured } from '@manningworks/projex'

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
