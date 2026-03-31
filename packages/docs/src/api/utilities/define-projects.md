# defineProjects

Type-safe helper for defining project configurations.

## Signature

```tsx
function defineProjects(projects: ProjexProjectInput[], options?: DefineProjectsOptions): DefineProjectsResult
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProjectInput[]` | Array of project input configurations |
| options | `DefineProjectsOptions` | Optional configuration options |

## Returns

`DefineProjectsResult` - Object containing:
- `projects`: `ProjexProjectInput[]` - The same array (identity function for type inference)
- `options`: `DefineProjectsOptions` - The options passed in

## Commits Configuration

Projex can fetch recent commits from GitHub repositories for GitHub and hybrid project types.

### Global Default

Set a default number of commits for all GitHub/hybrid projects:

```tsx
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  { id: 'my-project', type: 'github', repo: 'user/repo', status: 'active' },
], { commits: 5 })
```

### Per-Project Override

Override global default for specific projects:

```tsx
export const projects = defineProjects([
  { id: 'project-1', type: 'github', repo: 'user/repo1', commits: 10 },
  { id: 'project-2', type: 'github', repo: 'user/repo2' }, // uses global default
], { commits: 5 })
```

### Available Types

Commits are supported for:
- `github` - Fetches commits from GitHub repository
- `hybrid` - Fetches commits from GitHub repository

Other project types (`manual`, `npm`, `product-hunt`) do not support commits.

### Rate Limits

GitHub's unauthenticated API limit is 60 requests/hour. If you have many projects with commits enabled, we recommend setting a `GITHUB_TOKEN`:

```bash
GITHUB_TOKEN=github_pat_xxx pnpm build
```

This increases your rate limit to 5,000 requests/hour.

## NPM Timestamps Configuration

By default, npm projects do not use timestamps from the npm registry for sorting. You can opt-in to extract `createdAt` and `updatedAt` timestamps from the npm registry.

### Enable NPM Timestamps

```tsx
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-npm-package',
    type: 'npm',
    package: 'my-package',
    status: 'active',
  },
], {
  fetchNpmTimestamps: true,  // Extract timestamps from npm registry
})
```

### Behavior by Project Type

| Type | Timestamp Source | Requires `fetchNpmTimestamps` |
|------|-----------------|-----------------------------|
| `github` | GitHub API (`created_at`, `updated_at`) | No |
| `hybrid` | GitHub API, npm `time` (max of both) | For npm timestamps |
| `npm` | npm `time.created`, `time.modified` | Yes |
| `product-hunt` | Product Hunt API `featured_at` | No |
| `youtube` | YouTube API `latestVideoPublishedAt` | No |
| `devto` | Manual `createdAt`/`updatedAt` only | N/A |
| `manual` | Manual `createdAt`/`updatedAt` only | N/A |
| `gumroad` | Manual `createdAt`/`updatedAt` only | N/A |
| `lemonsqueezy` | Manual `createdAt`/`updatedAt` only | N/A |

### Hybrid Projects

For hybrid projects, when `fetchNpmTimestamps` is enabled, `updatedAt` is set to the most recent of:
- GitHub's `updated_at`
- npm's `time.modified`

This accurately reflects the last activity whether it was a code change or a new package version.

### Manual Override

You can always manually specify timestamps regardless of the `fetchNpmTimestamps` setting:

```tsx
{
  id: 'my-npm-package',
  type: 'npm',
  package: 'my-package',
  status: 'active',
  createdAt: '2024-01-01',
  updatedAt: '2024-06-01',
}
```

### Performance Note

The npm registry data is already being fetched to get version and download counts. Enabling `fetchNpmTimestamps` extracts additional metadata from the existing response with **zero extra API calls**.

## Purpose

This is an identity function that provides TypeScript type inference and autocomplete for project configurations. It does not modify the input.

## Example

```tsx
import { defineProjects } from '@manningworks/projex'

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
// projex.config.ts
import { defineProjects } from '@manningworks/projex'

export const config = defineProjects([
  // ...projects
])

// lib/projects.ts
import { config } from '@/projex.config'
import { normalise } from '@manningworks/projex'

export async function getProjects() {
  return Promise.all(config.projects.map(p => normalise(p, config.options)))
}
```

## Type Safety

The function ensures all required fields are present based on the `type`:

- `github`: requires `repo`
- `npm`: requires `package`
- `product-hunt`: requires `slug`
- `youtube`: requires `channelId`
- `gumroad`: requires `productId`
- `lemonsqueezy`: requires `storeId`
- `devto`: requires `username`
- `hybrid`: requires `repo` and `package`
- `manual`: no additional required fields
