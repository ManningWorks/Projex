# defineProjects

Type-safe helper for defining project configurations.

## Signature

```tsx
function defineProjects(projects: FolioProjectInput[]): FolioProjectInput[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `FolioProjectInput[]` | Array of project input configurations |

## Returns

`FolioProjectInput[]` - The same array (identity function for type inference)

## Purpose

This is an identity function that provides TypeScript type inference and autocomplete for project configurations. It does not modify the input.

## Example

```tsx
import { defineProjects } from '@folio/core'

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
import { defineProjects } from '@folio/core'

export const projects = defineProjects([
  // ...projects
])

// lib/projects.ts
import { projects } from '@/folio.config'
import { normalise } from '@folio/core'

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
