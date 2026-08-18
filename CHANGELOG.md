# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **`name-desc` and `stars-asc` sort values** — `SortValue` now covers both directions for every field: `'name-desc'` sorts Z-A via `sortByName(projects, 'desc')`, and `'stars-asc'` sorts lowest-stars-first via `sortByStars(projects, 'asc')`. Every existing value keeps its meaning; `'stars'` remains descending, mirroring `'date'`. Fixes [#20].
- **Opt-out flags for auto-generated GitHub links** — `github` and `hybrid` projects accept `useGithubLinkFromRepo` and `useLiveLinkFromRepo` (both default `true`) to suppress the repo-URL `github` link and the repo-homepage `live` link. Explicit `links` in config still win. For the pre-existing `linkOrder`-based `live` suppression, the docs now explain how the two mechanisms interact. Fixes [#24].

### Fixed

- **`sortByDate` null-date handling** — Projects with no date (`updatedAt` and `createdAt` both null) previously sorted to the top in `desc` order, and flipped position with sort direction. Null dates are now treated as epoch-equivalent (oldest), so dateless projects sort last in newest-first and first in oldest-first, consistently in both directions. Matches the already-documented behavior. Fixes [#23].

---

## [1.5.0] - 2026-08-08

### Changed

- **CLI dependencies moved to optional `peerDependencies`** — `ts-morph`, `chalk`, `@inquirer/prompts`, and `commander` relocated from `dependencies` to `peerDependencies` (marked optional via `peerDependenciesMeta`). Completes the CLI/component split documented in 1.4.0: consumers importing only components no longer install CLI dependencies transitively; CLI consumers install the peers explicitly. Fixes [#11].
- **`ProjexProject.commits` type tightened** from `commits?: ProjectCommit[]` (optional, `undefined`) to `commits: ProjectCommit[] | null` (required, `null`) for consistency with the null-sentinel model used elsewhere. Truthiness checks (`if (project.commits)`) are unaffected; `=== undefined` checks should become `=== null` or truthiness. This is the resolved output type, so objects produced by `normalise`/`defineProjects` are unaffected.
- Added explicit return types to `SmartProjectGrid` and `ProjectGridProvider`.
- Marked `normalizeStats` with `@deprecated` JSDoc (the alias remains exported per 1.4.0).

### Fixed

- **`showSort` on `SmartProjectGrid` now applies sorting** — delivers the 1.4.0-documented behavior; sorting is applied only when `showSort` is enabled. Fixes [#10].
- **dev.to API**: added `state=published` to the request URL, and `totalViews` is now included only when non-zero. Fixes [#6].
- **Removed unsafe `as any` / `as Record<string, any>` casts** that bypassed the `ProjectStats` tagged union in `ProjectCard`, `ProjectView`, `ShowcaseCard`, and `seo/project`. Rendered output is byte-for-byte unchanged. Fixes [#8].

### Internal

- New internal `getStatEntries` typed accessor powers all stats rendering and `hasStatValues`. It is intentionally **not** part of the public export surface.
- `hasStatValues` parameter scoped to `ProjectStats` (the function is new this release; the looser signature never shipped).
- Enabled `@typescript-eslint/no-explicit-any` on non-test source as a regression guard.

---

## [1.4.0] - 2026-04-18

### Breaking Changes

- **`fetchGitHubRepo()` returns `{ data, error }` instead of `GitHubRepoData | null`** — Consumers must now destructure the result. The `data` field contains `GitHubRepoData` on success or `null` on failure. The `error` field provides structured error details (`type: 'not_found' | 'rate_limited' | 'network' | 'auth' | 'other'`).
- **`fetchNpmPackage()` returns `{ data, error }` instead of `NpmPackageData | null`** — Same structured error pattern as `fetchGitHubRepo`. Consumers must destructure the result.
- **`ProjectStats` is now a tagged union requiring a `type` discriminator** — Accessing stats fields requires narrowing by `type` (e.g., `if (stats.type === 'github')` yields `GitHubStats`). TypeScript catches this at compile time. The main API surface (`defineProjects`, `normalise`, components) handles this internally.

### Added

- **`fetchProjectData()`** — New function that calls all required APIs in parallel via `Promise.all`. Returns raw fetch results for a given project input. Extracted from `normalise` for direct use by power consumers.
- **Structured error returns on `fetchGitHubRepo` and `fetchNpmPackage`** — Both fetchers return `{ data, error }` with typed error objects. Error types include `not_found`, `rate_limited`, `network`, `auth`, and `other`.
- **`onError` option** — Configurable error handling on `normalise` via `DefineProjectsOptions`. Supports `'throw'` (throw on any fetch failure), `'warn'` (current default behavior), and `'silent'` (continue with no warnings).
- **Smart `<ProjectGrid>` component** — Turnkey client component composing search, filters, and project cards. Accepts `ProjexProject[]` with optional `showSearch`, `showFilters`, and `showSort` props. Includes `'use client'` directive for Next.js App Router.
- **`ProjectGridProvider`** — React context provider that supplies `project` to all `ProjectCard` sub-components. Sub-components read from context when no explicit `project` prop is given.
- **`useProjectContext`** — Hook to access the current project from `ProjectGridProvider` context.

### Fixed

- **Missing `'use client'` on React hooks** — Added `'use client'` directive to `useProjectFilters` and `useProjectSearch`.
- **Incomplete `escapeString` in CLI commands** — The inline `escapeString` helpers in `init` and `init-interactive` did not escape backslashes, so a `\` immediately before a `'` could defeat the quote escaping. The logic is now a single shared, exported utility that escapes backslashes first, then single quotes and newlines. Used by `init`, `init-interactive`, and `config-editor`.

### Changed

- **Parallel fetches in `normalise`** — All API calls within a single project now run concurrently via `Promise.all` instead of sequentially.
- **`ProjectStats` changed from intersection type to tagged union** — Matches runtime behavior where `normalise` only produces a stats subset per project type.
- **CLI dependencies separated into `@manningworks/projex/cli` entry point** — `ts-morph`, `chalk`, `@inquirer/prompts`, and `commander` moved out of the main bundle. Consumers importing only components no longer pull in CLI dependencies.
- **`normalizeStats` renamed to `normaliseStats`** — Follows project British English naming convention. `normalizeStats` available as deprecated alias for one version.

---

## [1.3.1] - 2026-04-17

### Fixed

- **`projex add learning` prompted unnecessarily for entry type** — The `learning` subcommand now defaults to `type: "learning"` instead of prompting the user to choose between "challenge" and "learning". A new `projex add challenge` route is added for challenge entries, and `projex remove challenge` is available as a removal alias.

---

## [1.3.0] - 2026-04-16

### Added

- **CLI for managing projects** — Full command-line interface for managing `projex.config.ts` without editing the file directly. All commands support interactive prompts when flags are omitted and non-interactive mode for scripting.
  - `projex init` — Initialize a new config file
  - `projex list` — List all projects
  - `projex add project` — Add a project (supports `github`, `npm`, `hybrid`, `product-hunt`, `youtube`, `gumroad`, `lemonsqueezy`, `devto`, `manual` types)
  - `projex add learning|timeline|post` — Add learning entries, timeline milestones, and blog posts to projects
  - `projex edit project` — Edit project fields with type-specific field validation
  - `projex edit project --unset <field>` — Remove a field from a project config (protected fields: `id`, `type`, `struggles`, `timeline`, `posts`)
  - `projex remove project|learning|timeline|post` — Remove projects or entries with descriptive interactive labels
  - `projex add <component>` — Copy UI components into your project
- **`config-editor.ts` library** — Programmatic AST-based config file manipulation using ts-morph. Provides `addProject`, `removeProject`, `setProjectField`, `removeProjectField`, `getProjectIds`, `getProjectSummaries`, `getLearningEntries`, `getTimelineEntries`, `getPostEntries`, and more.
- **881 tests** — Comprehensive test coverage across 55 test files including integration tests that exercise real config file parsing.

---

## [1.2.0] - 2026-04-15

### Added

- **`DEV_TO_API_KEY` env var support for Dev.to API** — Sends `api-key` header to Forem API for authenticated requests, enabling access to `page_views_count` and higher rate limits. Warns when not set that page view counts won't be available.

### Changed

- **Dev.to API now prefers `public_reactions_count`** — Uses the current Forem API field (`public_reactions_count`) with fallback to deprecated `positive_reactions_count`.
- **`averageReactions` renamed to `totalReactions`** — Returns the raw sum of reactions instead of computing an average. Updated across types, source, components, tests, and docs. Not a breaking change since the Dev.to integration has not been previously published.
- **`page_views_count` made optional** — Falls back to `0` with `?? 0` since the field is only available with authenticated API requests.

### Fixed

- **Dev.to integration used wrong API field names** — Fixed `page_views_count` availability and `public_reactions_count` vs `positive_reactions_count` handling. Fixes [#4](https://github.com/ManningWorks/Projex/issues/4)
- **Return totalReactions instead of averageReactions** — Reactions stat now returns the total sum rather than a computed average. Fixes [#5](https://github.com/ManningWorks/Projex/issues/5)

---

## [1.1.5] - 2026-04-15

### Fixed

- **`npm` projects not auto-populating `name` from fetched package data** — The `normalise` function now falls back to the fetched npm registry package name when no `name` is provided in the project config, consistent with how GitHub projects already worked.
- **`product-hunt` projects not auto-populating `name`, `tagline`, or `description` from fetched data** — These fields are now populated from the Product Hunt API when not provided in the project config.
- **`override` object priority chain corrected for non-GitHub types** — The `override` object now correctly only applies to `github` and `hybrid` types. For other types, config values take precedence over fetched data, with no override layer.
- Added comprehensive tests validating the name/tagline/description priority chain for all fetched project types.

---

## [1.1.4] - 2026-04-02

### Fixed

- **Unscoped `npx projex` commands in docs and CLI** — All `npx projex` references replaced with `npx @manningworks/projex` across 19 files. Without this fix, users following the documentation would install an unrelated npm package.
- **Stale "Folio" references in source and docs** — Replaced remaining `folio` paths, URLs, and error messages with correct `projex` equivalents across 8 files (component paths, `projex.manningworks.dev` URLs, CLI error messages, benchmark fixtures).
- **CLI version mismatch** — `packages/core/src/cli.ts` hardcoded `.version('1.3.0')` instead of reading dynamically from `package.json`. Now reads version at runtime.
- **`--folio-*` CSS custom properties** — Renamed all `--folio-*` CSS variables to `--projex-*` (~170+ replacements across `ProjectCard.tsx`, theme files, and docs stylesheets for brand consistency).
- **`.folio-*` CSS class names** — Renamed `.folio-link` and related classes to `.projex-*` equivalents in `ProjectCard.tsx`.
- **`data-folio-*` selectors in docs** — Renamed all `data-folio-*` attribute selectors to `data-projex-*` in VitePress theme styles.
- **Inconsistent VitePress internal links** — Removed `.md` extensions from 7 internal links that caused navigation issues.
- **Redundant note in docs index** — Removed duplicated note in `packages/docs/src/index.md`.

### Changed

- **Migration guide** — Added "CSS Custom Properties" section with full variable mapping table and `sed`/PowerShell migration commands. Added "CSS Class Names" section and updated "Styles Not Applying" troubleshooting with all three rename patterns.

---

## [1.1.3] - 2026-03-11

### Fixed

- **Fuse.js search false positives** - Improved search precision by reducing threshold from 0.3 to 0.2 and adding `ignoreLocation: true`
- **Incorrect match behavior** - Fixes issue where short queries like 'aest' incorrectly matched projects containing the query anywhere in field content
- **Search threshold documentation** - Updated API docs to reflect new default threshold value

With the new threshold (0.2) and `ignoreLocation` enabled, search now provides more precise matching:
- 'a': matches all relevant projects ✓
- 'ae' to 'aesthetic': only matches projects with those character sequences ✓
- Eliminates false positive matches on substrings (e.g., 'aest' no longer matches 'Vitest')

Aligns with Fuse.js best practices and scoring theory documentation.

---

## [1.1.2] - 2026-03-10

### Breaking Changes

- **Renamed `ProjectStruggle.type` values** - Changed from log-level terminology (`warn` | `error`) to semantic content categories (`challenge` | `learning`) for better narrative representation in project showcases

### Changed

- Updated Zod schema validation to use new `challenge` | `learning` types
- Updated all test fixtures to use new type values

### Migration Guide

If you're using the `struggles` array in your project configurations, you need to update the `type` values:

```typescript
// Before
struggles: [
  { type: 'warn', text: '...' },
  { type: 'error', text: '...' }
]

// After
struggles: [
  { type: 'challenge', text: '...' },  // obstacles or struggles overcome
  { type: 'learning', text: '...' }     // insights and growth
]
```

---

## [1.1.1] - 2026-03-10

### Fixed

- **Incomplete timestamp mappings for sortByDate** - `sortByDate` now works for 7/9 project types (78%) instead of 5/9 (56%)
- **Product Hunt timestamp mapping** - Map `featured_at` to `updatedAt` (zero API cost)
- **YouTube timestamp mapping** - Map `latestVideoPublishedAt` to `updatedAt` (zero API cost)

The `sortByDate` utility was documented to support sorting by date, but only worked for GitHub and Hybrid projects. This fix adds timestamp mappings for Product Hunt and YouTube using data already being fetched, completing the zero-cost timestamp mappings from issue #2.

---

## [1.1.0] - 2026-03-10

### Added

- **Opt-in npm timestamps** - New `fetchNpmTimestamps` option in `defineProjects` for enabling npm timestamp extraction from npm registry `time` field
- **NpmPackageData type enhancements** - Added optional `createdAt` and `modifiedAt` fields to `NpmPackageData` type
- **Smart hybrid timestamp behavior** - Hybrid projects intelligently pick the most recent timestamp from GitHub `updated_at` and npm `time.modified` when `fetchNpmTimestamps` is enabled
- **Comprehensive timestamp documentation** - Updated 6 documentation files covering npm timestamp extraction, hybrid behavior, and sorting improvements

### Changed

- **Improved project sorting** - All 9 project types now support automatic timestamps when configured appropriately (npm requires opt-in, manual types require manual timestamps)
- **Zero API cost for npm timestamps** - Timestamp data is extracted from existing npm registry responses, requiring no additional API calls

---

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

<!-- Reference-style link definitions -->

[#6]: https://github.com/ManningWorks/Projex/issues/6
[#8]: https://github.com/ManningWorks/Projex/issues/8
[#10]: https://github.com/ManningWorks/Projex/issues/10
[#11]: https://github.com/ManningWorks/Projex/issues/11
[#23]: https://github.com/ManningWorks/Projex/issues/23
[#24]: https://github.com/ManningWorks/Projex/issues/24
[Unreleased]: https://github.com/ManningWorks/Projex/compare/v1.5.0...HEAD
[1.5.0]: https://github.com/ManningWorks/Projex/compare/v1.4.0...v1.5.0
