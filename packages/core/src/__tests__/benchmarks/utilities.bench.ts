import { bench, describe, beforeAll } from 'vitest'
import { filterByType } from '../../lib/filterByType'
import { filterByStatus } from '../../lib/filterByStatus'
import { filterByFeatured } from '../../lib/filterByFeatured'
import { sortByName } from '../../lib/sortByName'
import { sortByDate } from '../../lib/sortByDate'
import { sortByStars } from '../../lib/sortByStars'
import type { ProjexProject, ProjectStatus, ProjectType } from '../../types'

const createProject = (id: number): ProjexProject => ({
  id: `project-${id}`,
  type: (['github', 'npm', 'product-hunt', 'manual', 'hybrid'] as ProjectType[])[id % 5],
  status: (['active', 'shipped', 'in-progress', 'archived'] as ProjectStatus[])[id % 4],
  featured: id % 10 === 0,
  name: `Project ${String(id).padStart(4, '0')}`,
  tagline: `A test project ${id}`,
  description: `Description for project ${id}`,
  background: null,
  why: null,
  image: null,
  struggles: [],
  timeline: [],
  posts: [],
  stack: ['React', 'TypeScript', 'Node.js'],
  links: {
    github: `https://github.com/test/project-${id}`,
    live: `https://project-${id}.com`,
  },
  stats: {
    stars: Math.floor(Math.random() * 10000),
    forks: Math.floor(Math.random() * 1000),
  },
  language: 'TypeScript',
  languageColor: '#3178c6',
  createdAt: new Date(2024, id % 12, (id % 28) + 1).toISOString(),
  updatedAt: new Date(2024, (id % 12) + 1, 1).toISOString(),
})

describe('Utility functions performance (1000 projects)', () => {
  let projects: ProjexProject[]

  beforeAll(() => {
    projects = Array.from({ length: 1000 }, (_, i) => createProject(i))
  })

  describe('filterByType', () => {
    bench('filter by github', () => {
      filterByType(projects, 'github')
    })

    bench('filter by npm', () => {
      filterByType(projects, 'npm')
    })

    bench('filter by all (no-op)', () => {
      filterByType(projects, 'all')
    })

    bench('filter by undefined (no-op)', () => {
      filterByType(projects, undefined)
    })
  })

  describe('filterByStatus', () => {
    bench('filter by active', () => {
      filterByStatus(projects, 'active')
    })

    bench('filter by shipped', () => {
      filterByStatus(projects, 'shipped')
    })
  })

  describe('filterByFeatured', () => {
    bench('filter featured projects', () => {
      filterByFeatured(projects, true)
    })

    bench('filter non-featured projects', () => {
      filterByFeatured(projects, false)
    })
  })

  describe('sortByName', () => {
    bench('sort by name ascending', () => {
      sortByName(projects, 'asc')
    })

    bench('sort by name descending', () => {
      sortByName(projects, 'desc')
    })
  })

  describe('sortByDate', () => {
    bench('sort by date ascending', () => {
      sortByDate(projects, 'asc')
    })

    bench('sort by date descending', () => {
      sortByDate(projects, 'desc')
    })
  })

  describe('sortByStars', () => {
    bench('sort by stars ascending', () => {
      sortByStars(projects, 'asc')
    })

    bench('sort by stars descending', () => {
      sortByStars(projects, 'desc')
    })
  })

  describe('combined operations', () => {
    bench('filter by github then sort by stars', () => {
      const filtered = filterByType(projects, 'github')
      sortByStars(filtered, 'desc')
    })

    bench('filter featured then sort by date', () => {
      const featured = filterByFeatured(projects, true)
      sortByDate(featured, 'desc')
    })

    bench('filter by status then by type then sort', () => {
      const active = filterByStatus(projects, 'active')
      const github = filterByType(active, 'github')
      sortByStars(github, 'desc')
    })
  })
})
