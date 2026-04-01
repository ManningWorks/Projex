# Filtered Grid Example

A filterable project grid with type and status filters using `ProjectFilterBar` and `ProjectFilterTag`.

## Features

- **ProjectFilterBar** - Container for filter tags
- **ProjectFilterTag** - Individual filter button with active state
- **ProjectGrid** - Grid layout for projects
- **Real-time filtering** - Updates immediately when filter changes

## Code

```tsx
import { ProjectFilterBar, ProjectFilterTag, ProjectGrid, ProjectCard } from '@manningworks/projex'
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

## HTML Output

The components generate semantic HTML with data attributes:

```html
<!-- ProjectFilterBar -->
<div data-projex-filter-bar>
  <div>
    <button data-projex-filter-tag data-projex-filter-active>All</button>
    <button data-projex-filter-tag data-projex-filter-active="false">github</button>
    <button data-projex-filter-tag data-projex-filter-active="false">npm</button>
    <button data-projex-filter-tag data-projex-filter-active="false">manual</button>
  </div>
  <div>
    <button data-projex-filter-tag data-projex-filter-active>All</button>
    <button data-projex-filter-tag data-projex-filter-active="false">active</button>
    <button data-projex-filter-tag data-projex-filter-active="false">shipped</button>
  </div>
</div>

<!-- ProjectGrid -->
<div data-projex-grid>
  <div data-projex-card>
    <!-- Card content -->
  </div>
</div>
```

## Styling Example

CSS for the filter bar and active states:

```css
/* Filter bar container */
[data-projex-filter-bar] {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

/* Filter tags */
[data-projex-filter-tag] {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

/* Active filter */
[data-projex-filter-active="true"] {
  background: #374151;
  color: #fff;
  border-color: #374151;
}

/* Hover state */
[data-projex-filter-tag]:hover {
  background: #f9fafb;
}

[data-projex-filter-active="true"]:hover {
  background: #1f2937;
}

/* Grid layout */
[data-projex-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
```

See the [Styling Guide](../guides/styling) for more CSS examples.

## Tips

1. **Extract unique values** from your project data for filter options
2. **Combine multiple filters** for more refined results
3. **Style active states** to show which filters are applied
4. **Add "Clear all"** button to reset filters quickly
