# ProjexProjectInput

Project input configuration for defining projects. Passed to `normalise` to create `ProjexProject` objects.

## Definition

```tsx
type ProjexProjectInput =
  | GitHubProjectInput
  | ManualProjectInput
  | NpmProjectInput
  | ProductHuntProjectInput
  | YouTubeProjectInput
  | GumroadProjectInput
  | LemonSqueezyProjectInput
  | DevToProjectInput
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

### YouTubeProjectInput

```tsx
interface YouTubeProjectInput extends BaseProjectInput {
  type: 'youtube'
  channelId: string  // Required: YouTube channel ID
}
```

### GumroadProjectInput

```tsx
interface GumroadProjectInput extends BaseProjectInput {
  type: 'gumroad'
  productId: string  // Required: Gumroad product ID
}
```

### LemonSqueezyProjectInput

```tsx
interface LemonSqueezyProjectInput extends BaseProjectInput {
  type: 'lemonsqueezy'
  storeId: string  // Required: Lemon Squeezy store ID
}
```

### DevToProjectInput

```tsx
interface DevToProjectInput extends BaseProjectInput {
  type: 'devto'
  username: string  // Required: Dev.to username
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

  // YouTube channel project
  {
    id: 'youtube-channel',
    type: 'youtube',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    status: 'active',
  },

  // Gumroad product project
  {
    id: 'gumroad-product',
    type: 'gumroad',
    productId: 'prod_test123',
    status: 'shipped',
  },

  // Lemon Squeezy store project
  {
    id: 'lemonsqueezy-store',
    type: 'lemonsqueezy',
    storeId: '12345',
    status: 'active',
  },

  // Dev.to user project
  {
    id: 'devto-user',
    type: 'devto',
    username: 'your-username',
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
