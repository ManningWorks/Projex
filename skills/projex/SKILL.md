---
name: projex
description: Drive a Projex developer-portfolio "projects showcase" page end-to-end. Use when a user asks to build a projects/portfolio/showcase page with Projex, run the projex CLI (init, add, edit, remove, list), create or modify projex.config.ts entries (github, npm, youtube, gumroad, lemonsqueezy, product-hunt, devto, manual, hybrid project types), wire ProjectCard/ProjectView/ProjectGrid components into a Next.js app, or set provider env vars (GITHUB_TOKEN, DEV_TO_API_KEY, PRODUCT_HUNT_TOKEN, YOUTUBE_TOKEN, GUMROAD_TOKEN, LS_TOKEN). All CLI examples are verified against live --help output and run non-interactively.
---

# Projex agent skill

Projex is a shadcn-style component library for developer portfolio pages. You
declare projects (GitHub repos, npm packages, Product Hunt launches, YouTube
channels, Gumroad/LemonSqueezy products, Dev.to accounts, manual entries) in a
single TypeScript config file, and components render them with auto-fetched
stats (stars, forks, downloads, upvotes, revenue...). All external data is
fetched **at build/render time** by `normalise()` — no runtime API calls.

Target stack: **Next.js** (required for the documented page patterns), Node.js
>= 18, TypeScript. CLI package: `@manningworks/projex` — run as
`npx @manningworks/projex <command>`.

## Golden rules for agents

1. **Never rely on interactive prompts.** Any omitted flag silently falls back
   to a prompt; in a non-TTY shell a failed prompt prints `✖ Cancelled.` and
   **exits 0**. Exit 0 is NOT proof of success — verify the `✓` line and
   re-read `projex.config.ts` or run `projex list`.
2. **Every operation mutates `projex.config.ts` in place** (AST editing). Read
   it before and after each mutation.
3. **`projex.config.ts` must exist first** (`init` creates it); all content ops
   fail without it.
4. **Package import is the working component path**: `import { ProjectCard }
   from '@manningworks/projex'`. (Known bug: `projex add <component>` from the
   published package copies only `.d.ts` files — see Troubleshooting.)

---

## 1. Init

> **Published-package gotcha:** `@manningworks/projex` declares its CLI runtime deps (`commander`, `ts-morph`, `chalk`, `@inquirer/prompts`) as *optional* peerDependencies, so a plain `npx @manningworks/projex …` or a fresh `npm install @manningworks/projex` **crashes with `ERR_MODULE_NOT_FOUND` on the first command** — install the four peers once (see Troubleshooting) or run from a source build (`pnpm build`).

```bash
npx @manningworks/projex init -y              # basic scaffold, no prompts
npx @manningworks/projex init --github -y     # auto-discover GitHub repos, no prompts
npx @manningworks/projex init -i              # guided interactive setup — HUMANS ONLY, do not run
```

| Flag | Effect |
| --- | --- |
| `-y, --yes` | Skip all prompts, use defaults; overwrites an existing `projex.config.ts` silently. |
| `--github` | Fetch the user's repos from the GitHub API and pre-populate the config. |
| `-i, --interactive` | Prompt-by-prompt setup. Do NOT run in an agent shell. |

Verified non-interactive behavior:

- `init -y` writes a scaffold with one placeholder `github` project
  (`id: 'my-project'`, `repo: 'username/repo'`); detects Next.js (warns only
  if absent); auto-installs the package (below).
- `init --github -y` derives the GitHub username from **`git config user.name`**
  — if that is not a real GitHub handle (e.g. a full name) you get
  `GitHub user "X" not found` or someone else's repos. Set
  `git config user.name <github-handle>` first. If `user.name` is
  unset/empty, a warning (`⚠ Could not detect GitHub username from git
  config`) is printed and the **basic scaffold is written instead** — no
  error, exit 0. With `--yes`, forks are
  excluded; archived repos, `*.template`, `*.github.io` and repos without a
  description are filtered out. Generated entries: `type: 'github'`,
  `status: 'active'`, `featured: false`, and **`background: null, why: null` —
  must be fixed before the config validates** (see Troubleshooting).
- With no flags, `init` prompts for overwrite if the config exists; non-TTY
  aborts and leaves the file untouched (exit 0).

Auto-install side effect: `init` and `add` check the user's `package.json`; if
`@manningworks/projex` is missing they run `pnpm add` / `yarn add` /
`npm install` (chosen by lockfile). No `--legacy-peer-deps`, so peer-dependency
conflicts fail the command (see Troubleshooting). Pre-install the package
yourself for deterministic behavior — then the CLI skips installation.

