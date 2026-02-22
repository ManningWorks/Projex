import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  {
    id: 'folio',
    type: 'manual',
    status: 'active',
    featured: true,
    name: 'Folio',
    tagline: 'Project showcase component library',
    description: 'A shadcn-style component library for developers building project showcase pages.',
    background: 'Every developer eventually builds a projects page, and almost every developer builds it from scratch. Folio provides a flexible, data-driven approach.',
    why: 'No existing solution handled the reality of a solopreneur project mix — private repos, client work, npm packages, and unreleased ideas all in one place.',
    stack: ['TypeScript', 'React', 'Next.js', 'VitePress'],
    struggles: [
      { type: 'warn', text: 'Deciding between npm package and shadcn-style distribution took longer than expected.' },
    ],
    timeline: [
      { date: '2025-01', note: 'Initial concept and research' },
      { date: '2025-02', note: 'v1.0 release' },
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
    id: 'tailwindcss',
    type: 'github',
    repo: 'tailwindlabs/tailwindcss',
    status: 'shipped',
    links: {
      github: 'https://github.com/tailwindlabs/tailwindcss',
      live: 'https://tailwindcss.com'
    },
    stack: ['TypeScript', 'PostCSS', 'Node.js'],
    background: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom designs.',
    timeline: [
      { date: '2017-11', note: 'Initial release' },
      { date: '2023-01', note: 'v3.0 release' },
    ],
  },
  {
    id: 'portfolio-v2',
    type: 'github',
    repo: 'vercel/next.js',
    status: 'active',
    links: {
      github: 'https://github.com/vercel/next.js',
      live: 'https://nextjs.org'
    },
    stack: ['React', 'TypeScript', 'Node.js'],
    background: 'After success of first portfolio, wanted to push boundaries with modern React patterns.',
    timeline: [
      { date: '2016', note: 'Next.js created' },
      { date: '2024', note: 'App Router stable release' },
    ],
    posts: [
      { title: 'Introduction to Next.js', date: '2024-01-01' }
    ],
    struggles: [
      { type: 'warn', text: 'Balancing feature velocity with stability' },
      { type: 'warn', text: 'Documentation maintenance across versions' }
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
      { date: '2023-06', note: 'Archived due to maintenance burden' },
    ],
  },
  {
    id: 'indie-starter',
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
    background: 'After launching multiple products, bundled the best patterns into a reusable starter kit.',
    timeline: [
      { date: '2023-11', note: 'Released v1.0' },
      { date: '2024-02', note: 'Released v2.0 with more features' },
    ],
  },
  {
    id: 'react-query',
    type: 'github',
    repo: 'TanStack/query',
    status: 'active',
    links: {
      github: 'https://github.com/TanStack/query',
      npm: 'https://npmjs.com/package/@tanstack/react-query'
    },
    stack: ['TypeScript', 'React', 'Testing Library'],
    background: 'TanStack Query (formerly React Query) is a powerful data synchronization library for React.',
    timeline: [
      { date: '2018', note: 'Initial release as React Query' },
      { date: '2022', note: 'Rebranded to TanStack Query' },
    ],
    struggles: [
      { type: 'warn', text: 'Managing ecosystem complexity across multiple frameworks' }
    ]
  },
  {
    id: 'analytics-dashboard',
    type: 'manual',
    status: 'active',
    links: {
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
      { date: '2024-02', note: 'Public launch' },
    ],
    posts: [
      { title: 'Building Privacy-First Analytics', date: '2024-02-28', url: 'https://blog.analytics.dev/privacy-first' }
    ],
    struggles: [
      { type: 'warn', text: 'Query performance optimization for large datasets' }
    ],
  }
])
