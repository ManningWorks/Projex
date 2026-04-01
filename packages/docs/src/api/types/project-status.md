# ProjectStatus

Union type for project status values. Every project in Projex must have a status that indicates its current lifecycle state.

## Definition

```tsx
type ProjectStatus = 'active' | 'shipped' | 'in-progress' | 'coming-soon' | 'archived' | 'for-sale'
```

## Status Values

### `active`

A project that is actively maintained with ongoing development, bug fixes, or feature additions.

**When to use:**
- You are currently accepting issues and pull requests
- You release updates on a regular cadence (even if infrequent)
- The project is live and you intend to keep it working

**Example projects:** Open-source libraries with recent commits, SaaS products with active users, personal tools you use daily

```tsx
{
  id: 'my-lib',
  type: 'github',
  repo: 'user/active-lib',
  status: 'active',
}
```

### `shipped`

A project that has been completed and released. It works as intended and may receive occasional maintenance, but is not under active feature development.

**When to use:**
- The project is feature-complete for its stated scope
- It has been launched/deployed and is serving its purpose
- You may fix bugs but aren't planning new features

**Example projects:** Client websites that launched, hackathon projects that won, completed courses or ebooks

```tsx
{
  id: 'client-site',
  type: 'manual',
  status: 'shipped',
  name: 'Client E-commerce Store',
  links: { live: 'https://client-store.com' },
}
```

### `in-progress`

A project currently under active development that has not yet been released.

**When to use:**
- You are actively writing code for the project
- The project exists in some form (repo created, prototype built) but isn't ready for users
- You want to tease an upcoming project on your portfolio

**Example projects:** A new library you're building, a startup MVP in development, a course you're recording

```tsx
{
  id: 'next-big-thing',
  type: 'github',
  repo: 'user/next-big-thing',
  status: 'in-progress',
  name: 'Next Big Thing',
  tagline: 'Something awesome is coming...',
}
```

### `coming-soon`

A planned project that has not yet started development. Use this to build anticipation or show your roadmap.

**When to use:**
- You've announced the project but haven't started coding
- You're in the planning/design phase
- You want visitors to know what's next

**Example projects:** Announced products with landing pages, planned course launches, upcoming SaaS products

```tsx
{
  id: 'future-project',
  type: 'manual',
  status: 'coming-soon',
  name: 'Secret Project',
  tagline: 'Coming Q2 2026',
}
```

### `archived`

A project that is no longer maintained. It may still work, but you are not actively supporting it.

**When to use:**
- You no longer have time to maintain the project
- The technology is deprecated or superseded
- You've explicitly marked the GitHub repo as archived
- The project was experimental and you've moved on

**Example projects:** Old libraries replaced by better alternatives, hackathon prototypes, retired SaaS products

```tsx
{
  id: 'old-project',
  type: 'github',
  repo: 'user/old-project',
  status: 'archived',
}
```

### `for-sale`

A project, product, or business that is available for purchase. Use this to signal to potential buyers.

**When to use:**
- You're selling a SaaS product on Acquire.com or similar
- You're offering a digital product for sale on Gumroad or Lemon Squeezy
- You're looking for a buyer for a project or business

**Example projects:** SaaS products with MRR on selling platforms, digital products on Gumroad, domain+code packages

```tsx
{
  id: 'saas-for-sale',
  type: 'lemonsqueezy',
  storeId: '12345',
  status: 'for-sale',
  name: 'Micro SaaS Tool',
  tagline: 'Acquiring? Reach out!',
}
```

## Status Lifecycle

A typical project lifecycle follows this progression:

```
coming-soon → in-progress → active → shipped → archived
                                           ↘ for-sale
```

Projects don't have to follow every step. Common paths:

| Path | Scenario |
|------|----------|
| `coming-soon → in-progress → shipped` | Client project with clear start and end |
| `coming-soon → in-progress → active` | OSS library that stays in active development |
| `active → shipped → archived` | Product that reached end-of-life |
| `active → for-sale` | Selling a profitable project |
| `in-progress → archived` | Abandoned experiment |

## Usage

### In Configuration

```tsx
import type { ProjectStatus } from '@manningworks/projex'
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-active-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',          // Required field
    featured: true,
  },
])
```

### Filtering by Status

```tsx
import { filterByStatus } from '@manningworks/projex'
import type { ProjectStatus } from '@manningworks/projex'

// Filter by single status
const active = filterByStatus(projects, 'active')

// Filter by multiple statuses
const visible = filterByStatus(projects, ['active', 'shipped', 'in-progress'])

// Get all projects (no filtering)
const all = filterByStatus(projects, 'all')

// Filter with type-safe variable
const targetStatus: ProjectStatus = 'shipped'
const shipped = filterByStatus(projects, targetStatus)
```

