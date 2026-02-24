interface ProjectSortProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

function ProjectSort({ options, value, onChange }: ProjectSortProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  return (
    <div data-folio-sort>
      <select
        value={value}
        onChange={handleChange}
        data-folio-sort-select
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            data-folio-sort-option
            data-folio-sort-value={option === value ? option : undefined}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export { ProjectSort }
