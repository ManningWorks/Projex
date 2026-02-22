# normalise

Transform a `FolioProjectInput` into a normalized `FolioProject` by fetching external data.

## Signature

```tsx
function normalise(input: FolioProjectInput): Promise<FolioProject>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| input | `FolioProjectInput` | Project input configuration |

## Returns

`Promise<FolioProject>` - Normalized project with fetched data

## Behavior

The function fetches external data based on the project type:

| Type | Fetches |
|------|---------|
| `github` | GitHub repository data |
| `npm` | npm package data |
| `product-hunt` | Product Hunt post data |
| `hybrid` | GitHub + npm data |
| `manual` | No external fetch |

### Data Merging

For GitHub and hybrid types, the function merges fetched data with input data:

1. Fetched data provides defaults for `name`, `description`, `links`, `stats`
2. Input values override fetched data
3. `override` object provides explicit overrides

### Null Safety

The function handles fetch failures gracefully:

- If GitHub/npm/Product Hunt fetch fails, uses input data only
- Returns `null` for missing optional fields

## Example

```tsx
import { normalise, defineProjects } from '@folio/core'

// Single project
const project = await normalise({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active'
})

// Multiple projects
const projects = await Promise.all(
  defineProjects([
    { id: 'proj-1', type: 'github', repo: 'user/repo', status: 'active' },
    { id: 'proj-2', type: 'npm', package: 'my-package', status: 'shipped' },
    { id: 'proj-3', type: 'manual', status: 'coming-soon', name: 'Secret Project' },
  ]).map(normalise)
)
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Optional | GitHub API token (5000/hr vs 60/hr rate limit) |
| `PRODUCT_HUNT_TOKEN` | Required for `product-hunt` | Product Hunt API token |

## Override Example

```tsx
const project = await normalise({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active',
  override: {
    name: 'Custom Name',
    description: 'Custom description overrides GitHub description',
    stack: ['React', 'TypeScript', 'Tailwind']
  }
})
```
