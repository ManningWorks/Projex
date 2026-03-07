import { defineConfig } from 'vitepress'
import react from '@vitejs/plugin-react'

export default defineConfig({
  vite: {
    plugins: [
      react({
        include: /\.(jsx|tsx)$/,
      }),
    ],
    ssr: {
      noExternal: ['@reallukemanning/folio'],
    },
  },
  title: 'Folio',
  description: 'A shadcn-style component library for project showcase pages',
  srcDir: 'src',
  cleanUrls: true,
  base: '/',
  appearance: 'dark',
  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Examples', link: '/examples/index' },
      { text: 'Guides', link: '/guides/index' },
      { text: 'Performance', link: '/performance' },
      { text: 'API Reference', link: '/api/components/' },
      { text: 'CLI', link: '/cli' }
    ],
    sidebar: [
      {
        items: [
          {
            text: 'Getting Started',
            items: [
              {
                text: 'Quick Start',
                link: '/'
              },
              {
                text: 'Tutorial',
                link: '/guides/getting-started'
              },
              {
                text: 'Installation',
                link: '/guides/installation'
              }
            ]
          },
          {
            text: 'Examples',
            items: [
              {
                text: 'Overview',
                link: '/examples/index'
              },
              {
                text: 'Solo Developer Portfolio',
                link: '/examples/solo-developer'
              },
              {
                text: 'Full Portfolio',
                link: '/examples/full-portfolio'
              },
              {
                text: 'Filtered Grid',
                link: '/examples/filtered-grid'
              },
              {
                text: 'Searchable List',
                link: '/examples/searchable-list'
              }
            ]
          },
          {
            text: 'Configuration',
            items: [
              {
                text: 'Using Components',
                link: '/guides/using-components'
              },
              {
                text: 'Project Types',
                link: '/guides/project-types'
              },
              {
                text: 'Fetch Strategy',
                link: '/guides/fetch-strategy'
              }
            ]
          },
          {
            text: 'Styling',
            items: [
              {
                text: 'Styling Guide',
                link: '/guides/styling'
              },
              {
                text: 'Real World Examples',
                link: '/guides/real-world-examples'
              }
            ]
          },
          {
            text: 'Advanced',
            items: [
              {
                text: 'SEO Integration',
                link: '/guides/seo'
              },
              {
                text: 'URL-Persisted State',
                link: '/guides/url-state'
              },
              {
                text: 'Deployment',
                link: '/guides/deployment'
              },
              {
                text: 'Project Commits',
                link: '/guides/project-commits'
              }
            ]
          },
          {
            text: 'Reference',
            items: [
              {
                text: 'Performance',
                link: '/performance'
              },
              {
                text: 'Components',
                link: '/api/components/'
              },
              {
                text: 'Utilities',
                link: '/api/utilities/'
              },
              {
                text: 'Types',
                link: '/api/types/'
              },
              {
                text: 'CLI Reference',
                link: '/cli'
              }
            ]
          },
          {
            text: 'Maintenance',
            items: [
              {
                text: 'Migration Guide',
                link: '/guides/migration'
              },
              {
                text: 'Troubleshooting',
                link: '/guides/troubleshooting'
              }
            ]
          },
          {
            text: 'Links',
            items: [
              {
                text: '⭐ GitHub',
                link: 'https://github.com/RealLukeManning/Folio'
              },
              {
                text: '📦 npm',
                link: 'https://www.npmjs.com/package/@reallukemanning/folio'
              }
            ]
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/RealLukeManning/Folio' }
    ]
  }
})
