# ProjectPost

Represents a related blog post, article, or announcement for a project.

## Definition

```tsx
interface ProjectPost {
  title: string
  date: string
  url?: string
}
```

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | Yes | Post title |
| `date` | `string` | Yes | Publication date (any format) |
| `url` | `string` | No | Link to the post (must be a valid URL if provided) |

## Usage

```tsx
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
    posts: [
      {
        title: 'Announcing My Project v1.0',
        date: '2024-01-15',
        url: 'https://blog.example.com/announcing-my-project',
      },
      {
        title: 'How I Built My Project',
        date: '2024-02',
        url: 'https://dev.to/username/how-i-built-my-project',
      },
      {
        title: 'Upcoming Features in v2.0',
        date: '2024-06',
        // No URL — post not yet published
      },
    ],
  },
])
```

## Display

Posts are displayed by the [ProjectView](../components/project-view) component:

```tsx
<ProjectView.Section name="posts" project={project} />
```

Each post renders with data attributes:

```html
<!-- Post with URL -->
<div>
  <span data-projex-post-title>Announcing My Project v1.0</span>
  <span data-projex-post-date>2024-01-15</span>
  <a href="https://blog.example.com/..." data-projex-post-link>Link</a>
</div>

<!-- Post without URL (no link rendered) -->
<div>
  <span data-projex-post-title>Upcoming Features in v2.0</span>
  <span data-projex-post-date>2024-06</span>
</div>
```

## Validation

When using `projexProjectInputSchema`, post URLs are validated:

```tsx
// Valid — URL is optional
{ title: 'My Post', date: '2024-01' }

// Valid — URL is provided
{ title: 'My Post', date: '2024-01', url: 'https://example.com/post' }

// Invalid — URL must be valid
{ title: 'My Post', date: '2024-01', url: 'not-a-url' }
// Error: url must be a valid URL
```

## Styling

```css
[data-projex-post-title] {
  font-weight: 500;
  color: #374151;
}

[data-projex-post-date] {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

[data-projex-post-link] {
  font-size: 0.875rem;
  color: #3b82f6;
  margin-left: 0.5rem;
}
```

## Best Practices

1. **Include launch posts**: Announce major releases and milestones
2. **Link to technical write-ups**: Show the engineering behind your projects
3. **Mix internal and external**: Blog posts, Dev.to articles, and Twitter threads all work
4. **Use consistent date formats**: Pick one format and stick with it
5. **Omit URLs for unpublished content**: Planned posts without a URL render without a link

## Related

- [ProjectView.Section](../components/project-view) — Component that renders posts
- [ProjectTimelineEntry](./project-timeline-entry) — Chronological milestones
- [ProjectStruggle](./project-struggle) — Challenges and learnings
