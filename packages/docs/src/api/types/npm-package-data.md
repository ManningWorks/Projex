# NpmPackageData

Interface for npm API response data.

## Definition

```tsx
interface NpmPackageData {
  name: string
  version: string
  downloads: number
  createdAt?: string
  modifiedAt?: string
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Package name |
| `version` | `string` | Latest version |
| `downloads` | `number` | Monthly download count |
| `createdAt` | `string \| undefined` | When package was first published (ISO 8601) |
| `modifiedAt` | `string \| undefined` | When package was last updated (ISO 8601) |

## Usage

```tsx
import { fetchNpmPackage } from '@manningworks/projex'
import type { NpmPackageData } from '@manningworks/projex'

const data: NpmPackageData | null = await fetchNpmPackage('react')

if (data) {
  console.log(data.version)
  console.log(data.downloads)
}
```

## Export

```tsx
import type { NpmPackageData } from '@manningworks/projex'
```

## API Sources

Data is fetched from:
- Downloads: `https://api.npmjs.org/downloads/point/last-month/{package}`
- Metadata: `https://registry.npmjs.org/{package}`
