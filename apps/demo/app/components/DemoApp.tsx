'use client'

import { useState, useMemo } from 'react'
import type { FolioProject, ProjectType, ProjectStatus } from '@reallukemanning/folio'
import { FeaturedProject } from '@reallukemanning/folio'
import { GitHubCard } from '@reallukemanning/folio'
import { NpmCard } from '@reallukemanning/folio'
import { ShowcaseCard } from '@reallukemanning/folio'
import { ProjectGrid } from '@reallukemanning/folio'
import { ProjectList } from '@reallukemanning/folio'
import { ProjectSearch } from '@reallukemanning/folio'
import { ProjectFilterBar } from '@reallukemanning/folio'
import { ProjectFilterTag } from '@reallukemanning/folio'
import { ProjectSort } from '@reallukemanning/folio'
import { ThemeToggle } from './ThemeToggle'
import { LayoutToggle } from './LayoutToggle'

type SortOption = 'name' | 'date' | 'stars'

const projectTypes: ProjectType[] = ['github', 'manual', 'npm', 'product-hunt', 'youtube', 'gumroad', 'lemonsqueezy', 'devto', 'hybrid']
const projectStatuses: ProjectStatus[] = ['active', 'shipped', 'in-progress', 'coming-soon', 'archived', 'for-sale']
const sortOptions: SortOption[] = ['name', 'date', 'stars']

interface DemoAppProps {
  projects: FolioProject[]
}

export function DemoApp({ projects }: DemoAppProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([])
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('folio-layout') as 'grid' | 'list' | null
      return stored || 'grid'
    }
    return 'grid'
  })

  const featuredProjects = projects.filter((p) => p.featured)
  const featuredProject = featuredProjects.length > 0 ? featuredProjects[0] : null

  const filteredProjects = useMemo(() => {
    let filtered = projects

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((p) => {
        const name = (p.name || p.id).toLowerCase()
        const description = (p.description || '').toLowerCase()
        const stack = (p.stack || []).join(' ').toLowerCase()
        return name.includes(query) || description.includes(query) || stack.includes(query)
      })
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTypes.includes(p.type))
    }

    if (selectedStatus) {
      filtered = filtered.filter((p) => p.status === selectedStatus)
    }

    return filtered
  }, [projects, searchQuery, selectedTypes, selectedStatus])

  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects]
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || a.id).localeCompare(b.name || b.id)
        case 'date':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'stars': {
          const aStars = a.stats?.stars ? Number(a.stats.stars) : 0
          const bStars = b.stats?.stars ? Number(b.stats.stars) : 0
          return bStars - aStars
        }
        default:
          return 0
      }
    })
    return sorted
  }, [filteredProjects, sortBy])

  const handleCardClick = (project: FolioProject) => {
    console.log('Clicked project:', project.id)
  }

  const renderCard = (project: FolioProject) => {
    const commonProps = {
      project
    }

    switch (project.type) {
      case 'github':
        return (
          <GitHubCard {...commonProps}>
            <GitHubCard.Header project={project} />
            <GitHubCard.Description project={project} />
            <GitHubCard.Tags project={project} />
            <GitHubCard.Stats project={project} />
            <GitHubCard.Status project={project} />
            <GitHubCard.Links project={project} />
          </GitHubCard>
        )
      case 'npm':
      case 'hybrid':
        return (
          <NpmCard {...commonProps}>
            <NpmCard.Header project={project} />
            <NpmCard.Description project={project} />
            <NpmCard.Tags project={project} />
            <NpmCard.Stats project={project} />
            <NpmCard.Status project={project} />
            <NpmCard.Links project={project} />
          </NpmCard>
        )
      default:
        return (
          <ShowcaseCard {...commonProps}>
            <ShowcaseCard.Header project={project} />
            <ShowcaseCard.Description project={project} />
            <ShowcaseCard.Tags project={project} />
            <ShowcaseCard.Stats project={project} />
            <ShowcaseCard.Status project={project} />
            <ShowcaseCard.Links project={project} />
          </ShowcaseCard>
        )
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              Folio Demo
            </h1>
            <p style={{ color: 'var(--folio-stats-label, #6b7280)', margin: '0' }}>
              Welcome to the Folio component library demo
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeToggle />
            <LayoutToggle layout={layout} onLayoutChange={setLayout} />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '1rem 0',
          borderBottom: '1px solid var(--folio-card-border, #e5e7eb)'
        }}>
          <ProjectSearch
            placeholder="Search projects..."
            onSearch={setSearchQuery}
          />

          <ProjectFilterBar>
            {projectTypes.map((type) => (
              <ProjectFilterTag
                key={type}
                label={type}
                isActive={selectedTypes.includes(type)}
                onClick={(label) => {
                  const projectType = label as ProjectType
                  setSelectedTypes((prev) =>
                    prev.includes(projectType)
                      ? prev.filter((t) => t !== projectType)
                      : [...prev, projectType]
                  )
                }}
              />
            ))}
          </ProjectFilterBar>

          <ProjectSort
            options={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value as SortOption)}
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--folio-stats-label, #6b7280)' }}>
            Filter by status:
          </span>
          {selectedStatus && (
            <button
              onClick={() => setSelectedStatus(null)}
              type="button"
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--folio-card-border, #e5e7eb)',
                borderRadius: '0.375rem',
                background: 'var(--folio-status-shipped-bg, #dbeafe)',
                color: 'var(--folio-status-shipped-text, #1e40af)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {selectedStatus} ✕
            </button>
          )}

          {projectStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              type="button"
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--folio-card-border, #e5e7eb)',
                borderRadius: '0.25rem',
                background: selectedStatus === status ? 'var(--folio-status-shipped-bg, #dbeafe)' : 'var(--folio-card-bg, white)',
                color: selectedStatus === status ? 'var(--folio-status-shipped-text, #1e40af)' : 'var(--folio-card-text, #374151)',
                fontSize: '0.75rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
          {sortedProjects.length} {sortedProjects.length === 1 ? 'project' : 'projects'}
        </div>
      </header>

      {featuredProject && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
            Featured Project
          </h2>
          <FeaturedProject project={featuredProject} />
        </section>
      )}

      <main>
        {layout === 'grid' ? (
          <ProjectGrid>
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleCardClick(project)}
                style={{ cursor: 'pointer' }}
              >
                {renderCard(project)}
              </div>
            ))}
          </ProjectGrid>
        ) : (
          <ProjectList>
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleCardClick(project)}
                style={{ cursor: 'pointer' }}
              >
                {renderCard(project)}
              </div>
            ))}
          </ProjectList>
        )}

        {sortedProjects.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--folio-stats-label, #6b7280)'
          }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
              No projects found
            </p>
            <p>
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
