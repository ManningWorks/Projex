# Full Portfolio Example

A complete portfolio page showcasing all major Projex components working together.

## Features

- **FeaturedProject** - Hero section showcasing your best work
- **ProjectGrid** - Grid layout for all projects
- **Interactive Controls**:
  - Layout toggle (grid/list)
  - Filter by project type (GitHub, npm, hybrid, etc.)
  - Filter by status (active, shipped, in-progress, etc.)

## Code

```tsx
import { FeaturedProject, ProjectGrid, ProjectCard } from '@manningworks/projex'
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
<div data-projex-featured>
  <img data-projex-featured-image src="..." alt="Featured Project" />
  <div data-projex-view>
    <h2>Featured Project</h2>
    <div data-projex-view-section data-projex-view-section-name="background">
      Background story...
    </div>
    <div data-projex-view-section data-projex-view-section-name="why">
      Why I built this...
    </div>
    <div data-projex-view-stats>
      <span data-projex-stat="stars">1000 stars</span>
      <span data-projex-stat="forks">200 forks</span>
    </div>
    <div data-projex-view-links>
      <a href="..." data-projex-link data-projex-link-type="github">GitHub</a>
      <a href="..." data-projex-link data-projex-link-type="live">Live</a>
    </div>
  </div>
</div>

<!-- ProjectGrid -->
<div data-projex-grid>
  <div data-projex-card>
    <!-- Card content -->
  </div>
  <div data-projex-card>
    <!-- Card content -->
  </div>
</div>

<!-- List view -->
<div class="list">
  <div data-projex-card>
    <!-- Card content -->
  </div>
</div>
```

## Styling Example

CSS for the featured section and layouts:

```css
/* Featured section */
[data-projex-featured] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px;
  border-radius: 16px;
  margin-bottom: 32px;
  color: #fff;
}

[data-projex-featured] h2 {
  margin: 0 0 16px 0;
  font-size: 2em;
}

/* Grid layout */
[data-projex-grid] {
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

.list [data-projex-card] {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}
```

See the [Styling Guide](../guides/styling) for comprehensive CSS examples.

## Tips

1. **Use `featured: true`** in your project config to highlight your best work
2. **Combine filters** for more granular control
3. **Lazy load** project data for better performance
4. **Add search** for large project collections
