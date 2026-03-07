# Project Types

Folio supports multiple project types, each suited to different scenarios.

## GitHub (`github`)

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

## NPM (`npm`)

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

## Product Hunt (`product-hunt`)

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

## Hybrid (`hybrid`)

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

## Manual (`manual`)

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

## Extended Fields

Beyond the basic fields, you can add rich metadata to your projects:

```ts
{
  id: 'my-project',
  type: 'github',
  repo: 'username/repo',
  status: 'active',

  featured: true,
  
  background: 'A deeper dive into the project context',
  
  why: 'The motivation behind building this project',
  
  stack: ['TypeScript', 'React', 'Next.js'],
  
  struggles: [
    { type: 'warn', text: 'First challenge we faced' },
    { type: 'info', text: 'Technical decision explanation' },
  ],
  
  timeline: [
    { date: '2025-01', note: 'Initial concept' },
    { date: '2025-02', note: 'First release' },
    { date: '2025-03', note: 'Major feature launch' },
  ],
}
```

**Field descriptions:**
- `featured: boolean` — Promote this project in featured sections
- `background: string` — Longer description for project detail pages
- `why: string` — Motivation or problem this project solves
- `stack: string[]` — Technologies used in the project
- `struggles: Array<{type: 'warn' | 'info', text: string}>` — Challenges faced during development
- `timeline: Array<{date: string, note: string}>` — Project milestones and history
