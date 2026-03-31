# ProjectSearch

Search input component with built-in debouncing (300ms). Triggers callback with search query after debounce delay.

## Import

```tsx
import { ProjectSearch } from '@manningworks/projex'
```

## Usage

```tsx
<ProjectSearch 
  onSearch={(query) => console.log(query)} 
  placeholder="Search projects..." 
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onSearch | `(query: string) => void` | Yes | Callback fired after 300ms debounce with current input value |
| placeholder | `string` | No | Placeholder text for the input |

## Behavior

- Debounces input by 300ms to avoid excessive callbacks
- Callback receives the raw input value (not normalized)
- Pass empty string when input is cleared

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-search` | - | Root container |
| `data-projex-search-input` | - | Input element |

## Example

```tsx
import { useState } from 'react'
import { ProjectSearch, useProjectSearch, ProjectGrid, ProjectCard } from '@manningworks/projex'

function ProjectShowcase({ projects }) {
  const [query, setQuery] = useState('')
  const filteredProjects = useProjectSearch(projects, query)

  return (
    <div>
      <ProjectSearch onSearch={setQuery} placeholder="Search projects..." />
      <ProjectGrid>
        {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
      </ProjectGrid>
    </div>
  )
}
```
