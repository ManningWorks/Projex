Folio is a shadcn-style component library for building developer portfolio pages. Drop in pre-built project cards that auto-fetch data from GitHub, npm, and Product Hunt — no API glue required. Built for Next.js. Zero CSS shipped by default.

**Open-source (MIT licensed) and free to use.**

[See real world examples →](./guides/real-world-examples)

## Quick Start

```bash
npx @reallukemanning/folio init --github
```

Enter your GitHub username when prompted. Folio automatically fetches your public repositories and generates a `folio.config.ts` file pre-populated with all your projects.

### Quick Start Checklist

- [ ] **Initialize project** — Run `npx folio init --github` to create your config
- [ ] **Install dependencies** — Run `pnpm install` to install Folio package
- [ ] **Add components** — Run `npx folio add project-card` to add components
- [ ] **Add styling** — Run `npx folio add theme-minimal` for a theme, or add custom CSS
- [ ] **Update config** — Edit `folio.config.ts` with your projects
- [ ] **Import components** — Import and use components in your Next.js pages
- [ ] **Build and deploy** — Run `pnpm build` to generate your portfolio

[Continue → Getting Started](./guides/getting-started)

## How Folio works

- **Copy-paste components** — Run `npx folio add project-card` to get the source code. You own it.
- **Style with data attributes** — Target elements like `[data-folio-card]` or use pre-built themes.
- **Fetch data at build time** — GitHub, npm, Product Hunt data is fetched when your site builds. No runtime API calls, no rate limits at runtime, fresh data on every rebuild.

## The API

Folio uses compound components for maximum flexibility:

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

Each part is optional. Use only what you need, compose your own layout.

## Who is Folio for?

**OSS maintainers** — Auto-detect all your GitHub repositories with `npx folio init --github`. Stars, forks, and language data populate automatically.

**Freelancers** — Showcase client work with manual projects. Full control over descriptions, tags, and links. Mix with GitHub repos for open source contributions.

**SaaS founders** — Display Product Hunt launches with upvotes and comments. Track multiple products in one place.

**Junior developers** — Build your first portfolio with npm packages and personal projects. Start small, scale as you grow.

**Solo entrepreneurs** — Mix GitHub, npm, Product Hunt, and manual projects. One config for everything you ship.

[Choose your path → Getting Started](./guides/getting-started)

## Built with Folio

Portfolios using Folio in production:

- [lukemanning.ie](https://lukemanning.ie) — Personal portfolio showcasing open source projects and npm packages

[See more real world examples →](./guides/real-world-examples)

---

# About Folio

Folio is built and maintained by [Luke Manning](https://lukemanning.ie), a solo developer building tools for developers who ship small products and open source projects.

**Active development** — Folio is actively maintained. Check [GitHub commits](https://github.com/RealLukeManning/Folio/commits/main) for recent activity.

**Version history** — See the [CHANGELOG](https://github.com/RealLukeManning/Folio/blob/main/CHANGELOG.md) for detailed release notes and [GitHub Releases](https://github.com/RealLukeManning/Folio/releases) for all published versions.

**Why Folio exists** — No existing solution handled the reality of a solo developer's project mix: GitHub repos, npm packages, Product Hunt launches, and client work all in one place. Folio lets you showcase everything without fighting your tools.

---

# Next Steps

- [Getting Started Tutorial](/guides/getting-started) — Build a complete portfolio step-by-step
- [Guides](/guides/) — All available guides and tutorials
- [Examples](/examples/) — Code examples and complete implementations
- [Component Reference](./api/components/) — All available components
- [Utilities](./api/utilities/) — Filtering, sorting, and more
