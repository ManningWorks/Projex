'use client'

import { useState, useEffect, useRef } from 'react'

interface ProjectSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

function ProjectSearch({ onSearch, placeholder }: ProjectSearchProps) {
  const [value, setValue] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(value)
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, onSearch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div data-projex-search>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        data-projex-search-input
      />
    </div>
  )
}

export { ProjectSearch }
