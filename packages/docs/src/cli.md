# CLI Reference

The Projex CLI helps you initialize projects, add components, manage your config, and install themes. All commands can be run with `npx` without installing the package first.

## Installation

Install the package for shorter commands:

```bash
pnpm add @manningworks/projex
```

Now you can use:

```bash
npx @manningworks/projex <command>
```

Or install globally:

```bash
npm install -g @manningworks/projex
```

## Commands

### `init`

Initialize a new Projex project with a `projex.config.ts` file.

```bash
npx @manningworks/projex init
```

This creates a basic configuration template with a sample project.

**What it does:**

1. Detects if you're in a Next.js project
2. Creates `projex.config.ts` in your project root
3. Ensures `@manningworks/projex` is installed
4. Shows next steps for getting started

**Output:**

```ts
// projex.config.ts
import { defineProjects } from '@manningworks/projex'

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
npx @manningworks/projex init --github
```

**What it does:**

1. Prompts for your GitHub username
2. Fetches all your public repositories
3. Filters out archived repos and templates
4. Asks if you want to include forks
5. Creates `projex.config.ts` with all your repos

**Options:**

| Option | Description |
|--------|-------------|
| `--github` | Enable GitHub auto-detection mode |
| `--yes` | Skip prompts, use git config for username |

**Example with --yes:**

```bash
npx @manningworks/projex init --github --yes
```

This uses your git config username without prompting.

---

### `init --yes`

Create a config using git config without prompts.

```bash
npx @manningworks/projex init --yes
```

Uses your git `user.name` configuration for GitHub username when combined with `--github`.

---

### `add <component-name>`

Add a Projex component or theme to your project.

```bash
npx @manningworks/projex add project-card
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

1. Copies component source code to `components/projex/<ComponentName>/`
2. Transforms imports to use the installed package
3. Ensures `@manningworks/projex` is installed
4. Shows import usage instructions

**Example output:**

```
📦 Adding project-card...
  Installing @manningworks/projex...
  ✓ @manningworks/projex installed
  ✓ project-card added successfully

Import usage:
  import { ProjectCard } from './components/projex/ProjectCard'
```

---

### `add <component-name> --force`

Overwrite existing component files without prompting.

```bash
npx @manningworks/projex add project-card --force
```

Useful when updating to a new version or re-adding components.

---

### `add theme-*`

Add a pre-built theme to your project.

```bash
npx @manningworks/projex add theme-minimal
npx @manningworks/projex add theme-dark
npx @manningworks/projex add theme-gradient
```

**What it does:**

1. Copies theme CSS to `styles/projex-<theme-name>.css`
2. Shows import instructions

**Example output:**

```
🎨 Adding theme-minimal...
✓ theme-minimal added successfully

Import usage:
  import './styles/projex-theme-minimal.css'

  Or add to your CSS:
  @import './styles/projex-theme-minimal.css';
```

---

### `add project`

Add a new project to your config file.

```bash
npx @manningworks/projex add project
```

**Interactive mode:** When no flags are provided, you'll be guided through selecting a project type, entering a name, and configuring type-specific fields.

**Options:**

| Option | Description |
|--------|-------------|
| `--type <type>` | Project type (`github`, `npm`, `manual`, `product-hunt`, `hybrid`, `youtube`, `gumroad`, `lemonsqueezy`, `devto`) |
| `--name <name>` | Project display name (used to generate ID) |
| `--status <status>` | Project status (`active`, `shipped`, `in-progress`, `coming-soon`, `archived`, `for-sale`) |
| `--featured` | Mark as featured |
| `--stack <stack>` | Comma-separated tech stack (e.g., `--stack "TypeScript,React"`) |
| `--description <desc>` | Project description |
| `--repo <repo>` | GitHub repository, e.g., `username/repo` (for `github`/`hybrid` types) |
| `--package <pkg>` | npm package name (for `npm`/`hybrid` types) |
| `--slug <slug>` | Product Hunt slug (for `product-hunt` type) |
| `--channel-id <id>` | YouTube channel ID (for `youtube` type) |
| `--product-id <id>` | Gumroad product ID (for `gumroad` type) |
| `--store-id <id>` | Lemon Squeezy store ID (for `lemonsqueezy` type) |
| `--username <user>` | Dev.to username (for `devto` type) |

**Examples:**

```bash
# Interactive — guided through all fields
npx @manningworks/projex add project

