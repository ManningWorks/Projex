# useProjectSearch

React hook for fuzzy searching projects by name, description, and stack using Fuse.js.

## Signature

```tsx
function useProjectSearch(
  projects: ProjexProject[],
  query: string | undefined | null,
  options?: UseProjectSearchOptions
): ProjexProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProject[]` | Array of projects to search |
| query | `string \| undefined \| null` | Search query string |
| options | `UseProjectSearchOptions` | Optional configuration |

## Returns

`ProjexProject[]` - Filtered array of projects matching the query

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| threshold | `number` | `0.2` | Fuse.js fuzzy match threshold (lower = stricter) |

## Behavior

- Returns all projects if query is empty, null, or undefined
- Searches across name, description, and stack fields
- Name field has highest weight, then description, then stack
- Threshold of 0.2 allows typos while remaining accurate
- Uses `ignoreLocation: true` for better substring matching
- Results maintain original project order (sorted by relevance)

## Example

```tsx
import { useState } from 'react'
import { useProjectSearch, ProjectSearch, ProjectGrid } from '@manningworks/projex'

function ProjectShowcase({ projects }) {
  const [query, setQuery] = useState('')
  const filteredProjects = useProjectSearch(projects, query)

  return (
    <div>
      <ProjectSearch onSearch={setQuery} placeholder="Search projects..." />
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```

## Advanced Example with Custom Threshold

```tsx
import { useState } from 'react'
import { useProjectSearch, ProjectSearch, ProjectGrid } from '@manningworks/projex'

function ProjectShowcase({ projects }) {
  const [query, setQuery] = useState('')
  
  // Stricter matching (less tolerance for typos)
  const filteredProjects = useProjectSearch(projects, query, {
    threshold: 0.2
  })

  return (
    <div>
      <ProjectSearch onSearch={setQuery} />
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```
