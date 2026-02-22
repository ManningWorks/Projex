export type ProjectType = 'github' | 'manual' | 'npm' | 'hybrid'

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
}

export interface ProjectStats {
  stars?: number
  forks?: number
  downloads?: string
}

export interface FolioProjectInput {
  id: string
  type: ProjectType
  status: ProjectStatus
  featured?: boolean

  repo?: string

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
