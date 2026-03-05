import { defineProjects } from '@reallukemanning/folio'

export const { projects } = defineProjects([
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
    commits: 5,
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
    ],
    commits: 3,
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
  },
  {
    id: 'component-library',
    type: 'manual',
    status: 'active',
    name: 'Component Library',
    tagline: 'Demo of custom links and ordering',
    description: 'Example showing docs, demo, and custom links with custom ordering.',
    links: {
      github: 'https://github.com/user/component-library',
      live: 'https://components.dev',
      docs: 'https://docs.components.dev',
      demo: 'https://demo.components.dev',
      custom: [
        { label: 'Storybook', url: 'https://storybook.components.dev' },
        { label: 'Discord', url: 'https://discord.gg/abcdef' }
      ]
    },
    linkOrder: ['github', 'docs', 'demo', 'live', 'custom'],
    stack: ['React', 'TypeScript', 'Storybook'],
    background: 'Modern component library with comprehensive documentation and interactive demos.',
    timeline: [
      { date: '2024-01', note: 'Initial component set' },
      { date: '2024-02', note: 'Documentation site launched' },
    ],
  },
  {
    id: 'my-youtube-channel',
    type: 'youtube',
    channelId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    status: 'active',
    featured: true,
    name: 'My YouTube Channel',
    tagline: 'Tech tutorials and coding tips',
    description: 'A YouTube channel focused on teaching web development, React, and TypeScript.',
    stack: ['Video', 'Education', 'Web Development'],
    background: 'Started creating tutorials to help developers learn modern web technologies.',
    timeline: [
      { date: '2023-06', note: 'Channel created' },
      { date: '2023-12', note: 'Reached 1000 subscribers' },
      { date: '2024-05', note: 'Hit 100K total views' },
    ],
    struggles: [
      { type: 'warn', text: 'Finding time to produce high-quality content consistently' }
    ]
  },
  {
    id: 'my-digital-product',
    type: 'gumroad',
    productId: 'prod_test123',
    status: 'shipped',
    name: 'React Component Patterns',
    tagline: 'E-book on advanced React patterns',
    description: 'A comprehensive guide to mastering advanced React component patterns and architectures.',
    stack: ['React', 'TypeScript', 'eBook'],
    background: 'Created to share knowledge gained from building complex React applications.',
    timeline: [
      { date: '2024-01', note: 'Started writing' },
      { date: '2024-03', note: 'Launched on Gumroad' },
      { date: '2024-04', note: 'Reached 100 sales' },
    ],
    struggles: [
      { type: 'warn', text: 'Balancing depth vs accessibility in explanations' }
    ]
  },
  {
    id: 'my-saas-app',
    type: 'lemonsqueezy',
    storeId: '1',
    status: 'active',
    name: 'SaaS Starter',
    tagline: 'Complete SaaS boilerplate',
    description: 'A production-ready SaaS starter kit with authentication, billing, and deployment.',
    stack: ['Next.js', 'Lemon Squeezy', 'Supabase'],
    background: 'Built after launching multiple SaaS products to avoid reinventing the wheel.',
    timeline: [
      { date: '2024-02', note: 'Development started' },
      { date: '2024-03', note: 'Beta launch' },
      { date: '2024-05', note: 'Official v1.0 release' },
    ],
    struggles: [
      { type: 'warn', text: 'Maintaining documentation alongside features' }
    ]
  },
  {
    id: 'my-blog',
    type: 'devto',
    username: 'ben',
    status: 'active',
    name: 'My Dev.to Blog',
    tagline: 'Technical articles and tutorials',
    description: 'Writing about web development, software architecture, and developer experience.',
    stack: ['Writing', 'Education', 'Web Development'],
    background: 'Started writing to solidify my own understanding and help others learn.',
    timeline: [
      { date: '2023-08', note: 'Published first article' },
      { date: '2024-01', note: 'Reached 50 articles' },
      { date: '2024-06', note: 'Hit 100K total views' },
    ],
    struggles: [
      { type: 'warn', text: 'Consistency in posting schedule' }
    ]
  },
  {
    id: 'zustand',
    type: 'github',
    repo: 'pmndrs/zustand',
    status: 'active',
    links: {
      github: 'https://github.com/pmndrs/zustand',
      npm: 'https://npmjs.com/package/zustand',
      docs: 'https://docs.pmnd.rs/zustand'
    },
    stack: ['TypeScript', 'React', 'State Management'],
    background: 'Zustand is a small, fast, and scalable state-management solution using simplified flux principles.',
    why: 'Built to provide a simpler alternative to Redux with better TypeScript support.',
    timeline: [
      { date: '2019', note: 'Initial release' },
      { date: '2021', note: 'Reached 10k GitHub stars' },
      { date: '2023', note: 'v4.0 release with middleware support' },
    ],
    commits: 5,
    posts: [
      { title: 'Why Zustand over Redux?', date: '2023-06-15', url: 'https://dev.to/why-zustand' },
      { title: 'Using Zustand with TypeScript', date: '2023-08-20', url: 'https://dev.to/zustand-ts' }
    ],
    struggles: [
      { type: 'warn', text: 'Balancing simplicity with feature requests from the community' },
      { type: 'error', text: 'Breaking changes in v4 required careful migration guide documentation' }
    ]
  },
  {
    id: 'swr',
    type: 'github',
    repo: 'vercel/swr',
    status: 'active',
    links: {
      github: 'https://github.com/vercel/swr',
      live: 'https://swr.vercel.app'
    },
    stack: ['TypeScript', 'React', 'Data Fetching'],
    background: 'SWR is a React Hooks library for data fetching. The name "SWR" is derived from stale-while-revalidate.',
    why: 'Built to provide a lightweight alternative to React Query with React Suspense support.',
    timeline: [
      { date: '2020', note: 'Initial release by Vercel' },
      { date: '2021', note: 'Reached 20k GitHub stars' },
      { date: '2023', note: 'v2.0 release with improved TypeScript types' },
    ],
    commits: 3,
    struggles: [
      { type: 'warn', text: 'Handling concurrent requests in older browsers' }
    ]
  },
  {
    id: 'zod',
    type: 'npm',
    package: 'zod',
    status: 'active',
    links: {
      npm: 'https://npmjs.com/package/zod',
      github: 'https://github.com/colinhacks/zod',
      docs: 'https://zod.dev'
    },
    stack: ['TypeScript', 'Validation', 'Schema'],
    background: 'Zod is a TypeScript-first schema declaration and validation library.',
    why: 'Built to eliminate the need for external validation libraries by leveraging TypeScript types.',
    timeline: [
      { date: '2020', note: 'Initial release' },
      { date: '2022', note: 'v3.0 major rewrite' },
      { date: '2023', note: 'Reached 1M weekly downloads' },
    ],
    posts: [
      { title: 'Why Zod for validation?', date: '2023-03-10' }
    ],
    struggles: [
      { type: 'error', text: 'v3.0 had breaking changes that required community migration effort' },
      { type: 'warn', text: 'Performance optimization for large schemas' }
    ]
  },
  {
    id: 'date-fns',
    type: 'npm',
    package: 'date-fns',
    status: 'active',
    links: {
      npm: 'https://npmjs.com/package/date-fns',
      github: 'https://github.com/date-fns/date-fns',
      docs: 'https://date-fns.org'
    },
    stack: ['TypeScript', 'Date', 'Utilities'],
    background: 'Date-fns provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript dates.',
    why: 'Built as a modular alternative to Moment.js with better tree-shaking support.',
    timeline: [
      { date: '2016', note: 'Initial release' },
      { date: '2019', note: 'v2.0 with TypeScript support' },
      { date: '2021', note: 'Reached 10M weekly downloads' },
    ],
    struggles: [
      { type: 'warn', text: 'Maintaining timezone database' },
      { type: 'warn', text: 'Balancing module count with bundle size' }
    ]
  },
  {
    id: 'tailwind-merge',
    type: 'hybrid',
    repo: 'dcastil/tailwind-merge',
    package: 'tailwind-merge',
    status: 'active',
    links: {
      github: 'https://github.com/dcastil/tailwind-merge',
      npm: 'https://npmjs.com/package/tailwind-merge',
      docs: 'https://github.com/dcastil/tailwind-merge'
    },
    stack: ['TypeScript', 'Tailwind CSS', 'Utilities'],
    background: 'Utility function to merge Tailwind CSS classes without style conflicts.',
    why: 'Solved the common problem of merging Tailwind classes from different sources.',
    timeline: [
      { date: '2021', note: 'Initial release' },
      { date: '2022', note: 'Reached 5M weekly downloads' },
      { date: '2023', note: 'v2.0 with improved conflict resolution' },
    ],
    commits: 5,
    struggles: [
      { type: 'warn', text: 'Handling arbitrary values and variants' }
    ]
  },
  {
    id: 'clsx',
    type: 'hybrid',
    repo: 'lukeed/clsx',
    package: 'clsx',
    status: 'active',
    links: {
      github: 'https://github.com/lukeed/clsx',
      npm: 'https://npmjs.com/package/clsx',
      docs: 'https://github.com/lukeed/clsx'
    },
    stack: ['TypeScript', 'Utilities', 'Tiny'],
    background: 'A tiny (228B) utility for constructing className strings conditionally.',
    why: 'Built as a smaller alternative to classnames with better TypeScript support.',
    timeline: [
      { date: '2018', note: 'Initial release' },
      { date: '2020', note: 'Reached 10M weekly downloads' },
    ],
    commits: 3,
    struggles: [
      { type: 'warn', text: 'Maintaining zero dependencies' }
    ]
  },
  {
    id: 'product-launch',
    type: 'product-hunt',
    slug: 'my-awesome-product',
    status: 'shipped',
    links: {
      live: 'https://producthunt.com/posts/my-awesome-product',
      demo: 'https://demo.myproduct.com'
    },
    stack: ['Next.js', 'Stripe', 'Supabase'],
    background: 'Launched a SaaS product for indie developers on Product Hunt.',
    why: 'Wanted to share the product with the Product Hunt community and get initial feedback.',
    timeline: [
      { date: '2024-01', note: 'Started development' },
      { date: '2024-03', note: 'Product Hunt launch day' },
      { date: '2024-03', note: 'Reached #5 Product of the Day' },
    ],
    posts: [
      { title: 'How we launched on Product Hunt', date: '2024-03-15', url: 'https://blog.example.com/ph-launch' }
    ],
    struggles: [
      { type: 'warn', text: 'Handling launch day traffic spikes' },
      { type: 'error', text: 'Last-minute bug fix during launch' }
    ]
  },
  {
    id: 'side-project-idea',
    type: 'manual',
    status: 'coming-soon',
    name: 'Side Project Idea',
    tagline: 'An exciting new project in planning',
    description: 'Working on a new idea that combines AI with developer tools.',
    stack: ['Next.js', 'OpenAI', 'PostgreSQL'],
    background: 'After months of research, ready to start building this new project.',
    why: 'Saw a gap in the market for AI-powered developer assistance tools.',
    timeline: [
      { date: '2024-01', note: 'Initial idea conception' },
      { date: '2024-04', note: 'Market research complete' },
      { date: '2024-06', note: 'Planned development start' },
    ],
    struggles: [
      { type: 'warn', text: 'Deciding on the right AI model for the use case' },
      { type: 'warn', text: 'Defining MVP features vs. nice-to-have' }
    ]
  },
  {
    id: 'mobile-app',
    type: 'manual',
    status: 'in-progress',
    name: 'Mobile App Companion',
    tagline: 'React Native app for web services',
    description: 'Building a React Native companion app for existing web services.',
    image: 'https://via.placeholder.com/1200x600?text=Mobile+App',
    stack: ['React Native', 'Expo', 'TypeScript'],
    background: 'Users requested mobile access to the web platform.',
    why: 'Expanding reach to mobile users and improving accessibility.',
    timeline: [
      { date: '2024-02', note: 'Started mobile feasibility study' },
      { date: '2024-03', note: 'MVP development started' },
      { date: '2024-05', note: 'Beta testing with select users' },
    ],
    links: {
      appStore: 'https://apps.apple.com/app/companion',
      playStore: 'https://play.google.com/store/apps/companion'
    },
    struggles: [
      { type: 'error', text: 'Syncing state between web and mobile app' },
      { type: 'warn', text: 'Platform-specific UI differences' }
    ]
  },
  {
    id: 'design-system',
    type: 'manual',
    status: 'active',
    name: 'Design System',
    tagline: 'Internal design system for projects',
    description: 'A comprehensive design system with components, tokens, and documentation.',
    image: 'https://via.placeholder.com/1200x600?text=Design+System',
    stack: ['React', 'Figma', 'Storybook', 'TypeScript'],
    background: 'Inconsistent UI across multiple projects led to creating a unified design system.',
    why: 'Speed up development and ensure consistent user experience.',
    timeline: [
      { date: '2023-09', note: 'Started design system research' },
      { date: '2023-12', note: 'v1.0 release with core components' },
      { date: '2024-03', note: 'Documentation site launched' },
    ],
    links: {
      github: 'https://github.com/user/design-system',
      docs: 'https://design-system.dev',
      demo: 'https://storybook.design-system.dev'
    },
    linkOrder: ['docs', 'demo', 'github'],
    struggles: [
      { type: 'warn', text: 'Adoption across different teams' },
      { type: 'warn', text: 'Keeping components in sync with Figma' }
    ]
  },
  {
    id: 'open-source-lib',
    type: 'github',
    repo: 'user/open-source-lib',
    status: 'active',
    links: {
      github: 'https://github.com/user/open-source-lib',
      npm: 'https://npmjs.com/package/open-source-lib'
    },
    stack: ['TypeScript', 'React', 'Utilities'],
    background: 'Created a utility library to solve a recurring problem across projects.',
    why: 'Wanted to contribute back to the open source community.',
    timeline: [
      { date: '2023-11', note: 'Initial concept' },
      { date: '2024-01', note: 'First public release' },
      { date: '2024-04', note: 'First external contribution' },
    ],
    commits: 5,
    override: {
      description: 'A powerful utility library for React developers with hooks, utilities, and components.'
    },
    struggles: [
      { type: 'warn', text: 'Balancing feature scope' },
      { type: 'warn', text: 'Writing comprehensive tests' }
    ]
  }
], { commits: 5 })
