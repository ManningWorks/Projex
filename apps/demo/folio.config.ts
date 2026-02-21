import { defineProjects } from '@folio/core'

export const projects = defineProjects([
  {
    id: 'folio',
    name: 'Folio',
    description: 'A shadcn-style component library for project showcase pages',
    type: 'github',
    status: 'active',
    links: {
      github: 'https://github.com/anomalyco/folio',
      live: 'https://folio.dev'
    },
    techStack: ['TypeScript', 'React', 'Next.js', 'shadcn/ui'],
    background: 'Folio was created to solve a common problem: developers want beautiful project showcase pages without building custom layouts from scratch.',
    timeline: [
      { date: '2024-01', note: 'Initial concept and MVP development' },
      { date: '2024-02', note: 'Core component library built' },
      { date: '2024-03', note: 'Public beta launch' }
    ],
    posts: [
      { title: 'Introducing Folio: Project Showcase Made Simple', date: '2024-03-15', url: 'https://blog.folio.dev/introducing-folio' },
      { title: 'Building with shadcn/ui Patterns', date: '2024-02-20' }
    ],
    struggles: [
      { type: 'warn', text: 'Currently working on improving build performance for large project lists' },
      { type: 'warn', text: 'Documentation needs expansion for advanced use cases' }
    ]
  },
  {
    id: 'shipfast',
    name: 'ShipFast',
    description: 'AI-powered boilerplate to launch SaaS products faster',
    type: 'github',
    status: 'shipped',
    links: {
      github: 'https://github.com/user/shipfast',
      live: 'https://shipfast.dev'
    },
    techStack: ['Next.js', 'TailwindCSS', 'Prisma', 'Stripe'],
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
    name: 'Portfolio v2',
    description: 'Next-generation personal portfolio website with 3D effects',
    type: 'github',
    status: 'in-progress',
    links: {
      github: 'https://github.com/user/portfolio-v2'
    },
    techStack: ['React Three Fiber', 'Next.js', 'Framer Motion'],
    background: 'After the success of my first portfolio, I wanted to push the boundaries with immersive 3D experiences.',
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
    name: 'AI Assistant',
    description: 'Privacy-focused AI chatbot for developers',
    type: 'github',
    status: 'coming-soon',
    links: {
      github: 'https://github.com/user/ai-assistant'
    },
    techStack: ['TypeScript', 'LangChain', 'Vercel AI SDK'],
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
    name: 'Legacy E-commerce',
    description: 'First major project - no longer maintained',
    type: 'manual',
    status: 'archived',
    links: {
      github: 'https://github.com/user/legacy-ecommerce'
    },
    techStack: ['PHP', 'MySQL', 'jQuery'],
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
    name: 'Indie Starter Kit',
    description: 'Complete starter kit for indie hackers - available for purchase',
    type: 'manual',
    status: 'for-sale',
    links: {
      live: 'https://indiestarter.dev'
    },
    stats: {
      downloads: '250'
    },
    techStack: ['Next.js', 'Supabase', 'Stripe', 'Resend'],
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
    name: 'React Utilities',
    description: 'Collection of utility functions for React projects',
    type: 'npm',
    status: 'active',
    links: {
      github: 'https://github.com/user/react-utilities',
      npm: 'https://npmjs.com/package/react-utilities'
    },
    stats: {
      downloads: '50000'
    },
    techStack: ['TypeScript', 'Vitest', 'Rollup'],
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
    name: 'Analytics Dashboard',
    description: 'Privacy-focused analytics dashboard with open-source SDK',
    type: 'hybrid',
    status: 'active',
    links: {
      github: 'https://github.com/user/analytics-dashboard',
      live: 'https://analytics.dev'
    },
    stats: {
      downloads: '1200'
    },
    techStack: ['Next.js', 'ClickHouse', 'React'],
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
    language: 'TypeScript',
    languageColor: '#3178c6'
  }
])
