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
import type { ProjectStatus } from '@reallukemanning/folio'
import { filterByStatus } from '@reallukemanning/folio'

// Filter by single status
const active = filterByStatus(projects, 'active')

// Filter by multiple statuses
const visible = filterByStatus(projects, ['active', 'shipped', 'in-progress'])
```

## Styling by Status

```css
[data-folio-status-value="active"] { color: green; }
[data-folio-status-value="shipped"] { color: blue; }
[data-folio-status-value="in-progress"] { color: orange; }
[data-folio-status-value="coming-soon"] { color: gray; }
[data-folio-status-value="archived"] { color: gray; opacity: 0.6; }
[data-folio-status-value="for-sale"] { color: purple; }
```
