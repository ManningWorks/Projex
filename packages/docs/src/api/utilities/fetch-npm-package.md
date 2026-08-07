# fetchNpmPackage

Fetch package data from the npm registry.

## Signature

```tsx
function fetchNpmPackage(packageName: string): Promise<FetchNpmResult>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| packageName | `string` | npm package name |

## Returns

`Promise<FetchNpmResult>` - Result object with data or error

## Types

```tsx
interface FetchNpmResult {
  data: NpmPackageData | null
  error: FetchNpmError | null
}

interface FetchNpmError {
  type: FetchNpmErrorType
  message: string
}

type FetchNpmErrorType = 'not_found' | 'network' | 'other'

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
- Returns `{ data: null, error }` on any error
- `createdAt` and `modifiedAt` are populated from npm registry `time` metadata
- These timestamps require `fetchNpmTimestamps: true` in `defineProjects` options to be used for sorting

## Example

```tsx
import { fetchNpmPackage } from '@manningworks/projex'

const { data, error } = await fetchNpmPackage('react')

if (data) {
  console.log(data.version)   // '19.0.0'
  console.log(data.downloads) // Monthly downloads
} else if (error) {
  console.error(error.message)
}
```

## Error Handling

The function never throws - it returns `{ data: null, error }` for any failure:

```tsx
const { data, error } = await fetchNpmPackage('@scope/nonexistent-package')
// data is null, error.type is 'not_found'
```

### Error Codes

| Error Type | Description |
|-----------|-------------|
| `not_found` | Package not found (404) |
| `network` | Network error or request failed |
| `other` | Unknown error or no latest version found |

## Usage in normalise

This function is called internally by `normalise` and `fetchProjectData` for `npm` and `hybrid` project types:

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