# Add a GitHub project
npx @manningworks/projex add project --type github --name "My Lib" --repo user/repo

# Add a manual project with stack
npx @manningworks/projex add project --type manual --name "Client Site" --stack "Next.js,TypeScript" --status shipped

# Add an npm package
npx @manningworks/projex add project --type npm --name "my-package" --package my-package
```

The project ID is auto-generated from the name by lowercasing and replacing spaces with hyphens.

---

### `add learning <project-id>`

Add a learning entry to a project's struggles array.

```bash
npx @manningworks/projex add learning my-project --text "Learned about SSR patterns"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--text <text>` | The learning text |

**Behavior:** When `--text` is provided, the entry type is set to `"learning"` automatically (no prompt). When `--text` is not provided, you'll be prompted to enter text.

**Examples:**

```bash
# Add a learning entry (type is automatically "learning")
npx @manningworks/projex add learning my-project --text "Discovered efficient caching strategies"

# Interactive — prompted for text
npx @manningworks/projex add learning my-project
```

---

### `add challenge <project-id>`

Add a challenge entry to a project's struggles array.

```bash
npx @manningworks/projex add challenge my-project --text "Struggled with state management"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--text <text>` | The challenge text |

**Behavior:** When `--text` is provided, the entry type is set to `"challenge"` automatically (no prompt). When `--text` is not provided, you'll be prompted to enter text.

**Examples:**

```bash
# Add a challenge entry (type is automatically "challenge")
npx @manningworks/projex add challenge my-project --text "API rate limits required creative caching"

# Interactive — prompted for text
npx @manningworks/projex add challenge my-project
```

---

### `add timeline <project-id>`

Add a timeline milestone entry to a project.

```bash
npx @manningworks/projex add timeline my-project --date 2026-04-15 --note "v1.0 released"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--date <date>` | Date in `YYYY-MM-DD` format (defaults to today in interactive mode) |
| `--note <note>` | Milestone note |

**Interactive mode:** When flags are not provided, you'll be prompted for date and note. Date defaults to today.

**Examples:**

```bash
# Add a timeline entry
npx @manningworks/projex add timeline my-project --date 2026-04-15 --note "v1.0 released"

# Interactive — prompted for date (defaults to today) and note
npx @manningworks/projex add timeline my-project
```

---

### `add post <project-id>`

Add a blog post or article link to a project.

```bash
npx @manningworks/projex add post my-project --title "How I Built It" --url "https://dev.to/user/how-i-built-it"
```

**Options:**

| Option | Description |
|--------|-------------|
| `--title <title>` | Post title |
| `--date <date>` | Date in `YYYY-MM-DD` format (defaults to today in interactive mode) |
| `--url <url>` | Post URL (optional) |

**Interactive mode:** When flags are not provided, you'll be prompted for title, date, and URL. Date defaults to today. URL is optional.

**Examples:**

```bash
# Add a post with URL
npx @manningworks/projex add post my-project --title "How I Built It" --url "https://dev.to/user/how-i-built-it"

# Add a post with a specific date
npx @manningworks/projex add post my-project --title "Launch Day" --date 2026-04-15

