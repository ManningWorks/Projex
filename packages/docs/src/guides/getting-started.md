# Getting Started: Build a Solo Developer Portfolio

Complete walkthrough for building a portfolio website with Folio. This tutorial covers GitHub repos, npm packages, and manual projects.

## What You'll Build

A portfolio website featuring:
- Featured project hero section
- Grid of all your projects
- Project detail pages
- Responsive design
- GitHub stars/forks data auto-populated
- Build-time data fetching

**Prerequisites:**
- Node.js 18+ installed
- Next.js project (or create one)
- TypeScript (recommended)
- GitHub account with public repos

## Step 1: Create Next.js Project

If you don't have a Next.js project, create one:

```bash
npx create-next-app@latest my-portfolio --typescript --tailwind --app
cd my-portfolio
```

## Step 2: Initialize Folio

Run the CLI to auto-detect your GitHub repositories:

```bash
npx @reallukemanning/folio init --github
```

When prompted, enter your GitHub username. Folio will:
1. Fetch all your public repositories
2. Filter out archived repos and templates
3. Ask if you want to include forks
4. Create `folio.config.ts` with all your repos

This creates a config file like:

```ts
// folio.config.ts
import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  {
    id: 'my-awesome-lib',
    type: 'github',
    repo: 'yourusername/my-awesome-lib',
    status: 'active',
  },
  {
    id: 'my-cool-package',
    type: 'github',
    repo: 'yourusername/my-cool-package',
    status: 'active',
  },
])
```

## Step 3: Add npm Packages

Add any npm packages you've published:

```ts
export const projects = defineProjects([
  {
    id: 'my-awesome-lib',
    type: 'github',
    repo: 'yourusername/my-awesome-lib',
    status: 'active',
  },
  {
    id: 'my-awesome-lib-npm',
    type: 'npm',
    package: 'my-awesome-lib',
    status: 'active',
  },
])
```

## Step 4: Add Manual Projects

Add client work or personal projects:

```ts
export const projects = defineProjects([
  {
    id: 'client-website',
    type: 'manual',
    status: 'shipped',
    name: 'Client E-commerce Site',
    tagline: 'Custom Shopify storefront',
    description: 'Full rebuild of a Shopify storefront with Next.js and Shopify API',
    stack: ['Next.js', 'TypeScript', 'Shopify', 'Tailwind'],
    links: {
      live: 'https://client-site.com',
      github: 'https://github.com/yourusername/client-site',
    },
  },
])
```

## Step 5: Mark Featured Project

Add `featured: true` to your best project:

```ts
{
  id: 'my-awesome-lib',
  type: 'github',
  repo: 'yourusername/my-awesome-lib',
  status: 'active',
  featured: true, // This will appear in the hero section
}
```

## Step 6: Install Components

Add the components you'll need:

```bash
npx folio add project-card
npx folio add project-grid
npx folio add featured-project
```

Install dependencies:

```bash
pnpm install
```

## Step 7: Add Styling

Install a pre-built theme:

```bash
npx folio add theme-minimal
```

Import the theme in your layout:

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/folio-theme-minimal.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Your Name - Developer Portfolio',
  description: 'Full-stack developer specializing in React, Next.js, and TypeScript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## Step 8: Create Portfolio Page

Create the main portfolio page with data fetching:

```tsx
// app/page.tsx
import { ProjectCard, ProjectGrid, FeaturedProject } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'

async function getProjects(): Promise<FolioProject[]> {
  const { projects: projectInputs } = await import('../folio.config')
  const { normalise } = await import('@reallukemanning/folio')
  return Promise.all(projectInputs.map((input) => normalise(input)))
}

export default async function PortfolioPage() {
  const projects = await getProjects()
  const featuredProject = projects.find((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Projects
          </h1>
          <p className="text-xl text-gray-600">
            Open source, npm packages, and client work
          </p>
        </header>

        {/* Featured Project */}
        {featuredProject && (
          <section className="mb-12">
            <FeaturedProject project={featuredProject} />
          </section>
        )}

        {/* All Projects Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            All Projects
          </h2>
          <ProjectGrid>
            {otherProjects.map((project) => (
              <ProjectCard key={project.id}>
                <ProjectCard.Header project={project} />
                <ProjectCard.Description project={project} />
                <ProjectCard.Tags project={project} />
                <ProjectCard.Stats project={project} />
                <ProjectCard.Status project={project} />
                <ProjectCard.Links project={project} />
              </ProjectCard>
            ))}
          </ProjectGrid>
        </section>
      </div>
    </main>
  )
}
```

