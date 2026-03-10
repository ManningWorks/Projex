# Getting Started: Build a Solo Developer Portfolio

Complete walkthrough for building a portfolio website with Projex. This tutorial covers GitHub repos, npm packages, and manual projects.

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

## Step 2: Initialize Projex

Run the CLI to auto-detect your GitHub repositories:

```bash
npx @manningworks/projex init --github
```

When prompted, enter your GitHub username. Projex will:
1. Fetch all your public repositories
2. Filter out archived repos and templates
3. Ask if you want to include forks
4. Create `projex.config.ts` with all your repos

This creates a config file like:

```ts
// projex.config.ts
import { defineProjects } from '@manningworks/projex'

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

**Tip:** Enable npm timestamps to sort your packages by when they were last updated:

```ts
export const projects = defineProjects([
  // ...projects
], {
  fetchNpmTimestamps: true,  // Extracts createdAt/updatedAt from npm registry
})
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

## Step 4a: Add YouTube Channels (Optional)

If you have a YouTube channel, add it to display subscriber count, views, and latest video:

```ts
export const projects = defineProjects([
  {
    id: 'tech-channel',
    type: 'youtube',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    status: 'active',
    featured: true,
  },
])
```

**Getting your Channel ID:**

1. Go to your YouTube channel page
2. Check the URL: `youtube.com/channel/[CHANNEL_ID]` or `youtube.com/@username`
3. For custom URLs, use the [channel lookup tool](https://commentpicker.com/youtube-channel-id.php) or inspect the page source

**Setting up the API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials → API key
5. Add to your environment:

```bash
# .env.local
YOUTUBE_TOKEN=your_api_key_here
```

**Note:** YouTube API has a quota of 10,000 units per day. Channel fetches use ~2 units (1 for channel data, 1 for latest video).

## Step 4b: Add Gumroad Products (Optional)

For digital products sold on Gumroad, add them to display revenue and sales:

```ts
export const projects = defineProjects([
  {
    id: 'design-course',
    type: 'gumroad',
    productId: 'prod_test123',
    status: 'shipped',
    name: 'Advanced Design Patterns',
    tagline: 'Master modern UI/UX principles',
    description: 'Comprehensive course on component design...',
  },
])
```

**Getting your Product ID:**

1. Go to [Gumroad Products](https://app.gumroad.com/products)
2. Click on a product
3. Copy the ID from the URL: `gumroad.com/l/[PRODUCT_SLUG]` or from the product settings
4. Product IDs typically start with `prod_`

**Setting up the Access Token:**

1. Go to [Gumroad Settings](https://app.gumroad.com/settings/api_tokens)
2. Click "Create Access Token"
3. Give it a name (e.g., "Projex Portfolio")
4. Copy the token and add to your environment:

```bash
# .env.local
GUMROAD_TOKEN=your_access_token_here
```

**Note:** Gumroad API is rate limited. Returns `null` on rate limit errors with a console warning.

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
npx projex add project-card
npx projex add project-grid
npx projex add featured-project
```

Install dependencies:

```bash
pnpm install
```

## Step 7: Add Styling

Install a pre-built theme:

```bash
npx projex add theme-minimal
```

Import the theme in your layout:

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './styles/projex-theme-minimal.css'

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
import { ProjectCard, ProjectGrid, FeaturedProject } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'

async function getProjects(): Promise<ProjexProject[]> {
  const { projects: projectInputs } = await import('../projex.config')
  const { normalise } = await import('@manningworks/projex')
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
[data-projex-featured] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem;
  border-radius: 1rem;
  margin-bottom: 3rem;
  color: white;
}

[data-projex-featured] h2 {
  color: white;
}

[data-projex-grid] {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

[data-projex-card] {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

[data-projex-card]:hover {
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
│   └── projex-theme-minimal.css
├── projex.config.ts
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
import { ProjectView } from '@manningworks/projex'
import type { ProjexProject } from '@manningworks/projex'

async function getProject(id: string) {
  const { projects: projectInputs } = await import('../../projex.config')
  const input = projectInputs.find((p) => p.id === id)
  if (!input) return null

  const { normalise } = await import('@manningworks/projex')
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
} from '@manningworks/projex'

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
import { generatePortfolioMetadata } from '@manningworks/projex'

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

1. Check `projex.config.ts` has valid syntax
2. Verify GitHub repos exist and are public
3. Ensure `@manningworks/projex` is installed
4. Check TypeScript config includes `moduleResolution: "bundler"`

## Additional Resources

- [Installation Guide](./installation) - Detailed setup instructions
- [Using Components](./using-components) - Component integration patterns
- [Styling Guide](./styling) - Customizing your portfolio
- [Project Types](./project-types) - All available project types
- [Examples](/examples/) - More code examples
- [Component API](../api/components/) - All available components
