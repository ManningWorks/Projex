# Searchable List Example

A searchable project list with real-time filtering using `ProjectSearch`.

## Features

- **ProjectSearch** - Search input with debounced input
- **ProjectList** - List layout for projects
- **Real-time filtering** - Updates as you type
- **Multi-field search** - Searches name, tagline, description, and tags

## Code

```tsx
import { ProjectSearch, ProjectList, ProjectCard } from '@reallukemanning/folio'
import { useState } from 'react'

function SearchableProjects() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter(project => {
    const query = searchQuery.toLowerCase()
    return (
      project.name.toLowerCase().includes(query) ||
      project.tagline?.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.stack?.some(tag => tag.toLowerCase().includes(query))
    )
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
<div data-folio-search>
  <input type="search" placeholder="Search projects..." />
</div>

<!-- ProjectList -->
<div data-folio-list>
  <div data-folio-card>
    <div data-folio-card-header>
      <h3>Project Name</h3>
    </div>
    <div data-folio-card-description>Description...</div>
  </div>
  <div data-folio-card>
    <!-- Card content -->
  </div>
</div>
```

## Styling Example

CSS for the search input and list layout:

```css
/* Search input */
[data-folio-search] input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1em;
  margin-bottom: 24px;
}

[data-folio-search] input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* List layout */
[data-folio-list] {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* List cards */
[data-folio-list] [data-folio-card] {
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

[data-folio-list] [data-folio-card]:hover {
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
