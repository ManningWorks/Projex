# Publishing @manningworks/projex

## Current Setup: npm-publish-action

The workflow uses [pascalgn/npm-publish-action](https://github.com/marketplace/actions/publish-to-npm) which automatically:
- Detects version changes in `package.json`
- Creates a git tag
- Publishes to npm
- Creates a GitHub release

This is a simple, all-in-one solution that doesn't require OIDC configuration.

## Setup Steps

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

### Step 3: Publish

To publish a new version:

1. Update the version in `packages/core/package.json`
2. Commit the change with a message like "Release 1.0.1"
3. Push to the `main` branch

The workflow will automatically:
- Create a tag `v1.0.1`
- Publish to npm
- Create a GitHub release

## Why Not OIDC?

OIDC (OpenID Connect) is a more secure method for publishing, but it requires:
- Package already exists on npm
- Additional GitHub Actions permissions configuration
- `npm@11.5.1` to be installed globally

The npm-publish-action is simpler and works for the first publish of a new package without requiring any prior setup.

## Alternative: OIDC Setup (Optional)

If you want to switch to OIDC after the first publish, you can modify the workflow to:

```yaml
on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    permissions:
      id-token: write
      contents: read
    steps:
      - name: Install npm for OIDC
        run: npm install -g npm@11.5.1

      - name: Publish
        run: npm publish --access public --provenance
```

## Troubleshooting

### Error: "404 Not Found" or "package not found"

**Cause**: Package doesn't exist on npm yet.

**Solution**: The first publish will create the package. Make sure NPM_TOKEN is set.

### Error: "E401 Unauthorized" or "need auth"

**Cause**: NPM_TOKEN secret not set or expired.

**Solution**:
- Check secret exists at: https://github.com/ManningWorks/Projex/settings/secrets/actions
- Regenerate token if expired

### Error: "No version changes detected"

**Cause**: package.json version hasn't changed.

**Solution**: Update the version in `packages/core/package.json` and commit the change.
