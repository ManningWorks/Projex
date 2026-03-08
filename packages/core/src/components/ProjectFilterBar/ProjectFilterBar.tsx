import type { ReactNode } from 'react'

interface ProjectFilterBarProps {
  children: ReactNode
}

function ProjectFilterBar({ children }: ProjectFilterBarProps) {
  return (
    <div data-projex-filter-bar>
      {children}
    </div>
  )
}

export { ProjectFilterBar }