## 2. Components and themes

Copy commands — `npx @manningworks/projex add <name> [-f, --force]`:

| Name | Kind | Copied to |
| --- | --- | --- |
| `project-card` | component | `components/projex/ProjectCard/` |
| `project-view` | component | `components/projex/ProjectView/` |
| `project-grid` | component | `components/projex/ProjectGrid/` |
| `project-list` | component | `components/projex/ProjectList/` |
| `featured-project` | component | `components/projex/FeaturedProject/` |
| `github-card` | component | `components/projex/GitHubCard/` |
| `npm-card` | component | `components/projex/NpmCard/` |
| `showcase-card` | component | `components/projex/ShowcaseCard/` |
| `theme-minimal` / `theme-dark` / `theme-gradient` | theme CSS | `styles/projex-<name>.css` |

`--force` overwrites without prompting (otherwise an interactive confirm fires
— pass `--force` when re-adding). Unknown names exit 1 and print the available
list.

> **Known bug (published package):** the copy step only matches `.tsx`/`.ts`
> files, but the published dist ships `.js` + `.d.ts` — the copied directory
> contains type declarations **only**, so the import the CLI prints
> (`import { ProjectCard } from './components/projex/ProjectCard'`) has no
> runtime code and fails at build. **Import from the package instead**
> (verified): `import { ProjectCard } from '@manningworks/projex'`. Copying is
> still useful for owning the source when done from a git checkout.

### Wiring into a Next.js page (verified pattern)

`projex.config.ts` exports `defineProjects(...)`, which returns
`{ projects, options }` — **not an array**. Components render *normalized*
projects (`ProjexProject`), so run `normalise()` (async; performs the fetches):

```tsx
// app/page.tsx — async server component
import { ProjectCard, ProjectGrid, FeaturedProject, normalise } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'

async function getProjects(): Promise<ProjexProject[]> {
  const { projects: projectInputs } = await import('../projex.config')
  return Promise.all(projectInputs.map((input) => normalise(input)))
}

export default async function PortfolioPage() {
  const projects = await getProjects()
  const featuredProject = projects.find((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <main>
      {featuredProject && <FeaturedProject project={featuredProject} />}
      <ProjectGrid>
        {otherProjects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Tags project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Status project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
      </ProjectGrid>
    </main>
  )
}
```

Theme import (e.g. `app/layout.tsx`): `import './styles/projex-theme-minimal.css'`
(or `@import './styles/projex-theme-minimal.css';` in CSS).

### Compound component API

Subcomponents take `project: ProjexProject` (optional on ProjectCard parts):

- **ProjectCard** — `.Header` `.Description` `.Tags` `.Stats` `.Status` `.Links`
- **ProjectView** — `{ project, onBack?, children }`; parts:
  `.Section({ project, name })` with `name` ∈ `description | background | why |
  stack | struggles | timeline | posts | commits`; `.Links` `.Stats` `.Commits`
- **ProjectGrid** / **ProjectList** — `{ children }` wrappers
  (`div[data-projex-grid]` / `div[data-projex-list]`)
- **FeaturedProject** — `{ project }`; hero (image, background, why, stats,
  links); renders nothing for null/undefined
- **GitHubCard** — `{ project?, showForks? = true, statsComponent?, children? }`
- **NpmCard** / **ShowcaseCard** — compound (`.Header`, `.Description`, ...)
- Also exported from the package (not CLI-copyable): `ProjectSearch`,
  `ProjectSort`, `ProjectFilterBar`, `ProjectFilterTag`,
  `ProjectStatusFilterBar`, `ProjectTypeFilterBar`, `CommitList`.

### Styling hooks

Zero CSS ships by default; every element carries `data-projex-*` attributes.
Main ones: `data-projex-card` (+ `-header`, `-description`, `-tags`, `-tag`,
`-stats`, `-stat`, `-status`, `-status-value`, `-links`, `-link`, `-tagline`),
`-grid`, `-list`, `-view` (+ `-section`, `-section-name`, `-stats`, `-links`),
`-featured` (+ `-image`), `-commit-list` (+ `-commit`, `-message`, `-date`,
`-author`, `-link`), `-search` (+ `-input`), `-sort` (+ `-option`),
`-filter-bar`, `-filter-tag`, `-status-filter-bar`, `-type-filter-bar`,
`-language` (+ `-color`), `-struggle` (+ `-type`), `-timeline-date/-note`,
`-post-title/-date/-link`, `-og-title/-description/-image`.

