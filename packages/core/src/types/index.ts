export type ProjectType = 'github' | 'manual' | 'npm' | 'product-hunt' | 'youtube' | 'gumroad' | 'lemonsqueezy' | 'devto' | 'hybrid'

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

export interface ProjectCommitAuthor {
  name?: string
  email?: string
}

export interface ProjectCommit {
  message: string
  date: string
  url: string
  author?: ProjectCommitAuthor
}

export interface ProjectLinks {
  github?: string
  live?: string
  npm?: string
  docs?: string
  demo?: string
  appStore?: string
  playStore?: string
  productHunt?: string
  custom?: Array<{ label: string, url: string }>
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

export interface YouTubeStats {
  subscribers?: number
  views?: number
  latestVideoTitle?: string | null
  latestVideoUrl?: string | null
  latestVideoPublishedAt?: string | null
}

export interface GumroadStats {
  formattedRevenue?: string
  salesCount?: number
  subscriberCount?: number
}

export interface LemonSqueezyStats {
  formattedMRR?: string
  orderCount?: number
  customerCount?: number
}

export interface DevToStats {
  articleCount?: number
  totalViews?: number
  averageReactions?: number
}

export type ProjectStats = GitHubStats & NpmStats & ProductHuntStats & YouTubeStats & GumroadStats & LemonSqueezyStats & DevToStats

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
  createdAt?: string
  updatedAt?: string
  linkOrder?: string[]
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
  commits?: number
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

export interface YouTubeProjectInput extends BaseProjectInput {
  type: 'youtube'
  channelId: string
}

export interface GumroadProjectInput extends BaseProjectInput {
  type: 'gumroad'
  productId: string
}

export interface LemonSqueezyProjectInput extends BaseProjectInput {
  type: 'lemonsqueezy'
  storeId: string
}

export interface DevToProjectInput extends BaseProjectInput {
  type: 'devto'
  username: string
}

export interface HybridProjectInput extends BaseProjectInput {
  type: 'hybrid'
  repo: string
  package: string
  commits?: number
}

export type FolioProjectInput =
  | GitHubProjectInput
  | ManualProjectInput
  | NpmProjectInput
  | ProductHuntProjectInput
  | YouTubeProjectInput
  | GumroadProjectInput
  | LemonSqueezyProjectInput
  | DevToProjectInput
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
