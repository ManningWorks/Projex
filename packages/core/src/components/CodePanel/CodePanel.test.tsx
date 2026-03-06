import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react'
import { CodePanel } from './CodePanel'

afterEach(() => {
  cleanup()
})

describe('CodePanel', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('renders code with syntax highlighting', () => {
    const code = 'const hello = "world"'
    render(<CodePanel language="javascript">{code}</CodePanel>)

    const codeElement = screen.getByRole('code')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement).toHaveTextContent(code)
  })

  it('displays language label', () => {
    render(<CodePanel language="typescript">{`const x: number = 42`}</CodePanel>)

    const languageLabel = screen.getByText('typescript')
    expect(languageLabel).toBeInTheDocument()
    expect(languageLabel).toHaveAttribute('data-folio-code-language')
  })

  it('has copy button', () => {
    render(<CodePanel>{`console.log("test")`}</CodePanel>)

    const copyButton = screen.getByRole('button')
    expect(copyButton).toBeInTheDocument()
    expect(copyButton).toHaveTextContent('Copy')
    expect(copyButton).toHaveAttribute('data-folio-code-copy')
  })

  it('copies code to clipboard when copy button is clicked', async () => {
    const code = 'const test = "value"'
    render(<CodePanel>{code}</CodePanel>)

    const copyButton = screen.getByRole('button')
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(code)
  })

  it('shows "Copied!" confirmation after successful copy', async () => {
    render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const copyButton = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(copyButton).toHaveTextContent('Copied!')
  })

  it('resets copy confirmation after 2 seconds', async () => {
    vi.useFakeTimers()
    render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const copyButton = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(copyButton).toHaveTextContent('Copied!')

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(copyButton).toHaveTextContent('Copy')
    vi.useRealTimers()
  })

  it('falls back to textarea select method when clipboard API unavailable', async () => {
    vi.stubGlobal('navigator', {
      clipboard: undefined,
    })

    const createElementSpy = vi.spyOn(document, 'createElement')
    const appendChildSpy = vi.spyOn(document.body, 'appendChild')
    const removeChildSpy = vi.spyOn(document.body, 'removeChild')

    render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const copyButton = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(createElementSpy).toHaveBeenCalledWith('textarea')
    expect(appendChildSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('handles clipboard API errors gracefully', async () => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard not allowed')),
      },
    })

    const createElementSpy = vi.spyOn(document, 'createElement')
    const appendChildSpy = vi.spyOn(document.body, 'appendChild')
    const removeChildSpy = vi.spyOn(document.body, 'removeChild')

    render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const copyButton = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(createElementSpy).toHaveBeenCalledWith('textarea')
    expect(appendChildSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('scrolls for long code without breaking layout', () => {
    const longCode = Array.from({ length: 100 }, (_, i) => `const line${i} = ${i}`).join('\n')
    render(<CodePanel maxHeight="300px">{longCode}</CodePanel>)

    const container = screen.getByTestId('folio-code-container')
    expect(container).toHaveStyle({ maxHeight: '300px', overflow: 'auto' })
  })

  it('applies custom maxHeight when provided', () => {
    render(<CodePanel maxHeight="600px">{`const test = "value"`}</CodePanel>)

    const container = screen.getByTestId('folio-code-container')
    expect(container).toHaveStyle({ maxHeight: '600px' })
  })

  it('renders with default maxHeight when not provided', () => {
    render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const container = screen.getByTestId('folio-code-container')
    expect(container).toHaveStyle({ maxHeight: '400px' })
  })

  it('handles very long config snippets (>50 lines) with scroll', () => {
    const longConfig = Array.from({ length: 60 }, (_, i) => `config[${i}] = "value"`).join('\n')
    render(<CodePanel language="json">{longConfig}</CodePanel>)

    const container = screen.getByTestId('folio-code-container')
    expect(container).toBeInTheDocument()
    expect(container).toHaveStyle({ overflow: 'auto' })
  })
})

describe('CodePanel data attributes', () => {
  it('has data-folio-code-panel attribute on root', () => {
    const { container } = render(<CodePanel>{`const test = "value"`}</CodePanel>)

    expect(container.querySelector('[data-folio-code-panel]')).toBeInTheDocument()
  })

  it('has data-folio-code-header attribute', () => {
    const { container } = render(<CodePanel>{`const test = "value"`}</CodePanel>)

    expect(container.querySelector('[data-folio-code-header]')).toBeInTheDocument()
  })

  it('has data-folio-code-language attribute', () => {
    const { container } = render(<CodePanel language="typescript">{`const x: number = 42`}</CodePanel>)

    const languageLabel = container.querySelector('[data-folio-code-language]')
    expect(languageLabel).toBeInTheDocument()
    expect(languageLabel).toHaveTextContent('typescript')
  })

  it('has data-folio-code-copy attribute on button', () => {
    const { container } = render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const copyButton = container.querySelector('[data-folio-code-copy]')
    expect(copyButton).toBeInTheDocument()
  })

  it('has data-folio-code-copied attribute set to true when copied', async () => {
    render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const copyButton = screen.getByRole('button')
    await act(async () => {
      fireEvent.click(copyButton)
    })

    expect(copyButton).toHaveAttribute('data-folio-code-copied', 'true')
  })

  it('has data-folio-code-copied attribute set to false when not copied', () => {
    const { container } = render(<CodePanel>{`const test = "value"`}</CodePanel>)

    const copyButton = container.querySelector('[data-folio-code-copy]')
    expect(copyButton).toHaveAttribute('data-folio-code-copied', 'false')
  })

  it('has data-folio-code-container attribute', () => {
    const { container } = render(<CodePanel>{`const test = "value"`}</CodePanel>)

    expect(container.querySelector('[data-folio-code-container]')).toBeInTheDocument()
  })

  it('has data-folio-code-pre attribute', () => {
    const { container } = render(<CodePanel>{`const test = "value"`}</CodePanel>)

    expect(container.querySelector('[data-folio-code-pre]')).toBeInTheDocument()
  })

  it('has data-folio-code attribute with language', () => {
    const { container } = render(<CodePanel language="javascript">{`const test = "value"`}</CodePanel>)

    const codeElement = container.querySelector('[data-folio-code]')
    expect(codeElement).toBeInTheDocument()
    expect(codeElement).toHaveAttribute('data-folio-code-language', 'javascript')
  })
})

describe('CodePanel language support', () => {
  const languages = ['javascript', 'typescript', 'tsx', 'jsx', 'css', 'html', 'bash', 'json', 'python', 'rust', 'go', 'java']

  for (const lang of languages) {
    it(`renders with ${lang} language`, () => {
      render(<CodePanel language={lang}>{`code in ${lang}`}</CodePanel>)

      const languageLabel = screen.getByText(lang)
      expect(languageLabel).toBeInTheDocument()
    })
  }
})
