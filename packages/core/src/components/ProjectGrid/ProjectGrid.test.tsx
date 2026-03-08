import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProjectGrid } from './ProjectGrid'

afterEach(() => {
  cleanup()
})

describe('ProjectGrid', () => {
  it('wraps children with grid data attribute', () => {
    const { container } = render(
      <ProjectGrid>
        <span>Project 1</span>
        <span>Project 2</span>
      </ProjectGrid>
    )

    const grid = container.querySelector('[data-projex-grid]')
    expect(grid).toBeInTheDocument()
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
  })

  it('renders nothing without children', () => {
    const { container } = render(<ProjectGrid>{undefined}</ProjectGrid>)

    expect(container.querySelector('[data-projex-grid]')).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing with null children', () => {
    const { container } = render(<ProjectGrid children={null} />)

    expect(container.querySelector('[data-projex-grid]')).not.toBeInTheDocument()
  })

  it('renders nothing with empty string children', () => {
    const { container } = render(<ProjectGrid>{''}</ProjectGrid>)

    expect(container.querySelector('[data-projex-grid]')).not.toBeInTheDocument()
  })
})

describe('ProjectGrid data attributes', () => {
  it('has correct data-projex-grid attribute on root', () => {
    const { container } = render(
      <ProjectGrid>
        <span>Content</span>
      </ProjectGrid>
    )

    expect(container.querySelector('[data-projex-grid]')).toBeInTheDocument()
  })
})

describe('ProjectGrid composition', () => {
  it('composes correctly with ProjectCard children', () => {
    const { container } = render(
      <ProjectGrid>
        <div data-projex-card>Card 1</div>
        <div data-projex-card>Card 2</div>
      </ProjectGrid>
    )

    const grid = container.querySelector('[data-projex-grid]')
    expect(grid).toBeInTheDocument()
    expect(container.querySelectorAll('[data-projex-card]')).toHaveLength(2)
  })
})