## Step 9: Add GitHub Token (Optional)

Set a GitHub token to increase rate limits:

```bash
# .env.local
GITHUB_TOKEN=github_pat_xxxxxxxxxxxxx
```

Create a fine-grained token at [github.com/settings/personal-access-token/new](https://github.com/settings/personal-access-token/new):
1. Select **Fine-grained** token type
2. Set **Contents** permission to **Read-only**
3. Select **Only select repositories** and choose your portfolio repos
4. Set expiration to **No expiration** (recommended for CI/CD)

## Step 10: Test Locally

Run the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your portfolio.

## Step 11: Custom Styling

Add custom CSS to match your brand:

```css
/* styles/globals.css (or your CSS file) */
[data-folio-featured] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  border-radius: 1rem;
  margin-bottom: 3rem;
  color: white;
}

[data-folio-featured] h2 {
  color: white;
}

[data-folio-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

[data-folio-card] {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

[data-folio-card]:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

## Step 12: Build and Deploy

Build your portfolio:

```bash
pnpm build
```

Deploy to Vercel:

```bash
npx vercel
```

Or deploy to Netlify, GitHub Pages, or any static host.

## Complete Example

Here's the complete project structure:

```
my-portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── styles/
│   └── folio-theme-minimal.css
├── folio.config.ts
├── .env.local
├── package.json
└── tsconfig.json
```

## What's Next?

### Add Project Detail Pages

Create dynamic routes for individual projects:

```bash
mkdir -p app/projects/[id]
```

```tsx
// app/projects/[id]/page.tsx
import { notFound } from 'next/navigation'
import { ProjectView } from '@reallukemanning/folio'
import type { FolioProject } from '@reallukemanning/folio'

async function getProject(id: string) {
  const { projects: projectInputs } = await import('../../folio.config')
  const input = projectInputs.find((p) => p.id === id)
  if (!input) return null

  const { normalise } = await import('@reallukemanning/folio')
  return normalise(input)
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) notFound()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <ProjectView project={project} />
    </main>
  )
}
```

### Add Search and Filter

Add interactive filtering to your portfolio:

```tsx
'use client'

import { useState } from 'react'
import {
  ProjectSearch,
  ProjectFilterBar,
  ProjectFilterTag,
  useProjectSearch,
  useProjectFilters,
} from '@reallukemanning/folio'

function InteractivePortfolio({ projects }) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const allTags = [...new Set(projects.flatMap(p => p.stack))]

  const filteredByTags = useProjectFilters(projects, selectedTags)
  const filteredProjects = useProjectSearch(filteredByTags, query)

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
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

      <ProjectGrid>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id}>
            <ProjectCard.Header project={project} />
            <ProjectCard.Description project={project} />
            <ProjectCard.Tags project={project} />
            <ProjectCard.Stats project={project} />
            <ProjectCard.Links project={project} />
          </ProjectCard>
        ))}
      </ProjectGrid>
    </div>
  )
}
```

### Add SEO Metadata

Add proper metadata for search engines:

```tsx
// app/page.tsx
import { generatePortfolioMetadata } from '@reallukemanning/folio'

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
```

## Troubleshooting

### GitHub API Rate Limit

If you see `GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit)`, set a GitHub token:

```bash
echo "GITHUB_TOKEN=github_pat_xxx" >> .env.local
```

### Missing Stars/Forks

GitHub stats might be missing if:
- Repo is private (add GITHUB_TOKEN)
- Rate limit exceeded (add GITHUB_TOKEN)
- Repo doesn't have any stars/forks yet

### Build Errors

If build fails:

1. Check `folio.config.ts` has valid syntax
2. Verify GitHub repos exist and are public
3. Ensure `@reallukemanning/folio` is installed
4. Check TypeScript config includes `moduleResolution: "bundler"`

## Additional Resources

- [Installation Guide](./installation) - Detailed setup instructions
- [Using Components](./using-components) - Component integration patterns
- [Styling Guide](./styling) - Customizing your portfolio
- [Project Types](./project-types) - All available project types
- [Examples](/examples/) - More code examples
- [Component API](../api/components/) - All available components
