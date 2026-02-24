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
                items: [
                  { text: 'ProjectCard', link: '/api/components/project-card' },
                  { text: 'ProjectView', link: '/api/components/project-view' },
                  { text: 'ProjectGrid', link: '/api/components/project-grid' },
                  { text: 'ProjectList', link: '/api/components/project-list' },
                  { text: 'FeaturedProject', link: '/api/components/featured-project' },
                  { text: 'ProjectSearch', link: '/api/components/project-search' },
                  { text: 'ProjectFilterBar', link: '/api/components/project-filter-bar' },
                  { text: 'ProjectFilterTag', link: '/api/components/project-filter-tag' },
                  { text: 'ProjectSort', link: '/api/components/project-sort' }
                ]
              },
              {
                text: 'Utilities',
                link: '/api/utilities/',
                items: [
                  { text: 'filterByStatus', link: '/api/utilities/filter-by-status' },
                  { text: 'filterByType', link: '/api/utilities/filter-by-type' },
                  { text: 'filterByFeatured', link: '/api/utilities/filter-by-featured' },
                  { text: 'sortByDate', link: '/api/utilities/sort-by-date' },
                  { text: 'sortByName', link: '/api/utilities/sort-by-name' },
                  { text: 'sortByStars', link: '/api/utilities/sort-by-stars' },
                  { text: 'sortProjects', link: '/api/utilities/sort-projects' },
                  { text: 'useProjectSearch', link: '/api/utilities/use-project-search' },
                  { text: 'useProjectFilters', link: '/api/utilities/use-project-filters' },
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
                link: '/api/types/',
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
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/anomalyco/folio' }
    ]
  }
})
