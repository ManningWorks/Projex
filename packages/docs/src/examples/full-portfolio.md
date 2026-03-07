# Full Portfolio Example

A complete portfolio page showcasing all major Folio components working together.

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

## HTML Output

The components generate semantic HTML with data attributes for styling:

```html
<!-- FeaturedProject -->
<div data-folio-featured>
  <img data-folio-featured-image src="..." alt="Featured Project" />
  <div data-folio-view>
    <h2>Featured Project</h2>
    <div data-folio-view-section data-folio-view-section-name="background">
      Background story...
    </div>
    <div data-folio-view-section data-folio-view-section-name="why">
      Why I built this...
    </div>
    <div data-folio-view-stats>
      <span data-folio-stat="stars">1000 stars</span>
      <span data-folio-stat="forks">200 forks</span>
    </div>
    <div data-folio-view-links>
      <a href="..." data-folio-link data-folio-link-type="github">GitHub</a>
      <a href="..." data-folio-link data-folio-link-type="live">Live</a>
    </div>
  </div>
</div>

<!-- ProjectGrid -->
<div data-folio-grid>
  <div data-folio-card>
    <!-- Card content -->
  </div>
  <div data-folio-card>
    <!-- Card content -->
  </div>
</div>

<!-- List view -->
<div class="list">
  <div data-folio-card>
    <!-- Card content -->
  </div>
</div>
```

## Styling Example

CSS for the featured section and layouts:

```css
/* Featured section */
[data-folio-featured] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px;
  border-radius: 16px;
  margin-bottom: 32px;
  color: #fff;
}

[data-folio-featured] h2 {
  margin: 0 0 16px 0;
  font-size: 2em;
}

/* Grid layout */
[data-folio-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* List layout */
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list [data-folio-card] {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}
```

See the [Styling Guide](../guides/styling.md) for comprehensive CSS examples.

## Tips

1. **Use `featured: true`** in your project config to highlight your best work
2. **Combine filters** for more granular control
3. **Lazy load** project data for better performance
4. **Add search** for large project collections
