import type { FolioProjectInput } from '@reallukemanning/folio'

export const exampleConfigs: Record<string, FolioProjectInput> = {
  react: {
    id: 'react',
    type: 'github',
    repo: 'facebook/react',
    status: 'active',
    commits: 5,
  },
  nextjs: {
    id: 'nextjs',
    type: 'hybrid',
    repo: 'vercel/next.js',
    package: 'next',
    status: 'active',
    commits: 5,
  },
  tailwindcss: {
    id: 'tailwindcss',
    type: 'github',
    repo: 'tailwindlabs/tailwindcss',
    status: 'active',
    commits: 5,
  },
  lodash: {
    id: 'lodash',
    type: 'npm',
    package: 'lodash',
    status: 'active',
  },
  'date-fns': {
    id: 'date-fns',
    type: 'npm',
    package: 'date-fns',
    status: 'active',
  },
  zod: {
    id: 'zod',
    type: 'npm',
    package: 'zod',
    status: 'active',
  },
  'tailwind-merge': {
    id: 'tailwind-merge',
    type: 'hybrid',
    repo: 'dcastil/tailwind-merge',
    package: 'tailwind-merge',
    status: 'active',
    commits: 5,
  },
  portfolio: {
    id: 'portfolio',
    type: 'manual',
    status: 'active',
    name: 'My Portfolio',
    tagline: 'Personal project showcase',
    description: 'A complete portfolio website showcasing my projects and work.',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind'],
    links: {
      live: 'https://myportfolio.dev',
      github: 'https://github.com/user/portfolio',
    },
    background: 'After years of building projects, I wanted a central place to showcase my work.',
    why: 'No existing solution handled the mix of project types I work on.',
    timeline: [
      { date: '2024-01', note: 'Initial design' },
      { date: '2024-02', note: 'Development started' },
      { date: '2024-03', note: 'Launched' },
    ],
  },
}
