# URL-Persisted State

Persist filter, search, and layout state to URL query parameters. This creates shareable, bookmarkable portfolio views.

## Why URL State?

- **Shareable links** - Send filtered views to others: `yourportfolio.com/?type=github&status=active`
- **Bookmarkable** - Save specific filters as browser bookmarks
- **Back button support** - Natural browser navigation
- **SEO-friendly** - Each filtered view has its own URL
- **No state loss** - Page refreshes preserve user selections

## Next.js App Router

### Basic Example

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ProjectCard, ProjectGrid } from '@reallukemanning/folio'

function Portfolio({ projects }) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Initialize state from URL on mount
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
    setSelectedType(searchParams.get('type') || null)
  }, [searchParams])

  // Update URL when state changes
  const updateURL = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    const url = newParams.toString()
      ? `?${newParams.toString()}`
      : ''

    window.history.replaceState({}, '', url)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    updateURL({ q: query || null })
  }

  const handleTypeFilter = (type: string | null) => {
    setSelectedType(type)
    updateURL({ type })
  }

  const filteredProjects = projects.filter(project => {
    if (selectedType && project.type !== selectedType) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        project.name.toLowerCase().includes(query) ||
        project.tagline?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div>
      <ProjectSearch onSearch={handleSearch} placeholder="Search..." />
      <ProjectFilterBar>
        <ProjectFilterTag
          label="All"
          isActive={selectedType === null}
          onClick={() => handleTypeFilter(null)}
        />
        {types.map(type => (
          <ProjectFilterTag
            key={type}
            label={type}
            isActive={selectedType === type}
            onClick={() => handleTypeFilter(type)}
          />
        ))}
      </ProjectFilterBar>
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```

### Using useRouter for App Router

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function Portfolio({ projects }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || null,
    status: searchParams.get('status') || null,
    search: searchParams.get('q') || ''
  })

  const updateFilters = (key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }))

    // Update URL with new params
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Rest of component...
}
```

## Next.js Pages Router

```tsx
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { ProjectCard, ProjectGrid } from '@reallukemanning/folio'

function Portfolio({ projects }) {
  const router = useRouter()
  const [filters, setFilters] = useState({
    type: router.query.type as string | null,
    status: router.query.status as string | null,
    search: router.query.q as string || ''
  })

  // Sync URL on mount
  useEffect(() => {
    setFilters({
      type: router.query.type as string | null || null,
      status: router.query.status as string | null || null,
      search: router.query.q as string || ''
    })
  }, [router.query])

  const updateFilters = (key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }))

    const { type, status, q, ...rest } = router.query
    const newQuery = {
      ...rest,
      ...(filters.type && { type: filters.type }),
      ...(filters.status && { status: filters.status }),
      ...(filters.search && { q: filters.search })
    }

    if (!value) {
      delete newQuery[key]
    } else {
      newQuery[key] = value
    }

    router.push(
      { pathname: router.pathname, query: newQuery },
      undefined,
      { shallow: true }
    )
  }

  // Rest of component...
}
```

## Advanced: Multiple Filter Types

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

type Filters = {
  search: string
  type: string | null
  status: string | null
  featured: boolean
  layout: 'grid' | 'list'
}

function AdvancedPortfolio({ projects }) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('q') || '',
    type: searchParams.get('type') || null,
    status: searchParams.get('status') || null,
    featured: searchParams.get('featured') === 'true',
    layout: (searchParams.get('layout') as 'grid' | 'list') || 'grid'
  })

  // Serialize filters to URL
  const toSearchParams = (f: Filters) => {
    const params = new URLSearchParams()
    if (f.search) params.set('q', f.search)
    if (f.type) params.set('type', f.type)
    if (f.status) params.set('status', f.status)
    if (f.featured) params.set('featured', 'true')
    if (f.layout) params.set('layout', f.layout)
    return params
  }

  // Update single filter
  const updateFilter = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    const params = toSearchParams(newFilters)
    const url = params.toString() ? `?${params.toString()}` : ''
    window.history.replaceState({}, '', url)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      type: null,
      status: null,
      featured: false,
      layout: 'grid'
    })
    window.history.replaceState({}, '', '/')
  }

  // Share current view
  const shareView = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  // Apply filters
  const filteredProjects = projects.filter(project => {
    if (filters.type && project.type !== filters.type) return false
    if (filters.status && project.status !== filters.status) return false
    if (filters.featured && !project.featured) return false
    if (filters.search) {
      const query = filters.search.toLowerCase()
      return (
        project.name.toLowerCase().includes(query) ||
        project.tagline?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.stack?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  return (
    <div>
      <div className="controls">
        <button onClick={clearFilters}>Clear Filters</button>
        <button onClick={shareView}>Share View</button>
      </div>

      <ProjectSearch onSearch={(q) => updateFilter('search', q)} />
      <ProjectFilterBar>
        {types.map(type => (
          <ProjectFilterTag
            key={type}
            label={type}
            isActive={filters.type === type}
            onClick={() => updateFilter('type', type)}
          />
        ))}
      </ProjectFilterBar>

      <div className="layout-toggle">
        <button
          className={filters.layout === 'grid' ? 'active' : ''}
          onClick={() => updateFilter('layout', 'grid')}
        >
          Grid
        </button>
        <button
          className={filters.layout === 'list' ? 'active' : ''}
          onClick={() => updateFilter('layout', 'list')}
        >
          List
        </button>
      </div>

      {filters.layout === 'grid' ? (
        <ProjectGrid projects={filteredProjects} />
      ) : (
        <ProjectList projects={filteredProjects} />
      )}
    </div>
  )
}
```

## Tag Selection

Persist multiple selected tags to URL:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function TagFilterPortfolio({ projects }) {
  const searchParams = useSearchParams()
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tags = searchParams.get('tags')
    return tags ? tags.split(',') : []
  })

  // Get all unique tags from projects
  const allTags = [...new Set(projects.flatMap(p => p.stack || []))]

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','))
    } else {
      params.delete('tags')
    }

    const url = params.toString() ? `?${params.toString()}` : '/'
    window.history.replaceState({}, '', url)
  }, [selectedTags, searchParams])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredProjects = projects.filter(project =>
    selectedTags.every(tag => project.stack?.includes(tag))
  )

  return (
    <div>
      <ProjectFilterBar>
        {allTags.map(tag => (
          <ProjectFilterTag
            key={tag}
            label={tag}
            isActive={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
          />
        ))}
      </ProjectFilterBar>
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```

## Server Component with URL State

Combining server-side data fetching with client-side URL state:

```tsx
// app/page.tsx
import { ProjectCard, ProjectGrid } from '@reallukemanning/folio'
import { FolioProject } from '@reallukemanning/folio'
import { FolioClient } from './folio-client'

export default async function PortfolioPage({
  searchParams
}: {
  searchParams: { q?: string; type?: string; status?: string }
}) {
  const projects = await getProjects()

  // Pass searchParams to client component
  return <FolioClient projects={projects} initialParams={searchParams} />
}

async function getProjects(): Promise<FolioProject[]> {
  const { projects: projectInputs } = await import('../../folio.config')
  const { normalise } = await import('@reallukemanning/folio')
  return Promise.all(projectInputs.map(normalise))
}

// app/folio-client.tsx
'use client'

import { ProjectCard, ProjectGrid } from '@reallukemanning/folio'
import { FolioProject } from '@reallukemanning/folio'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function FolioClient({
  projects,
  initialParams
}: {
  projects: FolioProject[]
  initialParams: { q?: string; type?: string; status?: string }
}) {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    search: initialParams.q || '',
    type: initialParams.type || null,
    status: initialParams.status || null
  })

  useEffect(() => {
    setFilters({
      search: searchParams.get('q') || '',
      type: searchParams.get('type') || null,
      status: searchParams.get('status') || null
    })
  }, [searchParams])

  // Update URL and filters
  const updateFilter = (key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    window.history.replaceState({}, '', `?${params.toString()}`)
  }

  const filteredProjects = projects.filter(project => {
    if (filters.type && project.type !== filters.type) return false
    if (filters.status && project.status !== filters.status) return false
    if (filters.search) {
      const query = filters.search.toLowerCase()
      return (
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div>
      <ProjectSearch onSearch={(q) => updateFilter('search', q)} />
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```

## Example URLs

After implementing URL state, users can bookmark or share specific views:

```
# Active GitHub projects
yourportfolio.com/?type=github&status=active

# Search for React projects
yourportfolio.com/?q=react

# TypeScript npm packages, shipped status
yourportfolio.com/?type=npm&status=shipped&tags=typescript

# Featured projects only
yourportfolio.com/?featured=true&layout=list

# Complex filter combination
yourportfolio.com/?type=github&status=active&tags=react,nextjs&layout=grid
```

## Best Practices

1. **Use shallow routing** - Don't trigger full page reloads when updating filters
2. **Debounce search** - Don't update URL on every keystroke
3. **Preserve scroll position** - Use `{ scroll: false }` in router.push
4. **Handle missing params gracefully** - Always provide defaults
5. **Test bookmarking** - Refresh page to verify state persists
6. **Share button** - Add "Share this view" button for easy URL copying

## SEO Considerations

URL-persisted state creates unique URLs for filtered views. For SEO:

- **Canonical URLs** - Set canonical to base URL without params
- **Meta robots** - Use `noindex` for filtered views if needed
- **OpenGraph** - Keep OG tags consistent across views
- **Structured data** - Ensure schema applies to filtered results

```tsx
// app/page.tsx
export const metadata = {
  canonical: 'https://yourportfolio.com',
  robots: {
    index: true,
    follow: true
  }
}

// In filtered views (optional)
const isFiltered = searchParams.toString().length > 0
if (isFiltered) {
  metadata.robots.noindex = true
}
```
