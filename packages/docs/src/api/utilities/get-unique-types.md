# getUniqueTypes

Get the unique project types present in a list of projects, in canonical order.

## Signature

```tsx
function getUniqueTypes(projects: ProjexProject[]): ProjectType[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProject[]` | Array of projects to scan |

## Returns

`ProjectType[]` - Unique types present in `projects` (new array, does not mutate input)

## Behavior

- Only types with at least one project are included
- Order follows the canonical `PROJECT_TYPES` order, not first-seen order, so filter UIs render consistently regardless of input order
- Returns an empty array if `projects` is empty

## Example

```tsx
import { getUniqueTypes } from '@manningworks/projex'

// Only the types that actually occur, in canonical order
const types = getUniqueTypes(projects)
// e.g. ['github', 'npm', 'hybrid']
```

## PROJECT_TYPES Constant

The canonical type order, exported alongside `getUniqueTypes` for building custom filter UIs:

```tsx
const PROJECT_TYPES = [
  'github',
  'manual',
  'npm',
  'product-hunt',
  'youtube',
  'gumroad',
  'lemonsqueezy',
  'devto',
  'hybrid',
] as const
```

`ProjectTypeFilterBar` is a prebuilt component that consumes this helper — see [ProjectTypeFilterBar](../components/project-type-filter-bar). To apply a type selection, use [filterByType](./filter-by-type).
