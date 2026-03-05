'use client'

import { useState, useEffect } from 'react'

const layouts = ['grid', 'list'] as const
type Layout = typeof layouts[number]

interface LayoutToggleProps {
  layout: Layout
  onLayoutChange: (layout: Layout) => void
}

export function LayoutToggle({ layout, onLayoutChange }: LayoutToggleProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleLayout = () => {
    const currentIndex = layouts.indexOf(layout)
    const nextIndex = (currentIndex + 1) % layouts.length
    const nextLayout = layouts[nextIndex]
    localStorage.setItem('folio-layout', nextLayout)
    onLayoutChange(nextLayout)
  }

  const getLayoutIcon = () => {
    return layout === 'grid' ? '▦' : '☰'
  }

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={cycleLayout}
      type="button"
      style={{
        padding: '0.5rem 1rem',
        border: '1px solid var(--folio-card-border, #e5e7eb)',
        borderRadius: '0.375rem',
        background: 'var(--folio-card-bg, white)',
        color: 'var(--folio-card-text, #374151)',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--folio-stats-label, #6b7280)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--folio-card-border, #e5e7eb)'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{getLayoutIcon()}</span>
      <span style={{ textTransform: 'capitalize' }}>{layout}</span>
    </button>
  )
}
