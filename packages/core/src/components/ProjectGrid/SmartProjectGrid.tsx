'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ProjexProject } from '../../types'
import { useProjectSearch } from '../../lib/useProjectSearch'
import { useProjectFilters } from '../../lib/useProjectFilters'
import { sortProjects, type SortValue } from '../../lib/sortProjects'
import { ProjectSort } from '../ProjectSort'
import { ProjectGridProvider } from './ProjectGridContext'

interface SmartProjectGridProps {
  projects: ProjexProject[]
  showSearch?: boolean
  showFilters?: boolean
  showSort?: boolean
  placeholder?: string
  children?: (project: ProjexProject) => React.ReactNode
}

const SORT_OPTIONS: SortValue[] = ['stars', 'name', 'date', 'date-asc']

function SmartProjectGrid({
  projects,
  showSearch = true,
  showFilters = false,
  showSort = false,
  placeholder,
  children,
}: SmartProjectGridProps): React.ReactNode {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortValue, setSortValue] = useState<SortValue>('stars')

  const searched = useProjectSearch(projects, query)
  const filtered = useProjectFilters(searched, selectedTags)
  const sorted = useMemo(() => sortProjects(filtered, sortValue), [filtered, sortValue])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const project of projects) {
      if (project.stack) {
        for (const tag of project.stack) {
          tagSet.add(tag)
        }
      }
    }
    return Array.from(tagSet).sort()
  }, [projects])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
  }, [])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }, [])

  const handleSort = useCallback((value: string) => {
    setSortValue(value as SortValue)
  }, [])

  return (
    <div data-projex-smart-grid>
      {(showSearch || showFilters || showSort) && (
        <div data-projex-controls>
          {showSearch && (
            <div data-projex-search>
              <input
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder={placeholder || 'Search projects...'}
                data-projex-search-input
              />
            </div>
          )}
          {showFilters && allTags.length > 0 && (
            <div data-projex-filter-bar>
              {allTags.map(tag => (
                <button
                  key={tag}
                  data-projex-filter-tag={selectedTags.includes(tag) ? 'active' : undefined}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          {showSort && (
            <ProjectSort
              options={SORT_OPTIONS}
              value={sortValue}
              onChange={handleSort}
            />
          )}
        </div>
      )}
      <div data-projex-grid>
        {children
          ? sorted.map(project => (
              <ProjectGridProvider key={project.id} project={project}>
                {children(project)}
              </ProjectGridProvider>
            ))
          : sorted.map(project => (
              <ProjectGridProvider key={project.id} project={project}>
                <div data-projex-card={project.id}>
                  <h3>{project.name}</h3>
                  {project.description && <p>{project.description}</p>}
                </div>
              </ProjectGridProvider>
            ))}
      </div>
    </div>
  )
}

export { SmartProjectGrid }
