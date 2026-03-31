# ProjexProjectInputCompat

A compatibility/utility type that relaxes the strict `ProjexProjectInput` union to accept partial project configurations. Useful when migrating from untyped configs or building tools that accept flexible input shapes.

## Definition

```tsx
type ProjexProjectInputCompat = Omit<BaseProjectInput, 'id'> & {
  id: string
  type?: ProjectType
  repo?: string
  package?: string
  slug?: string
}
```

## Purpose

`ProjexProjectInputCompat` is a flattened, fully-optional variant of the project input types. Unlike `ProjexProjectInput` (which is a discriminated union requiring `type` and type-specific fields like `repo` or `package`), this type makes all type-specific fields optional.

### When to Use

- **Migration**: Accepting legacy configuration files where `type` may not be specified
- **Tooling**: Building CLI tools or validators that work with partial project data before the full input is resolved
- **Progressive enhancement**: Allowing users to start with minimal config and fill in type-specific details later

### When NOT to Use

- For `defineProjects()` or `normalise()` — these require the full `ProjexProjectInput` discriminated union with a mandatory `type` field
- For production project definitions — use `ProjexProjectInput` for full type safety

## Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier |
| `type` | `ProjectType` | No | Project type (optional) |
| `status` | `ProjectStatus` | Yes | Current status |
| `repo` | `string` | No | Repository path (GitHub/hybrid) |
| `package` | `string` | No | Package name (npm/hybrid) |
| `slug` | `string` | No | Product Hunt slug |
| All `BaseProjectInput` fields | Various | No | All other base properties |

## Difference from ProjexProjectInput

| Aspect | `ProjexProjectInput` | `ProjexProjectInputCompat` |
|--------|----------------------|---------------------------|
| Structure | Discriminated union | Single flat type |
| `type` field | Required | Optional |
| Type-specific fields | Required based on `type` | All optional |
| Type safety | Full narrowing by `type` | No narrowing |
| Use with `normalise` | Supported | Not directly |

## Related

- [ProjexProjectInput](./projex-project-input) — Strict project input type
- [ProjexProject](./projex-project) — Normalized project output
- [defineProjects](../utilities/define-projects) — Type-safe configuration helper
