# CLI Reference

The Folio CLI helps you initialize projects, add components, and install themes. All commands can be run with `npx` without installing the package first.

## Installation

Install the package for shorter commands:

```bash
pnpm add @reallukemanning/folio
```

Now you can use:

```bash
npx folio <command>
```

Or install globally:

```bash
npm install -g @reallukemanning/folio
```

## Commands

### `init`

Initialize a new Folio project with a `folio.config.ts` file.

```bash
npx folio init
```

This creates a basic configuration template with a sample project.

**What it does:**

1. Detects if you're in a Next.js project
2. Creates `folio.config.ts` in your project root
3. Ensures `@reallukemanning/folio` is installed
4. Shows next steps for getting started

**Output:**

```ts
// folio.config.ts
import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/repo',
    status: 'active',
    featured: true,
    background: 'A brief background of your project...',
    why: 'Why you built this project...',
    stack: ['TypeScript', 'React', 'Next.js'],
    struggles: [],
    timeline: [],
    posts: [],
  },
])
```

---

### `init --github`

Auto-detect your GitHub repositories and create a pre-populated config.

```bash
npx folio init --github
```

**What it does:**

1. Prompts for your GitHub username
2. Fetches all your public repositories
3. Filters out archived repos and templates
4. Asks if you want to include forks
5. Creates `folio.config.ts` with all your repos

**Options:**

| Option | Description |
|--------|-------------|
| `--github` | Enable GitHub auto-detection mode |
| `--yes` | Skip prompts, use git config for username |

**Example with --yes:**

```bash
npx folio init --github --yes
```

This uses your git config username without prompting.

---

### `init --yes`

Create a config using git config without prompts.

```bash
npx folio init --yes
```

Uses your git `user.name` configuration for GitHub username when combined with `--github`.

---

### `add <component-name>`

Add a Folio component or theme to your project.

```bash
npx folio add project-card
```

**Available components:**

| Component | Description |
|-----------|-------------|
| `github-card` | Pre-built card for GitHub projects |
| `npm-card` | Pre-built card for npm packages |
| `showcase-card` | Pre-built card for manual projects |
| `project-card` | Flexible card component |
| `project-view` | Full page project view |
| `project-grid` | Grid layout container |
| `project-list` | List layout container |
| `featured-project` | Featured project hero section |

**Available themes:**

| Theme | Description |
|-------|-------------|
| `theme-minimal` | Clean light theme |
| `theme-dark` | Dark mode with system preference |
| `theme-gradient` | Purple gradient theme |

**What it does:**

1. Copies component source code to `components/folio/<ComponentName>/`
2. Transforms imports to use the installed package
3. Ensures `@reallukemanning/folio` is installed
4. Shows import usage instructions

**Example output:**

```
📦 Adding project-card...
  Installing @reallukemanning/folio...
  ✓ @reallukemanning/folio installed
✓ project-card added successfully

Import usage:
  import { ProjectCard } from './components/folio/ProjectCard'
```

---

### `add <component-name> --force`

Overwrite existing component files without prompting.

```bash
npx folio add project-card --force
```

Useful when updating to a new version or re-adding components.

---

### `add theme-*`

Add a pre-built theme to your project.

```bash
npx folio add theme-minimal
npx folio add theme-dark
npx folio add theme-gradient
```

**What it does:**

1. Copies theme CSS to `styles/folio-<theme-name>.css`
2. Shows import instructions

**Example output:**

```
🎨 Adding theme-minimal...
✓ theme-minimal added successfully

Import usage:
  import './styles/folio-theme-minimal.css'

  Or add to your CSS:
  @import './styles/folio-theme-minimal.css';
```

---

## Environment Variables

### `GITHUB_TOKEN`

Fine-grained personal access token for GitHub API.

```bash
GITHUB_TOKEN=github_pat_xxx npx folio init --github
```

**Why use it:**

- Increases rate limit from 60/hr to 5,000/hr
- Required for private repositories
- Recommended for projects with many repos

**How to create:**

1. Go to [github.com/settings/personal-access-token/new](https://github.com/settings/personal-access-token/new)
2. Select **Fine-grained** token type
3. Set **Contents** permission to **Read-only**
4. Select **Only select repositories** and choose your portfolio repos
5. Set expiration to **No expiration** (recommended for CI/CD)
6. Copy the token and set as environment variable

### `PRODUCT_HUNT_TOKEN`

Product Hunt API token for fetching product data.

```bash
PRODUCT_HUNT_TOKEN=xxx npx build
```

Only required if using `type: 'product-hunt'` in your config.

---

## Global Options

| Option | Description |
|--------|-------------|
| `--help, -h` | Show help for commands |
| `--version, -v` | Show CLI version |

---

## Common Workflows

### Quick Start with GitHub Repos

```bash
# Initialize with your GitHub repos
npx folio init --github

# Add the ProjectCard component
npx folio add project-card

# Install dependencies
pnpm install

# Add styling
npx folio add theme-minimal
```

### Manual Project Setup

```bash
# Initialize basic config
npx folio init

# Add components you need
npx folio add project-card
npx folio add project-view
npx folio add project-grid

# Add dark mode theme
npx folio add theme-dark
```

### Update Components

```bash
# Force overwrite to update
npx folio add project-card --force
```

---

## Troubleshooting

### `folio: command not found`

Use the full package name:

```bash
npx @reallukemanning/folio init
```

Or install globally:

```bash
npm install -g @reallukemanning/folio
```

### Permission Denied

Check file permissions in your project directory:

```bash
ls -la folio.config.ts
```

Ensure you have write permissions.

### GitHub API Rate Limit

Set a `GITHUB_TOKEN`:

```bash
GITHUB_TOKEN=github_pat_xxx npx folio init --github
```

See [Fetch Strategy](./guides/fetch-strategy) for more details.

### Component Not Found

Check available components:

```bash
npx folio add
```

This lists all available components and themes.

---

## CLI vs Package Imports

You have two ways to use Folio:

### CLI (Copy-Paste)

Use `npx folio add` to copy components:

```tsx
// Import from copied files
import { ProjectCard } from './components/folio/ProjectCard'
```

### Package Imports

Install and import directly:

```tsx
// Import from package
import { ProjectCard } from '@reallukemanning/folio'
```

Both approaches work. The CLI gives you ownership of the code, while package imports are easier to update.
