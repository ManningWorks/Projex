# normalizeStats

Format project stats into a normalized array for display.

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

Transforms raw stats into display-friendly format:

| Stat | Label | Format |
|------|-------|--------|
| `stars` | Stars | Number (K, M suffix) |
| `forks` | Forks | Number (K, M suffix) |
| `downloads` | Downloads | Number (K, M suffix) + "month" unit |
| `version` | Version | Prefixed with "v" |
| `upvotes` | Upvotes | Number (K, M suffix) |
| `comments` | Comments | Number (K, M suffix) |
| `launchDate` | Launched | Formatted date |

## Example

```tsx
import { normalizeStats } from '@folio/core'

const stats = normalizeStats(
  { 
    stars: 1234, 
    forks: 56, 
    downloads: 1234567,
    version: '1.2.3' 
  },
  'github'
)

// Result:
// [
//   { label: 'Stars', value: '1.2K' },
//   { label: 'Forks', value: '56' },
//   { label: 'Downloads', value: '1.2M', unit: 'month' },
//   { label: 'Version', value: 'v1.2.3' }
// ]
```

## Usage with Components

```tsx
import { normalizeStats } from '@folio/core'

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
