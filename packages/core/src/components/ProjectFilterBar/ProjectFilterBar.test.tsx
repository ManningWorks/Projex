import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ProjectFilterBar } from './ProjectFilterBar'

afterEach(() => {
  cleanup()
})

describe('ProjectFilterBar', () => {
  it('renders with data-projex-filter-bar attribute', () => {
    const { container } = render(<ProjectFilterBar>children</ProjectFilterBar>)

    expect(container.querySelector('[data-projex-filter-bar]')).toBeInTheDocument()
  })

  it('renders children', () => {
    const { container } = render(
      <ProjectFilterBar>
        <span>test child</span>
      </ProjectFilterBar>
    )

    expect(container.querySelector('span')).toBeInTheDocument()
    expect(container.querySelector('span')?.textContent).toBe('test child')
  })
})
