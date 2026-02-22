# ProjectType

Union type for project types.

## Definition

```tsx
type ProjectType = 'github' | 'manual' | 'npm' | 'product-hunt' | 'hybrid'
```

## Values

| Value | Description |
|-------|-------------|
| `github` | GitHub repository |
| `npm` | npm package |
| `product-hunt` | Product Hunt launch |
| `hybrid` | GitHub + npm combination |
| `manual` | Manual configuration |

## Usage

```tsx
import type { ProjectType } from '@reallukemanning/folio'

function getIcon(type: ProjectType): string {
  switch (type) {
    case 'github': return 'github'
    case 'npm': return 'package'
    case 'product-hunt': return 'rocket'
    case 'hybrid': return 'link'
    case 'manual': return 'file'
  }
}
```

## Type-Specific Behavior

| Type | Fetches Data | Required Fields |
|------|--------------|-----------------|
| `github` | Yes | `repo` |
| `npm` | Yes | `package` |
| `product-hunt` | Yes | `slug` |
| `hybrid` | Yes | `repo`, `package` |
| `manual` | No | None |
