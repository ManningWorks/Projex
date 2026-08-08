import type { ProjexProject, ProjectType } from '../../types'
import { getUniqueTypes } from '../../lib/getUniqueTypes'
import { ProjectFilterBar } from '../ProjectFilterBar'
import { ProjectFilterTag } from '../ProjectFilterTag'

interface ProjectTypeFilterBarProps {
  projects: ProjexProject[]
  value: ProjectType | 'all'
  onChange: (value: ProjectType | 'all') => void
  allLabel?: string
  ariaLabel?: string
}

function ProjectTypeFilterBar({
  projects,
  value,
  onChange,
  allLabel = 'All',
  ariaLabel = 'Filter by kind',
}: ProjectTypeFilterBarProps) {
  const types = getUniqueTypes(projects)

  if (projects.length === 0) {
    return null
  }

  const handleSelect = (next: ProjectType | 'all') => {
    if (next === value) {
      return
    }
    onChange(next)
  }

  return (
    <ProjectFilterBar>
      <div
        data-projex-type-filter-bar
        role="group"
        aria-label={ariaLabel}
      >
        <ProjectFilterTag
          label={allLabel}
          isActive={value === 'all'}
          onClick={() => handleSelect('all')}
        />
        {types.map((type) => (
          <ProjectFilterTag
            key={type}
            label={type}
            isActive={value === type}
            onClick={() => handleSelect(type)}
          />
        ))}
      </div>
    </ProjectFilterBar>
  )
}

export { ProjectTypeFilterBar }
