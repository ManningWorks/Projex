# AGENTS.md

Guidelines for agentic coding agents operating in this repository.

## Project Overview

Folio is a shadcn-style component library for developers and solopreneurs building project showcase pages. Components are copied into consumer projects (not installed as npm packages). The library ships zero styling - only semantic HTML with data attributes for CSS targeting.

## Build/Lint/Test Commands

Since this project is in early development, commands will evolve. When package.json exists:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Run all tests
pnpm test

# Run a single test file
pnpm test -- path/to/test.test.ts

# Run a single test by name pattern
pnpm test -- -t "test name pattern"

# Run tests in watch mode
pnpm test -- --watch

# Run demo app in development
pnpm --filter @folio/demo dev
```

## Monorepo Structure

```
folio/
├── packages/
│   ├── core/              # Main component library (includes CLI)
│   │   ├── src/
│   │   │   ├── components/      # React components
│   │   │   ├── cli-components/  # Components copied by CLI
│   │   │   ├── commands/        # CLI command implementations
│   │   │   ├── lib/             # Utilities (github.ts, normalise.ts, defineProjects.ts)
│   │   │   ├── types/           # TypeScript interfaces
│   │   │   └── index.ts         # Public API exports
│   │   └── package.json
│   └── docs/              # VitePress documentation
├── apps/
│   └── demo/              # Next.js demo app
│       ├── app/
│       ├── folio.config.ts
│       └── package.json
├── pnpm-workspace.yaml
└── package.json
```

## Code Style Guidelines

### TypeScript

- **Strict mode** - always enable strict TypeScript
- **No comments** - code should be self-documenting; types and names carry intent
- **Explicit return types** on exported functions
- **Prefer interfaces over types** for object shapes
- **Use discriminated unions** for variants (e.g., `ProjectType`, `ProjectStatus`)

### Imports

- Group imports: React/framework first, then external libraries, then internal modules
- Use `@folio/core` for cross-package imports within the monorepo
- Prefer named exports over default exports for utilities

```typescript
// React
import { useState, useEffect } from 'react'

// External
import type { Metadata } from 'next'

// Internal
import { fetchGitHubRepo } from './github'
import type { FolioProject, ProjectType } from '../types'
```

### Naming Conventions

- **Components**: PascalCase - `ProjectCard`, `ProjectView`
- **Compound components**: Dot notation - `ProjectCard.Header`, `ProjectView.Section`
- **Files**: Match export name - `ProjectCard.tsx`, `github.ts`
- **Types/Interfaces**: PascalCase - `FolioProject`, `ProjectLinks`
- **Utilities**: camelCase - `fetchGitHubRepo`, `defineProjects`
- **Constants**: SCREAMING_SNAKE or PascalCase objects - `STATUS`, `TYPE_ICON`
- **Data attributes**: kebab-case with `data-folio-` prefix - `data-folio-card`, `data-folio-view-section`

### Formatting

- No semicolons (follow project convention when established)
- Single quotes for strings
- Trailing commas in multiline structures
- 2-space indentation

### Component Patterns

- **Compound components** for flexibility - consumers compose their own layout
- **Render nothing for empty data** - no empty wrappers, no placeholder text
- **Data attributes on every element** for styling hooks
- **No inline styles in library code** - demo app only for visual examples

```tsx
// Component pattern - compound with data attributes
<div data-folio-card>
  <div data-folio-card-header>{name}</div>
  <div data-folio-card-description>{description}</div>
</div>

// Section with conditional rendering
{project.background && (
  <ProjectView.Section name="background">
    {project.background}
  </ProjectView.Section>
)}
```

### Data Attributes

Every rendered element must have a `data-folio-*` attribute:

```
data-folio-card
data-folio-card-header
data-folio-card-description
data-folio-card-tags
data-folio-card-stats
data-folio-card-status
data-folio-card-links
data-folio-view
data-folio-view-section
data-folio-view-links
data-folio-view-stats
data-folio-featured
data-folio-featured-image
data-folio-grid
data-folio-list
data-folio-status
data-folio-status-value="active"
data-folio-type
data-folio-type-value="github"
data-folio-struggle
data-folio-struggle-type="warn"
data-folio-tag
data-folio-link
data-folio-link-type="github"
data-folio-stat="stars|forks|downloads|version|upvotes|comments"
data-folio-timeline-date
data-folio-timeline-note
data-folio-post-title
data-folio-post-date
data-folio-post-link
```

### Error Handling

- **Never throw** from component code - handle gracefully
- **Return null** on fetch failures - components must handle null stats
- **Log warnings** to console for recoverable issues (e.g., missing GITHUB_TOKEN)
- **Fail silently** for missing optional data

```typescript
// GitHub fetch - return null on error
export async function fetchGitHubRepo(repo: string): Promise<GitHubRepoData | null> {
  try {
    const response = await fetch(url, { cache: 'force-cache' })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}
```

### API Fetching

- **Build-time only** - use Next.js `fetch` with `{ cache: 'force-cache' }`
- **Never fetch client-side** - all data resolved at build time
- **GitHub token** - read from `process.env.GITHUB_TOKEN`
- **Rate limits**: 60/hr unauthenticated, 5000/hr authenticated - document this

### Environment Variables

- `GITHUB_TOKEN` - optional but recommended for GitHub API

### Testing

When tests exist:
- Use the project's chosen test framework (check package.json)
- Test behavior, not implementation details
- Mock external API calls
- Test null/error handling paths

## Key Architectural Decisions

1. **shadcn-style distribution** - consumers own the code after copying
2. **Zero styling opinions** - no fonts, colors, or layout assumptions
3. **Config-driven** - all projects defined in `folio.config.ts`
4. **Every project type is first-class** - GitHub, manual, npm, hybrid all equal
5. **Build-time data fetching** - no runtime API calls
6. **Compound components** - maximum flexibility for consumers

## Target Consumer

Experienced solo developers using Next.js and TypeScript. They want clean, well-typed APIs without hand-holding. Documentation should be direct and technical.

## Project Documentation

The `project_docs/` directory contains design documents, agent briefings, and reference materials used during development. These are internal documents, not part of the public API.

**Agent guideline:** Any documents created by agents (PRDs, design docs, briefings, etc.) should be stored in the `project_docs/` directory to maintain a centralized location for project planning materials.
