import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Folio',
  description: 'A shadcn-style component library for project showcase pages',
  srcDir: 'src',
  cleanUrls: true,
  base: '/',
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'Performance', link: '/performance' },
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
            text: 'Performance',
            link: '/performance'
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
