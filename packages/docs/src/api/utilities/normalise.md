# normalise

Transform a `ProjexProjectInput` into a normalized `ProjexProject` by fetching external data.

## Signature

```tsx
function normalise(
  input: ProjexProjectInput,
  options?: DefineProjectsOptions,
): Promise<ProjexProject>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| input | `ProjexProjectInput` | Project input configuration |
| options | `DefineProjectsOptions` | Optional configuration controlling commits fetching and npm timestamp behavior |

### DefineProjectsOptions

```tsx
interface DefineProjectsOptions {
  commits?: number
  fetchNpmTimestamps?: boolean
}
```

- **`commits`**: Number of recent commits to fetch for `github` and `hybrid` projects. Defaults to `0` (no commits). Per-project `commits` values override this global default.
- **`fetchNpmTimestamps`**: When `true`, extracts `createdAt` and `updatedAt` timestamps from the npm registry for `npm` and `hybrid` projects. Defaults to `false`.

## Returns

`Promise<ProjexProject>` - Normalized project with fetched data

## Behavior

The function fetches external data based on the project type:

| Type | Fetches |
|------|---------|
| `github` | GitHub repository data |
| `npm` | npm package data |
| `product-hunt` | Product Hunt post data |
| `youtube` | YouTube channel data |
| `gumroad` | Gumroad product data |
| `lemonsqueezy` | Lemon Squeezy store data |
| `devto` | Dev.to user article data |
| `hybrid` | GitHub + npm data |
| `manual` | No external fetch |

### Data Merging

For fetched types, the function merges external API data with your input config using a consistent priority chain:

1. **`override` object** — highest priority (only available for `github` and `hybrid` types)
2. **Input config values** — `name`, `tagline`, `description`, `stack` from your project config
3. **Fetched API data** — auto-populated from external sources as fallbacks
4. **Default** — empty string or empty array

**Auto-populated fields by type:**

| Type | `name` | `tagline` | `description` | `stats` | `links` |
|------|:------:|:---------:|:-------------:|:-------:|:-------:|
| `github` | ✅ | — | ✅ | ✅ | ✅ |
| `hybrid` | ✅ | — | ✅ | ✅ | ✅ |
| `npm` | ✅ | — | — | ✅ | — |
| `product-hunt` | ✅ | ✅ | ✅ | ✅ | — |
| `youtube` | — | — | — | ✅ | — |
| `gumroad` | — | — | — | ✅ | — |
| `lemonsqueezy` | — | — | — | ✅ | — |
| `devto` | — | — | — | ✅ | — |
| `manual` | — | — | — | — | — |

### Null Safety

The function handles fetch failures gracefully:

- If GitHub/npm/Product Hunt fetch fails, uses input data only
- Returns `null` for missing optional fields

## Example

```tsx
import { normalise, defineProjects } from '@manningworks/projex'

// Single project
const project = await normalise({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active'
})

// Multiple projects
const { projects, options } = defineProjects([
  { id: 'proj-1', type: 'github', repo: 'user/repo', status: 'active' },
  { id: 'proj-2', type: 'npm', package: 'my-package', status: 'shipped' },
  { id: 'proj-3', type: 'manual', status: 'coming-soon', name: 'Secret Project' },
])
const normalised = await Promise.all(projects.map(p => normalise(p, options)))
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Optional | GitHub API token (5000/hr vs 60/hr rate limit) |
| `PRODUCT_HUNT_TOKEN` | Required for `product-hunt` | Product Hunt API token |
| `YOUTUBE_TOKEN` | Required for `youtube` | YouTube Data API v3 key |
| `GUMROAD_TOKEN` | Required for `gumroad` | Gumroad access token |
| `LS_TOKEN` | Required for `lemonsqueezy` | Lemon Squeezy API key |
| `DEV_TO_API_KEY` | Optional | Dev.to API key (enables `page_views_count` for `totalViews`) |

> **Note:** Dev.to (`devto`) works without environment variables (public API), but `DEV_TO_API_KEY` is recommended to enable `page_views_count` for accurate `totalViews`. The `manual` type does not require any environment variables.

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
