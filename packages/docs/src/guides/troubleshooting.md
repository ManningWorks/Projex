# Troubleshooting

Folio is designed to handle errors gracefully. Here's what to expect and how to handle common issues.

## Error Handling

### GitHub API Rate Limits

The GitHub API has rate limits that affect data fetching:

- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5,000 requests/hour

**Symptoms:**
```
GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit)
```
Projects with `type: 'github'` or `type: 'hybrid'` will return with empty stats (stars, forks).

**Solution:**

Set a GitHub token as an environment variable:

```bash
# .env.local
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxx
```

Create a fine-grained token at [github.com/settings/personal-access-token/new](https://github.com/settings/personal-access-token/new) with **Contents (Read-only)** permission scoped to your portfolio repos.

```bash
# Build with token
pnpm build
```

### Failed API Fetches

If GitHub, npm, or Product Hunt API requests fail, Folio handles it gracefully:

- The `normalise` function returns a project with `stats: null`
- Components with missing stats won't render the stats section
- Your site will still build and render other project data

**Debugging:**

Check build output for warning messages:

```bash
pnpm build
```

Common failures:
- GitHub: Repository not found, private repo without token, rate limit exceeded
- npm: Package not found on registry
- Product Hunt: Invalid slug, missing token

### Private Repositories

Private GitHub repositories require authentication:

```bash
GITHUB_TOKEN=github_pat_xxx pnpm build
```

The token must have **Contents (Read-only)** permission for the repository. When creating a fine-grained token, ensure private repos are included in the repository selection.

**Without authentication:**
- Private repos return `null` from `fetchGitHubRepo`
- Project stats will be empty
- Other project data (name, description from config) still renders

### Missing Environment Variables

Folio fetches data at build time using environment variables:

| Variable | Purpose | Required |
|----------|-----------|------------|
| `GITHUB_TOKEN` | GitHub API authentication | Optional (recommended) |
| `PRODUCT_HUNT_TOKEN` | Product Hunt API access | Optional (if using product-hunt type) |

**Missing variables:**
- Folio logs a warning
- Falls back to unauthenticated requests
- Continues to build (may hit rate limits)

### Build Failures

If your build fails:

1. **Check environment variables:**
   ```bash
   echo $GITHUB_TOKEN
   ```

2. **Verify project config:**
   - Check repo format: `username/repo`
   - Check package name exists on npm
   - Verify GitHub repos are public (or you have a token)

3. **Review build logs:**
   - Look for rate limit warnings
   - Check for network errors
   - Verify all projects have required fields

4. **Test individual projects:**
   Create a minimal config with one project to isolate the issue:
   ```ts
   export const projects = defineProjects([
     { id: 'test', type: 'github', repo: 'username/repo', status: 'active' }
   ])
   ```

### Fallback Strategies

For mission-critical data:

**Override API data:**

```ts
{
  id: 'my-project',
  type: 'github',
  repo: 'username/repo',
  status: 'active',
  override: {
    name: 'Custom Name',
    description: 'Custom description',
    stats: { stars: 1000, forks: 50 }
  }
}
```

**Use manual type for full control:**

```ts
{
  id: 'manual-project',
  type: 'manual',
  status: 'shipped',
  name: 'My Project',
  description: 'Full control over data',
  stats: { stars: 999, forks: 42 }
}
```

## Common Issues

### Component Not Rendering

**Symptom:** Component renders nothing

**Solutions:**
- Check if `project.description` is empty - `ProjectCard.Description` returns null
- Verify `project.stack` has values - `ProjectCard.Tags` returns null if empty
- Ensure `project.stats` has values - `ProjectCard.Stats` returns null if empty

### Types Not Found

**Symptom:** TypeScript error "Cannot find module" or "Cannot find name"

**Solutions:**
- Using CLI: Components are copied to `components/folio/<ComponentName>/` with types in `components/folio/types.ts`
- Using npm package: Import from `@reallukemanning/folio` package
- Check TypeScript config includes component directory

### Build Not Updating Data

**Symptom:** Changes to project config don't appear on site

**Solutions:**
- GitHub/npm data is cached at build time - rebuild site to refresh
- Clear build cache: `rm -rf .next` (Next.js) then rebuild
- Check environment variables are set for build: `GITHUB_TOKEN=xxx pnpm build`

### CLI Command Not Found

**Symptom:** `folio: command not found`

**Solutions:**
- Use `npx @reallukemanning/folio <command>` - no installation required
- Or install the package first: `pnpm add @reallukemanning/folio` then use `npx folio <command>`
- Or install globally: `npm install -g @reallukemanning/folio`
- Check Node.js version: `node --version` (requires 18+)
