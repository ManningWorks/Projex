# Interactive Demo

All interactive features combined in one playground. Try out search, filters, and layout toggles together!

<ReactWrapper name="InteractiveDemoExample" />

## Features

- **ProjectSearch** - Real-time search with debounced input
- **ProjectFilterBar & ProjectFilterTag** - Type and status filters
- **Layout Toggle** - Switch between grid and list views
- **All features work together** - Combine search, filters, and layout

## Code

```tsx
import {
  ProjectSearch,
  ProjectFilterBar,
  ProjectFilterTag,
  ProjectGrid,
  ProjectCard
} from '@reallukemanning/folio'
import { useState } from 'react'

function InteractivePlayground() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  const filteredProjects = projects.filter(project => {
    if (selectedType && project.type !== selectedType) return false
    if (selectedStatus && project.status !== selectedStatus) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        project.name.toLowerCase().includes(query) ||
        project.tagline?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.stack?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  return (
    <div>
      <ProjectSearch onSearch={setSearchQuery} placeholder="Search..." />

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
      </ProjectFilterBar>

      <div className="layout-toggle">
        <button onClick={() => setLayout('grid')}>Grid</button>
        <button onClick={() => setLayout('list')}>List</button>
      </div>

      {layout === 'grid' ? (
        <ProjectGrid>
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ProjectGrid>
      ) : (
        <div className="list">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
```

## Tips

1. **Extract types and statuses** from your data for dynamic filters
2. **Show active filters** clearly in UI
3. **Add count badges** to show how many projects match
4. **Persist state** to URL for shareable links
5. **Combine features** for powerful filtering and search
