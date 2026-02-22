# Getting Started

Get your project showcase up and running in under 10 minutes.

## Installation

Folio is a shadcn-style component library. You copy components into your project rather than installing as an npm package.

### Option 1: Copy Components (Recommended)

Copy the components you need from `packages/core/src/components/` into your project:

```bash
mkdir -p src/components/folio
cp -r node_modules/@folio/core/src/components/* src/components/folio/
```

### Option 2: Install as Package

```bash
pnpm add @folio/core
```

Or with npm:

```bash
npm install @folio/core
```

## Quick Start

### 1. Create Your Config

Create `folio.config.ts` in your project root:

```ts
import { defineProjects } from '@folio/core'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/my-project',
    status: 'active',
    featured: true,
  },
])
```

### 2. Normalize Projects

In your page component, use `normalise` to fetch remote data and build `FolioProject` objects:

```tsx
import { normalise } from '@folio/core'
import type { FolioProject } from '@folio/core'
import { projects as projectInputs } from '../folio.config'

async function getProjects(): Promise<FolioProject[]> {
  const projects = await Promise.all(
    projectInputs.map((input) => normalise(input))
  )
  return projects
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### 3. Use Components

Compose your layout with compound components:

```tsx
import { ProjectCard } from '@folio/core'

export default async function ProjectsPage() {
  const projects = await getProjects()
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectCard.Header project={project} />
          <ProjectCard.Description project={project} />
          <ProjectCard.Tags project={project} />
          <ProjectCard.Stats project={project} />
          <ProjectCard.Status project={project} />
          <ProjectCard.Links project={project} />
        </ProjectCard>
      ))}
    </div>
  )
}
```

## Project Types

Folio supports multiple project types, each suited to different scenarios:

### GitHub (`github`)

Fetches repo data from the GitHub API automatically.

```ts
{
  id: 'my-lib',
  type: 'github',
  repo: 'username/repo-name',
  status: 'active',
}
```

**Auto-populated fields:** name, description, stars, forks, language, links

### NPM (`npm`)

Fetches package data from the npm registry.

```ts
{
  id: 'my-package',
  type: 'npm',
  package: 'my-package-name',
  status: 'active',
}
```

**Auto-populated fields:** downloads, version, npm link

### Product Hunt (`product-hunt`)

Fetches post data from Product Hunt.

```ts
{
  id: 'my-launch',
  type: 'product-hunt',
  slug: 'my-product-slug',
  status: 'shipped',
}
```

**Auto-populated fields:** upvotes, comments, launch date

### Hybrid (`hybrid`)

Combines GitHub and NPM data for packages with both repo and registry presence.

```ts
{
  id: 'full-stack-lib',
  type: 'hybrid',
  repo: 'username/lib',
  package: 'my-lib',
  status: 'active',
}
```

**Auto-populated fields:** Combined from both sources

### Manual (`manual`)

Full control with no automatic data fetching. Use for client work, private projects, or anything custom.

```ts
{
  id: 'client-project',
  type: 'manual',
  status: 'shipped',
  name: 'Client E-commerce',
  tagline: 'Custom storefront build',
  description: 'Full rebuild of a Shopify storefront...',
  links: { live: 'https://example.com' },
  stack: ['Next.js', 'Shopify'],
}
```

## Project Status

Each project has a status that indicates its current state:

| Status | Use For |
|--------|---------|
| `active` | Maintained projects |
| `shipped` | Completed products |
| `in-progress` | Currently building |
| `coming-soon` | Not yet released |
| `archived` | No longer maintained |
| `for-sale` | Available for purchase |

## Fetch Strategy

Folio is designed for **build-time data fetching**. All remote data (GitHub, npm, Product Hunt) is fetched when your site builds.

### Why Build-Time?

- **No rate limits at runtime** - GitHub API limits unauthenticated requests to 60/hour
- **Fast page loads** - No client-side API calls
- **Static hosting** - Works with any static host

### Authentication

For GitHub, set `GITHUB_TOKEN` to increase rate limits from 60/hr to 5,000/hr:

```bash
GITHUB_TOKEN=ghp_xxx pnpm build
```

Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) (no special permissions needed for public repos).

### Caching

The `normalise` function uses `cache: 'force-cache'` which caches responses for the build duration. For fresh data, rebuild your site.

## Complete Example

Here's a full setup for a Next.js App Router project:

### folio.config.ts

```ts
import { defineProjects } from '@folio/core'

export const projects = defineProjects([
  {
    id: 'folio',
    type: 'github',
    repo: 'anomalyco/folio',
    status: 'active',
    featured: true,
    background: 'A shadcn-style component library for project showcase pages.',
    why: 'No existing solution handled the reality of a solopreneur project mix.',
    stack: ['TypeScript', 'React', 'Next.js'],
    struggles: [
      { type: 'warn', text: 'Balancing flexibility with simplicity' },
    ],
    timeline: [
      { date: '2025-01', note: 'Initial concept' },
      { date: '2025-02', note: 'First release' },
    ],
  },
  {
    id: 'client-work',
    type: 'manual',
    status: 'shipped',
    name: 'Client E-commerce',
    tagline: 'Headless Shopify rebuild',
    description: 'Full stack rebuild with custom checkout and real-time inventory.',
    links: { live: 'https://client-example.com' },
    stack: ['Next.js', 'Shopify', 'Sanity'],
    background: 'The client needed a modern storefront.',
  },
])
```

### app/projects/page.tsx

```tsx
import { normalise, ProjectCard } from '@folio/core'
import type { FolioProject } from '@folio/core'
import { projects as projectInputs } from '../../folio.config'

async function getProjects(): Promise<FolioProject[]> {
  return Promise.all(projectInputs.map((input) => normalise(input)))
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <main>
      <h1>Projects</h1>
      <div data-folio-grid>
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Tags project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Status project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
      </div>
    </main>
  )
}
```

### Styling

Folio ships with zero CSS. Style using the data attributes:

```css
[data-folio-card] {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

[data-folio-card-header] {
  font-size: 1.25rem;
  font-weight: 600;
}

[data-folio-status] {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

[data-folio-status-value="active"] {
  background: #dcfce7;
  color: #166534;
}
```

## Next Steps

- [Component Reference](./api/components/project-card) - All available components
- [Utilities](./api/utilities/define-projects) - Filtering, sorting, and more
- [Types](./api/types/folio-project) - TypeScript type definitions
