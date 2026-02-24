# useProjectFilters

React hook for filtering projects by tags. Performs case-insensitive matching against project stack values.

## Signature

```tsx
function useProjectFilters(
  projects: FolioProject[],
  selectedTags: string[],
  options?: UseProjectFiltersOptions
): FolioProject[]
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| projects | `FolioProject[]` | Array of projects to filter |
| selectedTags | `string[]` | Array of selected tag strings |
| options | `UseProjectFiltersOptions` | Optional configuration |

## Returns

`FolioProject[]` - Filtered array of projects matching any selected tag

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| field | `string` | `'stack'` | Project field to filter against |

## Behavior

- Returns all projects if selectedTags is empty
- Case-insensitive tag matching
- Projects matching ANY selected tag are included (OR logic)
- Uses useMemo for performance optimization

## Example

```tsx
import { useState } from 'react'
import { 
  useProjectFilters, 
  ProjectFilterBar, 
  ProjectFilterTag, 
  ProjectGrid 
} from '@reallukemanning/folio'

const AVAILABLE_TAGS = ['React', 'TypeScript', 'Node.js', 'Python']

function ProjectShowcase({ projects }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const filteredProjects = useProjectFilters(projects, selectedTags)

  return (
    <div>
      <ProjectFilterBar>
        {AVAILABLE_TAGS.map(tag => (
          <ProjectFilterTag
            key={tag}
            label={tag}
            isActive={selectedTags.includes(tag)}
            onClick={handleTagClick}
          />
        ))}
      </ProjectFilterBar>
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```

## Composing with Search

```tsx
import { useState } from 'react'
import { 
  useProjectFilters, 
  useProjectSearch,
  ProjectSearch,
  ProjectFilterBar, 
  ProjectFilterTag, 
  ProjectGrid 
} from '@reallukemanning/folio'

function ProjectShowcase({ projects }) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter first, then search (more performant)
  const filteredByTags = useProjectFilters(projects, selectedTags)
  const filteredProjects = useProjectSearch(filteredByTags, query)

  return (
    <div>
      <ProjectSearch onSearch={setQuery} />
      <ProjectFilterBar>
        {AVAILABLE_TAGS.map(tag => (
          <ProjectFilterTag
            key={tag}
            label={tag}
            isActive={selectedTags.includes(tag)}
            onClick={(label) => {
              setSelectedTags(prev =>
                prev.includes(label)
                  ? prev.filter(t => t !== label)
                  : [...prev, label]
              )
            }}
          />
        ))}
      </ProjectFilterBar>
      <ProjectGrid projects={filteredProjects} />
    </div>
  )
}
```
