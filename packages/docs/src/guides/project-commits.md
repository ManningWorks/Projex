# Project Commits

Display recent GitHub commits in your project view. Available for GitHub and hybrid project types.

## Enabling Commits

Set a global default for all GitHub/hybrid projects:

```ts
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  { id: 'my-lib', type: 'github', repo: 'username/repo' },
  { id: 'another-lib', type: 'hybrid', repo: 'username/lib', package: 'my-lib' },
], { commits: 5 })
```

Or override per-project:

```ts
export const projects = defineProjects([
  { id: 'featured', type: 'github', repo: 'username/repo', commits: 10 },
  { id: 'secondary', type: 'github', repo: 'username/other' }, // uses global default
], { commits: 5 })
```

## Rate Limits

GitHub allows 60 requests/hour unauthenticated. For projects with many commits, set a `GITHUB_TOKEN`:

```bash
GITHUB_TOKEN=github_pat_xxx pnpm build
```

This increases the rate limit to 5,000 requests/hour.

See the [Fetch Strategy guide](./fetch-strategy) for details on setting up GitHub authentication.

## Displaying Commits

Use `ProjectView.Commits` in your project detail page:

```tsx
import { ProjectView } from '@manningworks/projex'

export default function ProjectDetailPage({ project }) {
  return (
    <ProjectView project={project} onBack={() => router.push('/')}>
      <ProjectView.Section name="background" project={project} />
      <ProjectView.Stats project={project} />
      <ProjectView.Commits project={project} />
    </ProjectView>
  )
}
```

The commits component displays:
- Commit message
- Author name
- Commit date
- Link to the commit on GitHub
