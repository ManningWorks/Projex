# FeaturedProject

Featured project hero section for highlighting a single project.

## Import

```tsx
import { FeaturedProject } from '@manningworks/projex'
```

## Usage

```tsx
<FeaturedProject project={featuredProject} />
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| project | `ProjexProject \| null \| undefined` | Yes | Featured project data |

Returns `null` if `project` is null or undefined.

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-projex-featured` | Featured container |
| `data-projex-featured-image` | Featured project image |

## Example

```tsx
import { FeaturedProject, filterByFeatured } from '@manningworks/projex'

function HomePage({ projects }) {
  const featured = filterByFeatured(projects, true)[0]
  
  return (
    <main>
      <FeaturedProject project={featured} />
      <ProjectGrid>
        {/* Other projects */}
      </ProjectGrid>
    </main>
  )
}
```

## Implementation Details

FeaturedProject internally uses ProjectView and renders:

- Project image (if available)
- Background section
- Why section
- Stats
- Links

This provides a complete project overview in a single component call.
