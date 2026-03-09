# ProjectSort

Dropdown component for selecting sort options. Renders a native select element for accessibility.

## Import

```tsx
import { ProjectSort } from '@manningworks/projex'
```

## Usage

```tsx
<ProjectSort
  options={['stars', 'name', 'date', 'date-asc']}
  value="stars"
  onChange={(value) => console.log(value)}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| options | `string[]` | Yes | Array of sort option values to display |
| value | `string` | Yes | Currently selected option |
| onChange | `(value: string) => void` | Yes | Callback fired when selection changes |

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-sort` | - | Root container |
| `data-projex-sort-select` | - | Select element |
| `data-projex-sort-option` | - | Option element |
| `data-projex-sort-value` | `string` | Present on selected option |

## Example

```tsx
import { useState } from 'react'
import { ProjectSort, sortProjects, ProjectGrid } from '@manningworks/projex'

const SORT_OPTIONS = ['stars', 'name', 'date', 'date-asc']

function ProjectShowcase({ projects }) {
  const [sortValue, setSortValue] = useState('stars')
  const sortedProjects = sortProjects(projects, sortValue as SortValue)

  return (
    <div>
      <ProjectSort
        options={SORT_OPTIONS}
        value={sortValue}
        onChange={setSortValue}
      />
      <ProjectGrid>
        {sortedProjects.map(project => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Stats project={project} />
          </ProjectCard>
        ))}
      </ProjectGrid>
    </div>
  )
}
```
