# Publishing @manningworks/projex

## Current Setup: npm-publish

The workflow uses [JS-DevTools/npm-publish](https://github.com/marketplace/actions/npm-publish) which:
- Publishes directly to npm on every push to `main` branch
- Creates GitHub releases when publishing succeeds
- Works with OIDC or NPM token
- More actively maintained than npm-publish-action

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

**IMPORTANT**: Since `@manningworks/projex` is a scoped package, npm defaults to restricted access. The workflow must explicitly set `access: public` to publish publicly.

### Step 3: Publish

To publish a new version:

1. Update the version in `packages/core/package.json`
2. Commit the change with a message like "Release 1.0.1"
3. Push to the `main` branch

The workflow will automatically:
- Publish to npm
- Create a GitHub release

**Note**: The workflow runs on every push to `main`, so you must actually update the version in `package.json` for it to publish.

## Troubleshooting

### Error: "404 Not Found" or "package not found"

**Cause**: Package doesn't exist on npm yet.

**Solution**: The first publish will create the package. Make sure NPM_TOKEN is set.

### Error: "E401 Unauthorized" or "need auth"

**Cause**: NPM_TOKEN secret not set or expired.

**Solution**:
- Check secret exists at: https://github.com/ManningWorks/Projex/settings/secrets/actions
- Regenerate token if expired

### Error: "No package published"

**Cause**: Version didn't actually change in `package.json`.

**Solution**: Update the version in `packages/core/package.json` and commit the change. The workflow publishes on every `main` push, so the version must actually change.
