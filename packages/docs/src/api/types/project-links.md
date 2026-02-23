# ProjectLinks

Interface for external project links.

## Definition

```tsx
interface ProjectLinks {
  github?: string
  live?: string
  docs?: string
  demo?: string
  npm?: string
  appStore?: string
  playStore?: string
  productHunt?: string
  custom?: Array<{ label: string, url: string }>
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `github` | `string` | GitHub repository URL |
| `live` | `string` | Live demo/website URL |
| `docs` | `string` | Documentation URL |
| `demo` | `string` | Demo site URL (separate from live site) |
| `npm` | `string` | npm package URL |
| `appStore` | `string` | Apple App Store URL |
| `playStore` | `string` | Google Play Store URL |
| `productHunt` | `string` | Product Hunt URL |
| `custom` | `Array<{ label, url }>` | Custom links with user-defined labels |

## Usage

```tsx
import type { FolioProject } from '@reallukemanning/folio'

function renderLinks(project: FolioProject) {
  const links = project.links
  
  return (
    <div>
      {links.github && <a href={links.github}>GitHub</a>}
      {links.live && <a href={links.live}>Live Demo</a>}
      {links.docs && <a href={links.docs}>Documentation</a>}
      {links.demo && <a href={links.demo}>Demo</a>}
      {links.custom?.map(link => (
        <a key={link.label} href={link.url}>{link.label}</a>
      ))}
    </div>
  )
}
```

## Custom Links

Custom links allow arbitrary external resources:

```tsx
{
  links: {
    github: 'https://github.com/user/repo',
    live: 'https://example.com',
    custom: [
      { label: 'Storybook', url: 'https://storybook.example.com' },
      { label: 'Discord', url: 'https://discord.gg/abcdef' },
      { label: 'Blog', url: 'https://blog.example.com' }
    ]
  }
}
```

## Link Ordering

Control the display order of links using `linkOrder`:

```tsx
{
  id: 'my-project',
  type: 'manual',
  status: 'active',
  links: {
    github: 'https://github.com/user/repo',
    docs: 'https://docs.example.com',
    live: 'https://example.com',
    custom: [
      { label: 'Discord', url: 'https://discord.gg/abcdef' }
    ]
  },
  linkOrder: ['github', 'docs', 'live', 'custom']
}
```

Default order: `github → live → docs → demo → npm → productHunt → appStore → playStore → custom`

## Automatic Population

For certain project types, links are automatically populated:

| Type | Auto-Generated Links |
|------|---------------------|
| `github` | `github`, `live` (if homepage set) |
| `npm` | `npm` |
| `hybrid` | `github`, `npm`, `live` |
| `product-hunt` | None |
| `manual` | None |

## Data Attributes

Each link element receives `data-folio-link` and `data-folio-link-type` attributes:

| Link Type | `data-folio-link-type` |
|-----------|------------------------|
| `github` | `"github"` |
| `live` | `"live"` |
| `docs` | `"docs"` |
| `demo` | `"demo"` |
| `npm` | `"npm"` |
| `appStore` | `"app-store"` |
| `playStore` | `"play-store"` |
| `productHunt` | `"product-hunt"` |
| `custom` | `"custom"` |

Custom links additionally receive `data-folio-link-label` with the label value.

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
    productHunt: 'https://producthunt.com/posts/my-project',
    docs: 'https://docs.example.com'
  }
}
```
