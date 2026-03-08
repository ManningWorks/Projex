# ProjexProjectInput

Project input configuration for defining projects. Passed to `normalise` to create `ProjexProject` objects.

## Definition

```tsx
type ProjexProjectInput =
  | GitHubProjectInput
  | ManualProjectInput
  | NpmProjectInput
  | ProductHuntProjectInput
  | HybridProjectInput
```

## Base Properties

All input types share these base properties:

```tsx
interface BaseProjectInput {
  id: string
  status: ProjectStatus
  featured?: boolean
  name?: string
  tagline?: string
  description?: string
  background?: string
  why?: string
  image?: string
  struggles?: ProjectStruggle[]
  timeline?: ProjectTimelineEntry[]
  posts?: ProjectPost[]
  stack?: string[]
  links?: ProjectLinks
  stats?: ProjectStats
  createdAt?: string
  updatedAt?: string
  override?: {
    name?: string
    tagline?: string
    description?: string
    stack?: string[]
  }
}
```

## Input Types

### GitHubProjectInput

```tsx
interface GitHubProjectInput extends BaseProjectInput {
  type: 'github'
  repo: string  // Required: 'owner/repo'
}
```

### NpmProjectInput

```tsx
interface NpmProjectInput extends BaseProjectInput {
  type: 'npm'
  package: string  // Required: package name
}
```

### ProductHuntProjectInput

```tsx
interface ProductHuntProjectInput extends BaseProjectInput {
  type: 'product-hunt'
  slug: string  // Required: Product Hunt slug
}
```

### HybridProjectInput

```tsx
interface HybridProjectInput extends BaseProjectInput {
  type: 'hybrid'
  repo: string     // Required
  package: string  // Required
}
```

### ManualProjectInput

```tsx
interface ManualProjectInput extends BaseProjectInput {
  type: 'manual'
  // No additional required fields
}
```

## Example

```tsx
import { defineProjects } from '@manningworks/projex'

const projects = defineProjects([
  // GitHub project
  {
    id: 'gh-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
    featured: true,
  },
  
  // npm project
  {
    id: 'npm-project',
    type: 'npm',
    package: 'my-package',
    status: 'shipped',
  },
  
  // Manual project
  {
    id: 'manual-project',
    type: 'manual',
    status: 'coming-soon',
    name: 'Secret Project',
    tagline: 'Coming soon...',
  },
  
  // Hybrid project
  {
    id: 'hybrid-project',
    type: 'hybrid',
    repo: 'user/repo',
    package: 'my-package',
    status: 'active',
  },
])
```

## Override

The `override` property lets you replace fetched data:

```tsx
{
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active',
  override: {
    name: 'Custom Name',  // Overrides GitHub repo name
    stack: ['React', 'TypeScript']  // Custom stack
  }
}
```
