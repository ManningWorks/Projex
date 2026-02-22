# ProjectGrid

Container component for displaying projects in a grid layout.

## Import

```tsx
import { ProjectGrid } from '@folio/core'
```

## Usage

```tsx
<ProjectGrid>
  <ProjectCard>...</ProjectCard>
  <ProjectCard>...</ProjectCard>
  <ProjectCard>...</ProjectCard>
</ProjectGrid>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | Yes | Child components (typically ProjectCards) |

Returns `null` if `children` is falsy.

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-folio-grid` | Grid container |

## Example

```tsx
import { ProjectGrid, ProjectCard } from '@folio/core'

function ProjectsGrid({ projects }) {
  return (
    <ProjectGrid>
      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectCard.Header project={project} />
          <ProjectCard.Description project={project} />
          <ProjectCard.Links project={project} />
        </ProjectCard>
      ))}
    </ProjectGrid>
  )
}
```

## Styling

Apply CSS Grid or Flexbox via the data attribute:

```css
[data-folio-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```
