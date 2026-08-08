interface ProjectFilterTagProps {
  label: string
  isActive?: boolean
  onClick?: (label: string) => void
}

function ProjectFilterTag({ label, isActive = false, onClick }: ProjectFilterTagProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(label)
    }
  }

  return (
    <button
      type="button"
      data-projex-filter-tag
      data-projex-filter-tag-active={isActive ? 'true' : undefined}
      aria-pressed={isActive}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}

export { ProjectFilterTag }
