# CommitList

Component for displaying a list of project commits.

## Import

```tsx
import { CommitList } from '@manningworks/projex'
```

## Usage

```tsx
<CommitList commits={project.commits} />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| commits | `ProjectCommit[]` | Yes | Array of commit data to display |

Returns `null` if the commits array is empty or undefined.

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-projex-commit-list` | Root commit list container |
| `data-projex-commit` | Individual commit item |
| `data-projex-commit-message` | Commit message |
| `data-projex-commit-date` | Commit date |
| `data-projex-commit-link` | Link to view commit |
| `data-projex-commit-author` | Commit author name |

## Styling

Messages over 100 characters are truncated with an ellipsis.

```css
[data-projex-commit-message] {
  margin-bottom: 0.5rem;
}

[data-projex-commit-date] {
  font-size: 0.875rem;
  color: #6b7280;
}

[data-projex-commit-link] {
  font-size: 0.875rem;
  color: #3b82f6;
}
```
