# ProjexProject

Normalized project object returned by the `normalise` function.

## Definition

```tsx
interface ProjexProject {
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
  channelId?: string
  productId?: string
  storeId?: string
  username?: string
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
| `repo` | `string \| undefined` | Repository path (GitHub/hybrid) |
| `package` | `string \| undefined` | Package name (npm/hybrid) |
| `slug` | `string \| undefined` | Product Hunt slug |
| `channelId` | `string \| undefined` | YouTube channel ID |
| `productId` | `string \| undefined` | Gumroad product ID |
| `storeId` | `string \| undefined` | Lemon Squeezy store ID |
| `username` | `string \| undefined` | Dev.to username |
| `commits` | `ProjectCommit[] \| undefined` | Recent commits (GitHub/hybrid) |
| `linkOrder` | `string[] \| undefined` | Link display order |

## Creation

`ProjexProject` objects are created by the `normalise` function:

```tsx
import { normalise } from '@manningworks/projex'

const project = await normalise({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active'
})
```

## Usage with Components

```tsx
import { ProjectCard, ProjectView } from '@manningworks/projex'

function ProjectPage({ project }: { project: ProjexProject }) {
  return (
    <ProjectCard>
      <ProjectCard.Header project={project} />
      <ProjectCard.Description project={project} />
    </ProjectCard>
  )
}
```
