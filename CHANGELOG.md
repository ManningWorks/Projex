# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-03-08

### Fixed

- **GitHubCard fallback display name** - GitHubCard now shows `repo` identifier when custom `name` is not set
- **NpmCard fallback display name** - NpmCard now shows `package` name when custom `name` is not set
- **Auto-populated live link suppression** - GitHub and hybrid projects now respect `linkOrder` for link inclusion. When `linkOrder` is specified without `live`, auto-generated `live` link from GitHub's homepage is removed

---

## [1.0.0] - 2026-03-08

### Initial Public Release

Projex is a shadcn-style component library for building project showcase pages. Components are copied into consumer projects (not installed as npm packages) and ship with zero styling - only semantic HTML with data attributes for CSS targeting.

#### Components

- `ProjectCard` - Compound component for project cards with Header, Description, Tags, Stats, Status, and Links subcomponents
- `ProjectView` - Compound component for expanded project detail view with Section, Commits, and Links subcomponents
- `ProjectList` - Container component for rendering project lists
- `FeaturedProject` - Component for highlighting a single featured project
- `ProjectSearch` - Search input component with Fuse.js integration and 300ms debounce
- `ProjectFilterBar` - Container component for filter tag display
- `ProjectFilterTag` - Clickable filter chip with active state indication
- `ProjectSort` - Dropdown component for sort selection
- `CommitList` - Component for displaying a list of project commits with message truncation

#### Preset Components

- `GitHubCard` - Pre-built card component for GitHub projects with stars, forks, language, and commits
- `NpmCard` - Pre-built card component for npm packages with downloads, version, and npm link
- `ShowcaseCard` - Pre-built card component for manual projects with live link and tech stack

#### Hooks

- `useProjectSearch` - Fuse.js powered search hook with empty query handling
- `useProjectFilters` - Multi-select tag filtering hook with OR logic

#### Data Fetching

- `fetchGitHubRepo(repo)` - Fetch GitHub repository data at build time
- `fetchNpmPackage(packageName)` - Fetch npm package data at build time
- `fetchProductHuntPost(slug)` - Fetch Product Hunt post data at build time
- `fetchGitHubCommits(repo, limit)` - Fetch commits from GitHub API at build time
- `LANGUAGE_COLORS` - Map of programming languages to their hex colors

#### Utilities

- `defineProjects(projects)` - Type-preserving identity function for project configuration
- `normalise(project)` - Normalize project data with automatic API fetching
- `filterByType(projects, type)` - Filter projects by type
- `filterByStatus(projects, status)` - Filter projects by status
- `filterByFeatured(projects)` - Filter featured projects
- `sortByDate(projects, order)` - Sort projects by date
- `sortByName(projects, order)` - Sort projects by name
- `sortByStars(projects, order)` - Sort projects by GitHub stars
- `sortProjects(projects, sortValue)` - Unified sorting function dispatching to existing utilities
- `getFuseOptions()` - Fuse.js configuration with field weighting
- `normalizeStats(stats)` - Normalize stats to consistent format
- `generatePersonSchema(options)` - Generate Schema.org Person JSON-LD structured data
- `generateProjectSchema(project)` - Generate Schema.org SoftwareApplication JSON-LD structured data
- `generatePortfolioMetadata(options)` - Generate Next.js App Router metadata for portfolio homepage
- `generateProjectMetadata(project)` - Generate Next.js App Router metadata for individual project pages

#### Types

- `ProjexProject` - Complete project type with all resolved fields
- `ProjexProjectInput` - Union type for all project input variants
- `GitHubProjectInput`, `ManualProjectInput`, `NpmProjectInput`, `ProductHuntProjectInput`, `HybridProjectInput` - Specific project input types
- `ProjectType` - Discriminated union: `'github' | 'manual' | 'npm' | 'product-hunt' | 'hybrid'`
- `ProjectStatus` - Discriminated union: `'active' | 'shipped' | 'in-progress' | 'coming-soon' | 'archived' | 'for-sale'`
- `GitHubRepoData`, `NpmPackageData`, `ProductHuntPostData` - API response types
- `ProjectLinks`, `ProjectStats`, `ProjectStruggle`, `ProjectTimelineEntry`, `ProjectPost` - Supporting types

