# Migration Guide

This guide helps you upgrade between versions of Projex. Follow the instructions for the version you're upgrading from and to.

## Version Policy

Projex follows [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)** — Breaking changes, may require code changes
- **Minor (1.X.0)** — New features, backward compatible
- **Patch (1.0.X)** — Bug fixes, backward compatible

See the [CHANGELOG](https://github.com/RealLukeManning/Projex/blob/main/CHANGELOG.md) for detailed release notes.

## Upgrading Projex

### Update the Package

```bash
# Check current version
npm list @manningworks/projex

# Update to latest
pnpm update @manningworks/projex
```

### Update CLI Components

If you copied components using the CLI, re-add them after updating:

```bash
# Re-add components to get latest versions
npx projex add project-card --force
npx projex add project-view --force
```

The `--force` flag overwrites existing files with the latest versions.

---

## Version-Specific Migrations

### Upgrading to 1.7.x

**No migration required** — Version 1.7.1 is a patch release with backward-compatible bug fixes.

**What's new in 1.7.0:** SEO utilities and metadata functions

New features are opt-in and don't require changes to existing code. See [SEO Integration Guide](./seo) for usage.

### Upgrading to 1.6.x

**No migration required** — Version 1.6.0 adds theming system with CSS custom properties.

**What's new:** Pre-built themes and CSS custom properties

The theming system is optional. Your existing CSS will continue to work. To use new features:

```bash
# Add a pre-built theme
npx projex add theme-minimal

# Or use CSS custom properties in your existing styles
:root {
  --projex-card-bg: #ffffff;
  --projex-card-border: #e5e7eb;
}
```

### Upgrading to 1.5.x

**No migration required** — Version 1.5.0 adds preset components.

**What's new:** GitHubCard, NpmCard, ShowcaseCard presets

Presets are new optional components. Existing ProjectCard usage is unchanged. To use presets:

```bash
npx projex add github-card
npx projex add npm-card
npx projex add showcase-card
```

### Upgrading to 1.4.x

**No migration required** — Version 1.4.0 adds search and filter components.

**What's new:** ProjectSearch, ProjectFilterBar, ProjectSort, useProjectSearch, useProjectFilters

New components are optional. Existing filtering/sorting code continues to work.

### Upgrading to 1.3.x

**No migration required** — Version 1.3.0 is an internal refactoring.

**What changed:** Single source of truth for components, CLI auto-installs package

Your code is unchanged. If using CLI-copied components, re-add them:

```bash
npx projex add project-card --force
```

The CLI now installs `@manningworks/projex` automatically if not present.

### Upgrading to 1.2.x

**No migration required** — Version 1.2.0 adds new link types.

**What's new:** `docs` and `demo` link types, custom links, link ordering

New features are opt-in. Existing links continue to work. To use new features:

```ts
{
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active',
  links: {
    github: 'https://github.com/user/repo',
    live: 'https://myapp.dev',
    docs: 'https://docs.myapp.dev', // new
    demo: 'https://demo.myapp.dev', // new
    custom: [ // new
      { label: 'Blog', url: 'https://blog.myapp.dev' }
    ],
    linkOrder: ['github', 'docs', 'demo', 'live'] // new
  }
}
```

### Upgrading to 1.1.x

**No migration required** — Version 1.1.0 adds GitHub commits support.

**What's new:** Commit fetching, CommitList component, commits configuration

New features are opt-in. To enable commits:

```ts
// Global default for all GitHub projects
defineProjects(projects, { commits: 5 })

// Per-project override
{
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active',
  commits: 10 // fetch 10 commits
}
```

### Upgrading to 1.0.x

**No migration required** — Version 1.0.0 is the first stable release.

If upgrading from beta versions:

1. Update the package: `pnpm update @manningworks/projex`
2. Re-add CLI components: `npx projex add project-card --force`
3. Review your `projex.config.ts` for any type changes
4. Check the [CHANGELOG](https://github.com/RealLukeManning/Projex/blob/main/CHANGELOG.md) for breaking changes

---

## Common Upgrade Issues

### TypeScript Errors After Upgrade

**Problem:** TypeScript errors about missing exports or type mismatches.

**Solution:**

1. Clear TypeScript cache:
   ```bash
   rm -rf .next node_modules/.cache
   ```

2. Restart your TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

3. If using CLI-copied components, re-add them:
   ```bash
   npx projex add project-card --force
   ```

### Missing Features After Upgrade

**Problem:** New features from the changelog aren't available.

**Solution:**

1. Ensure you've updated to the latest version:
   ```bash
   pnpm update @manningworks/projex
   ```

2. Verify the version:
   ```bash
   npm list @manningworks/projex
   ```

3. If using CLI-copied components, re-add them to get latest code:
   ```bash
   npx projex add <component-name> --force
   ```

### Build Fails After Upgrade

**Problem:** Build fails after upgrading with errors about missing modules or types.

**Solution:**

1. Clean install dependencies:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

3. Rebuild:
   ```bash
   pnpm build
   ```

### CLI Commands Not Working

**Problem:** `npx projex` commands fail after upgrade.

**Solution:**

1. Clear npx cache:
   ```bash
   npx clear-npx-cache
   # Or manually:
   rm -rf ~/.npm/_npx
   ```

2. Try the full package name:
   ```bash
   npx @manningworks/projex init
   ```

3. If that fails, install globally:
   ```bash
   npm install -g @manningworks/projex
   folio init
   ```

---

## Breaking Changes History

### Version 1.0.0

First stable release. Breaking changes from beta versions:

- Public API stabilized
- Component imports changed from relative paths to package imports
- Type names standardized (e.g., `ProjectStatus`, `ProjectType`)

See [CHANGELOG](https://github.com/RealLukeManning/Projex/blob/main/CHANGELOG.md#100---2026-02-22) for details.

---

## Need Help?

If you encounter issues not covered here:

1. Check the [Troubleshooting Guide](./troubleshooting)
2. Review the [CHANGELOG](https://github.com/RealLukeManning/Projex/blob/main/CHANGELOG.md)
3. Search [GitHub Issues](https://github.com/RealLukeManning/Projex/issues)
4. Open a new issue if the problem isn't documented

---

## Staying Updated

To stay informed about new releases:

- Watch the [GitHub Repository](https://github.com/RealLukeManning/Projex)
- Follow [GitHub Releases](https://github.com/RealLukeManning/Projex/releases)
- Subscribe to [npm releases](https://www.npmjs.com/package/@manningworks/projex)

Enable Dependabot or Renovate to automatically receive pull requests for updates.
