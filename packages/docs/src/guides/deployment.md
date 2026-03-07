# Deploying Your Portfolio

Deploy your Folio portfolio to popular hosting platforms with build-time data fetching.

## GitHub Actions Workflow

Automated builds with GitHub API authentication:

```yaml
# .github/workflows/deploy-portfolio.yml
name: Deploy Portfolio

on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    # Rebuild daily at 2 AM UTC to fetch fresh GitHub stats
    - cron: '0 2 * * *'
  repository_dispatch:
    types: [folio-rebuild]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Build with GitHub token
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

### Setting Up Secrets

1. **GITHUB_TOKEN**: GitHub provides this automatically
   - No setup needed if using the default `secrets.GITHUB_TOKEN`
   - For personal repos with many projects, create a fine-grained token:
     - Go to Settings → Developer settings → Personal access tokens
     - Create token with Contents: Read-only permission
     - Add as `GITHUB_TOKEN` in repo secrets

2. **Vercel credentials**:
   ```bash
   vercel login
   vercel link
   ```
   - Copy token from `~/.vercel/project.json`
   - Add as `VERCEL_TOKEN` in repo secrets
   - Add `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` from same file

### Auto-Rebuild Triggers

**Daily rebuilds** (already in workflow above):
```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

**Rebuild on GitHub activity**:
```yaml
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'
  watch:
    types: [started]
```

**Manual trigger**:
```bash
gh workflow run deploy-portfolio.yml
```

**Webhook trigger** (for external systems):
```yaml
on:
  repository_dispatch:
    types: [folio-rebuild]
```
Trigger with:
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/owner/repo/dispatches \
  -d '{"event_type":"folio-rebuild"}'
```

## Platform-Specific Deployment

### Vercel

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "env": {
    "GITHUB_TOKEN": "@github-token"
  }
}
```

**Environment variables**:
1. Go to Project Settings → Environment Variables
2. Add `GITHUB_TOKEN` with your GitHub PAT
3. Add any other tokens (`PRODUCT_HUNT_TOKEN`, etc.)

**Automatic rebuilds**:
- Vercel automatically rebuilds on git push
- For scheduled rebuilds, use GitHub Actions workflow above

### Netlify

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
```

**Environment variables**:
1. Site settings → Environment variables
2. Add `GITHUB_TOKEN`, `PRODUCT_HUNT_TOKEN`, etc.

**Scheduled rebuilds**:
- Site settings → Build & deploy → Continuous Deployment
- Add scheduled build (e.g., daily at 2 AM UTC)

### GitHub Pages

```yaml
# .github/workflows/deploy-github-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm build

      - name: Export static site
        run: pnpm export  # Requires 'output: export' in next.config.js

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Next.js config**:
```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
export default nextConfig
```

**Environment variables**:
- Repo Settings → Secrets and variables → Actions
- Add `GITHUB_TOKEN` as repository secret

### Cloudflare Pages

```yaml
# .github/workflows/deploy-cloudflare.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: pnpm build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .next --project-name=your-portfolio
```

**Environment variables**:
- Dashboard → Pages → Settings → Environment variables
- Add `GITHUB_TOKEN`, `PRODUCT_HUNT_TOKEN`, etc.

## Comparing Platforms

| Platform | Auto-rebuild on push | Scheduled rebuilds | Environment variables | Static export |
|----------|---------------------|-------------------|---------------------|--------------|
| Vercel | ✓ | Via GitHub Actions | ✓ | Optional |
| Netlify | ✓ | ✓ Native | ✓ | Optional |
| GitHub Pages | ✓ | Via GitHub Actions | ✓ | Required |
| Cloudflare Pages | ✓ | ✓ Native | ✓ | Optional |

## Troubleshooting

### GitHub rate limit exceeded

**Error**: `GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit)`

**Solutions**:
1. Add `GITHUB_TOKEN` to platform environment variables
2. Use fine-grained PAT scoped to specific repos
3. Reduce rebuild frequency (daily instead of hourly)

### Build fails with API errors

**Error**: Failed to fetch GitHub repository data

**Solutions**:
1. Verify token has `Contents: Read-only` permission
2. Check repository is public or token has access
3. Ensure repos in `folio.config.ts` exist

### Missing data after deployment

**Error**: Projects show null stats or missing data

**Solutions**:
1. Check build logs for API errors
2. Verify environment variables are set
3. Manually trigger rebuild with debug logging

## Best Practices

1. **Use fine-grained PATs** - Scope tokens to specific repos
2. **Set no expiration for CI/CD** - Tokens used for builds don't need rotation
3. **Schedule daily rebuilds** - Fresh stats without excessive API calls
4. **Monitor build logs** - Watch for rate limits or API errors
5. **Test locally first** - `GITHUB_TOKEN=xxx pnpm build` before deploying
