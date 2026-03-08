# ProjectStatus

Union type for project status values.

## Definition

```tsx
type ProjectStatus = 'active' | 'shipped' | 'in-progress' | 'coming-soon' | 'archived' | 'for-sale'
```

## Values

| Value | Description |
|-------|-------------|
| `active` | Actively maintained |
| `shipped` | Completed and released |
| `in-progress` | Currently in development |
| `coming-soon` | Not yet started |
| `archived` | No longer maintained |
| `for-sale` | Available for purchase |

## Usage

```tsx
import type { ProjectStatus } from '@manningworks/projex'
import { filterByStatus } from '@manningworks/projex'

// Filter by single status
const active = filterByStatus(projects, 'active')

// Filter by multiple statuses
const visible = filterByStatus(projects, ['active', 'shipped', 'in-progress'])
```

## Styling by Status

```css
[data-projex-status-value="active"] { color: green; }
[data-projex-status-value="shipped"] { color: blue; }
[data-projex-status-value="in-progress"] { color: orange; }
[data-projex-status-value="coming-soon"] { color: gray; }
[data-projex-status-value="archived"] { color: gray; opacity: 0.6; }
[data-projex-status-value="for-sale"] { color: purple; }
```
