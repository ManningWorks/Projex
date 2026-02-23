# AGENTS.md

Guidelines for agentic coding agents operating in this repository.

## Project Overview

Folio is a shadcn-style component library for developers building project showcase pages. Components are copied into consumer projects (not installed as npm packages). The library ships zero styling - only semantic HTML with data attributes for CSS targeting.

## Build/Lint/Test Commands

```bash
pnpm install                    # Install dependencies
pnpm build                      # Build all packages
pnpm typecheck                  # Run type checking
pnpm lint                       # Run linting
pnpm test                       # Run all tests

# Run a single test file (from repo root)
pnpm --filter @reallukemanning/folio test -- src/lib/__tests__/github.test.ts

# Run a single test by name pattern
pnpm --filter @reallukemanning/folio test -- -t "should return null for 404"

# Run tests in watch mode / with coverage
pnpm --filter @reallukemanning/folio test -- --watch
pnpm --filter @reallukemanning/folio test:coverage

# Run benchmarks
pnpm --filter @reallukemanning/folio benchmark

# Run demo app in development
pnpm --filter @folio/demo dev
```

## Monorepo Structure

```
folio/
├── packages/
│   ├── core/              # Main component library (includes CLI)
│   │   └── src/
│   │       ├── components/      # React components (single source for CLI copying)
│   │       ├── commands/        # CLI command implementations
│   │       ├── lib/             # Utilities (github.ts, normalise.ts, defineProjects.ts)
│   │       ├── types/           # TypeScript interfaces
│   │       └── index.ts         # Public API exports
│   └── docs/              # VitePress documentation
├── apps/
│   └── demo/              # Next.js demo app with folio.config.ts
├── pnpm-workspace.yaml
└── package.json
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** with: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noImplicitReturns`
- **No comments** - code should be self-documenting
- **Explicit return types** on exported functions
- **Prefer interfaces over types** for object shapes
- **Use discriminated unions** for variants (e.g., `ProjectType`, `ProjectStatus`)

### Imports

Group imports: React/framework first, then external libraries, then internal modules. Use `@reallukemanning/folio` for cross-package imports. Prefer named exports.

```typescript
import { useState, useEffect } from 'react'
import type { Metadata } from 'next'
import { fetchGitHubRepo } from './github'
import type { FolioProject, ProjectType } from '../types'
```

### Naming Conventions

- **Components**: PascalCase - `ProjectCard`, `ProjectView`
- **Compound components**: Dot notation - `ProjectCard.Header`
- **Files**: Match export name - `ProjectCard.tsx`, `github.ts`
- **Types/Interfaces**: PascalCase - `FolioProject`, `ProjectLinks`
- **Utilities**: camelCase - `fetchGitHubRepo`, `defineProjects`
- **Constants**: SCREAMING_SNAKE or PascalCase - `STATUS`, `TYPE_ICON`
- **Data attributes**: kebab-case with `data-folio-` prefix - `data-folio-card`

### Formatting

No semicolons, single quotes for strings, trailing commas in multiline structures, 2-space indentation.

### Component Patterns

- **Compound components** for flexibility - consumers compose their own layout
- **Render nothing for empty data** - no empty wrappers, no placeholder text
- **Data attributes on every element** for styling hooks
- **No inline styles in library code**

### Data Attributes

Every rendered element must have a `data-folio-*` attribute:

```
data-folio-card, data-folio-card-header, data-folio-card-description, data-folio-card-tags
data-folio-card-stats, data-folio-card-status, data-folio-card-links
data-folio-view, data-folio-view-section, data-folio-view-links, data-folio-view-stats
data-folio-featured, data-folio-featured-image, data-folio-grid, data-folio-list
data-folio-status, data-folio-status-value="active"
data-folio-type, data-folio-type-value="github"
data-folio-struggle, data-folio-struggle-type="warn"
data-folio-tag, data-folio-link, data-folio-link-type="github|live|docs|demo|npm|product-hunt|app-store|play-store|custom"
data-folio-link-label="custom-link-label"
data-folio-stat="stars|forks|downloads|version|upvotes|comments"
data-folio-timeline-date, data-folio-timeline-note
data-folio-post-title, data-folio-post-date, data-folio-post-link
data-folio-commits, data-folio-commits-header, data-folio-commit-list
data-folio-commit, data-folio-commit-message, data-folio-commit-date, data-folio-commit-link, data-folio-commit-author
```

### Error Handling & API Fetching

- **Never throw** from component code - handle gracefully
- **Return null** on fetch failures - components must handle null stats
- **Build-time only** - use `fetch` with `{ cache: 'force-cache' }`
- **Never fetch client-side**
- **GitHub token** - read from `process.env.GITHUB_TOKEN` (rate limits: 60/hr unauthenticated, 5000/hr authenticated)
- **Log warnings** to console for recoverable issues
- **Fail silently** for missing optional data

### Testing

Uses **Vitest** with `@testing-library/react` and `@testing-library/jest-dom`:

- Test behavior, not implementation details
- Mock external API calls with `vi.fn()` and `vi.stubGlobal()`
- Test null/error handling paths
- Use factory functions for test data
- Test coverage thresholds: 80% for lines, functions, branches, statements
- Cleanup after each test with `afterEach(() => cleanup())`

```typescript
const createProject = (overrides: Partial<FolioProject> = {}): FolioProject => ({
  id: 'test-project', type: 'github', status: 'active', ...overrides,
})
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)
mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) })
```

### Linting

- ESLint with `@typescript-eslint` plugin
- `no-console`: warn (allows `console.warn`)
- CLI commands (`src/commands/**`) exempt from console rules
- Run with `--max-warnings 0` to fail on any warnings

## Key Architectural Decisions

1. **shadcn-style distribution** - consumers own the code after copying
2. **Zero styling opinions** - no fonts, colors, or layout assumptions
3. **Config-driven** - all projects defined in `folio.config.ts`
4. **Every project type is first-class** - GitHub, manual, npm, hybrid all equal
5. **Build-time data fetching** - no runtime API calls
6. **Compound components** - maximum flexibility for consumers
7. **Single source of truth** - `components/` directory is only source, CLI transforms imports on copy

## Target Consumer & Documentation

Experienced solo developers using Next.js and TypeScript. They want clean, well-typed APIs without hand-holding.

The `project_docs/` directory contains design documents, agent briefings, and reference materials. Agents should store created documents (PRDs, design docs, briefings) in `project_docs/`.

### CHANGELOG Updates

When creating a new release, **always do the following in order**:

1. **Bump the version** in `packages/core/package.json` to match your intended release (e.g., 1.0.1 → 1.1.0)
2. **Update `CHANGELOG.md`** with the changes (follow Keep a Changelog format)
3. **Commit and tag** - create the git tag (e.g., `v1.1.0`)

**Important**: npm publish will silently skip publishing if the version in package.json hasn't changed. GitHub Actions detects version changes by comparing the package.json version, not the git tag. Tagging without bumping the version will result in "There are no new packages that should be published".
