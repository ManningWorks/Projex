# Folio

Folio is a shadcn-style component library for developers and solopreneurs who want a flexible, data-driven project showcase on their personal site.

## Problem

Every developer eventually builds a projects page, and almost every developer builds it from scratch. They wire up GitHub APIs, handle rate limiting, design cards, handle edge cases for private repos and non-GitHub projects, and end up with bespoke solutions that help nobody else.

## Quick Start

```bash
pnpm add @folio/core
```

```ts
// folio.config.ts
import { defineProjects } from '@folio/core'

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
import { ProjectCard } from '@folio/core'

export function ProjectsGrid() {
  return (
    <ProjectCard.Header project={project} />
  )
}
```

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
| `type` | `'github' \| 'manual' \| 'npm' \| 'hybrid'` (required) | Project type |
| `status` | `'active' \| 'shipped' \| 'in-progress' \| 'coming-soon' \| 'archived' \| 'for-sale'` (required) | Current status |
| `featured` | `boolean` | Whether project is featured |
| `repo` | `string` | GitHub repo in "username/repo" format (required for github/hybrid) |
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
| `override` | `object` | Override GitHub API data |

### ProjectLinks

| Field | Type |
|-------|------|
| `github` | `string` |
| `live` | `string` |
| `npm` | `string` |
| `appStore` | `string` |
| `playStore` | `string` |

### ProjectStats

| Field | Type |
|-------|------|
| `stars` | `number` |
| `forks` | `number` |
| `downloads` | `string` |

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
| Individual link | `data-folio-link`, `data-folio-link-type="github|live|npm"` |

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

## Roadmap

### v0.1 (Current)
- Core component library
- GitHub API integration
- ProjectCard and ProjectView components
- Demo application

### v0.2
- CLI tooling (`npx folio init`, `npx folio add`)
- Normalisation utility for automatic data fetching

### v0.3
- npm registry integration for download stats
- Product Hunt integration

### v0.4
- Layout components (ProjectGrid, ProjectList, FeaturedProject)
- Advanced filtering and sorting utilities

### v1.0
- Stabilized API
- Comprehensive documentation
- Full test coverage

## Contributing

Folio is in active development. We welcome contributions from experienced developers who understand the shadcn philosophy: own your code, use good defaults, avoid opinions.

Check the [AGENTS.md](./AGENTS.md) for development guidelines.

## License

MIT
