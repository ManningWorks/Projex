import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { CommitList } from './CommitList'
import type { ProjectCommit } from '../../types'

afterEach(() => {
  cleanup()
})

const createCommit = (overrides: Partial<ProjectCommit> = {}): ProjectCommit => ({
  message: 'Fix bug in component',
  date: '2024-01-15',
  url: 'https://github.com/test/repo/commit/abc123',
  author: { name: 'John Doe', email: 'john@example.com' },
  ...overrides,
})

describe('CommitList', () => {
  it('renders with 3 commits displaying all 3', () => {
    const commits = [
      createCommit({ message: 'First commit', url: 'https://github.com/test/repo/commit/1' }),
      createCommit({ message: 'Second commit', url: 'https://github.com/test/repo/commit/2' }),
      createCommit({ message: 'Third commit', url: 'https://github.com/test/repo/commit/3' }),
    ]

    const { container } = render(<CommitList commits={commits} />)

    expect(container.querySelector('[data-projex-commit]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-projex-commit]')).toHaveLength(3)
  })

  it('truncates message to 100 characters with ellipsis', () => {
    const longMessage = 'A'.repeat(150)
    const commits = [createCommit({ message: longMessage })]

    const { container } = render(<CommitList commits={commits} />)

    const messageEl = container.querySelector('[data-projex-commit-message]')
    expect(messageEl?.textContent?.length).toBe(103)
    expect(messageEl?.textContent?.endsWith('...')).toBe(true)
  })

  it('returns null for empty commits array', () => {
    const { container } = render(<CommitList commits={[]} />)

    expect(container.querySelector('[data-projex-commit-list]')).not.toBeInTheDocument()
  })

  it('renders without author information when author is undefined', () => {
    const commits = [createCommit({ author: undefined })]

    const { container } = render(<CommitList commits={commits} />)

    expect(container.querySelector('[data-projex-commit-author]')).not.toBeInTheDocument()
  })

  it('renders with author when author is present', () => {
    const commits = [createCommit({ author: { name: 'Jane Doe' } })]

    const { container } = render(<CommitList commits={commits} />)

    expect(container.querySelector('[data-projex-commit-author]')).toHaveTextContent('Jane Doe')
  })
})

describe('CommitList data attributes', () => {
  it('has data-projex-commit attribute on each commit', () => {
    const commits = [createCommit()]

    const { container } = render(<CommitList commits={commits} />)

    expect(container.querySelector('[data-projex-commit]')).toBeInTheDocument()
  })

  it('has data-projex-commit-message attribute', () => {
    const commits = [createCommit({ message: 'Test message' })]

    const { container } = render(<CommitList commits={commits} />)

    expect(container.querySelector('[data-projex-commit-message]')).toHaveTextContent('Test message')
  })

  it('has data-projex-commit-date attribute', () => {
    const commits = [createCommit({ date: '2024-06-15' })]

    const { container } = render(<CommitList commits={commits} />)

    expect(container.querySelector('[data-projex-commit-date]')).toHaveTextContent('2024-06-15')
  })

  it('has data-projex-commit-link attribute', () => {
    const commits = [createCommit({ url: 'https://github.com/test/commit/abc' })]

    const { container } = render(<CommitList commits={commits} />)

    const link = container.querySelector('[data-projex-commit-link]')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/test/commit/abc')
  })

  it('has data-projex-commit-author attribute when author is present', () => {
    const commits = [createCommit({ author: { name: 'Test Author' } })]

    const { container } = render(<CommitList commits={commits} />)

    expect(container.querySelector('[data-projex-commit-author]')).toBeInTheDocument()
  })
})
