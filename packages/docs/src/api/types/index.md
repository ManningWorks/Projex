# Types

Projex exports TypeScript types for all data structures. Import types from the main entry point.

## Available Types

### Core Types

| Type | Description |
|------|-------------|
| [ProjexProject](./projex-project) | Normalized project object |
| [ProjexProjectInput](./projex-project-input) | Project input configuration |
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
| [ProjectStruggle](./project-struggle) | Challenge or learning from the project |
| [ProjectTimelineEntry](./project-timeline-entry) | Timeline milestone entry |
| [ProjectPost](./project-post) | Blog post or article reference |
| [ProjectCommit](./project-commit) | GitHub commit data |
| [ProjectCommitAuthor](./project-commit) | Commit author information |

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
| [ProjexProjectInputCompat](./projex-project-input-compat) | Compatibility type for flexible/partial project input |
| SortValue | Allowed sort values for sortProjects |
| ProjexProjectInputZod | Zod schema type for project validation |
| FuseOptions | Fuse.js configuration options |

### Schema Types

| Type | Description |
|------|-------------|
| projexProjectInputSchema | Zod validation schema for ProjexProjectInput |
| PersonSchema | Schema.org Person JSON-LD |
| SoftwareApplicationSchema | Schema.org SoftwareApplication JSON-LD |
| GeneratePersonSchemaOptions | Options for generatePersonSchema |
| GeneratePortfolioMetadataOptions | Options for generatePortfolioMetadata |

## Import

```tsx
import type { 
  ProjexProject, 
  ProjexProjectInput, 
  ProjectType, 
  ProjectStatus 
} from '@manningworks/projex'
```

## Type Relationships

```
ProjexProjectInput ──normalise()──> ProjexProject
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
