# Fetch Strategy

Folio is designed for **build-time data fetching**. All remote data (GitHub, npm, Product Hunt) is fetched when your site builds.

## Why Build-Time?

Build-time fetching means your site is fully static. All data from GitHub, npm, and Product Hunt is fetched once when your site builds, then embedded in the HTML. When visitors load your portfolio, the data is already there — no API calls needed.

**The alternative (client-side fetching):** Your site calls GitHub/npm APIs in the browser. Every visitor triggers API requests, hitting rate limits and slowing down page loads. GitHub allows only 60 requests/hour unauthenticated — your portfolio would break after a few visitors.

**Why build-time is better for portfolios:**
- **No rate limits for visitors** — API calls happen at build time (your CI/CD), not when users visit
- **Instant page loads** — No client-side API calls, no loading spinners
- **Free hosting** — Works on Vercel, Netlify, GitHub Pages — any static host
- **Search-friendly** — Pre-rendered HTML is great for SEO

**The tradeoff:** Data updates when you rebuild your site, not in real-time. If you push a new GitHub commit, your portfolio shows the updated star count after your next build. For portfolios, this is fine — rebuilding on deploy is fast and automatic.

## Authentication

For GitHub, set `GITHUB_TOKEN` to increase rate limits from 60/hr to 5,000/hr:

```bash
GITHUB_TOKEN=github_pat_xxx pnpm build
```

We recommend using a **fine-grained personal access token** for better security:

1. Go to [github.com/settings/personal-access-token/new](https://github.com/settings/personal-access-token/new)
2. Select **Fine-grained** token type
3. Set permissions: **Contents** (Read-only)
4. Select **Only select repositories** and choose your portfolio repos
5. For expiration, we recommend **no expiration** for CI/CD (token only reads public data)

**Why fine-grained?**
- Scoped to specific repos only
- Read-only access (no write permissions)
- Can be revoked independently of other tokens

### Environment Variables

Folio fetches data at build time using environment variables:

| Variable | Purpose | Required |
|----------|-----------|------------|
| `GITHUB_TOKEN` | GitHub API authentication | Optional (recommended) |
| `PRODUCT_HUNT_TOKEN` | Product Hunt API access | Optional (if using product-hunt type) |

## Caching

The `normalise` function uses `cache: 'force-cache'` which caches responses for the build duration. For fresh data, rebuild your site.

> **Note:** Using private repos or hitting rate limits? See the [Troubleshooting guide](./troubleshooting) for solutions.
