# ProjectCommit

Represents a single commit from a GitHub repository. Commits are fetched for `github` and `hybrid` project types when the `commits` option is configured.

## Definition

```tsx
interface ProjectCommit {
  message: string
  date: string
  url: string
  author?: ProjectCommitAuthor
}
```

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `message` | `string` | Yes | Full commit message |
| `date` | `string` | Yes | Commit date (ISO 8601) |
| `url` | `string` | Yes | Link to view the commit on GitHub |
| `author` | `ProjectCommitAuthor` | No | Commit author information |

## ProjectCommitAuthor

```tsx
interface ProjectCommitAuthor {
  name?: string
  email?: string
}
```

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | `string` | No | Author display name (GitHub username or committer name) |
| `email` | `string` | No | Author email address. Reserved for future use — currently never populated by the normalisation process |

## Fetching Commits

Commits must be explicitly enabled in your configuration:

### Global Default

```tsx
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
  },
], { commits: 5 })  // Fetch 5 most recent commits for all GitHub/hybrid projects
```

### Per-Project Override

```tsx
export const projects = defineProjects([
  {
    id: 'project-a',
    type: 'github',
    repo: 'user/repo-a',
    status: 'active',
    commits: 10,   // Override: fetch 10 commits
  },
  {
    id: 'project-b',
    type: 'github',
    repo: 'user/repo-b',
    status: 'active',
    commits: 0,     // Disable commits for this project
  },
  {
    id: 'project-c',
    type: 'github',
    repo: 'user/repo-c',
    status: 'active',
    // Uses global default
  },
], { commits: 5 })
```

### Commits Value Behavior

| Value | Behavior |
|-------|----------|
| `0` | No commits fetched |
| `1`–`100` | Fetch that many recent commits |
| `> 100` | Clamped to 100 (with warning) |
| `< 0` | Clamped to 0 (with warning) |
| `undefined` | Uses global default from `defineProjects` options |

## Display

Commits are displayed by the [CommitList](../components/commit-list) component:

```tsx
import { CommitList } from '@manningworks/projex'

<CommitList commits={project.commits} />
```

Or via [ProjectView.Commits](../components/project-view):

```tsx
<ProjectView.Commits project={project} />
```

### Message Truncation

Commit messages over 100 characters are truncated with an ellipsis in the `CommitList` component:

```tsx
// Full message: "feat: add support for YouTube channel data fetching with automatic subscriber and view count normalization"
// Displayed: "feat: add support for YouTube channel data fetching with automatic subscriber and view count normaliz..."
```

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-projex-commit-list` | Commit list container |
| `data-projex-commit` | Individual commit item |
| `data-projex-commit-message` | Commit message (truncated if > 100 chars) |
| `data-projex-commit-date` | Commit date |
| `data-projex-commit-link` | Link to view commit on GitHub |
| `data-projex-commit-author` | Author name |

## Rate Limiting

Commit fetching uses the GitHub API. Each project with commits enabled makes one API call.

| Auth | Rate Limit | Projects × Commits |
|------|------------|-------------------|
| Unauthenticated | 60/hr | ~60 projects with commits |
| `GITHUB_TOKEN` | 5000/hr | ~5000 projects with commits |

For portfolios with many GitHub projects, set `GITHUB_TOKEN` to avoid rate limits.

## Related

- [CommitList](../components/commit-list) — Display component for commits
- [ProjectView.Commits](../components/project-view) — Section component for commits
- [Project Commits Guide](../../guides/project-commits) — Complete commits walkthrough
- [defineProjects](../utilities/define-projects) — Commits configuration options
