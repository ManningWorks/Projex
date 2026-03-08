# SEO Integration

Add metadata and structured data to your portfolio using Projex's SEO utilities. These functions generate proper Next.js metadata objects and JSON-LD schema for search engines and social media.

## Overview

Projex provides four SEO utilities:

| Function | Purpose |
|----------|---------|
| `generatePortfolioMetadata()` | Generate Next.js metadata for your portfolio homepage |
| `generateProjectMetadata()` | Generate Next.js metadata for individual project pages |
| `generatePersonSchema()` | Generate Person JSON-LD structured data |
| `generateProjectSchema()` | Generate SoftwareApplication JSON-LD structured data |

## Next.js App Router

The App Router uses the `metadata` export to define page-level metadata.

### Portfolio Page Metadata

Generate metadata for your portfolio homepage:

```tsx
// app/page.tsx
import { generatePortfolioMetadata } from '@manningworks/projex'
import { ProjectCard } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'

export const metadata = generatePortfolioMetadata({
  name: 'Your Name',
  description: 'Full-stack developer specializing in React, Next.js, and TypeScript',
  url: 'https://yourdomain.com',
  image: 'https://yourdomain.com/og-image.png',
  sameAs: [
    'https://github.com/yourusername',
    'https://twitter.com/yourusername',
    'https://linkedin.com/in/yourusername'
  ]
})

export default async function PortfolioPage() {
  return (
    <main>
      <h1>Your Name</h1>
      <p>Full-stack developer specializing in React, Next.js, and TypeScript</p>
    </main>
  )
}
```

This generates:

- Title and description meta tags
- OpenGraph tags for social sharing (title, description, URL, type, image)
- JSON-LD Person schema embedded in `other['schema:person']`
- SameAs links for social profiles

### Project Page Metadata

Generate metadata for individual project pages:

```tsx
// app/projects/[id]/page.tsx
import { generateProjectMetadata } from '@manningworks/projex'
import { normalise } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'
import { projects as projectInputs } from '../../../folio.config'

async function getProject(id: string): Promise<ProjexProject | null> {
  const input = projectInputs.find((p) => p.id === id)
  if (!input) return null
  return normalise(input)
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) return {}

  return generateProjectMetadata(project)
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) return <div>Project not found</div>

  return (
    <main>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </main>
  )
}
```

This generates:

- Title and description from project data
- Keywords from project stack (comma-separated)
- OpenGraph tags prioritizing live URL over GitHub
- JSON-LD SoftwareApplication schema embedded in `other['schema:softwareApplication']`

### Dynamic Metadata with API Routes

Combine with data fetching for dynamic metadata:

```tsx
// app/projects/[id]/page.tsx
import { generateProjectMetadata, normalise } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'

async function getProject(id: string): Promise<ProjexProject> {
  const response = await fetch(`${process.env.API_URL}/projects/${id}`)
  const data = await response.json()
  return normalise(data)
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  return generateProjectMetadata(project)
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  return (
    <main>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </main>
  )
}
```

## Next.js Pages Router

The Pages Router uses the `Head` component from `next/head` to set metadata.

### Portfolio Page with JSON-LD

Add Person schema to your portfolio homepage:

```tsx
// pages/index.tsx
import { generatePersonSchema } from '@manningworks/projex'
import Head from 'next/head'
import type { PersonSchema } from '@manningworks/projex'

const schema = generatePersonSchema({
  name: 'Your Name',
  url: 'https://yourdomain.com',
  jobTitle: 'Full-Stack Developer',
  image: 'https://yourdomain.com/profile.jpg',
  sameAs: [
    'https://github.com/yourusername',
    'https://twitter.com/yourusername',
    'https://linkedin.com/in/yourusername'
  ]
})

export default function PortfolioPage() {
  return (
    <>
      <Head>
        <title>Your Name - Full-Stack Developer</title>
        <meta name="description" content="Full-stack developer specializing in React, Next.js, and TypeScript" />
        <meta property="og:title" content="Your Name - Full-Stack Developer" />
        <meta property="og:description" content="Full-stack developer specializing in React, Next.js, and TypeScript" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
      </Head>
      <main>
        <h1>Your Name</h1>
        <p>Full-Stack Developer</p>
      </main>
    </>
  )
}
```

### Project Page with SoftwareApplication Schema

Add SoftwareApplication schema to project pages:

```tsx
// pages/projects/[id].tsx
import { generateProjectSchema, normalise } from '@manningworks/projex'
import Head from 'next/head'
import type { ProjexProject, SoftwareApplicationSchema } from '@manningworks/projex'
import { projects as projectInputs } from '../../folio.config'

function getProject(id: string): ProjexProject {
  const input = projectInputs.find((p) => p.id === id)
  return normalise(input!)
}

export default function ProjectPage({ router }: { router: any }) {
  const { id } = router.query
  const project = getProject(id as string)

  const schema = generateProjectSchema(project)

  return (
    <>
      <Head>
        <title>{project.name}</title>
        <meta name="description" content={project.description} />
        <meta name="keywords" content={project.stack.join(', ')} />
        <meta property="og:title" content={project.name} />
        <meta property="og:description" content={project.description} />
        <meta property="og:url" content={project.links.live || project.links.github} />
        <meta property="og:type" content="website" />
        {project.image && (
          <meta property="og:image" content={project.image} />
        )}
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )}
      </Head>
      <main>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </main>
    </>
  )
}
```

