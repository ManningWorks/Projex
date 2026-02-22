import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProjectList } from './ProjectList'

afterEach(() => {
  cleanup()
})

describe('ProjectList', () => {
  it('wraps children with list data attribute', () => {
    const { container } = render(
      <ProjectList>
        <span>Project 1</span>
        <span>Project 2</span>
      </ProjectList>
    )

    const list = container.querySelector('[data-folio-list]')
    expect(list).toBeInTheDocument()
    expect(screen.getByText('Project 1')).toBeInTheDocument()
    expect(screen.getByText('Project 2')).toBeInTheDocument()
  })

  it('renders nothing without children', () => {
    const { container } = render(<ProjectList>{undefined}</ProjectList>)

    expect(container.querySelector('[data-folio-list]')).not.toBeInTheDocument()
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing with null children', () => {
    const { container } = render(<ProjectList children={null} />)

    expect(container.querySelector('[data-folio-list]')).not.toBeInTheDocument()
  })

  it('renders nothing with empty string children', () => {
    const { container } = render(<ProjectList>{''}</ProjectList>)

    expect(container.querySelector('[data-folio-list]')).not.toBeInTheDocument()
  })
})

describe('ProjectList data attributes', () => {
  it('has correct data-folio-list attribute on root', () => {
    const { container } = render(
      <ProjectList>
        <span>Content</span>
      </ProjectList>
    )

    expect(container.querySelector('[data-folio-list]')).toBeInTheDocument()
  })
})

describe('ProjectList composition', () => {
  it('composes correctly with ProjectCard children', () => {
    const { container } = render(
      <ProjectList>
        <div data-folio-card>Card 1</div>
        <div data-folio-card>Card 2</div>
      </ProjectList>
    )

    const list = container.querySelector('[data-folio-list]')
    expect(list).toBeInTheDocument()
    expect(container.querySelectorAll('[data-folio-card]')).toHaveLength(2)
  })
})
