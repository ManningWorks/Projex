# filterByType

Filter projects by their type value.

## Signature

```tsx
function filterByType(
  projects: ProjexProject[],
  type: ProjectType | 'all' | undefined
): ProjexProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `ProjexProject[]` | Array of projects to filter |
| type | `ProjectType \| 'all' \| undefined` | Type to filter by |

## Returns

`ProjexProject[]` - Filtered array of projects (new array, does not mutate input)

## Behavior

- Returns empty array if `projects` is empty
- Returns copy of all projects if `type` is `'all'` or `undefined`
- Filters by single type if `type` is a `ProjectType` value

## Example

```tsx
import { filterByType } from '@manningworks/projex'

// Single type
const githubProjects = filterByType(projects, 'github')

// All projects
const allProjects = filterByType(projects, 'all')

// With undefined
const allProjects = filterByType(projects, undefined)
```

## Type Values

```tsx
type ProjectType = 
  | 'github'
  | 'manual'
  | 'npm'
  | 'product-hunt'
  | 'youtube'
  | 'gumroad'
  | 'lemonsqueezy'
  | 'devto'
  | 'hybrid'
```

### Common Filter Patterns

```tsx
// Show only code-related projects
const codeProjects = filterByType(projects, 'github')

// Show only content creator projects
const contentProjects = projects.filter(p => 
  ['youtube', 'devto'].includes(p.type)
)

// Show only commercial products
const products = projects.filter(p => 
  ['gumroad', 'lemonsqueezy'].includes(p.type)
)

// Show packages (npm only, not hybrid)
const packagesOnly = filterByType(projects, 'npm')

// Show packages including hybrid projects that include npm data
const allPackages = projects.filter(p => 
  p.type === 'npm' || p.type === 'hybrid'
)
```
