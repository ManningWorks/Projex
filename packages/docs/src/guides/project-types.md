# Project Types

Projex supports multiple project types, each suited to different scenarios.

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

## YouTube (`youtube`)

Fetches channel data from YouTube API.

```ts
{
  id: 'my-channel',
  type: 'youtube',
  channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
  status: 'active',
}
```

**Auto-populated fields:** subscribers, views, latest video title, latest video URL, latest video published date

**Environment variable:** `YOUTUBE_TOKEN` (required) - Create an API key at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

## Gumroad (`gumroad`)

Fetches product data from Gumroad API.

```ts
{
  id: 'my-product',
  type: 'gumroad',
  productId: 'prod_test123',
  status: 'shipped',
}
```

**Auto-populated fields:** formatted revenue, sales count, subscriber count

**Environment variable:** `GUMROAD_TOKEN` (required) - Create an access token at [Gumroad Settings](https://app.gumroad.com/settings/api_tokens)

## Lemon Squeezy (`lemonsqueezy`)

Fetches store data from Lemon Squeezy API.

```ts
{
  id: 'my-store',
  type: 'lemonsqueezy',
  storeId: '12345',
  status: 'active',
}
```

**Auto-populated fields:** formatted MRR, order count, customer count

**Environment variable:** `LEMONSQUEEZY_TOKEN` (required) - Get from [Lemon Squeezy Settings](https://app.lemonsqueezy.com/settings/api)

## Dev.to (`devto`)

Fetches user data from Dev.to API.

```ts
{
  id: 'my-devto',
  type: 'devto',
  username: 'your-username',
  status: 'active',
}
```

**Auto-populated fields:** article count, total views, average reactions

**Environment variable:** Not required (Dev.to has generous public API limits)

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
