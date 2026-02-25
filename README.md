# Folio

Folio is a shadcn-style component library for developers and solopreneurs who want a flexible, data-driven project showcase on their personal site.

## Links

- **Documentation:** https://folio-guide.vercel.app
- **Demo:** https://folio-demo.vercel.app

## Problem

Every developer eventually builds a projects page, and almost every developer builds it from scratch. They wire up GitHub APIs, handle rate limiting, design cards, handle edge cases for private repos and non-GitHub projects, and end up with bespoke solutions that help nobody else.

## Quick Start

```bash
pnpm add @reallukemanning/folio
```

```ts
// folio.config.ts
import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  {
    id: 'my-app',
    name: 'My App',
    description: 'An amazing application',
    type: 'github',
    status: 'active',
    links: { github: 'https://github.com/user/my-app' }
  }
])
```

```tsx
import { ProjectCard } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'

export function ProjectsGrid({ projects }: { projects: FolioProject[] }) {
  return (
    <div>
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

## CLI

Folio includes a CLI for copying components and themes into your project (shadcn-style):

```bash
# Initialize config
npx folio init

# Copy components to your project
npx folio add project-card
npx folio add project-view

# Add pre-built themes
npx folio add theme-minimal
npx folio add theme-dark
npx folio add theme-gradient
```

The CLI automatically installs the `@reallukemanning/folio` package as a dependency, and copied components import types directly from it.

## folio.config.ts Reference

### defineProjects(projects)

Type-preserving identity function. Pass an array of `FolioProjectInput` objects.

```ts
export const projects = defineProjects([
  { id, name, description, type, status, ... }
])
```

### FolioProjectInput

All fields are optional except where noted.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` (required) | Unique identifier for project |
| `type` | `'github' \| 'manual' \| 'npm' \| 'product-hunt' \| 'youtube' \| 'gumroad' \| 'lemonsqueezy' \| 'devto' \| 'hybrid'` (required) | Project type |
| `status` | `'active' \| 'shipped' \| 'in-progress' \| 'coming-soon' \| 'archived' \| 'for-sale'` (required) | Current status |
| `featured` | `boolean` | Whether project is featured |
| `repo` | `string` | GitHub repo in "username/repo" format (required for github/hybrid) |
| `package` | `string` | npm package name (required for npm/hybrid) |
| `slug` | `string` | Product Hunt slug (required for product-hunt) |
| `channelId` | `string` | YouTube channel ID (required for youtube) |
| `productId` | `string` | Gumroad product ID (required for gumroad) |
| `storeId` | `string` | Lemon Squeezy store ID (required for lemonsqueezy) |
| `username` | `string` | Dev.to username (required for devto) |
| `name` | `string` | Display name (optional for github, required for manual/npm) |
| `tagline` | `string` | Short tagline |
| `description` | `string` | Short description (optional for github, required for manual/npm) |
| `background` | `string` | Project background story |
| `why` | `string` | Why you built this project |
| `struggles` | `ProjectStruggle[]` | Current challenges |
| `timeline` | `ProjectTimelineEntry[]` | Project milestones |
| `posts` | `ProjectPost[]` | Related blog posts |
| `stack` | `string[]` | Technologies used |
| `links` | `ProjectLinks` | URLs to project resources |
| `stats` | `ProjectStats` | GitHub/npm stats |
| `language` | `string` | Primary programming language |
| `languageColor` | `string` | Hex color for language badge |
| `linkOrder` | `string[]` | Link display order |
| `commits` | `number` | Number of commits to fetch (github/hybrid) |
| `override` | `object` | Override GitHub API data |

### ProjectLinks

| Field | Type |
|-------|------|
| `github` | `string` |
| `live` | `string` |
| `docs` | `string` |
| `demo` | `string` |
| `npm` | `string` |
| `appStore` | `string` |
| `playStore` | `string` |
| `productHunt` | `string` |
| `custom` | `Array<{ label: string, url: string }>` |

### ProjectStats

| Field | Type |
|-------|------|
| `stars` | `number` |
| `forks` | `number` |
| `downloads` | `string` |
| `version` | `string` |
| `upvotes` | `number` |
| `comments` | `number` |
| `launchDate` | `string` |

### ProjectStruggle

| Field | Type |
|-------|------|
| `type` | `'warn' \| 'error'` |
| `text` | `string` |

### ProjectTimelineEntry

| Field | Type |
|-------|------|
| `date` | `string` |
| `note` | `string` |

### ProjectPost

| Field | Type |
|-------|------|
| `title` | `string` |
| `date` | `string` |
| `url` | `string` (optional) |

## Component API

### ProjectCard

Compound component for project cards. Render nothing for empty data.

```tsx
<ProjectCard>
  <ProjectCard.Header project={project} />
  <ProjectCard.Description project={project} />
  <ProjectCard.Tags project={project} />
  <ProjectCard.Stats project={project} />
  <ProjectCard.Status project={project} />
  <ProjectCard.Links project={project} />
</ProjectCard>
```

### ProjectView

Compound component for expanded project detail view.

```tsx
<ProjectView project={project} onBack={() => setSelected(null)}>
  <ProjectView.Section project={project} name="background" />
  <ProjectView.Section project={project} name="stack" />
  <ProjectView.Section project={project} name="struggles" />
  <ProjectView.Section project={project} name="timeline" />
  <ProjectView.Section project={project} name="posts" />
  <ProjectView.Links project={project} />
</ProjectView>
```

