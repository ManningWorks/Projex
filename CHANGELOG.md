# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.1] - 2026-02-28

### Fixed

- **Auto-populated live link suppression** - GitHub and hybrid projects now respect `linkOrder` for link inclusion. When `linkOrder` is specified without `live`, the auto-generated `live` link from GitHub's homepage is removed. Previously, auto-generated `live` links would appear even when using custom `linkOrder` to control display. Fixes [#1](https://github.com/reallukemanning/folio/issues/1)

---

## [1.7.0] - 2026-02-24

### Added

#### SEO Module
- **generatePersonSchema()** - Generate Schema.org Person JSON-LD structured data for portfolio homepages
- **generateProjectSchema()** - Generate Schema.org SoftwareApplication JSON-LD structured data for project pages
- **generatePortfolioMetadata()** - Generate Next.js App Router metadata for portfolio homepage with OpenGraph tags
- **generateProjectMetadata()** - Generate Next.js App Router metadata for individual project pages
- **Build-time data attributes** - ProjectCard now includes `data-folio-og-image`, `data-folio-og-title`, `data-folio-og-description` for OG image generation and analytics
- **Structured data validation** - All SEO functions validate inputs and return null with warnings for invalid data
- **URL priority handling** - Metadata functions use different URL priorities for OpenGraph (live > github) vs schema (github > live)

#### Schema Features
- **Person schema** - Supports name, url, jobTitle, image, and sameAs social links
- **SoftwareApplication schema** - Supports name, description, url, applicationCategory, aggregateRating (stars), and interactionStatistic (downloads)
- **GitHub/NPM type detection** - Automatically sets `applicationCategory: "DeveloperApplication"` for github/npm project types

#### Metadata Features
- **OpenGraph support** - Auto-generates og:title, og:description, og:url, og:type, og:image
- **Keywords** - Project metadata includes project stack as comma-separated keywords
- **SameAs support** - Portfolio metadata includes social profile links
- **Schema embedding** - Embeds JSON-LD schemas in Next.js `metadata.other` field

#### Documentation
- **SEO Integration Guide** - Complete documentation at `/guides/seo.md` with Next.js App Router and Pages Router examples
- **Schema examples** - Code examples for both app router (`export const metadata`) and pages router (`<Head>` component)
- **Testing tools** - Links to Google Rich Results Test, Facebook Sharing Debugger, Twitter Card Validator, and Schema Markup Validator

### Public API Surface

**New Functions:**
- `generatePersonSchema(options: GeneratePersonSchemaOptions): PersonSchema | null`
- `generateProjectSchema(project: FolioProject): SoftwareApplicationSchema | null`
- `generatePortfolioMetadata(options: GeneratePortfolioMetadataOptions): Metadata | null`
- `generateProjectMetadata(project: FolioProject): Metadata | null`

**New Types:**
- `PersonSchema` - Schema.org Person object
- `SoftwareApplicationSchema` - Schema.org SoftwareApplication object
- `GeneratePersonSchemaOptions` - Options for person schema generation
- `GeneratePortfolioMetadataOptions` - Options for portfolio metadata generation

**New Data Attributes:**
- `data-folio-og-image` - Project image URL for OG image generation
- `data-folio-og-title` - Project title for metadata extraction
- `data-folio-og-description` - Project description for metadata extraction

**Modified Component Behavior:**
- `ProjectCard` - Now accepts optional `project` prop and adds OG metadata attributes when provided

### Testing
- 135 new tests for SEO functions covering schema generation, validation, and metadata creation
- All tests pass with comprehensive coverage for edge cases and error handling
- Schema validation tests ensure compliance with schema.org specifications

---

## [1.6.0] - 2026-02-24

### Added

#### Theming System
- **CSS Custom Properties** - All components now use CSS custom properties with fallback values for flexible theming
- **Theme Files** - Three pre-built themes available:
  - `theme-minimal.css` - Clean light theme with neutral colors
  - `theme-dark.css` - Dark mode with system preference and manual toggle support
  - `theme-gradient.css` - Purple gradient theme with modern aesthetic
- **CLI Theme Installation** - `npx folio add theme-<name>` to install themes to `styles/` directory
- **Dark Mode Support** - Automatic system preference detection and manual toggle via `[data-theme="dark"]` attribute
- **Theme Exports** - Theme files exportable from package via `@reallukemanning/folio/themes/theme-*.css`

