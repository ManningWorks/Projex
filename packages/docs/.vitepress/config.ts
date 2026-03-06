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
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Examples', link: '/examples/index' },
      { text: 'Performance', link: '/performance' },
      { text: 'Guides', link: '/guides/seo' },
      { text: 'API Reference', link: '/api/components/' }
    ],
    sidebar: [
      {
        items: [
          {
            text: 'Getting Started',
            link: '/'
          },
          {
            text: 'Examples',
            items: [
              {
                text: 'Overview',
                link: '/examples/index'
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
              },
              {
                text: 'Interactive Demo',
                link: '/examples/interactive-demo'
              }
            ]
          },
          {
            text: 'Performance',
            link: '/performance'
          },
          {
            text: 'Guides',
            items: [
              {
                text: 'SEO Integration',
                link: '/guides/seo'
              }
            ]
          },
          {
            text: 'API Reference',
            items: [
              {
                text: 'Components',
                link: '/api/components/',
                collapsed: true
              },
              {
                text: 'Utilities',
                link: '/api/utilities/',
                collapsed: true
              },
              {
                text: 'Types',
                link: '/api/types/',
                collapsed: true
              }
            ]
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/anomalyco/folio' }
    ]
  }
})
