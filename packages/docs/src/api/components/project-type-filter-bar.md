# ProjectTypeFilterBar

Data-driven filter bar for project types. Derives the available type options from your projects (in canonical order), so there is no hardcoded option list to keep in sync. Pair with `filterByType` to apply the selection.

## Import

```tsx
import { ProjectTypeFilterBar } from '@manningworks/projex'
```

## Usage

```tsx
<ProjectTypeFilterBar
  projects={projects}
  value={selectedType}
  onChange={setSelectedType}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| projects | `ProjexProject[]` | Yes | Projects used to derive the available type options |
| value | `ProjectType \| 'all'` | Yes | Currently selected type |
| onChange | `(value: ProjectType \| 'all') => void` | Yes | Callback fired when a different type is selected |
| allLabel | `string` | No | Label for the "all" option (default `'All'`) |
| ariaLabel | `string` | No | Accessible label for the group (default `'Filter by kind'`) |

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-filter-bar` | - | Root container (from `ProjectFilterBar`) |
| `data-projex-type-filter-bar` | - | Type filter group |
| `data-projex-filter-tag` | - | Each filter tag |
| `data-projex-filter-tag-active` | `'true'` | Present on the active tag |

## Behavior

- Returns `null` when `projects` is empty
- Only types present in `projects` are rendered, ordered by the canonical `PROJECT_TYPES` order (see [getUniqueTypes](../utilities/get-unique-types))
- Clicking the already-selected value does not fire `onChange`

## Example

```tsx
import { useState } from 'react'
import { ProjectTypeFilterBar, filterByType, ProjectGrid } from '@manningworks/projex'

function ProjectShowcase({ projects }) {
  const [type, setType] = useState('all')

  const visibleProjects = filterByType(projects, type)

  return (
    <div>
      <ProjectTypeFilterBar
        projects={projects}
        value={type}
        onChange={setType}
      />
      <ProjectGrid>
        {visibleProjects.map(project => (
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
