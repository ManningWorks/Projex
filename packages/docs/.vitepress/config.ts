import { defineConfig } from 'vitepress'
import react from '@vitejs/plugin-react'

export default defineConfig({
  title: 'Folio',
  description: 'A shadcn-style component library for project showcase pages',
  cleanUrls: true,
  base: '/',
  vite: {
    plugins: [react()]
  },
  themeConfig: {
    nav: [
      { text: 'Getting Started', link: '/' },
      { text: 'API Reference', link: '/api/components/' }
    ],
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          link: '/'
        },
        {
          text: 'Performance',
          link: '/performance'
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Components', link: '/api/components/' },
            { text: 'Utilities', link: '/api/utilities/' },
            { text: 'Types', link: '/api/types/' }
          ]
        },
        {
          text: 'Components',
          collapsed: false,
          items: [
            { text: 'ProjectCard', link: '/api/components/project-card' },
            { text: 'ProjectView', link: '/api/components/project-view' },
            { text: 'ProjectGrid', link: '/api/components/project-grid' },
            { text: 'ProjectList', link: '/api/components/project-list' },
            { text: 'FeaturedProject', link: '/api/components/featured-project' }
          ]
        },
        {
          text: 'Utilities',
          collapsed: false,
          items: [
            { text: 'filterByStatus', link: '/api/utilities/filter-by-status' },
            { text: 'filterByType', link: '/api/utilities/filter-by-type' },
            { text: 'filterByFeatured', link: '/api/utilities/filter-by-featured' },
            { text: 'sortByDate', link: '/api/utilities/sort-by-date' },
            { text: 'sortByName', link: '/api/utilities/sort-by-name' },
            { text: 'sortByStars', link: '/api/utilities/sort-by-stars' },
            { text: 'normalise', link: '/api/utilities/normalise' },
            { text: 'normalizeStats', link: '/api/utilities/normalize-stats' },
            { text: 'defineProjects', link: '/api/utilities/define-projects' },
            { text: 'fetchGitHubRepo', link: '/api/utilities/fetch-github-repo' },
            { text: 'fetchNpmPackage', link: '/api/utilities/fetch-npm-package' },
            { text: 'fetchProductHuntPost', link: '/api/utilities/fetch-product-hunt-post' }
          ]
        },
        {
          text: 'Types',
          collapsed: false,
          items: [
            { text: 'FolioProject', link: '/api/types/folio-project' },
            { text: 'FolioProjectInput', link: '/api/types/folio-project-input' },
            { text: 'ProjectType', link: '/api/types/project-type' },
            { text: 'ProjectStatus', link: '/api/types/project-status' },
            { text: 'ProjectStats', link: '/api/types/project-stats' },
            { text: 'ProjectLinks', link: '/api/types/project-links' },
            { text: 'GitHubRepoData', link: '/api/types/github-repo-data' },
            { text: 'NpmPackageData', link: '/api/types/npm-package-data' },
            { text: 'ProductHuntPostData', link: '/api/types/product-hunt-post-data' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/anomalyco/folio' }
    ]
  }
})
