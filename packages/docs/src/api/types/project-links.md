# ProjectLinks

Interface for external project links.

## Definition

```tsx
interface ProjectLinks {
  github?: string
  live?: string
  npm?: string
  appStore?: string
  playStore?: string
  productHunt?: string
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `github` | `string` | GitHub repository URL |
| `live` | `string` | Live demo/website URL |
| `npm` | `string` | npm package URL |
| `appStore` | `string` | Apple App Store URL |
| `playStore` | `string` | Google Play Store URL |
| `productHunt` | `string` | Product Hunt URL |

## Usage

```tsx
import type { FolioProject } from '@reallukemanning/folio'

function renderLinks(project: FolioProject) {
  const links = project.links
  
  return (
    <div>
      {links.github && <a href={links.github}>GitHub</a>}
      {links.live && <a href={links.live}>Live Demo</a>}
      {links.npm && <a href={links.npm}>npm</a>}
    </div>
  )
}
```

## Automatic Population

For certain project types, links are automatically populated:

| Type | Auto-Generated Links |
|------|---------------------|
| `github` | `github`, `live` (if homepage set) |
| `npm` | `npm` |
| `hybrid` | `github`, `npm`, `live` |
| `product-hunt` | None |
| `manual` | None |

## Override

Input links override auto-generated links:

```tsx
{
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active',
  links: {
    live: 'https://custom-demo.com',  // Overrides GitHub homepage
    productHunt: 'https://producthunt.com/posts/my-project'
  }
}
```
