# formatZodError

Format Zod validation errors with colored terminal output and helpful suggestions. Used internally by CLI for configuration validation.

## Signature

```tsx
function formatZodError(error: z.ZodError): string
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| error | `z.ZodError` | Zod validation error object |

## Returns

`string` - Formatted error message with colors, expected values, and hints

## Behavior

- Groups issues by path to reduce duplication
- Provides expected values for enum/type errors
- Shows received values for type mismatches
- Includes helpful hints and suggestions
- Uses chalk for colored terminal output
- Never throws - always returns a formatted string

## Example

```tsx
import { folioProjectInputSchema, formatZodError } from '@manningworks/projex'
import { z } from 'zod'

const result = folioProjectInputSchema.safeParse({
  id: 'my-project',
  type: 'github',
  status: 'invalid-status' // Wrong status
})

if (!result.success) {
  console.log(formatZodError(result.error))
}
```

Output:
```
✖ Validation failed
1 issue found:

status: Invalid enum value. Expected one of: active, shipped, in-progress, coming-soon, archived, for-sale
  Received: invalid-status
  Hint: Expected one of: active, shipped, in-progress, coming-soon, archived, for-sale

Tip: Check your projex.config.ts for errors above.
Refer to docs: https://folio.dev/docs/config
```

## Supported Error Types

| Error Code | Format |
|-----------|---------|
| `invalid_enum_value` | Shows all valid enum values |
| `invalid_type` | Shows received vs expected type |
| `too_small` | Shows minimum requirement |
| `too_big` | Shows maximum limit |
| `invalid_string` | Shows format requirement (email, URL, etc.) |
| `unrecognized_keys` | Lists unexpected keys |
| `custom` | Suggests checking validation logic |

## String Validation Messages

| Validation | Example Suggestion |
|-------------|-------------------|
| `email` | `Example: "user@example.com"` |
| `url` | `Example: "https://example.com"` |
| `regex` | `string matching required pattern` |

## Usage in CLI

This function is used internally by the CLI to display helpful validation errors:

```bash
# User provides invalid config
npx projex init

# CLI outputs formatted error
✖ Validation failed
2 issues found:

repo.type: Invalid enum value. Expected one of: github, manual, npm, product-hunt, hybrid
  Received: invalid
  Hint: Expected one of: github, manual, npm, product-hunt, hybrid

status: Invalid enum value. Expected one of: active, shipped, in-progress, coming-soon, archived, for-sale
  Received: production
  Hint: Expected one of: active, shipped, in-progress, coming-soon, archived, for-sale

Tip: Check your projex.config.ts for errors above.
```

## Related

- `folioProjectInputSchema` - Zod schema for project configuration
- `defineProjects` - Type-safe project configuration helper
