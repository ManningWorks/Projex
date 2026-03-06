# Searchable List Example

A searchable project list with real-time filtering using `ProjectSearch`.

<ReactWrapper name="SearchableListExample" />

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

## Tips

1. **Debounce search input** to avoid excessive re-renders (built-in to ProjectSearch)
2. **Search multiple fields** for better results
3. **Highlight matches** in UI for better UX
4. **Combine with filters** for advanced search functionality