### Type Guard Pattern

```tsx
function isActive(project: ProjexProject): boolean {
  return project.status === 'active' || project.status === 'shipped'
}

function isVisible(project: ProjexProject): boolean {
  return ['active', 'shipped', 'in-progress', 'coming-soon'].includes(project.status)
}
```

## Component Rendering

### ProjectCard.Status

The `ProjectCard.Status` subcomponent renders the status badge:

```tsx
<ProjectCard.Status project={project} />
```

This renders a `<div>` with the status value as text:

```html
<div data-projex-status data-projex-status-value="active" style="...">
  active
</div>
```

The component uses built-in CSS custom properties for default colors (see [CSS Custom Properties](#css-custom-properties)).

### Filtering Display

A common pattern is to hide certain statuses from the main portfolio view:

```tsx
const portfolioProjects = filterByStatus(projects, ['active', 'shipped', 'in-progress'])
const comingSoon = filterByStatus(projects, 'coming-soon')
const archived = filterByStatus(projects, 'archived')
```

## CSS Custom Properties

Each status has dedicated CSS custom properties for background and text color:

```css
:root {
  /* Active - Green */
  --projex-status-active-bg: #dcfce7;
  --projex-status-active-text: #166534;

  /* Shipped - Blue */
  --projex-status-shipped-bg: #dbeafe;
  --projex-status-shipped-text: #1e40af;

  /* In Progress - Amber */
  --projex-status-in-progress-bg: #fef3c7;
  --projex-status-in-progress-text: #92400e;

  /* Coming Soon - Purple */
  --projex-status-coming-soon-bg: #f3e8ff;
  --projex-status-coming-soon-text: #7c3aed;

  /* Archived - Gray */
  --projex-status-archived-bg: #f1f5f9;
  --projex-status-archived-text: #475569;

  /* For Sale - Red */
  --projex-status-for-sale-bg: #fee2e2;
  --projex-status-for-sale-text: #991b1b;
}
```

Override any status color by redefining the custom property:

```css
/* Make "active" use your brand color */
:root {
  --projex-status-active-bg: #eef2ff;
  --projex-status-active-text: #3730a3;
}
```

## Styling by Status

### Basic CSS Targeting

```css
/* Style all status badges */
[data-projex-status] {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

/* Target specific statuses */
[data-projex-status-value="active"] {
  /* Green badge - project is alive */
}

[data-projex-status-value="shipped"] {
  /* Blue badge - project is done */
}

[data-projex-status-value="in-progress"] {
  /* Amber badge - project is being built */
}

[data-projex-status-value="coming-soon"] {
  /* Purple badge - project is planned */
}

[data-projex-status-value="archived"] {
  /* Gray badge - project is retired */
  opacity: 0.7;
}

[data-projex-status-value="for-sale"] {
  /* Red badge - project is for sale */
}
```

### Combined with Filter Bar

```tsx
const STATUSES = ['active', 'shipped', 'in-progress', 'coming-soon', 'archived', 'for-sale']

<ProjectFilterBar>
  {STATUSES.map(status => (
    <ProjectFilterTag
      key={status}
      label={status}
      isActive={selectedStatus === status}
      onClick={() => setSelectedStatus(status)}
    />
  ))}
</ProjectFilterBar>
```

## Status and Project Types

Status works independently of project type — every project type supports all statuses:

| Project Type | `active` | `shipped` | `in-progress` | `coming-soon` | `archived` | `for-sale` |
|-------------|----------|-----------|---------------|---------------|------------|------------|
| `github` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `npm` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `manual` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `hybrid` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `product-hunt` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `youtube` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `gumroad` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `lemonsqueezy` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `devto` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Validation

Status values are validated at runtime using the Zod schema:

```tsx
import { projexProjectInputSchema } from '@manningworks/projex'

const result = projexProjectInputSchema.safeParse({
  id: 'test',
  type: 'github',
  repo: 'user/repo',
  status: 'invalid-status'  // Will fail validation
})

if (!result.success) {
  // Error: status must be one of: active, shipped, in-progress, coming-soon, archived, for-sale
}
```

## Related

- [filterByStatus](../utilities/filter-by-status) — Filter projects by status
- [ProjexProject](./projex-project) — Full project type with status field
- [ProjexProjectInput](./projex-project-input) — Input configuration with status requirement
- [Styling Guide](../../guides/styling) — Complete CSS customization reference
- [Project Types](../../guides/project-types) — Project type reference with status examples
