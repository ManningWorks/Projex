# ProjectFilterTag

Interactive tag button for filtering projects. Supports active state to indicate selected filters.

## Import

```tsx
import { ProjectFilterTag } from '@reallukemanning/folio'
```

## Usage

```tsx
<ProjectFilterTag 
  label="React" 
  isActive={true} 
  onClick={(label) => console.log(label)} 
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| label | `string` | Yes | Text to display in the tag |
| isActive | `boolean` | No | Whether the tag is currently selected (default: false) |
| onClick | `(label: string) => void` | No | Callback fired when tag is clicked |

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-folio-filter-tag` | - | Root button element |
| `data-folio-filter-tag-active` | `true` | Present when isActive is true |

## Example

```tsx
import { useState } from 'react'
import { ProjectFilterBar, ProjectFilterTag, useProjectFilters, ProjectGrid } from '@reallukemanning/folio'

const AVAILABLE_TAGS = ['React', 'TypeScript', 'Node.js', 'Python']

function ProjectShowcase({ projects }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredProjects = useProjectFilters(projects, selectedTags)

  return (
    <div>
      <ProjectFilterBar>
        {AVAILABLE_TAGS.map(tag => (
          <ProjectFilterTag
            key={tag}
            label={tag}
            isActive={selectedTags.includes(tag)}
            onClick={toggleTag}
          />
        ))}
      </ProjectFilterBar>
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```
