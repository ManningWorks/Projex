# ProjectTimelineEntry

Represents a milestone or event in a project's lifecycle. Timeline entries create a chronological narrative for your projects.

## Definition

```tsx
interface ProjectTimelineEntry {
  date: string
  note: string
}
```

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `date` | `string` | Yes | Date of the milestone. Can be any format (e.g., `'2024-01'`, `'2024-01-15'`, `'Q1 2024'`) |
| `note` | `string` | Yes | Description of what happened on this date |

## Usage

```tsx
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/repo',
    status: 'active',
    timeline: [
      { date: '2024-01', note: 'Initial concept and design' },
      { date: '2024-03', note: 'First working prototype' },
      { date: '2024-05', note: 'Public beta launch' },
      { date: '2024-08', note: 'v1.0 stable release' },
      { date: '2024-11', note: 'Featured in Node.js weekly' },
    ],
  },
])
```

## Display

Timeline entries are displayed by the [ProjectView](../components/project-view) component:

```tsx
<ProjectView.Section name="timeline" project={project} />
```

Each entry renders with data attributes:

```html
<div>
  <span data-projex-timeline-date>2024-01</span>
  <span data-projex-timeline-note>Initial concept and design</span>
</div>
```

## Styling

```css
[data-projex-timeline-date] {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  display: block;
}

[data-projex-timeline-note] {
  color: #374151;
  margin-left: 1rem;
}
```

## Date Format Guidelines

The `date` field is a freeform string. Recommended formats:

| Format | Example | Use When |
|--------|---------|----------|
| Year-Month | `'2024-01'` | Month-level precision is sufficient |
| Full Date | `'2024-01-15'` | Exact dates matter (launch days, etc.) |
| Quarter | `'Q1 2024'` | Rough timeframe |
| Relative | `'Late 2024'` | Approximate timing |

Timeline entries are NOT automatically sorted — they display in the order you define them. Use chronological order for the best reader experience.

## Best Practices

1. **Be specific**: Include meaningful milestones, not just "started" and "finished"
2. **Tell a story**: Show the progression from idea to completion
3. **Include external events**: Mentions, features, and awards add credibility
4. **Keep entries concise**: One line per milestone
5. **Use consistent date formats**: Pick one format and stick with it

## Related

- [ProjectView.Section](../components/project-view) — Component that renders timeline entries
- [ProjectStruggle](./project-struggle) — Challenges and learnings
- [ProjectPost](./project-post) — Related blog posts and articles
