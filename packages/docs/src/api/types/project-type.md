# ProjectType

Union type for project types.

## Definition

```tsx
type ProjectType = 'github' | 'manual' | 'npm' | 'product-hunt' | 'youtube' | 'gumroad' | 'lemonsqueezy' | 'devto' | 'hybrid'
```

## Values

| Value | Description |
|-------|-------------|
| `github` | GitHub repository |
| `manual` | Manual configuration |
| `npm` | npm package |
| `product-hunt` | Product Hunt launch |
| `youtube` | YouTube channel |
| `gumroad` | Gumroad product |
| `lemonsqueezy` | Lemon Squeezy store |
| `devto` | Dev.to user profile |
| `hybrid` | GitHub + npm combination |

## Usage

```tsx
import type { ProjectType } from '@manningworks/projex'

function getIcon(type: ProjectType): string {
  switch (type) {
    case 'github': return 'github'
    case 'npm': return 'package'
    case 'product-hunt': return 'rocket'
    case 'youtube': return 'video'
    case 'gumroad': return 'shopping-cart'
    case 'lemonsqueezy': return 'store'
    case 'devto': return 'article'
    case 'hybrid': return 'link'
    case 'manual': return 'file'
  }
}
```

## Type-Specific Behavior

| Type | Fetches Data | Required Fields |
|------|--------------|-----------------|
| `github` | Yes | `repo` |
| `manual` | No | None |
| `npm` | Yes | `package` |
| `product-hunt` | Yes | `slug` |
| `youtube` | Yes | `channelId` |
| `gumroad` | Yes | `productId` |
| `lemonsqueezy` | Yes | `storeId` |
| `devto` | Yes | `username` |
| `hybrid` | Yes | `repo`, `package` |
