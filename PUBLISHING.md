# Publishing @manningworks/projex

## First Publish: Use NPM_TOKEN

When publishing for the first time (or after breaking changes to the publish workflow), you must use an NPM token.

### Step 1: Create NPM Automation Token

1. Go to https://www.npmjs.com/settings/tokens
2. Click "Generate New Token"
3. Select "Automation" type
4. Set expiration (recommended: 1 year or "No expiration")
5. Click "Generate Token"
6. **Copy the token** (you won't be able to see it again)

### Step 2: Add NPM_TOKEN Secret to GitHub

1. Go to https://github.com/ManningWorks/Projex/settings/secrets/actions/new
2. Name: `NPM_TOKEN`
3. Secret: Paste your npm automation token
4. Click "Add secret"

### Step 3: Publish Manually

Run from your local machine:

```bash
cd packages/core
npm publish --access public
```

Or push a tag to trigger the workflow (it will use NPM_TOKEN secret).

## Subsequent Publishes: OIDC

After the package has been published once, OIDC will work for future publishes.

### Working OIDC Workflow Configuration

The workflow uses:

```yaml
permissions:
  id-token: write      # Required for OIDC
  contents: read

steps:
  - name: Install npm for OIDC
    run: npm install -g npm@11.5.1

  - name: Publish @manningworks/projex
    working-directory: packages/core
    run: npm publish --access public --provenance
```

### Why OIDC Doesn't Work Initially

OIDC (OpenID Connect) allows GitHub to obtain a short-lived token to publish to npm. However, this only works if:

1. The package **already exists** on npmjs.org
2. The GitHub Actions workflow has `id-token: write` permission
3. The workflow runs `npm install -g npm@11.5.1` to enable OIDC

For a brand new package or scoped package that hasn't been published yet, npm requires explicit authentication (NPM_TOKEN).

## Switching Back to OIDC After First Publish

Once the package exists on npmjs.org:

1. The workflow is already configured for OIDC (see above)
2. Just push a new version tag (e.g., `v1.0.1`)
3. The workflow will use OIDC automatically - no NPM_TOKEN secret needed

## Troubleshooting

### Error: "404 Not Found" or "404 package not found"

**Cause**: Package doesn't exist on npm yet.

**Solution**: Use NPM_TOKEN and publish manually first.

### Error: "E401 Unauthorized" or "need auth"

**Cause**: NPM_TOKEN secret not set or expired.

**Solution**:
- Check secret exists at: https://github.com/ManningWorks/Projex/settings/secrets/actions
- Regenerate token if expired
- Check workflow is using: `npm config set //registry.npmjs.org/:_authToken ${{ secrets.NPM_TOKEN }} && npm publish`

### Error: "Automatic provenance generation not supported"

**Cause**: Using `--provenance` flag with NPM_TOKEN auth method.

**Solution**:
- Remove `--provenance` flag when using NPM_TOKEN
- OR use OIDC (after first publish) which supports provenance

## Current Workflow Status

The workflow at `.github/workflows/publish.yml` is currently configured for OIDC. This is the correct long-term setup.

For the first publish, use NPM_TOKEN method. For all subsequent publishes, OIDC will work automatically.
