import { useState } from 'react'
import { ShowcaseCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'
import type { FolioProject } from '@reallukemanning/folio'

const mockProject: FolioProject = {
  id: 'showcase-mock',
  type: 'manual',
  name: 'My App',
  tagline: 'A beautiful web application',
  description: 'A complete web application built with modern technologies.',
  stack: ['React', 'Next.js', 'TypeScript'],
  links: {
    live: 'https://myapp.dev',
    github: 'https://github.com/user/myapp',
  },
  status: 'active',
  language: null,
  languageColor: null,
  featured: false,
  background: null,
  why: null,
  image: null,
  struggles: [],
  timeline: [],
  posts: [],
  stats: null,
  createdAt: null,
  updatedAt: null,
}

export function ShowcaseCardMinimalPreview() {
  return (
    <ShowcaseCard>
      <ShowcaseCard.Header project={mockProject} />
      <ShowcaseCard.Description project={mockProject} />
      <ShowcaseCard.Tags project={mockProject} />
      <ShowcaseCard.Status project={mockProject} />
      <ShowcaseCard.Links project={mockProject} />
    </ShowcaseCard>
  )
}

export function ShowcaseCardRealPreview() {
  const project = normalisedExamples.portfolio

  return (
    <ShowcaseCard>
      <ShowcaseCard.Header project={project} />
      <ShowcaseCard.Description project={project} />
      <ShowcaseCard.Tags project={project} />
      <ShowcaseCard.Status project={project} />
      <ShowcaseCard.Links project={project} />
    </ShowcaseCard>
  )
}

export function ShowcaseCardInteractiveDemo() {
  const [showStatus, setShowStatus] = useState(true)
  const project = normalisedExamples.portfolio

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showStatus}
            onChange={(e) => setShowStatus(e.target.checked)}
          />
          Show status
        </label>
      </div>
      <ShowcaseCard>
        <ShowcaseCard.Header project={project} />
        <ShowcaseCard.Description project={project} />
        <ShowcaseCard.Tags project={project} />
        {showStatus && <ShowcaseCard.Status project={project} />}
        <ShowcaseCard.Links project={project} />
      </ShowcaseCard>
    </div>
  )
}
