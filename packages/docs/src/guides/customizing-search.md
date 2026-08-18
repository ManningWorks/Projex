# Customizing Search Behavior

Projex uses [Fuse.js](https://fusejs.io/) for fuzzy search, providing flexible and powerful search capabilities across your project portfolio.

## Understanding Threshold Values

The threshold controls how "fuzzy" search matching is. Lower values are stricter (require closer matches), while higher values are more lenient (allow more variation).

### Default Behavior

Projex uses these defaults:
- **Threshold:** `0.3` - Balanced between precision and recall
- **ignoreLocation:** `true` - Matches found anywhere in field content
- **Field weights:** `name` (2), `tagline` (1.5), `description` (1.5), `stack` (1)

The `0.3` threshold default is shared by every search entry point: `useProjectSearch`, `searchProjects`, `createFuseSearch`, and `getFuseOptions`.

### Threshold Values Reference

| Threshold | Description | Example Matches | Use Case |
|-----------|-------------|------------------|-----------|
| `0.0` | Exact matches only | "react" → "React", "react-ui" ✅<br>"react" → "ReactNative" ❌ | Technical searches, package names |
| `0.1` | Near-exact matches | "react" → "React", "react-ui", "re-act" ✅<br>"react" → "NativeScript" ❌ | Code search, technical terms |
| `0.3` (default) | Balanced search | "react" → "React", "react-ui", "re-act", "ReactNative" ✅ | General project search |
| `0.3` | More lenient | "react" → "React", "react-ui", "re-act", "NativeScript" ✅ | User-facing search with typos |
| `0.5+` | Very fuzzy | "react" → "React", "react-ui", "re-act", "NativeScript", "reactor" ✅ | Broad discovery searches |

## Using `useProjectSearch` with Custom Threshold

```tsx
import { useProjectSearch } from '@manningworks/projex'
import { useState } from 'react'

function SearchablePortfolio() {
  const [searchQuery, setSearchQuery] = useState('')

  // Default behavior (threshold: 0.3)
  const results = useProjectSearch(projects, searchQuery)

  // Custom threshold for different use cases
  const strictResults = useProjectSearch(projects, searchQuery, {
    threshold: 0.1  // More precise, fewer results
  })

  const lenientResults = useProjectSearch(projects, searchQuery, {
    threshold: 0.4  // More inclusive, handles typos better
  })

  return (
    // ...
  )
}
```

## Customizing Searchable Fields and Threshold

Both `createFuseSearch` and the `searchProjects` helper (and `useProjectSearch`) accept a `{ threshold, keys }` options object, so customising the searchable fields no longer requires constructing `new Fuse(...)` yourself:

```tsx
import { createFuseSearch } from '@manningworks/projex'
import { useState, useMemo } from 'react'

function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  const fuse = useMemo(() =>
    createFuseSearch(projects, {
      threshold: 0.1,             // stricter matching
      keys: [                     // search only these fields, weighted
        { name: 'name', weight: 2 },
        { name: 'tagline', weight: 1 },
      ],
    }),
    []
  )

  const results = useMemo(() => {
    if (!searchQuery) return projects
    return fuse.search(searchQuery).map(r => r.item)
  }, [searchQuery, fuse])

  return (
    // ...
  )
}
```

::: tip Backwards compatibility
`createFuseSearch(projects, 0.3)` and `getFuseOptions(0.3)` still accept a bare threshold number, so v1.3-style calls keep working.
:::

### Truly Custom Fuse Options

For options projex does not expose (such as `ignoreLocation: false` or `minMatchCharLength`), drop down to Fuse.js directly:

```tsx
import Fuse from 'fuse.js'

const fuse = new Fuse(projects, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'tagline', weight: 1.5 },
    { name: 'description', weight: 1.5 },
    { name: 'stack', weight: 1 },
  ],
  threshold: 0.3,         // Match strictness
  ignoreLocation: true,   // Match anywhere in field
  ignoreFieldNorm: false, // Consider field length in scoring
  includeScore: false,    // Don't include score in results
  includeMatches: false,  // Don't include match details
  minMatchCharLength: 1,  // Minimum characters to match
})
```

## Understanding `ignoreLocation`

The `ignoreLocation` option affects where matches are expected to appear in fields:

### `ignoreLocation: true` (default)

```tsx
useProjectSearch(projects, 'test', { threshold: 0.2 })

// Matches anywhere in field content:
"Vitest" → matches "test" ✅
"TestSuite" → matches "test" ✅
"test" → matches "test" ✅
```

This is ideal for:
- General project search
- User-facing search interfaces
- Multi-field search (name, description, stack)

### `ignoreLocation: false`

```tsx
// Not available through useProjectSearch, requires direct Fuse.js
const fuse = new Fuse(projects, {
  keys: [{ name: 'stack', weight: 1 }],
  threshold: 0.2,
  ignoreLocation: false  // Expects matches near field start
})

// Matches only near the beginning:
"test-project" → matches "test" ✅
"Vitest" → matches "test" ❌ (too far from start)
```

Use this when:
- You only want prefix matching
- Performance is critical with many projects
- Queries are very short (1-2 characters)

## Field Weights

Search relevance is influenced by field weights. Higher weight = higher relevance score:

```tsx
import { createFuseSearch } from '@manningworks/projex'

const fuse = createFuseSearch(projects, {
  keys: [
    { name: 'name', weight: 2 },           // Highest priority
    { name: 'tagline', weight: 1.5 },      // Medium priority
    { name: 'description', weight: 1.5 },  // Medium priority
    { name: 'stack', weight: 1 },          // Lower priority
  ],
  threshold: 0.3,
})
```

**Effect of weights:**
- Matching in `name` is 2x more relevant than matching in `stack`
- Matching in `tagline` or `description` is 1.5x more relevant than matching in `stack`
- Results are sorted by combined relevance score

**When to adjust weights:**
- Increase `name` weight if users primarily search by project name
- Increase `stack` weight if portfolio is technical/developer-focused
- Increase `description` weight for discovery-focused portfolios

## Performance Considerations

Search performance varies based on configuration:

| Configuration | Performance | Recommended For |
|--------------|-------------|------------------|
| Threshold 0.1 | Fastest | 1000+ projects, technical searches |
| Threshold 0.3 (default) | Fast | 100-500 projects, balanced use |
| Threshold 0.4+ | Slower | <100 projects, user-facing search |
| `ignoreLocation: true` | Slightly slower | Most use cases |
| `ignoreLocation: false` | Fastest | Prefix-only searches |

### Optimizing Large Portfolios

For portfolios with 500+ projects:

```tsx
import { useProjectSearch } from '@manningworks/projex'
import { useState, useCallback } from 'react'

function LargePortfolioSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  // Stricter threshold for better performance
  const results = useProjectSearch(projects, searchQuery, {
    threshold: 0.1
  })

  // Debounce input (built into ProjectSearch, defaults to 300ms)
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  return (
    <ProjectSearch
      onSearch={handleSearch}
      placeholder="Search 1000+ projects..."
    />
  )
}
```

## Real-World Examples

### Tech Blog Portfolio

```tsx
function TechBlogSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  // Users are technical, expect precise matches
  const results = useProjectSearch(projects, searchQuery, {
    threshold: 0.1
  })

  return (
    <ProjectGrid>
      {results.map(p => <ProjectCard key={p.id} project={p} />)}
    </ProjectGrid>
  )
}
```

### Personal Portfolio with Mixed Audience

```tsx
function PersonalPortfolioSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mix of technical and non-technical users
  const results = useProjectSearch(projects, searchQuery, {
    threshold: 0.25  // Slightly more lenient than default
  })

  return (
    <ProjectGrid>
      {results.map(p => <ProjectCard key={p.id} project={p} />)}
    </ProjectGrid>
  )
}
```

### Discovery-Focused Showcase

```tsx
function DiscoverySearch() {
  const [searchQuery, setSearchQuery] = useState('')

  // Help users discover related projects through fuzzy matching
  const results = useProjectSearch(projects, searchQuery, {
    threshold: 0.4  // Very lenient
  })

  return (
    <ProjectGrid>
      {results.map(p => <ProjectCard key={p.id} project={p} />)}
    </ProjectGrid>
  )
}
```

## Troubleshooting Search Issues

### Too Many Results

**Problem:** Search returns many irrelevant projects

**Solution:** Decrease threshold

```tsx
useProjectSearch(projects, query, { threshold: 0.1 })
```

### Too Few Results

**Problem:** Search doesn't find expected projects

**Solution:** Increase threshold

```tsx
useProjectSearch(projects, query, { threshold: 0.4 })
```

### Typos Not Matching

**Problem:** User typos (e.g., "reactt", "projexx") aren't matched

**Solution:** Use higher threshold

```tsx
useProjectSearch(projects, query, { threshold: 0.3 })
```

### Search Feels Slow

**Problem:** Search input feels laggy

**Solutions:**
1. Use stricter threshold
2. Ensure `ProjectSearch` debounce is working (default 300ms)
3. Consider pagination for very large portfolios

```tsx
// Faster, more precise
const results = useProjectSearch(projects, query, { 
  threshold: 0.1 
})
```

## Further Reading

- [Fuse.js API Reference](https://fusejs.io/api/options.html)
- [Fuse.js Scoring Theory](https://fusejs.io/concepts/scoring-theory.html)
- [useProjectSearch API](../api/utilities/use-project-search)
- [Fuse Search Utilities](../api/utilities/fuse-search)
