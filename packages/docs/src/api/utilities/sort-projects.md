# sortProjects

Utility function that dispatches to appropriate sorting functions based on sort value. Provides a unified interface for common sorting options.

## Signature

```tsx
function sortProjects(projects: ProjexProject[], sortValue: SortValue): ProjexProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProject[]` | Array of projects to sort |
| sortValue | `SortValue` | Sort direction and field |

## Returns

`ProjexProject[]` - Sorted array of projects

## Sort Values

| Value | Description |
|-------|-------------|
| `'stars'` | Sort by GitHub stars (descending) |
| `'name'` | Sort alphabetically by name (ascending) |
| `'date'` | Sort by date (newest first, descending) |
| `'date-asc'` | Sort by date (oldest first, ascending) |

```tsx
type SortValue = 'stars' | 'name' | 'date' | 'date-asc'
```

## Behavior

- Returns original array reference if projects is empty
- Returns original array reference if sortValue is invalid
- Does not mutate original array

## Example

```tsx
import { sortProjects, ProjectSort, ProjectGrid } from '@manningworks/projex'

const SORT_OPTIONS = ['stars', 'name', 'date', 'date-asc']

function ProjectShowcase({ projects }) {
  const [sortValue, setSortValue] = useState('stars')
  const sortedProjects = sortProjects(projects, sortValue)

  return (
    <div>
      <ProjectSort
        options={SORT_OPTIONS}
        value={sortValue}
        onChange={setSortValue}
      />
      <ProjectGrid projects={sortedProjects} />
    </div>
  )
}
```

## Complete Example: Search + Filter + Sort

```tsx
import { useState } from 'react'
import { 
  useProjectSearch,
  useProjectFilters,
  sortProjects,
  ProjectSearch,
  ProjectFilterBar,
  ProjectFilterTag,
  ProjectSort,
  ProjectGrid
} from '@manningworks/projex'

const AVAILABLE_TAGS = ['React', 'TypeScript', 'Node.js']
const SORT_OPTIONS = ['stars', 'name', 'date', 'date-asc']

function ProjectShowcase({ projects }) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortValue, setSortValue] = useState('stars')

  // Chain operations: filter -> search -> sort
  const filteredByTags = useProjectFilters(projects, selectedTags)
  const searchedProjects = useProjectSearch(filteredByTags, query)
  const finalProjects = sortProjects(searchedProjects, sortValue)

  return (
    <div>
      <ProjectSearch onSearch={setQuery} placeholder="Search projects..." />
      
      <ProjectFilterBar>
        {AVAILABLE_TAGS.map(tag => (
          <ProjectFilterTag
            key={tag}
            label={tag}
            isActive={selectedTags.includes(tag)}
            onClick={(label) => {
              setSelectedTags(prev =>
                prev.includes(label)
                  ? prev.filter(t => t !== label)
                  : [...prev, label]
              )
            }}
          />
        ))}
      </ProjectFilterBar>

      <ProjectSort
        options={SORT_OPTIONS}
        value={sortValue}
        onChange={setSortValue}
      />

      <ProjectGrid projects={finalProjects} />
    </div>
  )
}
```