## Data Attributes

Every rendered element has a `data-folio-*` attribute for styling.

### ProjectCard

| Element | Attribute |
|---------|-----------|
| Card container | `data-folio-card` |
| Header | `data-folio-card-header` |
| Type badge | `data-folio-type`, `data-folio-type-value` |
| Description | `data-folio-card-description` |
| Tags container | `data-folio-card-tags` |
| Individual tag | `data-folio-tag` |
| Stats container | `data-folio-card-stats` |
| Individual stat | `data-folio-stat="stars|forks|downloads"` |
| Status badge | `data-folio-status`, `data-folio-status-value` |
| Links container | `data-folio-card-links` |
| Individual link | `data-folio-link`, `data-folio-link-type="github|live|docs|demo|npm|product-hunt|custom"` |

### ProjectView

| Element | Attribute |
|---------|-----------|
| View container | `data-folio-view` |
| Section | `data-folio-view-section`, `data-folio-view-section-name` |
| Timeline date | `data-folio-timeline-date` |
| Timeline note | `data-folio-timeline-note` |
| Post title | `data-folio-post-title` |
| Post date | `data-folio-post-date` |
| Post link | `data-folio-post-link` |
| Struggle | `data-folio-struggle`, `data-folio-struggle-type` |

## Bundle Size

Folio is optimized for minimal bundle impact. Size measurements are taken with tree-shaking enabled and all dependencies minified.

| Package | Target | Actual (gzipped) | Status |
|---------|--------|------------------|--------|
| @reallukemanning/folio | < 10 KB | **2.74 KB** | ✓ |

### Tree-Shaking

Folio exports are fully tree-shakeable. Importing only what you need significantly reduces bundle size:

```tsx
// Import only the component you need
import { ProjectCard } from '@reallukemanning/folio'  // ~320 B gzipped

// Or import everything
import * as Folio from '@reallukemanning/folio'  // ~2.74 KB gzipped
```

### Measuring Bundle Size

```bash
pnpm bundle-size
```

This command measures both packages and saves results to `.bundle-size.json` for tracking over time.

## GitHub API Setup

Folio fetches GitHub repo data at build time for projects with `type: 'github'` or `type: 'hybrid'`.

### Environment Variable

```bash
# .env.local
GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
```

### Rate Limits

- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

Without a token, Folio logs a warning and continues with unauthenticated requests.

### What Gets Fetched

- Name, description
- Stars, forks
- Primary language and topics
- GitHub URL and homepage

## Styling

Folio ships with zero styling. Use the data attributes to style components however you want.

### Pre-Built Themes

Get started quickly with pre-built themes:

```bash
# Install themes via CLI
npx folio add theme-minimal    # Light theme
npx folio add theme-dark        # Dark mode with system preference
npx folio add theme-gradient    # Gradient theme
```

Themes are copied to `styles/folio-<theme-name>.css`. Import in your app:

```tsx
// app/layout.tsx (Next.js)
import './styles/folio-theme-minimal.css'
```

### Custom Styling

Use the data attributes to style components however you want:

```css
[data-folio-card] {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
}

[data-folio-card-header] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

[data-folio-status-value="active"] {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

[data-folio-tag] {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-right: 0.5rem;
}
```

### CSS Custom Properties

All components use CSS custom properties with fallback values. Override them for fine-grained control:

```css
:root {
  --folio-card-bg: #ffffff;
  --folio-card-border: #e5e7eb;
  --folio-card-radius: 8px;
  --folio-card-padding: 16px;
  --folio-card-text: #374151;

  --folio-tag-bg: #f3f4f6;
  --folio-tag-text: #374151;
  --folio-tag-radius: 4px;

  --folio-stats-label: #6b7280;
  --folio-stats-value: #374151;

  --folio-link-text: #374151;

  --folio-status-active-bg: #dcfce7;
  --folio-status-active-text: #166534;
  --folio-status-shipped-bg: #dbeafe;
  --folio-status-shipped-text: #1e40af;
  --folio-status-in-progress-bg: #fef3c7;
  --folio-status-in-progress-text: #92400e;
  --folio-status-coming-soon-bg: #f3e8ff;
  --folio-status-coming-soon-text: #7c3aed;
  --folio-status-archived-bg: #f1f5f9;
  --folio-status-archived-text: #475569;
  --folio-status-for-sale-bg: #fee2e2;
  --folio-status-for-sale-text: #991b1b;
}
```

### Dark Mode

Use `theme-dark.css` for automatic dark mode based on system preference, or manually toggle with data attributes:

```html
<!-- Force dark mode -->
<html data-theme="dark">

<!-- Force light mode -->
<html data-theme="light">
```

## Roadmap

### v1.0 (Current)
- Core component library (ProjectCard, ProjectView, ProjectList, FeaturedProject)
- GitHub, npm, and Product Hunt API integration
- Build-time data fetching with caching
- Filtering and sorting utilities
- CLI tooling (`npx folio init`, `npx folio add`)
- Comprehensive documentation
- Full test coverage
- Bundle size optimization (< 3 KB gzipped)
- Performance benchmarks

### v1.1
- Additional layout components
- More filtering options
- Enhanced CLI features

### v2.0 (Future)
- Breaking changes if needed based on user feedback

## Contributing

Folio is in active development. We welcome contributions from experienced developers who understand the shadcn philosophy: own your code, use good defaults, avoid opinions.

Check the [AGENTS.md](./AGENTS.md) for development guidelines.

## License

MIT
