# SortValue

Allowed sort values for `sortProjects` function. Defines how projects can be sorted.

## Definition

```tsx
type SortValue = 'stars' | 'name' | 'date'
```

## Values

| Value | Description | Usage |
|-------|-------------|--------|
| `stars` | Sort by GitHub stars (highest first) | GitHub and hybrid projects |
| `name` | Sort alphabetically by project name | All project types |
| `date` | Sort by `updatedAt` or `createdAt` | All project types |

## Usage

```tsx
import { sortProjects } from '@manningworks/projex'
import type { SortValue } from '@manningworks/projex'

const sortBy: SortValue = 'stars'

const sorted = sortProjects(projects, sortBy, 'desc')
```

## Sort Behavior

Each sort value has specific behavior:

### stars

- Only sorts GitHub and hybrid projects
- Projects without stars are placed at the end
- Descending order (highest stars first)

```tsx
// Sort by stars descending
const sorted = sortProjects(projects, 'stars', 'desc')
// [1000 stars, 500 stars, 200 stars, 0 stars, manual project, npm project]
```

### name

- Alphabetical sort (case-insensitive)
- Works for all project types
- Default: ascending (A-Z)

```tsx
// Sort by name ascending
const sorted = sortProjects(projects, 'name', 'asc')
// ['Alpha Project', 'Beta App', 'Gamma Tool']
```

### date

- Uses `updatedAt` if available, otherwise `createdAt`
- Works for all project types
- Default: descending (newest first)

```tsx
// Sort by date descending
const sorted = sortProjects(projects, 'date', 'desc')
// [2024-01-15, 2024-01-10, 2024-01-05]
```

## Integration with ProjectSort Component

Use with `ProjectSort` component for user-selectable sorting:

```tsx
import { useState } from 'react'
import { ProjectSort, sortProjects } from '@manningworks/projex'
import type { SortValue } from '@manningworks/projex'

function ProjectsPage({ projects }) {
  const [sortBy, setSortBy] = useState<SortValue>('name')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const sortedProjects = sortProjects(projects, sortBy, order)

  return (
    <div>
      <ProjectSort
        options={['stars', 'name', 'date']}
        value={sortBy}
        onChange={setSortBy}
      />
      <ProjectGrid projects={sortedProjects} />
    </div>
  )
}
```

## Related

- `sortProjects` - Unified sorting function
- `sortByStars` - Star-specific sorting
- `sortByName` - Name-specific sorting
- `sortByDate` - Date-specific sorting
