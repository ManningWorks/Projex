import { defineProjects } from '@folio/core'

export const projects = defineProjects([
  {
    id: 'demo-project',
    name: 'Demo Project',
    description: 'A sample project to demonstrate the Folio component library',
    type: 'github',
    status: 'active',
    links: {
      github: 'https://github.com/example/folio',
      live: 'https://folio.example.com'
    },
    tags: ['TypeScript', 'React', 'Next.js'],
    background: 'This project was created to showcase the Folio component library features.',
    techStack: ['TypeScript', 'React', 'Next.js', 'shadcn/ui']
  }
])
