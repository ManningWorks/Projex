import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { ProjectSearch } from './ProjectSearch'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('ProjectSearch', () => {
  it('renders with data-folio-search attribute', () => {
    const { container } = render(<ProjectSearch onSearch={vi.fn()} />)

    expect(container.querySelector('[data-folio-search]')).toBeInTheDocument()
  })

  it('renders input with data-folio-search-input attribute', () => {
    const { container } = render(<ProjectSearch onSearch={vi.fn()} />)

    expect(container.querySelector('[data-folio-search-input]')).toBeInTheDocument()
  })

  it('shows placeholder text when provided', () => {
    render(<ProjectSearch onSearch={vi.fn()} placeholder="Search projects..." />)

    expect(screen.getByPlaceholderText('Search projects...')).toBeInTheDocument()
  })

  it('does not show placeholder when not provided', () => {
    const { container } = render(<ProjectSearch onSearch={vi.fn()} />)

    expect(container.querySelector('[data-folio-search-input]')).not.toHaveAttribute('placeholder')
  })
})

describe('ProjectSearch debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('calls onSearch after 300ms debounce', () => {
    const onSearch = vi.fn()
    render(<ProjectSearch onSearch={onSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'react' } })

    expect(onSearch).not.toHaveBeenCalledWith('react')

    vi.advanceTimersByTime(300)

    expect(onSearch).toHaveBeenCalledWith('react')
  })

  it('calls only the last search value when typing quickly', () => {
    const onSearch = vi.fn()
    render(<ProjectSearch onSearch={onSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'a' } })
    vi.advanceTimersByTime(100)
    fireEvent.change(input, { target: { value: 'ab' } })
    vi.advanceTimersByTime(100)

    expect(onSearch).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('ab')
  })

  it('calls onSearch with empty string when input is cleared', () => {
    const onSearch = vi.fn()
    render(<ProjectSearch onSearch={onSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'react' } })
    vi.advanceTimersByTime(300)

    expect(onSearch).toHaveBeenCalledWith('react')

    fireEvent.change(input, { target: { value: '' } })
    vi.advanceTimersByTime(300)

    expect(onSearch).toHaveBeenCalledWith('')
  })

  it('cancels previous timeout when user types again', () => {
    const onSearch = vi.fn()
    render(<ProjectSearch onSearch={onSearch} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 're' } })
    vi.advanceTimersByTime(150)

    fireEvent.change(input, { target: { value: 'rea' } })
    vi.advanceTimersByTime(150)

    expect(onSearch).not.toHaveBeenCalled()

    vi.advanceTimersByTime(150)

    expect(onSearch).toHaveBeenCalledTimes(1)
    expect(onSearch).toHaveBeenCalledWith('rea')
  })
})
