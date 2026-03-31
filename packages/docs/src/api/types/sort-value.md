# SortValue

Allowed sort values for the `sortProjects` function. Defines how projects can be sorted in the UI.

## Definition

```tsx
type SortValue = 'stars' | 'name' | 'date' | 'date-asc'
```

## Values

| Value | Description | Direction | Usage |
|-------|-------------|-----------|--------|
| `stars` | Sort by GitHub stars | Descending (highest first) | GitHub and hybrid projects |
| `name` | Sort alphabetically by project name | Ascending (A-Z) | All project types |
| `date` | Sort by `updatedAt` or `createdAt` | Descending (newest first) | All project types |
| `date-asc` | Sort by `updatedAt` or `createdAt` | Ascending (oldest first) | All project types |

## Usage

```tsx
import { sortProjects } from '@manningworks/projex'
import type { SortValue } from '@manningworks/projex'

const sortBy: SortValue = 'stars'
const sorted = sortProjects(projects, sortBy)
```

## Sort Behavior

### `stars`

- Only GitHub and hybrid projects have star counts
- Projects without stars are placed at the end
- Non-GitHub/non-hybrid projects are treated as having 0 stars
- Always sorts descending (highest stars first)

```tsx
const sorted = sortProjects(projects, 'stars')
// [1000 stars, 500 stars, 200 stars, 0 stars, manual project, npm project]
```

### `name`

- Alphabetical sort using `localeCompare` with `sensitivity: 'base'` (case-insensitive)
- Works for all project types
- Projects without a name are placed at the end
- Always sorts ascending (A-Z)

```tsx
const sorted = sortProjects(projects, 'name')
// ['Alpha Project', 'Beta App', 'Gamma Tool']
```

### `date`

- Uses `updatedAt` if available, falls back to `createdAt`
- Works for all project types
- Projects without any date are placed at the end
- Sorts descending (newest first)

```tsx
const sorted = sortProjects(projects, 'date')
// [2024-01-15, 2024-01-10, 2024-01-05]
```

### `date-asc`

- Same data source as `date` (`updatedAt` → `createdAt`)
- Sorts ascending (oldest first)
- Useful for timeline-style displays

```tsx
const sorted = sortProjects(projects, 'date-asc')
// [2024-01-05, 2024-01-10, 2024-01-15]
```

## Integration with ProjectSort Component

Use with the `ProjectSort` component for user-selectable sorting:

```tsx
import { useState } from 'react'
import { ProjectSort, sortProjects } from '@manningworks/projex'
import type { SortValue } from '@manningworks/projex'

function ProjectsPage({ projects }) {
  const [sortBy, setSortBy] = useState<SortValue>('name')

  const sortedProjects = sortProjects(projects, sortBy)

  return (
    <div>
      <ProjectSort
        options={['stars', 'name', 'date', 'date-asc']}
        value={sortBy}
        onChange={setSortBy}
      />
      <ProjectGrid>
        {sortedProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectGrid>
    </div>
  )
}
```

## Related

- `sortProjects` — Unified sorting function
- `sortByStars` — Star-specific sorting
- `sortByName` — Name-specific sorting
- `sortByDate` — Date-specific sorting (supports both `asc` and `desc`)
- [ProjectSort](../components/project-sort) — Sort dropdown component
