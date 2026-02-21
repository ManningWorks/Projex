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
  stars?: string
  forks?: string
  downloads?: string
}

export interface FolioProjectInput {
  id: string
  name: string
  description: string
  type: ProjectType
  status: ProjectStatus
  links?: ProjectLinks
  tags?: string[]
  stats?: ProjectStats
  background?: string
  struggles?: ProjectStruggle[]
  timeline?: ProjectTimelineEntry[]
  posts?: ProjectPost[]
  techStack?: string[]
}

export interface FolioProject {
  id: string
  name: string
  description: string
  type: ProjectType
  status: ProjectStatus
  links: ProjectLinks
  tags: string[]
  stats: ProjectStats
  background: string | null
  struggles: ProjectStruggle[]
  timeline: ProjectTimelineEntry[]
  posts: ProjectPost[]
  techStack: string[]
}
