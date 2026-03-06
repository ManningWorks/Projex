'use client'

import { useEffect, useRef, useState } from 'react'

type Language = 'javascript' | 'typescript' | 'tsx' | 'jsx' | 'css' | 'html' | 'bash' | 'json' | 'python' | 'rust' | 'go' | 'java' | string

interface CodePanelProps {
  children: string
  language?: Language
  maxHeight?: string
}

function CodePanel({ children, language = 'javascript', maxHeight = '400px' }: CodePanelProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    async function highlight() {
      const Prism = await import('prismjs')
      const loadLanguage = async (lang: string) => {
        try {
          await import(/* @vite-ignore */ `prismjs/components/prism-${lang}`)
        } catch {
          console.warn(`Prism language '${lang}' not found, falling back to 'javascript'`)
        }
      }

      await loadLanguage(language)

      if (codeRef.current) {
        Prism.highlightElement(codeRef.current)
      }
    }

    highlight()
  }, [children, language])

  async function handleCopy() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(children)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        fallbackCopy()
      }
    } else {
      fallbackCopy()
    }
  }

  function fallbackCopy() {
    const textArea = document.createElement('textarea')
    textArea.value = children
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.warn('Copy failed')
    }
    document.body.removeChild(textArea)
  }

  return (
    <div
      data-folio-code-panel
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--folio-code-bg, #1e1e1e)',
        borderRadius: 'var(--folio-code-radius, 8px)',
        overflow: 'hidden',
      }}
    >
      <div
        data-folio-code-header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          borderBottom: '1px solid var(--folio-code-border, #333)',
          backgroundColor: 'var(--folio-code-header-bg, #2d2d2d)',
        }}
      >
        <span
          data-folio-code-language
          style={{
            fontSize: 'var(--folio-code-language-size, 12px)',
            color: 'var(--folio-code-language-text, #888)',
            textTransform: 'uppercase',
            fontFamily: 'monospace',
          }}
        >
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          data-folio-code-copy
          data-folio-code-copied={copied}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            fontSize: 'var(--folio-code-copy-size, 12px)',
            color: 'var(--folio-code-copy-text, #ccc)',
            backgroundColor: 'var(--folio-code-copy-bg, transparent)',
            border: '1px solid var(--folio-code-copy-border, #444)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div
        data-folio-code-container
        data-testid="folio-code-container"
        style={{
          overflow: 'auto',
          maxHeight,
        }}
      >
        <pre
          data-folio-code-pre
          style={{
            margin: 0,
            padding: '16px',
            backgroundColor: 'transparent',
          }}
        >
          <code
            ref={codeRef}
            role="code"
            data-folio-code
            data-folio-code-language={language}
            className={`language-${language}`}
            style={{
              fontFamily: 'var(--folio-code-font, "Fira Code", "Consolas", monospace)',
              fontSize: 'var(--folio-code-font-size, 14px)',
              lineHeight: 'var(--folio-code-line-height, 1.6)',
              color: 'var(--folio-code-text, #d4d4d4)',
            }}
          >
            {children}
          </code>
        </pre>
      </div>
    </div>
  )
}

export { CodePanel }
