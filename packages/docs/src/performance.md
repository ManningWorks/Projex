# Performance

Folio is designed to add minimal overhead to your project. This page documents bundle sizes, tree-shaking behavior, and optimization strategies.

## Bundle Size

Size measurements are taken with tree-shaking enabled, all dependencies minified and brotlied.

| Package | Target | Actual (gzipped) | Status |
|---------|--------|------------------|--------|
| @folio/core | < 10 KB | **2.74 KB** | ✓ |
| @folio/cli | < 50 KB | **7.49 KB** | ✓ |

::: tip
Both packages are well under their size targets. We track these limits to prevent accidental bloat.
:::

## Benchmarks

Folio includes comprehensive benchmarks for measuring component render times, API fetch performance, and utility function efficiency.

### Running Benchmarks

```bash
# Run all benchmarks
pnpm --filter @folio/core benchmark

# Or from the core package
cd packages/core && pnpm benchmark
```

### Component Render Performance

Components are benchmarked with 100 renders to get accurate average times:

| Component | Mean Render Time | Status |
|-----------|------------------|--------|
| ProjectCard (full) | < 1ms | ✓ |
| ProjectView (full) | < 1ms | ✓ |

All component renders complete in sub-millisecond time. The compound component architecture ensures minimal overhead.

### API Fetch Performance

Fetch functions are measured with mocked responses to isolate parsing overhead:

| Function | Target | Actual (mean) | Status |
|----------|--------|---------------|--------|
| fetchGitHubRepo (cached) | < 1s | ~18ms | ✓ |
| fetchGitHubRepo (no cache) | < 2s | ~19ms | ✓ |
| fetchNpmPackage | < 2s | ~34ms | ✓ |
| fetchProductHuntPost | < 3s | ~20ms | ✓ |

::: tip
All API functions complete well under their targets. Real-world performance depends on network latency and API response times.
:::

### Utility Function Performance

Utility benchmarks process 1000 projects to measure filtering and sorting efficiency:

| Operation | Target | Actual | Status |
|-----------|--------|--------|--------|
| filterByType | < 50ms | < 1ms | ✓ |
| filterByStatus | < 50ms | < 1ms | ✓ |
| filterByFeatured | < 50ms | < 1ms | ✓ |
| sortByName | < 50ms | < 1ms | ✓ |
| sortByDate | < 50ms | < 1ms | ✓ |
| sortByStars | < 50ms | < 1ms | ✓ |
| Combined (filter + sort) | < 50ms | < 1ms | ✓ |

All utility operations on 1000 projects complete in under 1ms.

### CI Integration for Performance Regression

Add to your CI pipeline to catch performance regressions:

```yaml
# .github/workflows/benchmarks.yml
- name: Run benchmarks
  run: pnpm --filter @folio/core benchmark
```

Benchmarks run on every PR to ensure no performance regressions are introduced.

## Tree-Shaking

All exports are fully tree-shakeable. Importing only what you need significantly reduces bundle impact.

### Component Imports

```tsx
// Import only ProjectCard (~320 B gzipped)
import { ProjectCard } from '@folio/core'

// Import multiple components (only used ones are included)
import { ProjectCard, ProjectView } from '@folio/core'
```

### Utility Imports

```tsx
// Import only what you need
import { defineProjects, sortByStars } from '@folio/core'

// Type imports have zero runtime cost
import type { FolioProject, ProjectType } from '@folio/core'
```

### What Gets Tree-Shaken

- **Unused components** are completely eliminated
- **Unused utilities** are removed (e.g., `defineProjects` is an identity function that compiles away)
- **Types** have zero runtime impact

## Zero Styling Overhead

Folio ships with **zero CSS**. All styling hooks are provided through data attributes:

```css
/* You control every byte of CSS */
[data-folio-card] {
  /* Your styles here */
}
```

This means:
- No CSS-in-JS runtime
- No styled-components dependency
- No CSS file downloads
- Complete styling flexibility

## External Dependencies

### @folio/core

Folio core has **zero runtime dependencies** beyond React (which you already have):

```
react        - peer dependency (you provide)
react-dom    - peer dependency (you provide)
```

### @folio/cli

The CLI tool has minimal dependencies for its functionality:

```
commander    - CLI framework (~20 KB)
inquirer     - Interactive prompts (~30 KB)
chalk        - Terminal colors (~10 KB)
```

These are dev dependencies only - they don't impact your production bundle.

## Measuring Bundle Size

Run the bundle size measurement script:

```bash
pnpm bundle-size
```

This measures both packages and saves results to `.bundle-size.json` for tracking over time.

### CI Integration

Add to your CI pipeline to catch size regressions:

```yaml
# .github/workflows/bundle-size.yml
- name: Check bundle size
  run: pnpm bundle-size
```

## Optimization Tips

### 1. Use Type-Only Imports

```tsx
// Good: Zero runtime cost
import type { FolioProject } from '@folio/core'

// Works the same but doesn't hint tree-shaking
import { FolioProject } from '@folio/core'
```

### 2. Import Components Individually

```tsx
// Good: Tree-shakes unused components
import { ProjectCard } from '@folio/core'
import { ProjectView } from '@folio/core'

// Avoid: Prevents tree-shaking analysis
import * as Folio from '@folio/core'
```

### 3. Use Data Attributes for Styling

```css
/* Good: Pure CSS, zero JS */
[data-folio-card] { ... }

/* Avoid: Adds CSS-in-JS runtime */
import styled from 'styled-components'
```

## Baseline Measurements

Current baseline (as of measurement):

```json
{
  "timestamp": "2026-02-22T00:00:00.000Z",
  "packages": [
    {
      "name": "@folio/core",
      "target": "< 10 KB gzipped",
      "gzipped": 2805,
      "passes": true
    },
    {
      "name": "@folio/cli", 
      "target": "< 50 KB gzipped",
      "gzipped": 7666,
      "passes": true
    }
  ]
}
```

Significant size increases should be investigated and documented.
