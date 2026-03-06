# Full Portfolio Example

A complete portfolio page showcasing all major Folio components working together.

<ReactWrapper name="FullPortfolioExample" />

## Features

- **FeaturedProject** - Hero section showcasing your best work
- **ProjectGrid** - Grid layout for all projects
- **Interactive Controls**:
  - Layout toggle (grid/list)
  - Filter by project type (GitHub, npm, hybrid, etc.)
  - Filter by status (active, shipped, in-progress, etc.)

## Code

```tsx
import { FeaturedProject, ProjectGrid, ProjectCard } from '@reallukemanning/folio'
import { useState } from 'react'

function Portfolio() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<string | null>(null)

  const featuredProject = projects.find(p => p.id === 'featured')
  const filteredProjects = projects.filter(p => {
    if (filterType && p.type !== filterType) return false
    return true
  })

  return (
    <div>
      <FeaturedProject project={featuredProject} />

      <div className="controls">
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

1. **Use `featured: true`** in your project config to highlight your best work
2. **Combine filters** for more granular control
3. **Lazy load** project data for better performance
4. **Add search** for large project collections