# Interactive — prompted for all fields
npx @manningworks/projex add post my-project
```

---

### `list`

List all projects in your config file as a table.

```bash
npx @manningworks/projex list
```

**What it does:**

1. Reads `projex.config.ts` from the current directory
2. Displays a table with columns: ID, Type, Status, Featured, Name
3. Featured projects show ★, others show -
4. Values longer than 20 characters are truncated with …

**Example output:**

```
┌─────────┬──────────────────┬──────────────────┬───────────┬──────────────────┐
│ (index) │        ID        │       Type       │  Status   │    Featured      │ Name             │
├─────────┼──────────────────┼──────────────────┼───────────┼──────────────────┤
│    0    │ 'my-awesome-lib' │    'github'      │ 'active'  │      '★'         │ 'My Awesome Lib' │
│    1    │ 'my-npm-package' │      'npm'       │ 'shipped' │      '-'         │ 'my-npm-package' │
└─────────┴──────────────────┴──────────────────┴───────────┴──────────────────┘
```

**When no projects exist:**

```
No projects found.
```

**When no config file exists:**

```
✖ projex.config.ts not found. Run 'projex init' first.
```

---

### `edit project <id>`

Edit an existing project's fields in your config file.

```bash
npx @manningworks/projex edit project my-project --status shipped
```

**Options:**

| Option | Description |
|--------|-------------|
| `--name <name>` | Project display name |
| `--description <desc>` | Project description |
| `--status <status>` | Project status (`active`, `shipped`, `in-progress`, `coming-soon`, `archived`, `for-sale`) |
| `--featured` | Mark as featured |
| `--no-featured` | Remove featured status |
| `--stack <stack>` | Comma-separated tech stack (e.g., `--stack "TypeScript,React,Next.js"`) |
| `--repo <repo>` | GitHub repository (e.g., `username/repo`) |
| `--package <pkg>` | npm package name |
| `--slug <slug>` | Product Hunt slug |
| `--channel-id <id>` | YouTube channel ID |
| `--product-id <id>` | Gumroad product ID |
| `--store-id <id>` | Lemon Squeezy store ID |
| `--username <user>` | Dev.to username |
| `--unset <field>` | Remove a field from the project config |

**Interactive mode:** When no flags are provided, you'll be prompted to select a field and enter a new value.

**Type compatibility enforcement:** Setting a type-specific field that doesn't match the project type (e.g., `--channel-id` on a `hybrid` project) causes an error with a message listing valid type-specific fields. The command exits without making changes.

**Removing fields with `--unset`:** The `--unset` flag removes a field from the project config. It cannot be combined with other edit flags. Protected fields (`id`, `type`, `struggles`, `timeline`, `posts`) cannot be removed. If the field doesn't exist on the project, a warning is shown.

**Examples:**

```bash
# Update project status
npx @manningworks/projex edit project my-project --status shipped

# Update name and stack
npx @manningworks/projex edit project my-project --name "My Cool Lib" --stack "TypeScript,React"

# Mark as featured
npx @manningworks/projex edit project my-project --featured

# Remove featured status
npx @manningworks/projex edit project my-project --no-featured

# Remove a field from a project
npx @manningworks/projex edit project my-project --unset description

# Interactive mode — select field, then enter value
npx @manningworks/projex edit project my-project
```

---

### `remove project <id>`

Remove a project from your config file.

```bash
npx @manningworks/projex remove project my-project
```

**Options:**

| Option | Description |
|--------|-------------|
| `-f, --force` | Skip confirmation prompt |

**What it does:**

1. Finds the project by ID in `projex.config.ts`
2. Prompts for confirmation: `Remove project 'my-project'? This cannot be undone.`
3. Removes the project from the config on confirm

**Examples:**

```bash
# Remove with confirmation prompt
npx @manningworks/projex remove project old-project

