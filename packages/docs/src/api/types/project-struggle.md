# ProjectStruggle

Represents a challenge, learning, or insight from a project journey. These entries showcase the narrative behind your projects - obstacles overcome and growth experienced.

## Type Definition

```typescript
interface ProjectStruggle {
  type: 'challenge' | 'learning'
  text: string
}
```

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `'challenge'` \| `'learning'` | Yes | The category of the struggle |
| `text` | `string` | Yes | Description of the challenge or learning |

## Type Values

### `challenge`

Obstacles or struggles overcome during the project. Use this type for:

- Technical blockers you encountered and solved
- External challenges (time constraints, resource limitations, etc.)
- Unexpected problems that required creative solutions
- Hurdles that delayed or complicated the project

**Examples:**

```typescript
{
  type: 'challenge',
  text: 'The initial architecture couldn\'t handle the expected load, requiring a complete redesign of the caching layer.'
}

{
  type: 'challenge',
  text: 'Limited API rate limits required implementing a clever batching strategy to stay within quotas.'
}

{
  type: 'challenge',
  text: 'Browser compatibility issues in Safari required fallback implementations for certain CSS features.'
}
```

### `learning`

Insights and growth from the project. Use this type for:

- New skills or technologies you learned
- Surprising discoveries or unexpected outcomes
- Realizations that changed your approach
- Takeaways you'd share with others

**Examples:**

```typescript
{
  type: 'learning',
  text: 'TypeScript\'s strict mode caught several edge cases I would have missed otherwise.'
}

{
  type: 'learning',
  text: 'User testing revealed that the initial assumption about user behavior was completely wrong.'
}

{
  type: 'learning',
  text: 'Investing in a comprehensive test suite paid off when refactoring was required for new features.'
}
```

## Usage Example

```typescript
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/repo',
    status: 'shipped',
    struggles: [
      {
        type: 'challenge',
        text: 'Integrating with third-party APIs was complex due to inconsistent documentation.'
      },
      {
        type: 'learning',
        text: 'Implementing TypeScript from scratch significantly reduced bugs in production.'
      }
    ]
  }
])
```

## Display

Struggles are displayed in the [ProjectView](../components/project-view) component with visual distinction between types:

```tsx
<ProjectView.Section name="struggles" project={project} />
```

Each struggle renders with data attributes for styling:

```html
<div data-projex-struggle data-projex-struggle-type="challenge">
  The text of the challenge...
</div>

<div data-projex-struggle data-projex-struggle-type="learning">
  The text of the learning...
</div>
```

## Styling

Target struggles by type using data attributes:

```css
/* All struggles */
[data-projex-struggle] {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}

/* Challenges - typically yellow/orange */
[data-projex-struggle-type="challenge"] {
  background: #fef3c7;
  color: #92400e;
  border-left: 3px solid #f59e0b;
}

/* Learning - typically green/blue */
[data-projex-struggle-type="learning"] {
  background: #dbeafe;
  color: #1e40af;
  border-left: 3px solid #3b82f6;
}
```

See [Styling Guide](../../guides/styling) for more styling patterns.

## Best Practices

1. **Be specific**: Rather than "Had issues," describe what the issue was
2. **Show resolution**: Briefly hint at how it was solved
3. **Balance types**: Mix both challenges and learnings for a complete story
4. **Keep it readable**: Write for others to understand your journey
5. **Stay positive**: Frame challenges as opportunities for growth

## Migration Notes

If you're upgrading from an earlier version of Projex, the `ProjectStruggle` type was updated from log-level terminology (`'warn'` | `'error'`) to semantic content categories (`'challenge'` | `'learning'`).

See [Migration Guide](../../guides/migration#projectstruggle-type-changes) for migration instructions.
