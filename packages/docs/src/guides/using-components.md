# Using Components

Guide for integrating Projex components in Next.js pages and building layouts.

## Component Patterns

Projex uses compound components for maximum flexibility. Compose your own layout using modular pieces.

## Data Fetching Pattern

Fetch data at build time using `normalise`:

```tsx
import { normalise } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'
import { projects as projectInputs } from '../projex.config'

async function getProjects(): Promise<ProjexProject[]> {
  return Promise.all(projectInputs.map((input) => normalise(input)))
}
```

## Page Component Structure

### Portfolio Page (App Router)

```tsx
import { ProjectCard } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'

async function getProjects(): Promise<ProjexProject[]> {
  const { projects: projectInputs } = await import('../projex.config')
  const { normalise } = await import('@manningworks/projex')
  return Promise.all(projectInputs.map((input) => normalise(input)))
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <main>
      <h1>My Projects</h1>
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Tags project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Status project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
      </div>
    </main>
  )
}
```

### Portfolio Page (Pages Router)

```tsx
import { GetServerSideProps } from 'next'
import { ProjectCard } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'
import { projects as projectInputs } from '../projex.config'

export default function PortfolioPage({ projects }: { projects: ProjexProject[] }) {
  return (
    <main>
      <h1>My Projects</h1>
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Tags project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Status project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { normalise } = await import('@manningworks/projex')
  const projects = await Promise.all(projectInputs.map((input) => normalise(input)))

  return {
    props: { projects }
  }
}
```

## Layout Patterns

### Grid Layout

Use `ProjectGrid` for responsive card grids:

```tsx
import { ProjectGrid } from '@manningworks/projex'

<div className="portfolio">
  <ProjectGrid>
    {projects.map((project) => (
      <ProjectCard key={project.id}>
        <ProjectCard.Header project={project} />
        <ProjectCard.Description project={project} />
        <ProjectCard.Stats project={project} />
        <ProjectCard.Links project={project} />
      </ProjectCard>
    ))}
  </ProjectGrid>
</div>
```

### List Layout

Use `ProjectList` for compact project lists:

```tsx
import { ProjectList } from '@manningworks/projex'

<div className="portfolio">
  <ProjectList>
    {projects.map((project) => (
      <ProjectCard key={project.id}>
        <ProjectCard.Header project={project} />
        <ProjectCard.Description project={project} />
        <ProjectCard.Links project={project} />
      </ProjectCard>
    ))}
  </ProjectList>
</div>
```

### Featured Section

Use `FeaturedProject` for hero sections:

```tsx
import { FeaturedProject } from '@manningworks/projex'

const featuredProject = projects.find(p => p.featured)

<div className="portfolio">
  {featuredProject && (
    <FeaturedProject project={featuredProject} />
  )}

  <ProjectGrid>
    {projects.map((project) => (
      <ProjectCard key={project.id}>
        <ProjectCard.Header project={project} />
        <ProjectCard.Description project={project} />
        <ProjectCard.Stats project={project} />
        <ProjectCard.Links project={project} />
      </ProjectCard>
    ))}
  </ProjectGrid>
</div>
```

## Interactive Features

### Search and Filter

Combine search and filters for interactive portfolios:

```tsx
'use client'

import { useState } from 'react'
import {
  ProjectSearch,
  ProjectFilterBar,
  ProjectFilterTag,
  useProjectSearch,
  useProjectFilters,
} from '@manningworks/projex'

function InteractivePortfolio({ projects }) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Extract all unique tags
  const allTags = [...new Set(projects.flatMap(p => p.stack))]

  // Apply filters
  const filteredByTags = useProjectFilters(projects, selectedTags)
  const filteredProjects = useProjectSearch(filteredByTags, query)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div>
      <ProjectSearch onSearch={setQuery} placeholder="Search projects..." />

      <ProjectFilterBar>
        {allTags.map(tag => (
          <ProjectFilterTag
            key={tag}
            label={tag}
            isActive={selectedTags.includes(tag)}
            onClick={toggleTag}
          />
        ))}
      </ProjectFilterBar>

      <div className="grid">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
      </div>
    </div>
  )
}
```

### Sorting

Add sorting capabilities:

```tsx
'use client'

import { useState, useMemo } from 'react'
import { ProjectSort } from '@manningworks/projex'
import { sortByName, sortByDate, sortByStars } from '@manningworks/projex'

function SortedPortfolio({ projects }) {
  const [sortBy, setSortBy] = useState('name')

  const sortedProjects = useMemo(() => {
    switch (sortBy) {
      case 'name': return sortByName(projects)
      case 'date': return sortByDate(projects)
      case 'stars': return sortByStars(projects)
      default: return projects
    }
  }, [projects, sortBy])

  return (
    <div>
      <ProjectSort
        options={['Name', 'Date', 'Stars']}
        value={sortBy}
        onChange={setSortBy}
      />

      <div className="grid">
        {sortedProjects.map(project => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
      </div>
    </div>
  )
}
```

## Project Detail Pages

Create dynamic routes for individual projects:

```tsx
import { notFound } from 'next/navigation'
import { ProjectView } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'
import { projects as projectInputs } from '../../projex.config'

async function getProject(id: string): Promise<ProjexProject | null> {
  const input = projectInputs.find((p) => p.id === id)
  if (!input) return null

  const { normalise } = await import('@manningworks/projex')
  return normalise(input)
}

export async function generateStaticParams() {
  return projectInputs.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    notFound()
  }

  return (
    <main>
      <ProjectView project={project} />
    </main>
  )
}
```

## Conditional Rendering

Components render nothing for empty data:

```tsx
<ProjectCard>
  <ProjectCard.Header project={project} />
  <ProjectCard.Description project={project} />
  <ProjectCard.Tags project={project} />
  <ProjectCard.Stats project={project} />
  <ProjectCard.Status project={project} />
  <ProjectCard.Links project={project} />
</ProjectCard>
```

- `Description` returns null if `project.description` is empty
- `Tags` returns null if `project.stack` is empty
- `Stats` returns null if `project.stats` is empty
- `Links` returns null if no links are available

## Styling Components

All components render semantic HTML with data attributes. Style with CSS:

```css
[data-projex-card] {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

[data-projex-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

See [Styling Guide](./styling) for comprehensive CSS examples.

## Client vs Server Components

### Server Components (Default)

Use for static content and build-time data fetching:

```tsx
// Default - runs on server
export default async function PortfolioPage() {
  const projects = await getProjects()
  return <ProjectGrid>{/* ... */}</ProjectGrid>
}
```

### Client Components

Use for interactive features (search, filter, sort):

```tsx
'use client'

import { useState } from 'react'

function InteractivePortfolio({ projects }) {
  const [query, setQuery] = useState('')
  return <ProjectSearch onSearch={setQuery} />
}
```

Mix server and client components:

```tsx
// Server component
export default async function PortfolioPage() {
  const projects = await getProjects()
  return <InteractivePortfolio projects={projects} />
}

// Client component
'use client'
function InteractivePortfolio({ projects }) {
  return <ProjectSearch onSearch={/*...*/} />
}
```

## Best Practices

1. **Fetch data once** at build time, pass to client components
2. **Use compound components** for flexible layouts
3. **Leverage empty rendering** - components handle missing data
4. **Separate concerns** - server for data, client for interactivity
5. **Use data attributes** for styling, not CSS classes

## Next Steps

- [Styling](./styling) - Customizing component appearance
- [Examples](/examples/) - Complete working examples
- [Project Types](./project-types) - Understanding project configurations
- [API Reference](../api/components/) - All available components and utilities
