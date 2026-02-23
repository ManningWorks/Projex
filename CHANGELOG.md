# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-23

### Added

#### Components
- `CommitList` - Component for displaying a list of project commits with message truncation
- `ProjectView.Commits` - Compound component for displaying commits section in project view

#### Data Fetching
- `fetchGitHubCommits(repo, limit)` - Fetch commits from GitHub API at build time
- Commits automatically fetched for GitHub and hybrid project types

#### Configuration
- Global commits configuration via `defineProjects(projects, { commits: N })`
- Per-project override via `commits: N` on project config
- Commits clamped to valid range [0, 100] with warning on invalid values

#### Types
- `GitHubCommitData` - Internal type for GitHub API commit response
- `ProjectCommitAuthor` - Author type with optional name and email
- `ProjectCommit` - Public commit type with message, date, url, and author

#### Documentation
- CommitList component reference with data attributes
- defineProjects() options documentation with examples
- Demo app updated with commit configuration examples

### Public API Surface

**New Components:**
- `CommitList`

**New Utilities:**
- `fetchGitHubCommits(repo, limit)`

**New Types:**
- `GitHubCommitData`
- `ProjectCommitAuthor`
- `ProjectCommit`

**Modified:**
- `defineProjects()` - Now accepts optional `DefineProjectsOptions` parameter
- `FolioProject` - Added optional `commits: ProjectCommit[]` field
- `GitHubProjectInput` - Added optional `commits: number` field
- `HybridProjectInput` - Added optional `commits: number` field

**New Data Attributes (for CSS styling):**
- `data-folio-commits` - Commits section container
- `data-folio-commits-header` - Commits section header
- `data-folio-commit` - Individual commit item
- `data-folio-commit-message` - Commit message (truncated at 100 chars)
- `data-folio-commit-date` - Commit date
- `data-folio-commit-link` - Link to view commit
- `data-folio-commit-author` - Commit author name

---

## [1.0.1] - 2026-02-23

### Fixed

- Export `normalizeStats` utility (was documented but not exported)
- Export `NormalizedStat` type alongside `normalizeStats`
- Fix README package name references (`@folio/core` → `@reallukemanning/folio`)
- Add `ProjectView.Stats` subcomponent to CLI-copied components
- Add `productHunt` link support to CLI `ProjectView.Links`
- Add missing fields to CLI types (`createdAt`, `updatedAt`, `repo`, `package`, `slug`)
- Fix AGENTS.md monorepo structure to reflect actual layout
- Add missing data attributes to AGENTS.md documentation
- Fix CONTRIBUTING.md package structure (removed non-existent `packages/cli/`)

---

## [1.0.0] - 2026-02-22

### Added

#### Components
- `ProjectCard` - Compound component for project cards with Header, Description, Tags, Stats, Status, and Links subcomponents
- `ProjectView` - Compound component for expanded project detail view with Section and Links subcomponents
- `ProjectList` - Container component for rendering project lists
- `FeaturedProject` - Component for highlighting a single featured project

#### Data Fetching
- `fetchGitHubRepo(repo)` - Fetch GitHub repository data at build time
- `fetchNpmPackage(packageName)` - Fetch npm package data at build time
- `fetchProductHuntPost(slug)` - Fetch Product Hunt post data at build time
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

#### Types
- `FolioProject` - Complete project type with all resolved fields
- `FolioProjectInput` - Union type for all project input variants
- `GitHubProjectInput`, `ManualProjectInput`, `NpmProjectInput`, `ProductHuntProjectInput`, `HybridProjectInput` - Specific project input types
- `ProjectType` - Discriminated union: `'github' | 'manual' | 'npm' | 'product-hunt' | 'hybrid'`
- `ProjectStatus` - Discriminated union: `'active' | 'shipped' | 'in-progress' | 'coming-soon' | 'archived' | 'for-sale'`
- `GitHubRepoData`, `NpmPackageData`, `ProductHuntPostData` - API response types
- `ProjectLinks`, `ProjectStats`, `ProjectStruggle`, `ProjectTimelineEntry`, `ProjectPost` - Supporting types

#### CLI
- `@folio/cli` package with `folio init` and `folio add` commands
- Interactive project scaffolding
- Component copy functionality

### Public API Surface

The following exports are considered part of the stable public API and will not change without a major version bump:

**Components:**
- `ProjectCard` (and subcomponents: `ProjectCard.Header`, `ProjectCard.Description`, `ProjectCard.Tags`, `ProjectCard.Stats`, `ProjectCard.Status`, `ProjectCard.Links`)
- `ProjectView` (and subcomponents: `ProjectView.Section`, `ProjectView.Links`, `ProjectView.Stats`)
- `ProjectList`
- `FeaturedProject`

**Utilities:**
- `defineProjects`
- `fetchGitHubRepo`
- `fetchNpmPackage`
- `fetchProductHuntPost`
- `normalise`
- `normalizeStats`
- `filterByType`
- `filterByStatus`
- `filterByFeatured`
- `sortByDate`
- `sortByName`
- `sortByStars`
- `LANGUAGE_COLORS`

**Types:**
- `FolioProject`
- `FolioProjectInput`
- `FolioProjectInputCompat`
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

**Data Attributes (for CSS styling):**
All `data-folio-*` attributes on rendered elements are part of the stable API for CSS targeting.

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
