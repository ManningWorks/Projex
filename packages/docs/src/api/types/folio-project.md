# FolioProject

Normalized project object returned by the `normalise` function.

## Definition

```tsx
interface FolioProject {
  id: string
  type: ProjectType
  status: ProjectStatus
  featured: boolean
  name: string
  tagline: string
  description: string
  background: string | null
  why: string | null
  image: string | null
  struggles: ProjectStruggle[]
  timeline: ProjectTimelineEntry[]
  posts: ProjectPost[]
  stack: string[]
  links: ProjectLinks
  stats: ProjectStats | null
  language: string | null
  languageColor: string | null
  createdAt: string | null
  updatedAt: string | null
  repo?: string
  package?: string
  slug?: string
  commits?: ProjectCommit[]
  linkOrder?: string[]
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `type` | `ProjectType` | Project type (`github`, `npm`, `manual`, etc.) |
| `status` | `ProjectStatus` | Current status (`active`, `shipped`, etc.) |
| `featured` | `boolean` | Whether project is featured |
| `name` | `string` | Project name |
| `tagline` | `string` | Short tagline |
| `description` | `string` | Full description |
| `background` | `string \| null` | Background story |
| `why` | `string \| null` | Why this project exists |
| `image` | `string \| null` | Project image URL |
| `struggles` | `ProjectStruggle[]` | Challenges encountered |
| `timeline` | `ProjectTimelineEntry[]` | Project timeline |
| `posts` | `ProjectPost[]` | Related blog posts |
| `stack` | `string[]` | Technology stack |
| `links` | `ProjectLinks` | External links |
| `stats` | `ProjectStats \| null` | Project statistics |
| `language` | `string \| null` | Primary language (GitHub) |
| `languageColor` | `string \| null` | Language color hex (GitHub) |
| `createdAt` | `string \| null` | Creation date |
| `updatedAt` | `string \| null` | Last update date |
| `repo` | `string` | Repository path (GitHub/hybrid) |
| `package` | `string` | Package name (npm/hybrid) |
| `slug` | `string` | Product Hunt slug |
| `commits` | `ProjectCommit[]` | Recent commits (GitHub/hybrid) |
| `linkOrder` | `string[]` | Link display order |

## Creation

`FolioProject` objects are created by the `normalise` function:

```tsx
import { normalise } from '@reallukemanning/folio'

const project = await normalise({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active'
})
```

## Usage with Components

```tsx
import { ProjectCard, ProjectView } from '@reallukemanning/folio'

function ProjectPage({ project }: { project: FolioProject }) {
  return (
    <ProjectCard>
      <ProjectCard.Header project={project} />
      <ProjectCard.Description project={project} />
    </ProjectCard>
  )
}
```
