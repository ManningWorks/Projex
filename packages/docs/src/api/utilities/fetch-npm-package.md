# fetchNpmPackage

Fetch package data from the npm registry.

## Signature

```tsx
function fetchNpmPackage(packageName: string): Promise<NpmPackageData | null>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| packageName | `string` | npm package name |

## Returns

`Promise<NpmPackageData | null>` - Package data or `null` on error

## Types

```tsx
interface NpmPackageData {
  name: string
  version: string
  downloads: number
  createdAt?: string
  modifiedAt?: string
}
```

## Behavior

- Fetches from npm registry and downloads API in parallel
- Uses `force-cache` for build-time caching
- Returns `null` on any error
- `createdAt` and `modifiedAt` are populated from npm registry `time` metadata
- These timestamps require `fetchNpmTimestamps: true` in `defineProjects` options to be used for sorting

## Example

```tsx
import { fetchNpmPackage } from '@manningworks/projex'

const data = await fetchNpmPackage('react')

if (data) {
  console.log(data.version)   // '19.0.0'
  console.log(data.downloads) // Monthly downloads
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchNpmPackage('@scope/nonexistent-package')
// data is null
```

## Usage in normalise

This function is called internally by `normalise` for `npm` and `hybrid` project types:

```tsx
// normalise calls fetchNpmPackage internally
const project = await normalise({
  id: 'my-package',
  type: 'npm',
  package: 'my-npm-package',
  status: 'shipped'
})
```

## API Endpoints

The function queries two npm endpoints:

1. `https://api.npmjs.org/downloads/point/last-month/{package}` - Download counts
2. `https://registry.npmjs.org/{package}` - Package metadata
