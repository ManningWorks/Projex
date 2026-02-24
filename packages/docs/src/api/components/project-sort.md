# ProjectSort

Dropdown component for selecting sort options. Renders a native select element for accessibility.

## Import

```tsx
import { ProjectSort } from '@reallukemanning/folio'
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
| `data-folio-sort` | - | Root container |
| `data-folio-sort-select` | - | Select element |
| `data-folio-sort-option` | - | Option element |
| `data-folio-sort-value` | `string` | Present on selected option |

## Example

```tsx
import { useState } from 'react'
import { ProjectSort, sortProjects, ProjectGrid } from '@reallukemanning/folio'

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
      <ProjectGrid projects={sortedProjects} />
    </div>
  )
}
```
