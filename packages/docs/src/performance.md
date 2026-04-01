# Performance

Projex is designed to add minimal overhead to your project. This page documents component render performance and API fetch efficiency.

## Benchmarks

Projex includes comprehensive benchmarks for measuring component render times, API fetch performance, and utility function efficiency.

### Running Benchmarks

```bash
# Run all benchmarks
pnpm --filter @manningworks/projex benchmark

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
  run: pnpm --filter @manningworks/projex benchmark
```

Benchmarks run on every PR to ensure no performance regressions are introduced.

## Tree-Shaking

All exports are fully tree-shakeable. Importing only what you need significantly reduces bundle impact.

### Component Imports

```tsx
// Import only ProjectCard (~320 B gzipped)
import { ProjectCard } from '@manningworks/projex'

// Import multiple components (only used ones are included)
import { ProjectCard, ProjectView } from '@manningworks/projex'
```

### Utility Imports

```tsx
// Import only what you need
import { defineProjects, sortByStars } from '@manningworks/projex'

// Type imports have zero runtime cost
import type { ProjexProject, ProjectType } from '@manningworks/projex'
```

### NPM Timestamps Option

The `fetchNpmTimestamps` option extracts timestamps from the npm registry with **zero extra API calls**:

```tsx
defineProjects(projects, {
  fetchNpmTimestamps: true,  // No additional network requests
})
```

The npm registry response already includes `time.created` and `time.modified` fields. Enabling this option simply extracts the data from the existing response.

### What Gets Tree-Shaken

- **Unused components** are completely eliminated
- **Unused utilities** are removed (e.g., `defineProjects` is an identity function that compiles away)
- **Types** have zero runtime impact

## Zero Styling Overhead

Projex ships with **zero CSS**. All styling hooks are provided through data attributes:

```css
/* You control every byte of CSS */
[data-projex-card] {
  /* Your styles here */
}
```

This means:
- No CSS-in-JS runtime
- No styled-components dependency
- No CSS file downloads
- Complete styling flexibility

## External Dependencies

### @manningworks/projex

Projex has **zero runtime dependencies** beyond React (which you already have):

```
react        - peer dependency (you provide)
react-dom    - peer dependency (you provide)
```

The CLI is included in the same package and has minimal dependencies for its functionality:

```
commander    - CLI framework (~20 KB)
inquirer     - Interactive prompts (~30 KB)
chalk        - Terminal colors (~10 KB)
```

These CLI dependencies are only used when running `npx @manningworks/projex` commands - they don't impact your production bundle.

## Optimization Tips

### 1. Use Type-Only Imports

```tsx
// Good: Zero runtime cost
import type { ProjexProject } from '@manningworks/projex'

// Works the same but doesn't hint tree-shaking
import { ProjexProject } from '@manningworks/projex'
```

### 2. Import Components Individually

```tsx
// Good: Tree-shakes unused components
import { ProjectCard } from '@manningworks/projex'
import { ProjectView } from '@manningworks/projex'

// Avoid: Prevents tree-shaking analysis
import * as Projex from '@manningworks/projex'
```

### 3. Use Data Attributes for Styling

```css
/* Good: Pure CSS, zero JS */
[data-projex-card] { ... }

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
      "name": "@manningworks/projex",
      "target": "< 10 KB gzipped",
      "gzipped": 2805,
      "passes": true
    }
  ]
}
```

Significant size increases should be investigated and documented.