```css
[data-projex-grid] { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
[data-projex-card] { border: 1px solid #e5e5e5; border-radius: 8px; padding: 1rem; }
```

## 3. Content operations (non-interactive recipes)

All require `projex.config.ts`. "Required" = omitting it triggers a prompt
that cancels in a non-TTY shell.

### add project

```bash
npx @manningworks/projex add project --type <type> --name "<Name>" --status <status> \
  --stack "TypeScript, Next.js" --featured <one type-specific flag> [--description "<text>"]
```

- `id` derives from the name: lowercased, spaces → hyphens
  (`"My Test App"` → `my-test-app`). Duplicates exit 1 (`already exists`).
- **`--stack` is required** even when empty: pass `--stack ""`.
- **`--featured` must be passed explicitly** (no `--no-featured` on `add`).
  Non-featured project: add with `--featured`, then
  `edit project <id> --no-featured`.
- Type-specific flag (required per type):

| `--type` | Required flag |
| --- | --- |
| `github` | `--repo <owner/repo>` |
| `npm` | `--package <pkg>` |
| `hybrid` | `--repo <owner/repo>` AND `--package <pkg>` |
| `product-hunt` | `--slug <slug>` |
| `youtube` | `--channel-id <id>` |
| `gumroad` | `--product-id <id>` |
| `lemonsqueezy` | `--store-id <id>` |
| `devto` | `--username <user>` |
| `manual` | (none) |

Verified example:

```bash
npx @manningworks/projex add project --type github --name "My Test App" \
  --status active --repo user/repo --stack "TypeScript, Next.js" \
  --description "A test project" --featured
# → ✓ Project 'my-test-app' added to projex.config.ts
```

### add learning / challenge / timeline / post

```bash
npx @manningworks/projex add learning <project-id> --text "What I learned"
npx @manningworks/projex add challenge <project-id> --text "Obstacle overcome"
npx @manningworks/projex add timeline <project-id> --date 2026-01-15 --note "First commit"
npx @manningworks/projex add post <project-id> --title "Announcing v1" --date 2026-01-16 --url https://example.com/v1
```

- `<project-id>` must exist, else exit 1 with the valid id list.
- learning + challenge both append to `struggles`
  (`{ type: 'learning'|'challenge', text }`); use `challenge` for obstacles.
- `--date` expects format `YYYY-MM-DD` (prompt-validated; flag values are not checked).
- **`--url` on `add post` is required in practice**: omitting it prompts
  (cancels non-interactively; nothing added).

### edit project

```bash
npx @manningworks/projex edit project <id> --status shipped
npx @manningworks/projex edit project <id> --featured
npx @manningworks/projex edit project <id> --no-featured
npx @manningworks/projex edit project <id> --stack "Rust, Wasm"
npx @manningworks/projex edit project <id> --unset description
```

Flags: `--name --description --status --featured --no-featured --stack --repo
--package --slug --channel-id --product-id --store-id --username --unset
<field>`. Verified rules:

- `--unset <field>` is standalone (exits 1 combined with other flags).
  Protected fields exit 1: `id, type, struggles, timeline, posts`.
- Type-specific flags are validated against the project's type (`--repo` on a
  `manual` project exits 1).
- No flags at all → interactive field picker; never run bare.

### remove

```bash
npx @manningworks/projex remove project <id> --force
npx @manningworks/projex remove learning <id> --index 0
npx @manningworks/projex remove challenge <id> --index 1
npx @manningworks/projex remove timeline <id> --index 0
npx @manningworks/projex remove post <id> --index 0
```

- `remove project` without `--force` asks for confirmation; non-TTY cancels
  (exit 0, project kept). Always pass `--force` from an agent.
- `--index` is 0-based within `struggles` (learning + challenge share it),
  `timeline`, or `posts`; omitting it opens a picker — always pass it.
  Out of range exits 1 with valid bounds.

### list

```bash
npx @manningworks/projex list
# table: (index) | ID | Type | Status | Featured (★) | Name
```

No flags. Use it to discover ids before edit/remove. The table is rendered
with Node's `console.table`, which auto-prepends the leading `(index)` column
and single-quotes string cell values (`'manual-demo'`, `'★'`, `'-'`) — strip
the quotes when parsing.

## 4. `projex.config.ts` field reference

