# ProjectFilterBar

Container component for grouping filter tags. Provides semantic grouping without visual styling.

## Import

```tsx
import { ProjectFilterBar } from '@manningworks/projex'
```

## Usage

```tsx
<ProjectFilterBar>
  <ProjectFilterTag label="React" isActive={true} onClick={handleTagClick} />
  <ProjectFilterTag label="TypeScript" isActive={false} onClick={handleTagClick} />
</ProjectFilterBar>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | Yes | Filter tags or other content to render |

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-filter-bar` | - | Root container |

## Example

```tsx
import { useState } from 'react'
import { ProjectFilterBar, ProjectFilterTag, useProjectFilters, ProjectGrid } from '@manningworks/projex'

const AVAILABLE_TAGS = ['React', 'TypeScript', 'Node.js', 'Python']

function ProjectShowcase({ projects }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredProjects = useProjectFilters(projects, selectedTags)

  return (
    <ProjectFilterBar>
      {AVAILABLE_TAGS.map(tag => (
        <ProjectFilterTag
          key={tag}
          label={tag}
          isActive={selectedTags.includes(tag)}
          onClick={handleTagClick}
        />
      ))}
      <ProjectGrid projects={filteredProjects} />
    </ProjectFilterBar>
  )
}
```
