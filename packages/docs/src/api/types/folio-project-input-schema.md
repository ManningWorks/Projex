# folioProjectInputSchema & FolioProjectInputZod

Zod validation schema for `FolioProjectInput` configuration. Provides runtime type checking for project configurations.

## folioProjectInputSchema

Zod schema object for validating project configurations.

### Definition

```tsx
import { z } from 'zod'

export const folioProjectInputSchema: z.ZodDiscriminatedUnion<
  'type',
  [
    z.ZodObject<GitHubProjectInput, ...>,
    z.ZodObject<ManualProjectInput, ...>,
    z.ZodObject<NpmProjectInput, ...>,
    z.ZodObject<ProductHuntProjectInput, ...>,
    z.ZodObject<YouTubeProjectInput, ...>,
    z.ZodObject<GumroadProjectInput, ...>,
    z.ZodObject<LemonSqueezyProjectInput, ...>,
    z.ZodObject<DevToProjectInput, ...>,
    z.ZodObject<HybridProjectInput, ...>
  ]
>
```

### Validation Rules

#### Base Fields

| Field | Type | Required | Validation |
|-------|------|----------|-------------|
| id | `string` | Yes | Non-empty string |
| status | `ProjectStatus` | Yes | Must be one of: `active`, `shipped`, `in-progress`, `coming-soon`, `archived`, `for-sale` |
| featured | `boolean` | No | Optional boolean |
| name | `string` | No | Optional string |
| tagline | `string` | No | Optional string |
| description | `string` | No | Optional string |
| background | `string` | No | Optional string |
| why | `string` | No | Optional string |
| image | `string` | No | Optional string |
| struggles | `ProjectStruggle[]` | No | Array of struggle objects |
| timeline | `ProjectTimelineEntry[]` | No | Array of timeline entries |
| posts | `ProjectPost[]` | No | Array of post references |
| stack | `string[]` | No | Array of technology names |
| links | `ProjectLinks` | No | Object with link URLs |
| stats | `ProjectStats` | No | Object with stat values |
| createdAt | `string` | No | ISO 8601 date string |
| updatedAt | `string` | No | ISO 8601 date string |
| linkOrder | `string[]` | No | Array of link keys |
| override | `object` | No | Override object |

#### Type-Specific Fields

| Type | Required Fields |
|------|-----------------|
| `github` | `repo: string` |
| `manual` | None |
| `npm` | `package: string` |
| `product-hunt` | `slug: string` |
| `youtube` | `channelId: string` |
| `gumroad` | `productId: string` |
| `lemonsqueezy` | `storeId: string` |
| `devto` | `username: string` |
| `hybrid` | `repo: string`, `package: string` |

#### Link Validation

All link URLs are validated as proper URL strings:

| Link Type | Validation |
|-----------|-------------|
| `github` | URL format required |
| `live` | URL format required |
| `npm` | URL format required |
| `docs` | URL format required |
| `demo` | URL format required |
| `appStore` | URL format required |
| `playStore` | URL format required |
| `productHunt` | URL format required |
| `custom` | Each link must have `label: string` and `url: URL` |

## FolioProjectInputZod

Inferred TypeScript type from the Zod schema.

### Definition

```tsx
type FolioProjectInputZod = z.infer<typeof folioProjectInputSchema>
```

This type is identical to `FolioProjectInput` but explicitly typed as the inferred schema type.

## Usage

### Validating Configuration

```tsx
import { folioProjectInputSchema } from '@reallukemanning/folio'

const result = folioProjectInputSchema.safeParse({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active'
})

if (!result.success) {
  console.error('Validation failed:', result.error)
}
```

### Custom Validation

Create custom validation with Zod:

```tsx
import { folioProjectInputSchema } from '@reallukemanning/folio'

const strictSchema = folioProjectInputSchema
  .refine(
    (project) => project.type !== 'github' || !!project.repo,
    'GitHub projects must have a repo field'
  )
  .refine(
    (project) => project.type !== 'npm' || !!project.package,
    'npm projects must have a package field'
  )
```

### Type Inference

Use `FolioProjectInputZod` for type-safe config handling:

```tsx
import type { FolioProjectInputZod } from '@reallukemanning/folio'

function validateConfig(config: FolioProjectInputZod): boolean {
  return folioProjectInputSchema.safeParse(config).success
}
```

## Error Handling

The schema provides detailed error messages:

```tsx
const result = folioProjectInputSchema.safeParse({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'invalid-status' // Wrong!
})

if (!result.success) {
  console.log(result.error.errors)
  // [
  //   {
  //     code: 'invalid_enum_value',
  //     path: ['status'],
  //     message: 'Invalid enum value...',
  //     options: ['active', 'shipped', ...]
  //   }
  // ]
}
```

## CLI Integration

The schema is used internally by the CLI for `folio.config.ts` validation:

```bash
# Invalid config
npx folio init

# Output:
# ✖ Validation failed
# 1 issue found:
#
# status: Invalid enum value. Expected one of: active, shipped, in-progress, coming-soon, archived, for-sale
#   Received: production
#   Hint: Expected one of: active, shipped, in-progress, coming-soon, archived, for-sale
#
# Tip: Check your folio.config.ts for errors above.
```

## Related

- `defineProjects` - Type-safe configuration helper that uses this schema
- `formatZodError` - Format Zod validation errors with helpful messages
- Zod documentation: https://zod.dev/