#### CSS Custom Properties
All component styles now themeable via CSS variables:
- Card: `--folio-card-bg`, `--folio-card-border`, `--folio-card-radius`, `--folio-card-padding`, `--folio-card-text`
- Tags: `--folio-tag-bg`, `--folio-tag-text`, `--folio-tag-radius`
- Stats: `--folio-stats-label`, `--folio-stats-value`
- Links: `--folio-link-text`
- Status (per status type): `--folio-status-<type>-bg`, `--folio-status-<type>-text`

#### CLI Features
- Theme installation with confirmation prompt for existing files
- `--force` flag support for theme overwriting
- Automatic `styles/` directory creation
- Clear success messages with import instructions

### Public API Surface

**New CSS Exports:**
- `@reallukemanning/folio/themes/theme-minimal.css`
- `@reallukemanning/folio/themes/theme-dark.css`
- `@reallukemanning/folio/themes/theme-gradient.css`

**New CSS Custom Properties:**
All components now support CSS custom properties with fallback values. See documentation for full list.

**New Data Attributes:**
`[data-theme="dark"]` - Force dark mode when using theme-dark.css

**Modified Component Behavior:**
- All components now use CSS custom properties with inline fallbacks
- Components render correctly without themes (fallback values)
- Theme installation optional - zero-opinion styling maintained

### Documentation
- Updated README.md with theming system documentation
- Added theme installation examples and CSS custom properties reference
- Updated CLI documentation to include theme commands
- Added dark mode setup instructions

### Testing
- All existing tests pass with new CSS custom properties
- No breaking changes to component props or behavior

---

## [1.5.0] - 2026-02-24

### Added

#### Preset Components
- `GitHubCard` - Pre-built card component for GitHub projects with stars, forks, language, and commits
- `NpmCard` - Pre-built card component for npm packages with downloads, version, and npm link
- `ShowcaseCard` - Pre-built card component for manual projects with live link and tech stack

#### CLI
- `npx folio add github-card` - Install GitHubCard preset to your project
- `npx folio add npm-card` - Install NpmCard preset to your project
- `npx folio add showcase-card` - Install ShowcaseCard preset to your project
- `--force` flag to overwrite existing files without prompting
- Confirmation prompt when preset files already exist

#### Preset Features
- All presets support compound component pattern (Header, Description, Tags, Stats, Status, Links, Footer)
- GitHubCard supports `showForks` prop to optionally hide forks
- GitHubCard supports `statsComponent` prop for custom stats
- NpmCard supports `showVersion` prop to optionally hide version
- All presets support `children` prop for custom footer content
- Missing optional stats are handled gracefully (no errors, no empty sections)

### Public API Surface

**New Components:**
- `GitHubCard` (and subcomponents: `GitHubCard.Header`, `GitHubCard.Description`, `GitHubCard.Tags`, `GitHubCard.Stats`, `GitHubCard.Status`, `GitHubCard.Links`, `GitHubCard.Footer`)
- `NpmCard` (and subcomponents: `NpmCard.Header`, `NpmCard.Description`, `NpmCard.Tags`, `NpmCard.Stats`, `NpmCard.Status`, `NpmCard.Links`, `NpmCard.Footer`)
- `ShowcaseCard` (and subcomponents: `ShowcaseCard.Header`, `ShowcaseCard.Description`, `ShowcaseCard.Tags`, `ShowcaseCard.Stats`, `ShowcaseCard.Status`, `ShowcaseCard.Links`, `ShowcaseCard.Footer`)

**New Types:**
- `GitHubCardProps`
- `NpmCardProps`
- `ShowcaseCardProps`

**New Data Attributes (for CSS styling):**
- `data-folio-language` - Language label
- `data-folio-language-color` - Language color indicator
- `data-folio-card-tagline` - Tagline text
- `data-folio-card-footer` - Custom footer content container

### Testing
- Added unit tests for CLI add command with presets
- Tests for confirmation prompting and --force flag behavior
- Tests for error handling with invalid preset names

---

## [1.4.0] - 2026-02-24

### Added

#### Components
- `ProjectSearch` - Search input component with Fuse.js integration and 300ms debounce
- `ProjectFilterBar` - Container component for filter tag display
- `ProjectFilterTag` - Clickable filter chip with active state indication
- `ProjectSort` - Dropdown component for sort selection

