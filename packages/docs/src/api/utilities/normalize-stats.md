# normalizeStats

Format project stats into a normalized array for display. Converts raw numeric stats into human-readable format with proper labels.

## Signature

```tsx
function normalizeStats(
  stats: Record<string, unknown>,
  type: ProjectType
): NormalizedStat[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| stats | `Record<string, unknown>` | Raw stats object |
| type | `ProjectType` | Project type for context |

## Returns

`NormalizedStat[]` - Array of normalized stat objects

## Types

```tsx
interface NormalizedStat {
  label: string
  value: string | number
  unit?: string
}
```

## Behavior

Transforms raw stats into display-friendly format. Each stat is conditionally included only if it has a value.

> **Note:** Although the `type` parameter is accepted, the function does **not** filter stats by project type — it processes all stat keys present in the `stats` object regardless of the `type` value. The "Available for" labels in each section below describe which project types *populate* those stats upstream during normalisation, not what `normalizeStats` filters on.

### Number Formatting

Numbers are formatted with suffixes:
- `≥ 1,000,000` → `X.XM` (e.g., `1234567` → `1.2M`)
- `≥ 1,000` → `X.XK` (e.g., `1234` → `1.2K`)
- `< 1,000` → raw number (e.g., `56` → `56`)

### Date Formatting

Dates are formatted as `Mon DD, YYYY` (e.g., `Jan 15, 2024`).

## All Output Labels

### GitHub Stats

| Stat Key | Label | Format | Example Output |
|----------|-------|--------|----------------|
| `stars` | Stars | Number (K/M suffix) | `{ label: 'Stars', value: '1.2K' }` |
| `forks` | Forks | Number (K/M suffix) | `{ label: 'Forks', value: '56' }` |

**Available for:** `github`, `hybrid`

### NPM Stats

| Stat Key | Label | Format | Example Output |
|----------|-------|--------|----------------|
| `downloads` | Downloads | Number (K/M suffix) + "month" unit | `{ label: 'Downloads', value: '1.2M', unit: 'month' }` |
| `version` | Version | Prefixed with "v" | `{ label: 'Version', value: 'v1.2.3' }` |

**Available for:** `npm`, `hybrid`

### Product Hunt Stats

| Stat Key | Label | Format | Example Output |
|----------|-------|--------|----------------|
| `upvotes` | Upvotes | Number (K/M suffix) | `{ label: 'Upvotes', value: '456' }` |
| `comments` | Comments | Number (K/M suffix) | `{ label: 'Comments', value: '89' }` |
| `launchDate` | Launched | Formatted date | `{ label: 'Launched', value: 'Jan 15, 2024' }` |

**Available for:** `product-hunt`

### YouTube Stats

| Stat Key | Label | Format | Example Output |
|----------|-------|--------|----------------|
| `subscribers` | Subscribers | Number (K/M suffix) | `{ label: 'Subscribers', value: '125.4K' }` |
| `views` | Views | Number (K/M suffix) | `{ label: 'Views', value: '2.5M' }` |

> **Note:** `latestVideoTitle`, `latestVideoUrl`, and `latestVideoPublishedAt` are NOT included in normalized stats — they are displayed separately by components as links.

**Available for:** `youtube`

### Gumroad Stats

| Stat Key | Label | Format | Example Output |
|----------|-------|--------|----------------|
| `formattedRevenue` | Revenue | String (pass-through) | `{ label: 'Revenue', value: '$1,234.56' }` |
| `salesCount` | Sales | Number (K/M suffix) | `{ label: 'Sales', value: '456' }` |
| `subscriberCount` | Subscribers | Number (K/M suffix) | `{ label: 'Subscribers', value: '89' }` |

**Available for:** `gumroad`

### Lemon Squeezy Stats

| Stat Key | Label | Format | Example Output |
|----------|-------|--------|----------------|
| `formattedMRR` | MRR | String (pass-through) | `{ label: 'MRR', value: '$1,234.56' }` |
| `orderCount` | Orders | Number (K/M suffix) | `{ label: 'Orders', value: '234' }` |
| `customerCount` | Customers | Number (K/M suffix) | `{ label: 'Customers', value: '156' }` |

**Available for:** `lemonsqueezy`

### Dev.to Stats

| Stat Key | Label | Format | Example Output |
|----------|-------|--------|----------------|
| `articleCount` | Articles | Number (K/M suffix) | `{ label: 'Articles', value: '45' }` |
| `totalViews` | Views | Number (K/M suffix) | `{ label: 'Views', value: '125.4K' }` |
| `averageReactions` | Reactions | Number (K/M suffix) | `{ label: 'Reactions', value: '67' }` |

**Available for:** `devto`

## Example

```tsx
import { normalizeStats } from '@manningworks/projex'

// GitHub project
const githubStats = normalizeStats(
  { stars: 1234, forks: 56 },
  'github'
)
// [
//   { label: 'Stars', value: '1.2K' },
//   { label: 'Forks', value: '56' },
// ]

// YouTube channel
const youtubeStats = normalizeStats(
  { subscribers: 125400, views: 2500000 },
  'youtube'
)
// [
//   { label: 'Subscribers', value: '125.4K' },
//   { label: 'Views', value: '2.5M' },
// ]

// Gumroad product
const gumroadStats = normalizeStats(
  { formattedRevenue: '$5,678.90', salesCount: 234, subscriberCount: 89 },
  'gumroad'
)
// [
//   { label: 'Revenue', value: '$5,678.90' },
//   { label: 'Sales', value: '234' },
//   { label: 'Subscribers', value: '89' },
// ]
```

## Usage with Components

```tsx
import { normalizeStats } from '@manningworks/projex'

function StatList({ project }) {
  const stats = normalizeStats(project.stats || {}, project.type)
  
  return (
    <ul>
      {stats.map((stat) => (
        <li key={stat.label}>
          <strong>{stat.label}:</strong> {stat.value}
          {stat.unit && <span>/{stat.unit}</span>}
        </li>
      ))}
    </ul>
  )
}
```

## Skipped Fields

The following stats properties are intentionally NOT included in normalized output because they are displayed differently by components:

| Property | Reason |
|----------|--------|
| `latestVideoTitle` | Displayed as a link, not a stat |
| `latestVideoUrl` | Used as the URL for the link |
| `latestVideoPublishedAt` | Used for date sorting, not display |
