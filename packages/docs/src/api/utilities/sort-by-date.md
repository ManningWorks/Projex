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

## Timestamp Sources by Project Type

Different project types have different timestamp sources:

| Project Type | Auto-populated? | Timestamp Source |
|--------------|-----------------|-----------------|
| `github` | Yes | GitHub API (`created_at`, `updated_at`) |
| `hybrid` | Yes | GitHub API + npm `time` (uses max of both when `fetchNpmTimestamps` is enabled) |
| `npm` | Opt-in | npm `time.created`, `time.modified` (requires `fetchNpmTimestamps: true`) |
| `product-hunt` | Yes | Product Hunt API `featured_at` |
| `youtube` | Yes | YouTube API `latestVideoPublishedAt` |
| `devto` | Yes | Latest article `published_at` |
| `manual` | No | Manual `createdAt`/`updatedAt` only |
| `gumroad` | No | Manual `createdAt`/`updatedAt` only |
| `lemonsqueezy` | No | Manual `createdAt`/`updatedAt` only |

### NPM Timestamps

By default, npm projects do not have automatic timestamps. Enable them in `defineProjects`:

```tsx
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-npm-package',
    type: 'npm',
    package: 'my-package',
    status: 'active',
  },
], {
  fetchNpmTimestamps: true,  // Enables npm timestamp extraction
})
```

### Manual Override

For any project type, you can always manually specify timestamps:

```tsx
{
  id: 'my-project',
  type: 'manual',
  status: 'active',
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
}
```

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
