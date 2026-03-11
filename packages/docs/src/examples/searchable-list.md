# Searchable List Example

A searchable project list with real-time filtering using `ProjectSearch`.

## Features

- **ProjectSearch** - Search input with debounced input
- **ProjectList** - List layout for projects
- **Real-time filtering** - Updates as you type
- **Multi-field search** - Searches name, tagline, description, and tags

## Code

```tsx
import { ProjectSearch, ProjectList, ProjectCard, useProjectSearch } from '@manningworks/projex'
import { useState } from 'react'

function SearchableProjects() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = useProjectSearch(projects, searchQuery, {
    threshold: 0.2
  })

  return (
    <div>
      <ProjectSearch
        onSearch={setSearchQuery}
        placeholder="Search projects..."
      />

      <ProjectList>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ProjectList>
    </div>
  )
}
```

## HTML Output

The components generate semantic HTML:

```html
<!-- ProjectSearch -->
<div data-projex-search>
  <input type="search" placeholder="Search projects..." />
</div>

<!-- ProjectList -->
<div data-projex-list>
  <div data-projex-card>
    <div data-projex-card-header>
      <h3>Project Name</h3>
    </div>
    <div data-projex-card-description>Description...</div>
  </div>
  <div data-projex-card>
    <!-- Card content -->
  </div>
</div>
```

## Styling Example

CSS for the search input and list layout:

```css
/* Search input */
[data-projex-search] input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1em;
  margin-bottom: 24px;
}

[data-projex-search] input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* List layout */
[data-projex-list] {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* List cards */
[data-projex-list] [data-projex-card] {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

[data-projex-list] [data-projex-card]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

See the [Styling Guide](../guides/styling.md) for more CSS examples.

## Tips

1. **Debounce search input** to avoid excessive re-renders (built-in to ProjectSearch)
2. **Search multiple fields** for better results
3. **Highlight matches** in UI for better UX
4. **Combine with filters** for advanced search functionality

## Customizing Search Sensitivity

The `useProjectSearch` hook uses Fuse.js fuzzy search with a default threshold of 0.2. You can adjust this for different behaviors:

```tsx
import { useProjectSearch } from '@manningworks/projex'

function CustomSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  // More precise matches (fewer results, fewer false positives)
  const strictResults = useProjectSearch(projects, searchQuery, {
    threshold: 0.1
  })

  // More lenient matches (allows more typos, more results)
  const lenientResults = useProjectSearch(projects, searchQuery, {
    threshold: 0.4
  })

  // Default behavior (balanced)
  const defaultResults = useProjectSearch(projects, searchQuery)

  // ...
}
```

### When to Adjust Threshold

| Threshold | Use Case | Example |
|-----------|----------|---------|
| `0.1` | Exact/near-exact matches | Search for specific package names or technical terms |
| `0.2` (default) | Balanced search | General project showcase with good precision |
| `0.3` | More lenient | User-facing search with typos allowed |
| `0.4+` | Very fuzzy | Broad discovery searches |

For detailed information on search configuration, see [Fuse Search Utilities](../api/utilities/fuse-search).
