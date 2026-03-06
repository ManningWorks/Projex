import { useState } from 'react'
import { GitHubCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'
import type { FolioProject } from '@reallukemanning/folio'

const mockProject: FolioProject = {
  id: 'react-mock',
  type: 'github',
  name: 'React',
  tagline: 'A JavaScript library for building user interfaces',
  description: 'React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.',
  stack: ['JavaScript', 'UI'],
  stats: {
    stars: 180000,
    forks: 36000,
  },
  language: 'JavaScript',
  languageColor: '#f1e05a',
  links: {
    github: 'https://github.com/facebook/react',
  },
  status: 'active',
  featured: false,
  background: null,
  why: null,
  image: null,
  struggles: [],
  timeline: [],
  posts: [],
  createdAt: null,
  updatedAt: null,
}

export function GitHubCardMinimalPreview() {
  return (
    <GitHubCard project={mockProject}>
      <GitHubCard.Header project={mockProject} />
      <GitHubCard.Description project={mockProject} />
      <GitHubCard.Tags project={mockProject} />
      <GitHubCard.Stats project={mockProject} />
      <GitHubCard.Status project={mockProject} />
      <GitHubCard.Links project={mockProject} />
    </GitHubCard>
  )
}

export function GitHubCardRealPreview() {
  const project = normalisedExamples.react

  return (
    <GitHubCard project={project}>
      <GitHubCard.Header project={project} />
      <GitHubCard.Description project={project} />
      <GitHubCard.Tags project={project} />
      <GitHubCard.Stats project={project} />
      <GitHubCard.Status project={project} />
      <GitHubCard.Links project={project} />
    </GitHubCard>
  )
}

export function GitHubCardInteractiveDemo() {
  const [showForks, setShowForks] = useState(true)
  const [showStatus, setShowStatus] = useState(true)
  const project = normalisedExamples.react

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showForks}
            onChange={(e) => setShowForks(e.target.checked)}
          />
          Show forks
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showStatus}
            onChange={(e) => setShowStatus(e.target.checked)}
          />
          Show status
        </label>
      </div>
      <GitHubCard project={project}>
        <GitHubCard.Header project={project} />
        <GitHubCard.Description project={project} />
        <GitHubCard.Tags project={project} />
        <GitHubCard.Stats project={project} />
        {showStatus && <GitHubCard.Status project={project} />}
        <GitHubCard.Links project={project} />
      </GitHubCard>
    </div>
  )
}
