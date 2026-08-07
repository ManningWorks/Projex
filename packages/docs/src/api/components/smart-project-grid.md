# SmartProjectGrid

Turnkey client component with built-in search, filters, and sort. Wraps `ProjectGrid` and provides interactive controls out of the box.

## Import

```tsx
import { SmartProjectGrid } from '@manningworks/projex'
```

## Usage

### With render function

```tsx
<SmartProjectGrid projects={projects} showSearch showFilters>
  {(project) => (
    <ProjectCard>
      <ProjectCard.Header />
      <ProjectCard.Description />
      <ProjectCard.Tags />
      <ProjectCard.Stats />
      <ProjectCard.Links />
    </ProjectCard>
  )}
</SmartProjectGrid>
```

### Default rendering (no children)

```tsx
<SmartProjectGrid projects={projects} showSearch />
```

Without a `children` render function, each project is rendered as a minimal card with name and description.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| projects | `ProjexProject[]` | Yes | - | Array of projects to display |
| showSearch | `boolean` | No | `true` | Show search input |
| showFilters | `boolean` | No | `false` | Show filter tags derived from all project stacks |
| showSort | `boolean` | No | `false` | Show sort control (reserved for future use) |
| placeholder | `string` | No | `'Search projects...'` | Placeholder text for the search input |
| children | `(project: ProjexProject) => React.ReactNode` | No | - | Render function for each project. Receives each project and wraps it in `ProjectGridProvider` |

## Context

`SmartProjectGrid` wraps each rendered project in a `ProjectGridProvider`, making the current project available via `useProjectContext()`. This means `ProjectCard` sub-components can omit the `project` prop:

```tsx
<SmartProjectGrid projects={projects} showSearch>
  {(project) => (
    <ProjectCard>
      <ProjectCard.Header />
      <ProjectCard.Description />
      <ProjectCard.Stats />
    </ProjectCard>
  )}
</SmartProjectGrid>
```

### ProjectGridProvider

React context provider that supplies a `ProjexProject` to the tree. Exported for advanced use cases:

```tsx
import { ProjectGridProvider } from '@manningworks/projex'

<ProjectGridProvider project={project}>
  <ProjectCard>
    <ProjectCard.Header />
    <ProjectCard.Description />
  </ProjectCard>
</ProjectGridProvider>
```

### useProjectContext

Hook to access the current project from context. Returns `ProjexProject | null`:

```tsx
import { useProjectContext } from '@manningworks/projex'

function CustomProjectField() {
  const project = useProjectContext()
  if (!project) return null
  return <span>{project.name}</span>
}
```

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-projex-smart-grid` | Root container |
| `data-projex-controls` | Controls wrapper (search + filters) |
| `data-projex-search` | Search input wrapper |
| `data-projex-search-input` | Search input element |
| `data-projex-filter-bar` | Filter tags container |
| `data-projex-filter-tag` | Individual filter tag button (value is `'active'` when selected) |
| `data-projex-grid` | Grid container (same as `ProjectGrid`) |
| `data-projex-card` | Default card when no `children` render function is provided |

## Styling

```css
[data-projex-smart-grid] {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

[data-projex-controls] {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

[data-projex-search-input] {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
}

[data-projex-filter-bar] {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

[data-projex-filter-tag] {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  cursor: pointer;
}

[data-projex-filter-tag="active"] {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
```

## Example: Full Interactive Grid

```tsx
import { SmartProjectGrid, ProjectCard } from '@manningworks/projex'

function InteractivePortfolio({ projects }) {
  return (
    <SmartProjectGrid
      projects={projects}
      showSearch
      showFilters
      placeholder="Search by name, description, or tech..."
    >
      {(project) => (
        <ProjectCard>
          <ProjectCard.Header />
          <ProjectCard.Description />
          <ProjectCard.Tags />
          <ProjectCard.Stats />
          <ProjectCard.Status />
          <ProjectCard.Links />
        </ProjectCard>
      )}
    </SmartProjectGrid>
  )
}
```
