import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { ProjectFilterTag } from './ProjectFilterTag'

afterEach(() => {
  cleanup()
})

describe('ProjectFilterTag', () => {
  it('renders with data-folio-filter-tag attribute', () => {
    const { container } = render(<ProjectFilterTag label="React" />)

    expect(container.querySelector('[data-folio-filter-tag]')).toBeInTheDocument()
  })

  it('displays the label text', () => {
    render(<ProjectFilterTag label="React" />)

    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument()
  })

  it('calls onClick with label when clicked', () => {
    const onClick = vi.fn()
    render(<ProjectFilterTag label="React" onClick={onClick} />)

    fireEvent.click(screen.getByRole('button', { name: 'React' }))

    expect(onClick).toHaveBeenCalledWith('React')
  })

  it('does not have data-folio-filter-tag-active when inactive', () => {
    const { container } = render(<ProjectFilterTag label="React" isActive={false} />)

    const tag = container.querySelector('[data-folio-filter-tag]')
    expect(tag).not.toHaveAttribute('data-folio-filter-tag-active')
  })

  it('has data-folio-filter-tag-active when active', () => {
    const { container } = render(<ProjectFilterTag label="React" isActive={true} />)

    const tag = container.querySelector('[data-folio-filter-tag]')
    expect(tag).toHaveAttribute('data-folio-filter-tag-active', 'true')
  })

  it('renders as a button element', () => {
    render(<ProjectFilterTag label="TypeScript" />)

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