File: `projex.config.ts` at the project root. Shape:

```ts
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  /* project entries */
], {
  commits: 3,                // recent commits to fetch for github/hybrid (default 0)
  fetchNpmTimestamps: false, // fetch npm createdAt/updatedAt for date sorting
  onError: 'throw',          // 'throw' | 'warn' | 'silent' (default: 'warn') — data-fetch error policy
})
```

The export is `{ projects, options }`, **not an array**. The CLI requires a
`defineProjects([...])` call (it edits that array; ids must be string
literals).

### Per-type required fields

| `type` | Required | Optional type-specific |
| --- | --- | --- |
| `github` | `id`, `status`, `repo: 'owner/repo'` | `commits?: number`, `useGithubLinkFromRepo?: boolean` (default true), `useLiveLinkFromRepo?: boolean` (default true) |
| `manual` | `id`, `status` | — |
| `npm` | `id`, `status`, `package` | — |
| `hybrid` | `id`, `status`, `repo`, `package` | same github options as `github` |
| `product-hunt` | `id`, `status`, `slug` | — |
| `youtube` | `id`, `status`, `channelId` | — |
| `gumroad` | `id`, `status`, `productId` | — |
| `lemonsqueezy` | `id`, `status`, `storeId` | — |
| `devto` | `id`, `status`, `username` | — |

### Common fields (all types)

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Unique; referenced by edit/remove. |
| `status` | see below | Required. |
| `featured` | `boolean` | Featured projects render in the hero section. |
| `name` / `tagline` / `description` | `string` | Display name, one-liner, description. |
| `background` / `why` | `string` | **String or absent — `null` fails validation.** |
| `image` | `string` | URL/path; used by FeaturedProject. |
| `stack` | `string[]` | Tech tags. |
| `struggles` | `{ type: 'challenge' \| 'learning', text: string }[]` | via `add learning/challenge`. |
| `timeline` | `{ date: string, note: string }[]` | via `add timeline`. |
| `posts` | `{ title: string, date: string, url?: string }[]` | `url` must be a valid URL when present. |
| `links` | object | Optional URL strings: `github`, `live`, `npm`, `docs`, `demo`, `appStore`, `playStore`, `productHunt`; plus `custom: { label, url }[]`. |
| `linkOrder` | `string[]` | Reorder rendered links; keys: `github, live, docs, demo, npm, productHunt, youtube, custom`. |
| `stats` | object | Manual overrides, all optional: `stars?` (number), `forks?` (number), `downloads?` (string), `version?` (string), `upvotes?` (number), `comments?` (number), `launchDate?` (string). Provider stats are fetched automatically. |
| `createdAt` / `updatedAt` | `string` | |
| `override` | `{ name?, tagline?, description?, stack? }` | Override fetched values. |

**Statuses (lifecycle):** `active`, `shipped`, `in-progress`, `coming-soon`,
`archived`, `for-sale`.

Full entry:

```ts
{
  id: 'my-awesome-lib',
  type: 'github',
  repo: 'yourusername/my-awesome-lib',
  status: 'active',
  featured: true,
  name: 'My Awesome Lib',
  tagline: 'Does the thing',
  description: 'A library that does the thing well.',
  background: 'The story behind the project.',
  why: 'Why you built it.',
  stack: ['TypeScript', 'React', 'Next.js'],
  links: { live: 'https://example.com', docs: 'https://example.com/docs' },
  struggles: [{ type: 'learning', text: 'Hard won insight.' }],
  timeline: [{ date: '2026-01-15', note: 'First commit' }],
  posts: [{ title: 'Announcing v1', date: '2026-01-16', url: 'https://example.com/v1' }],
}
```

## 5. Provider environment variables

Read by the data-fetching layer when the page renders/builds — **set them in
your build environment** (`.env.local` locally, CI secrets for deploys).

| Variable | Required? | Unlocks | Where to create |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | optional (strongly recommended) | 5000 req/hr instead of 60 (shared, per-IP); `init --github`; stars/forks/commits | Fine-grained PAT at `github.com/settings/personal-access-token/new`; Contents read-only, only your referenced repos |
| `DEV_TO_API_KEY` | optional | Dev.to `totalViews`; without it views are 0 | `dev.to/settings/extensions` |
| `PRODUCT_HUNT_TOKEN` | required for `product-hunt` | Upvotes, comments, launch date | `api.producthunt.com` (OAuth application token) |
| `YOUTUBE_TOKEN` | required for `youtube` | Subscribers, views, latest video | Google Cloud Console; enable "YouTube Data API v3"; 10,000 units/day, fetch ≈ 2 units |
| `GUMROAD_TOKEN` | required for `gumroad` | Revenue, sales, subscribers | `app.gumroad.com/settings/api_tokens` |
| `LS_TOKEN` | required for `lemonsqueezy` | MRR, orders, customers | `app.lemonsqueezy.com/settings/api` |

