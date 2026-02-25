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
| YouTubeStats | YouTube-specific stats |
| GumroadStats | Gumroad-specific stats |
| LemonSqueezyStats | Lemon Squeezy-specific stats |
| DevToStats | Dev.to-specific stats |
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
| FetchReposResult | Result object for fetchGitHubRepos |
| FetchReposError | Error type for fetchGitHubRepos |
| [NpmPackageData](./npm-package-data) | npm API response |
| [ProductHuntPostData](./product-hunt-post-data) | Product Hunt API response |
| YouTubeChannelData | YouTube API response |
| GumroadProductData | Gumroad API response |
| LemonSqueezyStoreData | Lemon Squeezy API response |
| DevToUserData | Dev.to API response |
| DevToArticleData | Dev.to article data |

### Utility Types

| Type | Description |
|------|-------------|
| SortValue | Allowed sort values for sortProjects |
| FolioProjectInputZod | Zod schema type for project validation |
| FuseOptions | Fuse.js configuration options |

### Schema Types

| Type | Description |
|------|-------------|
| folioProjectInputSchema | Zod validation schema for FolioProjectInput |
| PersonSchema | Schema.org Person JSON-LD |
| SoftwareApplicationSchema | Schema.org SoftwareApplication JSON-LD |
| GeneratePersonSchemaOptions | Options for generatePersonSchema |
| GeneratePortfolioMetadataOptions | Options for generatePortfolioMetadata |

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
       ├── YouTubeProjectInput           ├── timeline: ProjectTimelineEntry[]
       ├── GumroadProjectInput          └── posts: ProjectPost[]
       ├── LemonSqueezyProjectInput
       ├── DevToProjectInput
       ├── HybridProjectInput
       └── ManualProjectInput
```