# Remove without confirmation (e.g., in scripts)
npx @manningworks/projex remove project old-project --force
```

---

### `remove challenge|learning|timeline|post <project-id>`

Remove a challenge entry, learning entry, timeline entry, or post from a project. Both `challenge` and `learning` operate on the same struggles array — `challenge` and `learning` are interchangeable aliases.

```bash
npx @manningworks/projex remove learning my-project --index 0
npx @manningworks/projex remove challenge my-project --index 0
npx @manningworks/projex remove timeline my-project --index 1
npx @manningworks/projex remove post my-project --index 0
```

**Options:**

| Option | Description |
|--------|-------------|
| `--index <n>` | Zero-based index of the entry to remove |

**Interactive mode:** When `--index` is not provided, you'll be prompted to select which entry to remove. Entries display with descriptive labels so you can identify them without referencing the config file:

- **Learning entries** display as `[type] text...` (e.g., `[challenge] Struggled with state management...`, text truncated at 60 characters)
- **Timeline entries** display as `YYYY-MM-DD - note...` (e.g., `2026-01-15 - v1.0 released`, note truncated at 50 characters)
- **Post entries** display as `title (YYYY-MM-DD)` (e.g., `How I Built X (2026-01-15)`)

**When the array is empty:**

```
No learning entries to remove.
```

**Examples:**

```bash
# Remove first learning entry from a project
npx @manningworks/projex remove learning my-project --index 0

# Remove a challenge entry (alias for learning)
npx @manningworks/projex remove challenge my-project --index 0

# Remove a timeline entry interactively
npx @manningworks/projex remove timeline my-project

# Remove a post by index
npx @manningworks/projex remove post my-project --index 2
```

---

## Environment Variables

### `GITHUB_TOKEN`

Fine-grained personal access token for GitHub API.

```bash
GITHUB_TOKEN=github_pat_xxx npx @manningworks/projex init --github
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
npx @manningworks/projex init --github

# Add the ProjectCard component
npx @manningworks/projex add project-card

# Install dependencies
pnpm install

# Add styling
npx @manningworks/projex add theme-minimal
```

### Manual Project Setup

```bash
# Initialize basic config
npx @manningworks/projex init

# Add components you need
npx @manningworks/projex add project-card
npx @manningworks/projex add project-view
npx @manningworks/projex add project-grid

# Add dark mode theme
npx @manningworks/projex add theme-dark
```

### Update Components

```bash
# Force overwrite to update
npx @manningworks/projex add project-card --force
```

### Manage Projects

```bash
# List all projects
npx @manningworks/projex list

# Add a new project
npx @manningworks/projex add project my-side-project --type manual --status active

# Edit a project
npx @manningworks/projex edit project my-side-project --status shipped --featured

# Remove a field from a project
npx @manningworks/projex edit project my-side-project --unset description

# Add content to a project
npx @manningworks/projex add learning my-side-project --text "Learned about SSR patterns"
npx @manningworks/projex add challenge my-side-project --text "API rate limits required creative caching"
npx @manningworks/projex add timeline my-side-project --date 2026-04-15 --note "v1.0 released"

# Remove content from a project
npx @manningworks/projex remove learning my-side-project --index 0
npx @manningworks/projex remove challenge my-side-project --index 1
npx @manningworks/projex remove timeline my-side-project --index 2

# Remove a project
npx @manningworks/projex remove project old-project --force
```

---

## Troubleshooting

### `projex: command not found`

Use the full package name:

```bash
npx @manningworks/projex init
```

Or install globally:

```bash
npm install -g @manningworks/projex
```

### Permission Denied

Check file permissions in your project directory:

```bash
ls -la projex.config.ts
```

Ensure you have write permissions.

### GitHub API Rate Limit

Set a `GITHUB_TOKEN`:

```bash
GITHUB_TOKEN=github_pat_xxx npx @manningworks/projex init --github
```

See [Fetch Strategy](./guides/fetch-strategy) for more details.

### Component Not Found

Check available components:

```bash
npx @manningworks/projex add
```

This lists all available components and themes.

---

## CLI vs Package Imports

You have two ways to use Projex:

### CLI (Copy-Paste)

Use `npx @manningworks/projex add` to copy components:

```tsx
// Import from copied files
import { ProjectCard } from './components/projex/ProjectCard'
```

### Package Imports

Install and import directly:

```tsx
// Import from package
import { ProjectCard } from '@manningworks/projex'
```

Both approaches work. The CLI gives you ownership of the code, while package imports are easier to update.