**Naming trap:** LemonSqueezy's variable is `LS_TOKEN`, not
`LEMONSQUEEZY_TOKEN`.

## 6. Troubleshooting

**`ERR_MODULE_NOT_FOUND` on the first CLI command (e.g. `Cannot find package 'commander'`).** The published `@manningworks/projex` declares its CLI runtime deps (`commander`, `ts-morph`, `chalk`, `@inquirer/prompts`) as *optional* `peerDependencies`, so npm/npx do not install them and the first command crashes before it runs. Fix: `npm install commander ts-morph chalk @inquirer/prompts` (install the package's declared `peerDependencies`; do not pin versions), or run from a source build (`pnpm build`) where the peers are present.

**`Validation failed ... Expected string, received null` after `init --github`.**
Generated entries contain `background: null` / `why: null`, but the schema
accepts only strings (or absence). Delete those lines from every generated
entry. Verified: config then validates and `normalise()` fetches data.

**`✖ Cancelled.` with exit code 0.** An interactive prompt was reached and
aborted non-interactively; nothing changed. Add the missing flags per section
3 (`--stack`, `--featured`, `--url`, `--index`, `--force`) and re-run.

**`init` reports `✖ Failed to create projex.config.ts` but the file exists.**
The auto-install step (bare `npm install @manningworks/projex`, no
`--legacy-peer-deps`) threw — e.g. a peer-dependency conflict
(`react@19` vs `next@15.0.0` → `ERESOLVE`). The config is written before the
install attempt: check it, then install the package yourself
(`pnpm add @manningworks/projex`) and re-run what you need.

**`init --github` found no repos / wrong user.** Unauthenticated GitHub sees
only public repos; a `404` also means *private* repo (no token). Set
`GITHUB_TOKEN` (fine-grained PAT, Contents read, repo-scoped) for private
repos. `init --github -y` uses `git config user.name` as the username — if
that is a full name, `git config user.name <handle>` first.

**GitHub rate limit (`403` / `rate_limit`).** 60 req/hr unauthenticated (per
IP); 5000/hr with `GITHUB_TOKEN`. Builds warn when no token is set; set the
token and rebuild.

**`projex add <component>` copies only `.d.ts` files.** Known bug in the
published package: the copy filter matches `.tsx`/`.ts`, but the shipped dist
has `.js` + `.d.ts` — `components/projex/<Name>/` ends up with no runtime code
and `import ... from './components/projex/<Name>'` fails at build. Use
`import { ... } from '@manningworks/projex'` (verified; 53 exports incl.
`ProjectCard`, `ProjectView`, `ProjectGrid`, `FeaturedProject`, `normalise`,
`defineProjects`).

**`import '@manningworks/projex'` fails outside a bundler.** The package is
ESM-only (`exports["."]` has an `import` condition only, no
`require`/`default`) and its internals use directory imports. Raw
`node`/CJS cannot load it; Next.js resolves it fine. Don't debug in raw Node.

**`projex.config.ts not found. Run 'projex init' first.`** — run
`npx @manningworks/projex init -y` in the project root.

**`Could not find defineProjects() call in config file`** — the CLI only edits
configs shaped `export const projects = defineProjects([...])`; wrap a hand
written array in `defineProjects(...)`.

**`Project ID 'x' already exists.`** — ids derive from `--name`; pick another
name or edit the existing project.

**`Project 'x' not found. Valid IDs: ...`** — the error lists valid ids; also
`npx @manningworks/projex list`.

**`Invalid learning/timeline/post index N`** — 0-based, bounded by array
length; learning and challenge share the `struggles` array.

**`'field' is not a valid field for type '<type>'` (edit)** — type-specific
flags must match the project's declared type (section 4 table).

## Drift baseline

Every flag and example was verified against the live CLI (`--help` + source)
of `@manningworks/projex` v1.6.0 on 2026-10-12. Full raw `--help` capture for
all commands: [`references/cli-help.md`](references/cli-help.md). Re-capture
after any CLI change (`pnpm build`, then run each command with `--help`) and
diff before shipping docs.
