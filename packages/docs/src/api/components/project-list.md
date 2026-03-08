# ProjectList

Container component for displaying projects in a list layout.

## Import

```tsx
import { ProjectList } from '@manningworks/projex'
```

## Usage

```tsx
<ProjectList>
  <ProjectCard>...</ProjectCard>
  <ProjectCard>...</ProjectCard>
  <ProjectCard>...</ProjectCard>
</ProjectList>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | `React.ReactNode` | Yes | Child components (typically ProjectCards) |

Returns `null` if `children` is falsy.

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-projex-list` | List container |

## Example

```tsx
import { ProjectList, ProjectCard } from '@manningworks/projex'

function ProjectsList({ projects }) {
  return (
    <ProjectList>
      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectCard.Header project={project} />
          <ProjectCard.Description project={project} />
          <ProjectCard.Links project={project} />
        </ProjectCard>
      ))}
    </ProjectList>
  )
}
```

## Styling

Apply list-specific styles via the data attribute:

```css
[data-projex-list] {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

[data-projex-list] [data-projex-card] {
  border-radius: 0;
  border-width: 0 0 1px 0;
}
```
