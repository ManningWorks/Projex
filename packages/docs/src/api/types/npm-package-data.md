# NpmPackageData

Interface for npm API response data.

## Definition

```tsx
interface NpmPackageData {
  name: string
  version: string
  downloads: number
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Package name |
| `version` | `string` | Latest version |
| `downloads` | `number` | Monthly download count |

## Usage

```tsx
import { fetchNpmPackage } from '@reallukemanning/folio'
import type { NpmPackageData } from '@reallukemanning/folio'

const data: NpmPackageData | null = await fetchNpmPackage('react')

if (data) {
  console.log(data.version)
  console.log(data.downloads)
}
```

## Export

```tsx
import type { NpmPackageData } from '@reallukemanning/folio'
```

## API Sources

Data is fetched from:
- Downloads: `https://api.npmjs.org/downloads/point/last-month/{package}`
- Metadata: `https://registry.npmjs.org/{package}`
