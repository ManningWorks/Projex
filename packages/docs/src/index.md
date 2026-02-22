# Getting Started

Get your project showcase up and running in under 10 minutes.

## Installation

### Quick Start with CLI

The fastest way to get started is using the CLI:

```bash
npx @reallukemanning/folio init
```

This creates a `folio.config.ts` file in your project root.

To add components:

```bash
npx @reallukemanning/folio add project-card
npx @reallukemanning/folio add project-view
```

Available components:
- `project-card` - Card component for project summaries
- `project-view` - Expanded project detail view
- `project-grid` - Grid layout container
- `project-list` - List layout container
- `featured-project` - Featured project highlight

The CLI copies components to `components/folio/` and includes all necessary type definitions.

### Install as Package

Alternatively, install the package first for shorter commands:

```bash
pnpm add @reallukemanning/folio
```

Now you can use the CLI without the full package name:

```bash
npx folio init
npx folio add project-card
```

And import components directly in your code:

```tsx
import { ProjectCard, normalise } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'
```

## CLI Commands

### `npx @reallukemanning/folio init`

Initialize a new Folio project in your current directory.

**Basic setup:**

```bash
npx @reallukemanning/folio init
```

This creates a minimal `folio.config.ts` template.

**Auto-detect GitHub repositories:**

```bash
npx @reallukemanning/folio init --github
```

This prompts for your GitHub username and automatically fetches your public repositories, generating a config with all your projects.

**With GitHub token:**

```bash
GITHUB_TOKEN=ghp_xxx npx @reallukemanning/folio init --github
```

Using a GitHub token increases the rate limit from 60 requests/hour to 5,000 requests/hour, allowing you to fetch more repositories.

### `npx @reallukemanning/folio add <component>`

Add a Folio component to your project.

```bash
npx @reallukemanning/folio add project-card
npx @reallukemanning/folio add project-view
npx @reallukemanning/folio add project-grid
npx @reallukemanning/folio add project-list
npx @reallukemanning/folio add featured-project
```

The command copies component files to `components/folio/<ComponentName>/` and includes a shared `types.ts` file with all necessary type definitions.

## Quick Start

### 1. Create Your Config

Create `folio.config.ts` in your project root:

```ts
import { defineProjects } from '@reallukemanning/folio'

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
import { normalise } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'
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
import { ProjectCard } from '@reallukemanning/folio'

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

## Error Handling

Folio is designed to handle errors gracefully. Here's what to expect and how to handle common issues.

### GitHub API Rate Limits

The GitHub API has rate limits that affect data fetching:

- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

**Symptoms:**
```
GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit)
```
Projects with `type: 'github'` or `type: 'hybrid'` will return with empty stats (stars, forks).

**Solution:**

Set a GitHub token as an environment variable:

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) (no special permissions needed for public repos).

```bash
# Build with token
pnpm build
```

### Failed API Fetches

If GitHub, npm, or Product Hunt API requests fail, Folio handles it gracefully:

- The `normalise` function returns a project with `stats: null`
- Components with missing stats won't render the stats section
- Your site will still build and render other project data

**Debugging:**

Check build output for warning messages:

```bash
pnpm build
```

Common failures:
- GitHub: Repository not found, private repo without token, rate limit exceeded
- npm: Package not found on registry
- Product Hunt: Invalid slug, missing token

### Private Repositories

Private GitHub repositories require authentication:

```bash
GITHUB_TOKEN=ghp_xxx pnpm build
```

The token must have `read` permissions for the repository.

**Without authentication:**
- Private repos return `null` from `fetchGitHubRepo`
- Project stats will be empty
- Other project data (name, description from config) still renders

### Missing Environment Variables

Folio fetches data at build time using environment variables:

| Variable | Purpose | Required |
|----------|-----------|------------|
| `GITHUB_TOKEN` | GitHub API authentication | Optional (recommended) |
| `PRODUCT_HUNT_TOKEN` | Product Hunt API access | Optional (if using product-hunt type) |

**Missing variables:**
- Folio logs a warning
- Falls back to unauthenticated requests
- Continues to build (may hit rate limits)

### Build Failures

If your build fails:

1. **Check environment variables:**
   ```bash
   echo $GITHUB_TOKEN
   ```

2. **Verify project config:**
   - Check repo format: `username/repo`
   - Check package name exists on npm
   - Verify GitHub repos are public (or you have a token)

3. **Review build logs:**
   - Look for rate limit warnings
   - Check for network errors
   - Verify all projects have required fields

4. **Test individual projects:**
   Create a minimal config with one project to isolate the issue:
   ```ts
   export const projects = defineProjects([
     { id: 'test', type: 'github', repo: 'username/repo', status: 'active' }
   ])
   ```

### Fallback Strategies

For mission-critical data:

**Override API data:**

```ts
{
  id: 'my-project',
  type: 'github',
  repo: 'username/repo',
  status: 'active',
  override: {
    name: 'Custom Name',
    description: 'Custom description',
    stats: { stars: 1000, forks: 50 }
  }
}
```

**Use manual type for full control:**

```ts
{
  id: 'manual-project',
  type: 'manual',
  status: 'shipped',
  name: 'My Project',
  description: 'Full control over data',
  stats: { stars: 999, forks: 42 }
}
```

## Troubleshooting

### Component Not Rendering

**Symptom:** Component renders nothing

**Solutions:**
- Check if `project.description` is empty - `ProjectCard.Description` returns null
- Verify `project.stack` has values - `ProjectCard.Tags` returns null if empty
- Ensure `project.stats` has values - `ProjectCard.Stats` returns null if empty

### Types Not Found

**Symptom:** TypeScript error "Cannot find module" or "Cannot find name"

**Solutions:**
- Using CLI: Components are copied to `components/folio/<ComponentName>/` with types in `components/folio/types.ts`
- Using npm package: Import from `@reallukemanning/folio` package
- Check TypeScript config includes component directory

### Build Not Updating Data

**Symptom:** Changes to project config don't appear on site

**Solutions:**
- GitHub/npm data is cached at build time - rebuild site to refresh
- Clear build cache: `rm -rf .next` (Next.js) then rebuild
- Check environment variables are set for build: `GITHUB_TOKEN=xxx pnpm build`

### CLI Command Not Found

**Symptom:** `folio: command not found`

**Solutions:**
- Use `npx @reallukemanning/folio <command>` - no installation required
- Or install the package first: `pnpm add @reallukemanning/folio` then use `npx folio <command>`
- Or install globally: `npm install -g @reallukemanning/folio`
- Check Node.js version: `node --version` (requires 18+)

## Complete Example

Here's a full setup for a Next.js App Router project:

### folio.config.ts

```ts
import { defineProjects } from '@reallukemanning/folio'

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
import { normalise, ProjectCard } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'
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