## Metadata Structure

### Portfolio Metadata

`generatePortfolioMetadata()` returns a Next.js `Metadata` object:

```tsx
{
  title?: string
  description?: string
  openGraph?: {
    title?: string
    description?: string
    url?: string
    type?: string // Always 'website'
    images?: Array<{ url: string }>
  }
  other?: {
    sameAs?: string[]
    'schema:person'?: string // JSON-serialized Person schema
  }
}
```

### Project Metadata

`generateProjectMetadata()` returns a Next.js `Metadata` object:

```tsx
{
  title?: string
  description?: string
  keywords?: string // Comma-separated stack tags
  openGraph?: {
    title?: string
    description?: string
    url?: string
    type?: string // Always 'website'
    images?: Array<{ url: string }>
  }
  other?: {
    'schema:softwareApplication'?: string // JSON-serialized SoftwareApplication schema
  }
}
```

## JSON-LD Schema

### Person Schema

`generatePersonSchema()` generates a Schema.org Person object:

```tsx
{
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  url: string
  jobTitle?: string
  image?: string
  sameAs?: string[] // Social profile URLs
}
```

### SoftwareApplication Schema

`generateProjectSchema()` generates a Schema.org SoftwareApplication object:

```tsx
{
  '@context': 'https://schema.org'
  '@type': 'SoftwareApplication'
  name: string
  description: string
  url: string
  applicationCategory?: string // 'DeveloperApplication' for github/npm types
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: 5
    ratingCount: number // Stars
  }
  interactionStatistic?: {
    '@type': 'InteractionCounter'
    interactionType: { '@type': 'DownloadAction' }
    userInteractionCount: number // Downloads
  }
}
```

## URL Priority

Metadata functions use different URL priorities for SEO optimization:

| Context | URL Priority |
|---------|--------------|
| OpenGraph (metadata) | live > github > npm > docs > demo > appStore > playStore > productHunt |
| Schema (structured data) | github > live > npm > docs > demo > appStore > playStore > productHunt |

OpenGraph prioritizes the live site URL for social sharing, while schema prioritizes GitHub for developer-focused SEO.

## Validation

All SEO functions validate inputs and log warnings for missing or invalid data:

```tsx
// Missing required fields
const metadata = generatePortfolioMetadata({
  name: '',
  description: '',
  url: ''
})
// Logs: "generatePortfolioMetadata: name is required and must be a non-empty string"
// Returns: null

// Valid input
const metadata = generatePortfolioMetadata({
  name: 'Your Name',
  description: 'Full-stack developer',
  url: 'https://yourdomain.com'
})
// Returns: { title: 'Your Name', description: 'Full-stack developer', ... }
```

Functions never throw - they return `null` for invalid inputs and log warnings.

## Complete Example

Here's a complete Next.js App Router setup with SEO:

### projex.config.ts

```ts
import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/my-project',
    status: 'active',
    featured: true,
    description: 'A full-stack application built with Next.js and TypeScript'
  }
])
```

### app/page.tsx

```tsx
import { generatePortfolioMetadata } from '@manningworks/projex'
import { ProjectCard, normalise } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'
import { projects as projectInputs } from '../folio.config'

export const metadata = generatePortfolioMetadata({
  name: 'Your Name',
  description: 'Full-stack developer specializing in React, Next.js, and TypeScript',
  url: 'https://yourdomain.com',
  image: 'https://yourdomain.com/og-image.png',
  sameAs: [
    'https://github.com/yourusername',
    'https://twitter.com/yourusername'
  ]
})

async function getProjects(): Promise<ProjexProject[]> {
  return Promise.all(projectInputs.map((input) => normalise(input)))
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <main>
      <h1>Your Name</h1>
      <p>Full-stack developer specializing in React, Next.js, and TypeScript</p>
      <div data-projex-grid>
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

### app/projects/[id]/page.tsx

```tsx
import { generateProjectMetadata, normalise } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'
import { projects as projectInputs } from '../../../folio.config'

async function getProject(id: string): Promise<ProjexProject | null> {
  const input = projectInputs.find((p) => p.id === id)
  if (!input) return null
  return normalise(input)
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) return {}

  return generateProjectMetadata(project)
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)
  if (!project) return <div>Project not found</div>

  return (
    <main>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
    </main>
  )
}
```

## Testing

Verify your SEO implementation using:

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Schema Markup Validator**: https://validator.schema.org/
