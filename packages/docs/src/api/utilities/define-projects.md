# defineProjects

Type-safe helper for defining project configurations.

## Signature

```tsx
function defineProjects(projects: FolioProjectInput[], options?: DefineProjectsOptions): DefineProjectsResult
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `FolioProjectInput[]` | Array of project input configurations |
| options | `DefineProjectsOptions` | Optional configuration options |

## Returns

`DefineProjectsResult` - Object containing:
- `projects`: `FolioProjectInput[]` - The same array (identity function for type inference)
- `options`: `DefineProjectsOptions` - The options passed in

## Commits Configuration

Folio can fetch recent commits from GitHub repositories for GitHub and hybrid project types.

### Global Default

Set a default number of commits for all GitHub/hybrid projects:

```tsx
import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  { id: 'my-project', type: 'github', repo: 'user/repo', status: 'active' },
], { commits: 5 })
```

### Per-Project Override

Override the global default for specific projects:

```tsx
export const projects = defineProjects([
  { id: 'project-1', type: 'github', repo: 'user/repo1', commits: 10 },
  { id: 'project-2', type: 'github', repo: 'user/repo2' }, // uses global default
], { commits: 5 })
```

### Available Types

Commits are supported for:
- `github` - Fetches commits from the GitHub repository
- `hybrid` - Fetches commits from the GitHub repository

Other project types (`manual`, `npm`, `product-hunt`) do not support commits.

### Rate Limits

GitHub's unauthenticated API limit is 60 requests/hour. If you have many projects with commits enabled, we recommend setting a `GITHUB_TOKEN`:

```bash
GITHUB_TOKEN=github_pat_xxx pnpm build
```

This increases your rate limit to 5,000 requests/hour.

## Purpose

This is an identity function that provides TypeScript type inference and autocomplete for project configurations. It does not modify the input.

## Example

```tsx
import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  {
    id: 'project-1',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
    featured: true,
  },
  {
    id: 'project-2',
    type: 'npm',
    package: 'my-package',
    status: 'shipped',
  },
  {
    id: 'project-3',
    type: 'manual',
    status: 'coming-soon',
    name: 'Secret Project',
    tagline: 'Coming soon...',
  },
  {
    id: 'project-4',
    type: 'hybrid',
    repo: 'user/repo',
    package: 'my-package',
    status: 'active',
  },
  {
    id: 'project-5',
    type: 'product-hunt',
    slug: 'my-product',
    status: 'shipped',
  },
])
```

## With Next.js

```tsx
// folio.config.ts
import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  // ...projects
])

// lib/projects.ts
import { projects } from '@/folio.config'
import { normalise } from '@reallukemanning/folio'

export async function getProjects() {
  return Promise.all(projects.map(normalise))
}
```

## Type Safety

The function ensures all required fields are present based on the `type`:

- `github`: requires `repo`
- `npm`: requires `package`
- `product-hunt`: requires `slug`
- `hybrid`: requires `repo` and `package`
- `manual`: no additional required fields
