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

export interface ProjectStats {
  stars?: number
  forks?: number
  downloads?: string
  version?: string
  upvotes?: number
  comments?: number
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
}
