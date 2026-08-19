# getUniqueStatuses

Get the unique project statuses present in a list of projects, in canonical order.

## Signature

```tsx
function getUniqueStatuses(projects: ProjexProject[]): ProjectStatus[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProject[]` | Array of projects to scan |

## Returns

`ProjectStatus[]` - Unique statuses present in `projects` (new array, does not mutate input)

## Behavior

- Only statuses with at least one project are included
- Order follows the canonical `PROJECT_STATUSES` order, not first-seen order, so filter UIs render consistently regardless of input order
- Returns an empty array if `projects` is empty

## Example

```tsx
import { getUniqueStatuses } from '@manningworks/projex'

// Only the statuses that actually occur, in canonical order
const statuses = getUniqueStatuses(projects)
// e.g. ['active', 'shipped']
```

## PROJECT_STATUSES Constant

The canonical status order, exported alongside `getUniqueStatuses` for building custom filter UIs:

```tsx
const PROJECT_STATUSES = [
  'active',
  'shipped',
  'in-progress',
  'coming-soon',
  'archived',
  'for-sale',
] as const
```

`ProjectStatusFilterBar` is a prebuilt component that consumes this helper — see [ProjectStatusFilterBar](../components/project-status-filter-bar). To apply a status selection, use [filterByStatus](./filter-by-status).
