'use client'

import { useState, useEffect } from 'react'

const themes = ['light', 'dark', 'gradient'] as const
type Theme = typeof themes[number]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('folio-theme') as Theme
    if (stored && themes.includes(stored)) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('folio-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme, mounted])

  if (!mounted) {
    return null
  }

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️'
      case 'dark':
        return '🌙'
      case 'gradient':
        return '🎨'
    }
  }

  return (
    <button
      onClick={cycleTheme}
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
      <span style={{ fontSize: '1.25rem' }}>{getThemeIcon()}</span>
      <span style={{ textTransform: 'capitalize' }}>{theme}</span>
    </button>
  )
}
