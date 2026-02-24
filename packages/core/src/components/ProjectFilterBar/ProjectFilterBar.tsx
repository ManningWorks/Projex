import type { ReactNode } from 'react'

interface ProjectFilterBarProps {
  children: ReactNode
}

function ProjectFilterBar({ children }: ProjectFilterBarProps) {
  return (
    <div data-folio-filter-bar>
      {children}
    </div>
  )
}

export { ProjectFilterBar }
