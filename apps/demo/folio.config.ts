import { defineProjects } from '@folio/core'

export const projects = defineProjects([
  {
    id: 'folio',
    type: 'github',
    repo: 'username/folio',
    status: 'in-progress',
    featured: true,
    background: 'Every developer builds a projects page from scratch. I got tired of solving the same problem.',
    why: 'No existing solution handled the reality of a solopreneur project mix — private repos, client work, npm packages, and unreleased ideas all in one place.',
    stack: ['TypeScript', 'React', 'Next.js', 'shadcn/ui'],
    struggles: [
      { type: 'warn', text: 'Deciding between npm package and shadcn-style distribution took longer than expected.' },
      { type: 'error', text: 'GitHub API rate limiting at 60req/hr unauthenticated is brutal. Build-time fetching is the only sane answer.' },
    ],
    timeline: [
      { date: '2025-01-10', note: 'Initial concept and research' },
      { date: '2025-01-18', note: 'First working prototype' },
    ],
    posts: [
      { title: 'Why I Built Folio', date: '2025-01-14', url: '/blog/why-i-built-folio' },
    ],
  },
  {
    id: 'client-ecommerce',
    type: 'manual',
    status: 'shipped',
    name: 'Client — Fashion E-commerce',
    tagline: 'Headless Shopify rebuild for a UK fashion brand',
    description: 'Full stack rebuild of a Shopify storefront. Custom checkout, real-time inventory, Sanity CMS.',
    stack: ['Next.js', 'Shopify', 'Sanity', 'TypeScript'],
    links: { live: 'https://example.com' },
    background: 'The client was on a heavily customised Shopify theme that had become unmaintainable.',
    struggles: [
      { type: 'error', text: 'Shopify Storefront API cart persistence across subdomains cost two days to debug.' },
    ],
  },
  {
    id: 'secret-project',
    type: 'github',
    repo: 'username/secret-project',
    status: 'coming-soon',
    override: {
      name: 'Secret Project',
      description: 'Something exciting. Not ready to share yet.',
    },
  },
  {
    id: 'shipfast',
    type: 'github',
    repo: 'user/shipfast',
    status: 'shipped',
    links: {
      github: 'https://github.com/user/shipfast',
      live: 'https://shipfast.dev'
    },
    stack: ['Next.js', 'TailwindCSS', 'Prisma', 'Stripe'],
    background: 'ShipFast helps developers go from idea to revenue in weeks instead of months. It includes authentication, payments, and more out of the box.',
    timeline: [
      { date: '2023-06', note: 'Started development' },
      { date: '2023-09', note: 'Launched v1.0' },
      { date: '2023-12', note: 'Reached 1000+ users' }
    ],
    posts: [
      { title: 'How I Built a SaaS in 2 Weeks', date: '2023-09-10', url: 'https://blog.shipfast.dev/how-i-built-it' }
    ],
    struggles: [
      { type: 'error', text: 'Dealing with database migration issues in production' }
    ]
  },
  {
    id: 'portfolio-v2',
    type: 'github',
    repo: 'user/portfolio-v2',
    status: 'in-progress',
    links: {
      github: 'https://github.com/user/portfolio-v2'
    },
    stack: ['React Three Fiber', 'Next.js', 'Framer Motion'],
    background: 'After success of my first portfolio, I wanted to push the boundaries with immersive 3D experiences.',
    timeline: [
      { date: '2024-02', note: 'Started planning and design' },
      { date: '2024-03', note: 'Core 3D engine built' },
      { date: '2024-04', note: 'Currently working on content migration' }
    ],
    posts: [
      { title: 'Building 3D Portfolio with R3F', date: '2024-03-05' }
    ],
    struggles: [
      { type: 'warn', text: 'Performance optimization for mobile devices is challenging' },
      { type: 'warn', text: 'Balancing visual effects with accessibility' }
    ]
  },
  {
    id: 'ai-assistant',
    type: 'github',
    repo: 'user/ai-assistant',
    status: 'coming-soon',
    links: {
      github: 'https://github.com/user/ai-assistant'
    },
    stack: ['TypeScript', 'LangChain', 'Vercel AI SDK'],
    background: 'Existing AI assistants often sacrifice privacy. This project focuses on local-first AI with optional cloud sync.',
    timeline: [
      { date: '2024-01', note: 'Research phase completed' },
      { date: '2024-04', note: 'Expected beta launch' }
    ],
    posts: [],
    struggles: [
      { type: 'warn', text: 'Determining the right local LLM to bundle' }
    ]
  },
  {
    id: 'legacy-ecommerce',
    type: 'manual',
    status: 'archived',
    name: 'Legacy E-commerce',
    tagline: 'First major project - no longer maintained',
    description: 'First major project - no longer maintained',
    links: {
      github: 'https://github.com/user/legacy-ecommerce'
    },
    stack: ['PHP', 'MySQL', 'jQuery'],
    background: 'This was my first full-stack project. It taught me the fundamentals of web development but has been superseded by newer technologies.',
    timeline: [
      { date: '2020-05', note: 'Project started' },
      { date: '2022-01', note: 'Reached 100 active users' },
      { date: '2023-06', note: 'Archived due to maintenance burden' }
    ],
    posts: [
      { title: 'Lessons from My First Major Project', date: '2023-06-15' }
    ],
    struggles: [
      { type: 'error', text: 'Code quality issues in early iterations' }
    ]
  },
  {
    id: 'starter-kit',
    type: 'manual',
    status: 'for-sale',
    name: 'Indie Starter Kit',
    tagline: 'Complete starter kit for indie hackers',
    description: 'Complete starter kit for indie hackers - available for purchase',
    links: {
      live: 'https://indiestarter.dev'
    },
    stats: {
      downloads: '250'
    },
    stack: ['Next.js', 'Supabase', 'Stripe', 'Resend'],
    background: 'After launching multiple products, I bundled the best patterns into a reusable starter kit.',
    timeline: [
      { date: '2023-11', note: 'Released v1.0' },
      { date: '2024-02', note: 'Released v2.0 with more features' }
    ],
    posts: [
      { title: 'Why I Built a Starter Kit', date: '2023-11-20', url: 'https://blog.indiestarter.dev/why-i-built-it' }
    ],
    struggles: []
  },
  {
    id: 'react-utilities',
    type: 'npm',
    package: 'react-utilities',
    status: 'active',
    name: 'React Utilities',
    tagline: 'Collection of utility functions',
    description: 'Collection of utility functions for React projects',
    links: {
      github: 'https://github.com/user/react-utilities',
      npm: 'https://npmjs.com/package/react-utilities'
    },
    stats: {
      downloads: '50000'
    },
    stack: ['TypeScript', 'Vitest', 'Rollup'],
    background: 'Common patterns I found myself copying between projects, now available as a standalone package.',
    timeline: [
      { date: '2023-08', note: 'Initial release' },
      { date: '2024-01', note: 'v2.0 with TypeScript improvements' }
    ],
    posts: [],
    struggles: [
      { type: 'warn', text: 'Keeping documentation in sync with releases' }
    ]
  },
  {
    id: 'analytics-dashboard',
    type: 'hybrid',
    repo: 'user/analytics-dashboard',
    package: 'analytics-dashboard',
    status: 'active',
    links: {
      github: 'https://github.com/user/analytics-dashboard',
      live: 'https://analytics.dev'
    },
    stats: {
      downloads: '1200'
    },
    stack: ['Next.js', 'ClickHouse', 'React'],
    background: 'Analytics should not require sacrificing user privacy. This dashboard provides real-time insights without tracking individual users.',
    timeline: [
      { date: '2023-12', note: 'SDK development started' },
      { date: '2024-01', note: 'Dashboard MVP built' },
      { date: '2024-02', note: 'Public launch' }
    ],
    posts: [
      { title: 'Building Privacy-First Analytics', date: '2024-02-28', url: 'https://blog.analytics.dev/privacy-first' }
    ],
    struggles: [
      { type: 'warn', text: 'Query performance optimization for large datasets' }
    ],
  }
])