#### CLI

- `projex init` - Interactive project scaffolding
- `projex add <component>` - Copy component to your project
- `projex add github-card|npm-card|showcase-card` - Install preset components
- `projex add theme-<name>` - Install pre-built themes (minimal, dark, gradient)

#### Theming System

- CSS Custom Properties with fallback values for flexible theming
- Three pre-built themes: theme-minimal.css, theme-dark.css, theme-gradient.css
- Dark mode support with automatic system preference detection

#### SEO Module

- Schema.org structured data generation (Person, SoftwareApplication)
- Next.js App Router metadata generation with OpenGraph tags
- Build-time data attributes for OG image generation and analytics

### Public API Surface

The following exports are considered part of the stable public API and will not change without a major version bump:

**Components:**

- `ProjectCard` (and subcomponents: `ProjectCard.Header`, `ProjectCard.Description`, `ProjectCard.Tags`, `ProjectCard.Stats`, `ProjectCard.Status`, `ProjectCard.Links`)
- `ProjectView` (and subcomponents: `ProjectView.Section`, `ProjectView.Links`, `ProjectView.Stats`, `ProjectView.Commits`)
- `ProjectList`
- `FeaturedProject`
- `ProjectSearch`
- `ProjectFilterBar`
- `ProjectFilterTag`
- `ProjectSort`
- `CommitList`
- `GitHubCard` (preset)
- `NpmCard` (preset)
- `ShowcaseCard` (preset)

**Hooks:**

- `useProjectSearch`
- `useProjectFilters`

**Utilities:**

- `defineProjects`
- `fetchGitHubRepo`
- `fetchNpmPackage`
- `fetchProductHuntPost`
- `fetchGitHubCommits`
- `normalise`
- `normalizeStats`
- `filterByType`
- `filterByStatus`
- `filterByFeatured`
- `sortByDate`
- `sortByName`
- `sortByStars`
- `sortProjects`
- `getFuseOptions`
- `generatePersonSchema`
- `generateProjectSchema`
- `generatePortfolioMetadata`
- `generateProjectMetadata`
- `LANGUAGE_COLORS`

**Types:**

- `ProjexProject`
- `ProjexProjectInput`
- `ProjexProjectInputCompat`
- `GitHubProjectInput`
- `ManualProjectInput`
- `NpmProjectInput`
- `ProductHuntProjectInput`
- `HybridProjectInput`
- `ProjectType`
- `ProjectStatus`
- `GitHubRepoData`
- `NpmPackageData`
- `ProductHuntPostData`
- `ProjectLinks`
- `ProjectStats`
- `GitHubStats`
- `NpmStats`
- `ProductHuntStats`
- `ProjectStruggle`
- `ProjectTimelineEntry`
- `ProjectPost`
- `NormalizedStat`
- `SortOrder`
- `PersonSchema`
- `SoftwareApplicationSchema`
- `GeneratePersonSchemaOptions`
- `GeneratePortfolioMetadataOptions`

**Data Attributes (for CSS styling):**

All `data-projex-*` attributes on rendered elements are part of the stable API for CSS targeting.

**Theme Exports:**

- `@manningworks/projex/themes/theme-minimal.css`
- `@manningworks/projex/themes/theme-dark.css`
- `@manningworks/projex/themes/theme-gradient.css`

---

## Version Policy

### Major Versions (X.0.0)

Breaking changes to the public API:

- Removing or renaming exports
- Changing function signatures
- Modifying type definitions in incompatible ways
- Changing data attribute names

### Minor Versions (1.X.0)

New features that are backward compatible:

- New components, utilities, or types
- New optional function parameters
- New data attributes

### Patch Versions (1.0.X)

Bug fixes that are backward compatible:

- Bug fixes
- Performance improvements
- Documentation updates
- Internal refactoring

### Internal APIs

The following are considered implementation details and may change in any version:

- File structure and organization
- Internal helper functions not exported from `index.ts`
- Test utilities and fixtures
- Build configuration
