# CommitList

Component for displaying a list of project commits.

## Import

```tsx
import { CommitList } from '@reallukemanning/folio'
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
| `data-folio-commit-list` | Root commit list container |
| `data-folio-commit` | Individual commit item |
| `data-folio-commit-message` | Commit message |
| `data-folio-commit-date` | Commit date |
| `data-folio-commit-link` | Link to view commit |
| `data-folio-commit-author` | Commit author name |

## Styling

Messages over 100 characters are truncated with an ellipsis.

```css
[data-folio-commit-message] {
  margin-bottom: 0.5rem;
}

[data-folio-commit-date] {
  font-size: 0.875rem;
  color: #6b7280;
}

[data-folio-commit-link] {
  font-size: 0.875rem;
  color: #3b82f6;
}
```
