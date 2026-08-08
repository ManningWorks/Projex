import type { ProjexProject, ProjectStatus } from '../../types'
import { getUniqueStatuses } from '../../lib/getUniqueStatuses'
import { ProjectFilterBar } from '../ProjectFilterBar'
import { ProjectFilterTag } from '../ProjectFilterTag'

interface ProjectStatusFilterBarProps {
  projects: ProjexProject[]
  value: ProjectStatus | 'all'
  onChange: (value: ProjectStatus | 'all') => void
  allLabel?: string
  ariaLabel?: string
}

function ProjectStatusFilterBar({
  projects,
  value,
  onChange,
  allLabel = 'All',
  ariaLabel = 'Filter by status',
}: ProjectStatusFilterBarProps) {
  const statuses = getUniqueStatuses(projects)

  if (projects.length === 0) {
    return null
  }

  const handleSelect = (next: ProjectStatus | 'all') => {
    if (next === value) {
      return
    }
    onChange(next)
  }

  return (
    <ProjectFilterBar>
      <div
        data-projex-status-filter-bar
        role="group"
        aria-label={ariaLabel}
      >
        <ProjectFilterTag
          label={allLabel}
          isActive={value === 'all'}
          onClick={() => handleSelect('all')}
        />
        {statuses.map((status) => (
          <ProjectFilterTag
            key={status}
            label={status}
            isActive={value === status}
            onClick={() => handleSelect(status)}
          />
        ))}
      </div>
    </ProjectFilterBar>
  )
}

export { ProjectStatusFilterBar }
