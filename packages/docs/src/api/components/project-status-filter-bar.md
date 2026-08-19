# ProjectStatusFilterBar

Data-driven filter bar for project statuses. Derives the available status options from your projects (in canonical order), so there is no hardcoded option list to keep in sync. Pair with `filterByStatus` to apply the selection.

## Import

```tsx
import { ProjectStatusFilterBar } from '@manningworks/projex'
```

## Usage

```tsx
<ProjectStatusFilterBar
  projects={projects}
  value={selectedStatus}
  onChange={setSelectedStatus}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| projects | `ProjexProject[]` | Yes | Projects used to derive the available status options |
| value | `ProjectStatus \| 'all'` | Yes | Currently selected status |
| onChange | `(value: ProjectStatus \| 'all') => void` | Yes | Callback fired when a different status is selected |
| allLabel | `string` | No | Label for the "all" option (default `'All'`) |
| ariaLabel | `string` | No | Accessible label for the group (default `'Filter by status'`) |

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-projex-filter-bar` | - | Root container (from `ProjectFilterBar`) |
| `data-projex-status-filter-bar` | - | Status filter group |
| `data-projex-filter-tag` | - | Each filter tag |
| `data-projex-filter-tag-active` | `'true'` | Present on the active tag |

## Behavior

- Returns `null` when `projects` is empty
- Only statuses present in `projects` are rendered, ordered by the canonical `PROJECT_STATUSES` order (see [getUniqueStatuses](../utilities/get-unique-statuses))
- Clicking the already-selected value does not fire `onChange`

## Example

```tsx
import { useState } from 'react'
import { ProjectStatusFilterBar, filterByStatus, ProjectGrid } from '@manningworks/projex'

function ProjectShowcase({ projects }) {
  const [status, setStatus] = useState('all')

  const visibleProjects = filterByStatus(projects, status)

  return (
    <div>
      <ProjectStatusFilterBar
        projects={projects}
        value={status}
        onChange={setStatus}
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
