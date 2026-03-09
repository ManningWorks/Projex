# @manningworks/projex

![Banner](https://raw.githubusercontent.com/ManningWorks/Projex/main/assets/projex_banner.svg)

Show Everything You Ship

A shadcn-style component library for building developer portfolio pages. Drop in pre-built project cards that auto-fetch data from GitHub, npm, and Product Hunt — no API glue required. Built for Next.js. Zero CSS shipped by default.

## Why use Projex?

**Auto-discover your GitHub repos** — Run `npx projex init --github` to auto-detect all your public repos and generate a pre-populated config file.

**Zero runtime API calls** — All data fetched at build time. No rate limits at runtime, fresh data on every rebuild.

**Mix project types in one place** — GitHub repos, npm packages, Product Hunt launches, client work, side projects — all managed from a single config file.

**Copy-paste components, you own the code** — Components are copied into your project (not installed as a dependency). Customize, refactor, or extend anything.

**Style with data attributes** — Target elements like `[data-projex-card]` or use pre-built themes. Zero opinions, full control.

## Quick Start

```bash
# Auto-discover your GitHub repos
npx projex init --github

# Add components to your project
npx projex add project-card

# Add a pre-built theme
npx projex add theme-minimal
```

```tsx
import { ProjectCard } from '@manningworks/projex'
import { projects } from './projex.config'

export function ProjectsGrid() {
  return (
    <div>
      {projects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectCard.Header project={project} />
          <ProjectCard.Description project={project} />
          <ProjectCard.Stats project={project} />
          <ProjectCard.Links project={project} />
        </ProjectCard>
      ))}
    </div>
  )
}
```

## Documentation

[Full Documentation →](https://projex-guide.vercel.app)

## CLI Reference

```bash
# Initialize with auto GitHub discovery
npx projex init --github

# Copy components to your project
npx projex add project-card
npx projex add project-view

# Add pre-built themes
npx projex add theme-minimal
npx projex add theme-dark
npx projex add theme-gradient
```

The CLI automatically installs the `@manningworks/projex` package as a dependency, and copied components import types directly from it.

## Project Types Supported

- **GitHub** — Auto-fetch stars, forks, language, topics
- **npm** — Display downloads, version, package info
- **Product Hunt** — Show upvotes, comments, launch date
- **YouTube** — Show subscribers, views, latest video
- **Gumroad** — Display revenue, sales, subscribers
- **Manual** — Full control over client work, side projects
- **Hybrid** — Mix GitHub + npm, or any combination

**Additional types:** Lemon Squeezy (store data), Dev.to (articles)
[View full documentation →](https://projex-guide.vercel.app/guides/project-types)

## Component API

Projex uses compound components for maximum flexibility. Each part is optional — use only what you need:

```tsx
<ProjectCard>
  <ProjectCard.Header project={project} />
  <ProjectCard.Description project={project} />
  <ProjectCard.Tags project={project} />
  <ProjectCard.Stats project={project} />
  <ProjectCard.Status project={project} />
  <ProjectCard.Links project={project} />
</ProjectCard>
```

[View all components →](https://projex-guide.vercel.app/api/components/)

## Styling

Every rendered element has a `data-projex-*` attribute for styling:

```css
/* Target any element */
[data-projex-card] {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
}

/* Target specific states */
[data-projex-status-value="active"] {
  background: #10b981;
  color: white;
}
```

Or use pre-built themes:

```bash
npx projex add theme-minimal
npx projex add theme-dark
npx projex add theme-gradient
```

[Styling guide →](https://projex-guide.vercel.app/guides/styling)

## License

MIT
