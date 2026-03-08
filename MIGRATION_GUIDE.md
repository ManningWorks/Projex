# Migration Guide

This guide helps you migrate from earlier versions of Projex to newer versions. If you're coming from the old "Folio" library name, see the [Project Rename](#project-rename) section.

---

## Table of Contents

- [Version Updates](#version-updates)
- [Project Rename](#project-rename)
- [Search and Replace Patterns](#search-and-replace-patterns)
- [CSS Styling Changes](#css-styling-changes)
- [Troubleshooting](#troubleshooting)
- [Common Issues and Solutions](#common-issues-and-solutions)

---

## Version Updates

### From v1.0.x to v1.1.x

Check the [CHANGELOG.md](./CHANGELOG.md) for specific version changes and new features.

Generally, upgrade steps are:

```bash
# Update the package
pnpm add @manningworks/projex@latest

# Rebuild if using Next.js
pnpm build
```

---

## Project Rename

If you were using the library when it was named **Folio**, follow these steps to migrate to **Projex**:

### Package Installation

```bash
# Uninstall old package
pnpm remove @reallukemanning/folio

# Install new package
pnpm add @manningworks/projex
```

### Config File Rename

Rename your config file:

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

// New
const project: ProjexProject = ...

// Old
const input: FolioProjectInput = ...

// New
const input: ProjexProjectInput = ...
```

### CLI Command Updates

```bash
# Old
npx folio init
npx folio add

# New
npx projex init
npx projex add
```

### CSS Styling Updates

Update your CSS selectors (see [CSS Styling Changes](#css-styling-changes) below).

---

## Search and Replace Patterns

### Global Package Replacement

Use your IDE's global search and replace:

**Find:** `@reallukemanning/folio`
**Replace with:** `@manningworks/projex`

### Type Replacement

**Find:** `FolioProject`
**Replace with:** `ProjexProject`

**Find:** `FolioProjectInput`
**Replace with:** `ProjexProjectInput`

**Find:** `FolioProjectInputCompat`
**Replace with:** `ProjexProjectInputCompat`

### Config File Reference

**Find:** `folio.config.ts`
**Replace with:** `projex.config.ts`

### CLI Command Reference

**Find:** `npx folio `
**Replace with:** `npx projex `

### Data Attributes

See the [CSS Styling Changes](#css-styling-changes) section for a complete list of data attributes that changed.

---

## CSS Styling Changes

All data attributes have been renamed from `data-folio-*` to `data-projex-*`. Update your CSS selectors accordingly.

### Attribute Mapping

| Old Attribute | New Attribute |
|--------------|--------------|
| `data-folio-card` | `data-projex-card` |
| `data-folio-card-header` | `data-projex-card-header` |
| `data-folio-card-description` | `data-projex-card-description` |
| `data-folio-card-tags` | `data-projex-card-tags` |
| `data-folio-card-stats` | `data-projex-card-stats` |
| `data-folio-card-status` | `data-projex-card-status` |
| `data-folio-card-links` | `data-projex-card-links` |
| `data-folio-card-footer` | `data-projex-card-footer` |
| `data-folio-card-tagline` | `data-projex-card-tagline` |
| `data-folio-view` | `data-projex-view` |
| `data-folio-view-section` | `data-projex-view-section` |
| `data-folio-view-section-name` | `data-projex-view-section-name` |
| `data-folio-view-stats` | `data-projex-view-stats` |
| `data-folio-view-links` | `data-projex-view-links` |
| `data-folio-featured` | `data-projex-featured` |
| `data-folio-featured-image` | `data-projex-featured-image` |
| `data-folio-grid` | `data-projex-grid` |
| `data-folio-list` | `data-projex-list` |
| `data-folio-status` | `data-projex-status` |
| `data-folio-status-value` | `data-projex-status-value` |
| `data-folio-type` | `data-projex-type` |
| `data-folio-type-value` | `data-projex-type-value` |
| `data-folio-struggle` | `data-projex-struggle` |
| `data-folio-struggle-type` | `data-projex-struggle-type` |
| `data-folio-tag` | `data-projex-tag` |
| `data-folio-link` | `data-projex-link` |
| `data-folio-link-type` | `data-projex-link-type` |
| `data-folio-link-label` | `data-projex-link-label` |
| `data-folio-stat` | `data-projex-stat` |
| `data-folio-timeline-date` | `data-projex-timeline-date` |
| `data-folio-timeline-note` | `data-projex-timeline-note` |
| `data-folio-post-title` | `data-projex-post-title` |
| `data-folio-post-date` | `data-projex-post-date` |
| `data-folio-post-link` | `data-projex-post-link` |
| `data-folio-commits` | `data-projex-commits` |
| `data-folio-commits-header` | `data-projex-commits-header` |
| `data-folio-commit` | `data-projex-commit` |
| `data-folio-commit-message` | `data-projex-commit-message` |
| `data-folio-commit-date` | `data-projex-commit-date` |
| `data-folio-commit-link` | `data-projex-commit-link` |
| `data-folio-commit-author` | `data-projex-commit-author` |
| `data-folio-language` | `data-projex-language` |
| `data-folio-language-color` | `data-projex-language-color` |
| `data-folio-og-image` | `data-projex-og-image` |
| `data-folio-og-title` | `data-projex-og-title` |
| `data-folio-og-description` | `data-projex-og-description` |

### CSS Example Updates

```css
/* Old */
[data-folio-card] {
  /* styles */
}

[data-folio-card-description] {
  /* styles */
}

/* New */
[data-projex-card] {
  /* styles */
}

[data-projex-card-description] {
  /* styles */
}
```

### Global CSS Replace

You can use a global find and replace in your CSS/SCSS files:

**Find:** `data-folio-`
**Replace with:** `data-projex-`

---

## Troubleshooting

### Import Errors After Migration

**Error:** `Cannot find module '@reallukemanning/folio'`

**Solution:** Update all import statements to use the new package name:

```typescript
// Check your imports
import { defineProjects } from '@manningworks/projex'
```

**Error:** `Type 'FolioProject' not found`

**Solution:** Update type names:

```typescript
// Check your types
import type { ProjexProject, ProjexProjectInput } from '@manningworks/projex'
```

### CLI Command Not Found

**Error:** `folio: command not found`

**Solution:** Update package.json scripts and use new CLI name:

```json
{
  "scripts": {
    "projects:init": "projex init",
    "projects:add": "projex add"
  }
}
```

### Config File Not Found

**Error:** `Could not find folio.config.ts`

**Solution:** Rename your config file to the new name:

```bash
mv folio.config.ts projex.config.ts
```

### Build Errors

**Error:** `Module not found: Error: Can't resolve '@reallukemanning/folio'`

**Solution:**

1. Clear your cache:
```bash
rm -rf node_modules
rm -rf .next
pnpm install
```

2. Verify all imports are updated to `@manningworks/projex`

3. Rebuild:
```bash
pnpm build
```

### Type Errors

**Error:** `Type 'FolioProject' is not assignable to type 'ProjexProject'`

**Solution:** This error shouldn't occur if you've updated all type references. Check for:

1. Mixed type imports in the same file
2. Type annotations in comments that weren't updated
3. Third-party packages that may reference the old types

---

## Common Issues and Solutions

### Issue: Styles Not Applying After Migration

**Cause:** CSS selectors still reference old data attributes.

**Solution:** Run a global search and replace in your CSS/SCSS files:

```bash
# Using sed (Linux/Mac)
find . -name "*.css" -o -name "*.scss" | xargs sed -i '' 's/data-folio-/data-projex-/g'

# Using PowerShell (Windows)
Get-ChildItem -Recurse -Include *.css,*.scss | ForEach-Object {
  (Get-Content $_) -replace 'data-folio-', 'data-projex-' | Set-Content $_
}
```

### Issue: IDE Autocomplete Shows Old Types

**Cause:** IDE cache or incomplete type updates.

**Solution:**

1. Restart your IDE
2. Clear TypeScript cache:
```bash
rm -rf node_modules/.cache
rm -rf .next/cache
```
3. Restart TypeScript server in your IDE (VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Issue: Tests Failing After Migration

**Cause:** Test files still reference old imports or types.

**Solution:** Update test imports:

```typescript
// test files
import { defineProjects } from '@manningworks/projex'
import type { ProjexProject, ProjexProjectInput } from '@manningworks/projex'
```

### Issue: Documentation Links Broken

**Cause:** Old documentation URLs or GitHub URLs in your project.

**Solution:** Update URLs:

| Old URL | New URL |
|----------|----------|
| `https://github.com/RealLukeManning/Folio` | `https://github.com/ManningWorks/Projex` |
| `https://github.com/reallukemanning/folio` | `https://github.com/manningworks/projex` |
| `https://folio-guide.vercel.app` | `https://projex-guide.vercel.app` |
| `https://docs.folio.dev` | `https://docs.projex.dev` |
| `https://www.npmjs.com/package/@reallukemanning/folio` | `https://www.npmjs.com/package/@manningworks/projex` |

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check the [CHANGELOG.md](./CHANGELOG.md) for version-specific changes
2. Review the [documentation](https://projex-guide.vercel.app)
3. Open an issue on [GitHub](https://github.com/ManningWorks/Projex/issues)

---

**Note:** This migration guide is for future reference. Since Projex was renamed from Folio before the first public release, there are no existing users who need to migrate from the old Folio package. However, this guide serves as documentation for future version upgrades.
