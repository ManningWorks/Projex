# Migration Guide

This guide helps you upgrade between versions of Projex and migrate from earlier versions. Follow the instructions for the version you're upgrading from and to.

## Version Policy

Projex follows [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)** — Breaking changes, may require code changes
- **Minor (1.X.0)** — New features, backward compatible
- **Patch (1.0.X)** — Bug fixes, backward compatible

See the [CHANGELOG](https://github.com/ManningWorks/Projex/blob/main/CHANGELOG.md) for detailed release notes.

---

## Table of Contents

- [Project Rename (Folio → Projex)](#project-rename-folio--projex)
- [Upgrading Projex](#upgrading-projex)
- [Common Upgrade Issues](#common-upgrade-issues)
- [Need Help?](#need-help)
- [Staying Updated](#staying-updated)

---

## Project Rename (Folio → Projex)

> **Note:** This section is only for users migrating from the old Folio package. If you're a new user, skip to [Upgrading Projex](#upgrading-projex).

If you were using this library when it was named **Folio**, follow these steps to migrate to **Projex**.

### Package Installation

```bash
# Uninstall old package
pnpm remove @reallukemanning/folio

# Install new package
pnpm add @manningworks/projex
```

### Config File Rename

```bash
mv folio.config.ts projex.config.ts
```

### Import Updates

Update your imports:

```typescript
// Old
import { defineProjects } from '@reallukemanning/folio'
import type { FolioProject, FolioProjectInput } from '@reallukemanning/folio'

// New
import { defineProjects } from '@manningworks/projex'
import type { ProjexProject, ProjexProjectInput } from '@manningworks/projex'
```

### Type Updates

Update all type references in your code:

```typescript
// Old
const project: FolioProject = ...
const input: FolioProjectInput = ...

// New
const project: ProjexProject = ...
const input: ProjexProjectInput = ...
```

### CLI Command Updates

```bash
# Old
npx folio init
npx folio add

# New
npx @manningworks/projex init
npx @manningworks/projex add
```

### CSS Styling Updates

All data attributes have been renamed from `data-folio-*` to `data-projex-*`. Update your CSS selectors:

**Global CSS Replace:**

**Find:** `data-folio-`
**Replace with:** `data-projex-`

Or use command-line tools:

```bash
# Using sed (Linux/Mac)
find . -name "*.css" -o -name "*.scss" | xargs sed -i '' 's/data-folio-/data-projex-/g'

# Using PowerShell (Windows)
Get-ChildItem -Recurse -Include *.css,*.scss | ForEach-Object {
  (Get-Content $_) -replace 'data-folio-', 'data-projex-' | Set-Content $_
}
```

**Common Attribute Changes:**

| Old Attribute | New Attribute |
|--------------|--------------|
| `data-folio-card` | `data-projex-card` |
| `data-folio-card-header` | `data-projex-card-header` |
| `data-folio-card-description` | `data-projex-card-description` |
| `data-folio-card-tags` | `data-projex-card-tags` |
| `data-folio-card-stats` | `data-projex-card-stats` |
| `data-folio-card-links` | `data-projex-card-links` |
| `data-folio-featured` | `data-projex-featured` |
| `data-folio-grid` | `data-projex-grid` |
| `data-folio-list` | `data-projex-list` |
| `data-folio-tag` | `data-projex-tag` |
| `data-folio-link` | `data-projex-link` |
| `data-folio-stat` | `data-projex-stat` |

### URL Updates

Update any documentation or repository URLs:

| Old URL | New URL |
|----------|----------|
| `https://github.com/RealLukeManning/Folio` | `https://github.com/ManningWorks/Projex` |
| `https://folio-guide.vercel.app` | `https://projex.manningworks.dev` |
| `https://www.npmjs.com/package/@reallukemanning/folio` | `https://www.npmjs.com/package/@manningworks/projex` |

---

## ProjectStruggle Type Changes

> **Version:** Latest
> **Impact:** Breaking change for users with `struggles` in their project configurations

The `ProjectStruggle` type has been updated from log-level terminology to semantic content categories that better represent project narratives.

### What Changed

**Old types (log-level terminology):**
- `'warn'` — Warnings or cautionary notes
- `'error'` — Errors or critical issues

**New types (semantic content categories):**
- `'challenge'` — Obstacles or struggles overcome during the project
- `'learning'` — Insights and growth from the project

### Why This Change

The old types (`'warn'` | `'error'`) were borrowed from logging systems and didn't make semantic sense for project showcases. A project portfolio isn't a log file—it's a narrative about your work. The new types (`'challenge'` | `'learning'`) represent the actual content you want to showcase: the obstacles you overcame and the lessons you learned.

### Migration Steps

1. **Search for all struggle definitions in your config:**

   ```bash
   grep -r "struggles:" projex.config.ts
   ```

2. **Update struggle type values:**

   **Before:**
   ```typescript
   {
     id: 'my-project',
     type: 'github',
     repo: 'user/repo',
     status: 'shipped',
     struggles: [
       { type: 'warn', text: 'API rate limits were tight' },
       { type: 'error', text: 'Initial architecture was flawed' },
     ]
   }
   ```

   **After:**
   ```typescript
   {
     id: 'my-project',
     type: 'github',
     repo: 'user/repo',
     status: 'shipped',
     struggles: [
       { type: 'challenge', text: 'API rate limits were tight' },
       { type: 'learning', text: 'Initial architecture was flawed' },
     ]
   }
   ```

3. **Review your content:**

   The new types are semantically different, so consider whether each struggle is better described as:
   - A **challenge** you overcame (something difficult that required effort/solution)
   - A **learning** you gained (insight, growth, or surprising discovery)

   Some `'error'` entries may be better as `'learning'` since they represent something you learned from, not just a technical error.

4. **Update your CSS (if styling struggles):**

   **Before:**
   ```css
   [data-projex-struggle-type="warn"] {
     background: #fef3c7;
   }
   [data-projex-struggle-type="error"] {
     background: #fee2e2;
   }
   ```

   **After:**
   ```css
   [data-projex-struggle-type="challenge"] {
     background: #fef3c7;
   }
   [data-projex-struggle-type="learning"] {
     background: #dbeafe;
   }
   ```

### Type Mapping

| Old Type | New Type | When to Use |
|----------|----------|-------------|
| `'warn'` | `'challenge'` | Obstacles, blockers, difficulties faced |
| `'error'` | `'challenge'` OR `'learning'` | Use `'challenge'` if it was an obstacle to overcome, or `'learning'` if it represents insight gained |

### Example Migration

**Before:**
```typescript
struggles: [
  { type: 'warn', text: 'Limited API calls required smart caching' },
  { type: 'error', text: 'First database design had performance issues' },
  { type: 'warn', text: 'Browser compatibility took extra time' },
]
```

**After:**
```typescript
struggles: [
  { type: 'challenge', text: 'Limited API calls required smart caching' },
  { type: 'learning', text: 'First database design had performance issues—learned the importance of indexing' },
  { type: 'challenge', text: 'Browser compatibility took extra time' },
]
```

Note how the second entry was converted to `'learning'` with a more descriptive text that emphasizes what was learned.

### See Also

- [ProjectStruggle API Reference](../api/types/project-struggle) — Complete type documentation with examples
- [Project Types Guide](./project-types) — Using struggles in project configurations
- [Styling Guide](./styling) — CSS patterns for struggles

---

## Upgrading Projex

### Update the Package

```bash
# Check current version
npm list @manningworks/projex

# Update to latest
pnpm update @manningworks/projex
```

### Update CLI Components

If you copied components using the CLI, re-add them after updating to get the latest versions:

```bash
npx @manningworks/projex add project-card --force
npx @manningworks/projex add project-view --force
```

The `--force` flag overwrites existing files with the latest versions.

---

## Common Upgrade Issues

### Import Errors After Folio → Projex Migration

**Problem:** Cannot find module '@reallukemanning/folio'

**Solution:** Update all import statements:

```typescript
import { defineProjects } from '@manningworks/projex'
```

**Problem:** Type 'FolioProject' not found

**Solution:** Update type names:

```typescript
import type { ProjexProject, ProjexProjectInput } from '@manningworks/projex'
```

### Config File Not Found After Migration

**Problem:** Could not find folio.config.ts

**Solution:** Rename your config file:

```bash
mv folio.config.ts projex.config.ts
```

### Build Errors After Folio Migration

**Problem:** Module not found: Error: Can't resolve '@reallukemanning/folio'

**Solution:**

1. Clear cache and reinstall:
```bash
rm -rf node_modules .next
pnpm install
```

2. Verify all imports are updated to `@manningworks/projex`

3. Rebuild:
```bash
pnpm build
```

### Styles Not Applying After Migration

**Problem:** Styles not applying after Folio → Projex migration

**Cause:** CSS selectors still reference old data attributes.

**Solution:** Run global find and replace in CSS files:

```bash
# Using sed (Linux/Mac)
find . -name "*.css" -o -name "*.scss" | xargs sed -i '' 's/data-folio-/data-projex-/g'
```

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
   npx @manningworks/projex add project-card --force
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
   npx @manningworks/projex add <component-name> --force
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

**Problem:** `npx @manningworks/projex` commands fail after upgrade.

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
    projex init
    ```

---

## Need Help?

If you encounter issues not covered here:

1. Check the [Troubleshooting Guide](./troubleshooting)
2. Review the [CHANGELOG](https://github.com/ManningWorks/Projex/blob/main/CHANGELOG.md)
3. Search [GitHub Issues](https://github.com/ManningWorks/Projex/issues)
4. Open a new issue if the problem isn't documented

---

## Staying Updated

To stay informed about new releases:

- Watch the [GitHub Repository](https://github.com/ManningWorks/Projex)
- Follow [GitHub Releases](https://github.com/ManningWorks/Projex/releases)
- Subscribe to [npm releases](https://www.npmjs.com/package/@manningworks/projex)

Enable Dependabot or Renovate to automatically receive pull requests for updates.
