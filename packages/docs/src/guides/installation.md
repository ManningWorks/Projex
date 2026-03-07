# Installation

Detailed installation guide for setting up Folio in your Next.js project.

## Prerequisites

- **Node.js 18+** - Required for modern React features
- **Next.js** - Folio is designed for Next.js projects
- **TypeScript** - Strongly recommended for type safety

## Quick Install

Run the CLI to initialize your project:

```bash
npx @reallukemanning/folio init
```

Or auto-detect your GitHub repositories:

```bash
npx @reallukemanning/folio init --github
```

This creates a `folio.config.ts` file in your project root.

## Installation Methods

### Method 1: CLI Only (Recommended)

Use the CLI to copy components into your project:

```bash
# Initialize config
npx @reallukemanning/folio init --github

# Add components
npx @reallukemanning/folio add project-card
npx @reallukemanning/folio add project-view

# Install dependencies
pnpm install

# Add theme (optional)
npx @reallukemanning/folio add theme-minimal
```

**Pros:**
- You own the component code
- Can modify components as needed
- No runtime dependency on Folio package

**Cons:**
- Manual updates to components
- Larger codebase (components copied)

### Method 2: Package Install

Install the package and import directly:

```bash
pnpm add @reallukemanning/folio
```

Then import components:

```tsx
import { ProjectCard, normalise } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'
```

**Pros:**
- Easy updates via `pnpm update`
- Smaller codebase (no copied components)
- Always latest features

**Cons:**
- Runtime dependency on Folio
- Less customization flexibility

## Adding Components

Use the CLI to add components (works with both methods):

```bash
# Base components
npx folio add project-card
npx folio add project-view
npx folio add project-grid
npx folio add project-list
npx folio add featured-project

# Preset components (ready to use)
npx folio add github-card
npx folio add npm-card
npx folio add showcase-card

# Interactive components
npx folio add project-search
npx folio add project-filter-bar
npx folio add project-filter-tag
npx folio add project-sort
```

## Adding Themes

Install pre-built themes for instant styling:

```bash
npx folio add theme-minimal    # Clean light theme
npx folio add theme-dark        # Dark mode with system preference
npx folio add theme-gradient    # Purple gradient theme
```

Themes are copied to `styles/folio-<theme-name>.css`. Import in your app:

```tsx
// app/layout.tsx (Next.js)
import './styles/folio-theme-minimal.css'
```

## Environment Variables

Set environment variables for API authentication:

### GitHub Token (Recommended)

Increases rate limit from 60/hr to 5,000/hr:

```bash
# .env.local
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxx
```

Create a fine-grained token at [github.com/settings/personal-access-token/new](https://github.com/settings/personal-access-token/new):
1. Select **Fine-grained** token type
2. Set **Contents** permission to **Read-only**
3. Select **Only select repositories** and choose your portfolio repos
4. Set expiration to **No expiration** (recommended for CI/CD)

### Product Hunt Token

Required if using `type: 'product-hunt'` in your config:

```bash
# .env.local
PRODUCT_HUNT_TOKEN=xxxxxxxxxxxx
```

## Config File

Create `folio.config.ts` in your project root:

```ts
import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/my-project',
    status: 'active',
    featured: true,
  },
  {
    id: 'my-package',
    type: 'npm',
    package: 'my-package-name',
    status: 'active',
  },
  {
    id: 'client-work',
    type: 'manual',
    status: 'shipped',
    name: 'Client Website',
    description: 'Custom web application...',
    stack: ['Next.js', 'TypeScript', 'Tailwind'],
  },
])
```

## Next Steps

- [Using Components](./using-components) - How to integrate Folio components in Next.js
- [Project Types](./project-types) - Available project types and their features
- [Styling](./styling) - Customizing your portfolio's appearance
- [Examples](/examples/) - Code examples and patterns

## Troubleshooting

### Command Not Found

Use the full package name:

```bash
npx @reallukemanning/folio init
```

Or install globally:

```bash
npm install -g @reallukemanning/folio
```

### Package Already Installed

If `@reallukemanning/folio` is already installed, use shorter commands:

```bash
npx folio init
npx folio add project-card
```

### TypeScript Errors

Ensure your TypeScript config includes the correct module resolution:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Missing Environment Variables

Check that your environment variables are set:

```bash
echo $GITHUB_TOKEN
```

Restart your dev server after adding `.env.local`:

```bash
pnpm dev
```

See [Troubleshooting Guide](./troubleshooting) for more solutions.