#### Hooks
- `useProjectSearch` - Fuse.js powered search hook with empty query handling
- `useProjectFilters` - Multi-select tag filtering hook with OR logic

#### Utilities
- `sortProjects(projects, sortValue)` - Unified sorting function dispatching to existing utilities
- `getFuseOptions()` - Fuse.js configuration with field weighting

#### Dependencies
- `fuse.js@^7.1.0` - Added for fuzzy search capability

#### Configuration
- `SortValue` type - `'stars' | 'name' | 'date' | 'date-asc'`

### Public API Surface

**New Components:**
- `ProjectSearch`
- `ProjectFilterBar`
- `ProjectFilterTag`
- `ProjectSort`

**New Hooks:**
- `useProjectSearch`
- `useProjectFilters`

**New Utilities:**
- `sortProjects`
- `getFuseOptions`

**New Types:**
- `SortValue`

**New Data Attributes (for CSS styling):**
- `data-folio-search` - Search input container
- `data-folio-filter-bar` - Filter bar container
- `data-folio-filter-tag` - Individual filter chip
- `data-folio-filter-tag-active` - Active filter chip indicator
- `data-folio-sort` - Sort dropdown container
- `data-folio-sort-value` - Selected sort value indicator

### Documentation
- Added documentation for search component with debouncing examples
- Added documentation for filter components with multi-select examples
- Added documentation for sort component with dispatching pattern
- Added integration examples for combining search + filters

### Testing
- Added unit tests for Fuse.js integration
- Added unit tests for useProjectSearch hook
- Added unit tests for useProjectFilters hook
- Added unit tests for sortProjects utility
- Added integration tests for search + filter combination
- Added component tests for ProjectSearch, ProjectFilterBar, ProjectFilterTag, ProjectSort

---

## [1.3.0] - 2026-02-23

### Changed

#### Architecture
- Eliminated component duplication - removed `cli-components/` directory
- Single source of truth: `components/` directory now serves both package and CLI
- CLI automatically installs `@reallukemanning/folio` package as dependency
- Copied components import types from `@reallukemanning/folio` package (via import path transformation)

#### CLI
- `init` command now auto-installs `@reallukemanning/folio` if not present
- `add` command now auto-installs `@reallukemanning/folio` if not present
- Removed `types.ts` file copying - components now import from package
- Import path transformation: relative imports → npm package imports

#### Build
- Removed `cli-components/` from build output
- Updated `vitest.config.ts` to remove deprecated exclusions

#### Documentation
- Updated AGENTS.md to reflect single-component-source architecture
- Updated README.md to document auto-installation behavior
- Removed outdated "IMPORTANT" warning about dual directory maintenance

### Public API Surface

**No breaking changes to public API** - this is a minor version bump with internal refactoring only.

**Implementation Changes:**
- Internal import transformation in CLI for copied components
- Package manager detection (pnpm/yarn/npm) for auto-installation

---

## [1.2.0] - 2026-02-23

### Added

#### Links
- New standard link types: `docs` and `demo` for documentation and demo sites
- Custom link support via `custom` array field in `ProjectLinks`
- Link ordering control via `linkOrder` config option (per-project)

#### Configuration
- `linkOrder?: string[]` field on `FolioProject` and all project input types
- Default link order: github → live → docs → demo → npm → productHunt → appStore → playStore → custom

#### Types
- `ProjectLinks` - Added `docs`, `demo`, and `custom` fields
- Custom link type: `Array<{ label: string, url: string }>`

#### Documentation
- Demo app updated with custom links and ordering example
- New data attributes for CSS styling

### Changed
- `ProjectCard.Links` now renders `docs` and `demo` links when provided
- `ProjectView.Links` renders all standard link types including `docs` and `demo`
- Default link order applied across both `ProjectCard.Links` and `ProjectView.Links`

### Public API Surface

**Modified Types:**
- `ProjectLinks` - Added optional `docs`, `demo`, and `custom` fields
- `FolioProject` - Added optional `linkOrder?: string[]` field
- `BaseProjectInput` - Added optional `linkOrder?: string[]` field

**New Data Attributes (for CSS styling):**
- `data-folio-link-type="docs"` - Documentation link
- `data-folio-link-type="demo"` - Demo link
- `data-folio-link-type="custom"` - Custom link (type indicator)
- `data-folio-link-label` - Custom link label value

---

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
