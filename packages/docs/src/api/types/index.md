# Types

Folio exports TypeScript types for all data structures. Import types from the main entry point.

## Available Types

### Core Types

| Type | Description |
|------|-------------|
| [FolioProject](./folio-project) | Normalized project object |
| [FolioProjectInput](./folio-project-input) | Project input configuration |
| [ProjectType](./project-type) | Project type union |
| [ProjectStatus](./project-status) | Project status union |

### Stats Types

| Type | Description |
|------|-------------|
| [ProjectStats](./project-stats) | Combined stats interface |
| GitHubStats | GitHub-specific stats |
| NpmStats | npm-specific stats |
| ProductHuntStats | Product Hunt-specific stats |
| NormalizedStat | Normalized stat for display |

### Data Types

| Type | Description |
|------|-------------|
| [ProjectLinks](./project-links) | Project link URLs |
| ProjectStruggle | Struggle/warning object |
| ProjectTimelineEntry | Timeline entry object |
| ProjectPost | Blog post reference |

### Fetched Data Types

| Type | Description |
|------|-------------|
| [GitHubRepoData](./github-repo-data) | GitHub API response |
| [NpmPackageData](./npm-package-data) | npm API response |
| [ProductHuntPostData](./product-hunt-post-data) | Product Hunt API response |

## Import

```tsx
import type { 
  FolioProject, 
  FolioProjectInput, 
  ProjectType, 
  ProjectStatus 
} from '@reallukemanning/folio'
```

## Type Relationships

```
FolioProjectInput ──normalise()──> FolioProject
       │                                 │
       ├── GitHubProjectInput            ├── stats: ProjectStats
       ├── NpmProjectInput               ├── links: ProjectLinks
       ├── ProductHuntProjectInput       ├── struggles: ProjectStruggle[]
       ├── HybridProjectInput            ├── timeline: ProjectTimelineEntry[]
       └── ManualProjectInput            └── posts: ProjectPost[]
```
