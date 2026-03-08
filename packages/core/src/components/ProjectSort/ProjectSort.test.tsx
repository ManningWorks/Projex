import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { ProjectSort } from './ProjectSort'

afterEach(() => {
  cleanup()
})

describe('ProjectSort', () => {
  it('renders with data-projex-sort attribute', () => {
    const { container } = render(
      <ProjectSort options={['date', 'stars', 'name']} value="date" onChange={vi.fn()} />
    )

    expect(container.querySelector('[data-projex-sort]')).toBeInTheDocument()
  })

  it('renders dropdown with provided options', () => {
    render(
      <ProjectSort options={['date', 'stars', 'name']} value="date" onChange={vi.fn()} />
    )

    const options = screen.getAllByRole('option')

    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('date')
    expect(options[1]).toHaveTextContent('stars')
    expect(options[2]).toHaveTextContent('name')
  })

  it('selects the option matching value prop by default', () => {
    render(
      <ProjectSort options={['date', 'stars', 'name']} value="stars" onChange={vi.fn()} />
    )

    const select = screen.getByRole('combobox') as HTMLSelectElement

    expect(select.value).toBe('stars')
  })

  it('calls onChange with sort value when user selects an option', () => {
    const onChange = vi.fn()
    render(
      <ProjectSort options={['date', 'stars', 'name']} value="date" onChange={onChange} />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'stars' } })

    expect(onChange).toHaveBeenCalledWith('stars')
  })

  it('calls onChange with selected value', () => {
    const onChange = vi.fn()
    render(
      <ProjectSort options={['date', 'stars', 'name']} value="date" onChange={onChange} />
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'name' } })

    expect(onChange).toHaveBeenCalledWith('name')
  })

  it('selected option has data-projex-sort-value attribute', () => {
    render(
      <ProjectSort options={['date', 'stars', 'name']} value="stars" onChange={vi.fn()} />
    )

    const options = screen.getAllByRole('option')
    const selectedOption = options.find(opt => opt.getAttribute('data-projex-sort-value'))

    expect(selectedOption).toBeInTheDocument()
    expect(selectedOption).toHaveAttribute('data-projex-sort-value', 'stars')
  })
})
