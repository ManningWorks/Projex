# Components

Folio provides compound components for building project showcase pages. All components ship with zero styling - only semantic HTML with data attributes for CSS targeting.

## Available Components

| Component | Description |
|-----------|-------------|
| [ProjectCard](./project-card) | Card component for displaying individual project summaries |
| [ProjectView](./project-view) | Full page view for detailed project information |
| [ProjectGrid](./project-grid) | Container for grid layout of projects |
| [ProjectList](./project-list) | Container for list layout of projects |
| [FeaturedProject](./featured-project) | Featured project hero section |

## Design Principles

### Compound Components

Components use the compound pattern for maximum flexibility. Consumers compose their own layout by combining subcomponents:

```tsx
<ProjectCard>
  <ProjectCard.Header project={project} />
  <ProjectCard.Description project={project} />
  <ProjectCard.Tags project={project} />
  <ProjectCard.Stats project={project} />
  <ProjectCard.Links project={project} />
</ProjectCard>
```

### Data Attributes

Every rendered element includes a `data-folio-*` attribute for styling hooks:

```css
[data-folio-card] {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

[data-folio-card-header] {
  display: flex;
  justify-content: space-between;
}
```

### Conditional Rendering

Subcomponents return `null` when data is missing. No empty wrappers or placeholder text:

```tsx
<ProjectCard.Tags project={project} /> {/* null if project.stack is empty */}
<ProjectCard.Stats project={project} /> {/* null if project.stats is null */}
```
