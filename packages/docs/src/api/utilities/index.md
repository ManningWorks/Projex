# Utilities

Folio provides utility functions for filtering, sorting, and normalizing project data. All utilities are pure functions that can be used in build-time data preparation.

## Available Utilities

### Filtering

| Function | Description |
|----------|-------------|
| [filterByStatus](./filter-by-status) | Filter projects by status |
| [filterByType](./filter-by-type) | Filter projects by type |
| [filterByFeatured](./filter-by-featured) | Filter featured/non-featured projects |

### Sorting

| Function | Description |
|----------|-------------|
| [sortByDate](./sort-by-date) | Sort projects by date |
| [sortByName](./sort-by-name) | Sort projects alphabetically |
| [sortByStars](./sort-by-stars) | Sort GitHub projects by stars |
| [sortProjects](./sort-projects) | Unified sorting by stars/name/date |

### React Hooks

| Function | Description |
|----------|-------------|
| [useProjectSearch](./use-project-search) | Fuzzy search projects by name, description, stack |
| [useProjectFilters](./use-project-filters) | Filter projects by tags |

### Data Normalization

| Function | Description |
|----------|-------------|
| [normalise](./normalise) | Transform project input to normalized project |
| [normalizeStats](./normalize-stats) | Format stats for display |

### Data Fetching

| Function | Description |
|----------|-------------|
| [fetchGitHubRepo](./fetch-github-repo) | Fetch GitHub repository data |
| [fetchNpmPackage](./fetch-npm-package) | Fetch npm package data |
| [fetchProductHuntPost](./fetch-product-hunt-post) | Fetch Product Hunt post data |

### Configuration

| Function | Description |
|----------|-------------|
| [defineProjects](./define-projects) | Type-safe project configuration helper |

## Import

```tsx
import { 
  filterByStatus, 
  filterByType, 
  filterByFeatured,
  sortByDate,
  sortByName,
  sortByStars,
  sortProjects,
  useProjectSearch,
  useProjectFilters,
  normalise,
  normalizeStats,
  defineProjects,
  fetchGitHubRepo,
  fetchNpmPackage,
  fetchProductHuntPost
} from '@reallukemanning/folio'
```

## Common Patterns

### Chaining Filters and Sorts

```tsx
import { filterByStatus, filterByFeatured, sortByDate } from '@reallukemanning/folio'

const activeProjects = filterByStatus(projects, 'active')
const featuredActive = filterByFeatured(activeProjects, true)
const sorted = sortByDate(featuredActive, 'desc')
```

### Build-Time Data Preparation

```tsx
import { defineProjects, normalise, sortByStars } from '@reallukemanning/folio'

export const projects = await Promise.all(
  defineProjects([
    { id: 'proj-1', type: 'github', repo: 'user/repo', status: 'active' },
    { id: 'proj-2', type: 'npm', package: 'my-package', status: 'shipped' },
  ]).map(normalise)
)

export const sortedProjects = sortByStars(projects, 'desc')
```
