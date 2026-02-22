export type ProjectType = 'github' | 'manual' | 'npm' | 'product-hunt' | 'hybrid'

export type ProjectStatus = 'active' | 'shipped' | 'in-progress' | 'coming-soon' | 'archived' | 'for-sale'

export interface ProjectStruggle {
  type: 'warn' | 'error'
  text: string
}

export interface ProjectTimelineEntry {
  date: string
  note: string
}

export interface ProjectPost {
  title: string
  date: string
  url?: string
}

export interface ProjectLinks {
  github?: string
  live?: string
  npm?: string
  appStore?: string
  playStore?: string
  productHunt?: string
}

export interface GitHubStats {
  stars?: number
  forks?: number
}

export interface NpmStats {
  downloads?: string
  version?: string
}

export interface ProductHuntStats {
  upvotes?: number
  comments?: number
  launchDate?: string
}

export type ProjectStats = GitHubStats & NpmStats & ProductHuntStats

export interface NormalizedStat {
  label: string
  value: string | number
  unit?: string
}

export interface BaseProjectInput {
  id: string
  status: ProjectStatus
  featured?: boolean
  name?: string
  tagline?: string
  description?: string
  background?: string
  why?: string
  image?: string
  struggles?: ProjectStruggle[]
  timeline?: ProjectTimelineEntry[]
  posts?: ProjectPost[]
  stack?: string[]
  links?: ProjectLinks
  stats?: ProjectStats
  override?: {
    name?: string
    tagline?: string
    description?: string
    stack?: string[]
  }
}

export interface GitHubProjectInput extends BaseProjectInput {
  type: 'github'
  repo: string
}

export interface ManualProjectInput extends BaseProjectInput {
  type: 'manual'
}

export interface NpmProjectInput extends BaseProjectInput {
  type: 'npm'
  package: string
}

export interface ProductHuntProjectInput extends BaseProjectInput {
  type: 'product-hunt'
  slug: string
}

export interface HybridProjectInput extends BaseProjectInput {
  type: 'hybrid'
  repo: string
  package: string
}

export type FolioProjectInput =
  | GitHubProjectInput
  | ManualProjectInput
  | NpmProjectInput
  | ProductHuntProjectInput
  | HybridProjectInput

export type FolioProjectInputCompat = Omit<BaseProjectInput, 'id'> & {
  id: string
  type?: ProjectType
  repo?: string
  package?: string
  slug?: string
}

export interface FolioProject {
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
  repo?: string
  package?: string
  slug?: string
}
