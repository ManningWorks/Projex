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
    <div data-projex-sort>
      <select
        value={value}
        onChange={handleChange}
        data-projex-sort-select
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            data-projex-sort-option
            data-projex-sort-value={option === value ? option : undefined}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export { ProjectSort }
