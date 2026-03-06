# Filtered Grid Example

A filterable project grid with type and status filters using `ProjectFilterBar` and `ProjectFilterTag`.

<ReactWrapper name="FilteredGridExample" />

## Features

- **ProjectFilterBar** - Container for filter tags
- **ProjectFilterTag** - Individual filter button with active state
- **ProjectGrid** - Grid layout for projects
- **Real-time filtering** - Updates immediately when filter changes

## Code

```tsx
import { ProjectFilterBar, ProjectFilterTag, ProjectGrid, ProjectCard } from '@reallukemanning/folio'
import { useState } from 'react'

function FilteredProjects() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const types = Array.from(new Set(projects.map(p => p.type)))
  const statuses = Array.from(new Set(projects.map(p => p.status)))

  const filteredProjects = projects.filter(project => {
    if (selectedType && project.type !== selectedType) return false
    if (selectedStatus && project.status !== selectedStatus) return false
    return true
  })

  return (
    <div>
      <ProjectFilterBar>
        <div>
          <ProjectFilterTag
            label="All"
            isActive={selectedType === null}
            onClick={() => setSelectedType(null)}
          />
          {types.map(type => (
            <ProjectFilterTag
              key={type}
              label={type}
              isActive={selectedType === type}
              onClick={() => setSelectedType(type)}
            />
          ))}
        </div>
        <div>
          <ProjectFilterTag
            label="All"
            isActive={selectedStatus === null}
            onClick={() => setSelectedStatus(null)}
          />
          {statuses.map(status => (
            <ProjectFilterTag
              key={status}
              label={status}
              isActive={selectedStatus === status}
              onClick={() => setSelectedStatus(status)}
            />
          ))}
        </div>
      </ProjectFilterBar>

      <ProjectGrid>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectGrid>
    </div>
  )
}
```

## Tips

1. **Extract unique values** from your project data for filter options
2. **Combine multiple filters** for more refined results
3. **Style active states** to show which filters are applied
4. **Add "Clear all"** button to reset filters quickly
