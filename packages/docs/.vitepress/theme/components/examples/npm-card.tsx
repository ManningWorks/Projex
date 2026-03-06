import { useState } from 'react'
import { NpmCard } from '@reallukemanning/folio'
import { normalisedExamples } from './data/normalised'
import type { FolioProject } from '@reallukemanning/folio'

const mockProject: FolioProject = {
  id: 'lodash-mock',
  type: 'npm',
  name: 'Lodash',
  tagline: 'A modern JavaScript utility library',
  description: 'Lodash makes JavaScript easier by taking the hassle out of working with arrays, numbers, objects, strings, etc.',
  stack: ['JavaScript', 'Utilities'],
  stats: {
    downloads: '50000000',
    version: '4.17.21',
  },
  links: {
    npm: 'https://npmjs.com/package/lodash',
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
  createdAt: null,
  updatedAt: null,
}

export function NpmCardMinimalPreview() {
  return (
    <NpmCard>
      <NpmCard.Header project={mockProject} />
      <NpmCard.Description project={mockProject} />
      <NpmCard.Tags project={mockProject} />
      <NpmCard.Stats project={mockProject} />
      <NpmCard.Status project={mockProject} />
      <NpmCard.Links project={mockProject} />
    </NpmCard>
  )
}

export function NpmCardRealPreview() {
  const project = normalisedExamples.lodash

  return (
    <NpmCard>
      <NpmCard.Header project={project} />
      <NpmCard.Description project={project} />
      <NpmCard.Tags project={project} />
      <NpmCard.Stats project={project} />
      <NpmCard.Status project={project} />
      <NpmCard.Links project={project} />
    </NpmCard>
  )
}

export function NpmCardInteractiveDemo() {
  const [showVersion, setShowVersion] = useState(true)
  const [showStatus, setShowStatus] = useState(true)
  const project = normalisedExamples.lodash

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showVersion}
            onChange={(e) => setShowVersion(e.target.checked)}
          />
          Show version
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
      <NpmCard>
        <NpmCard.Header project={project} />
        <NpmCard.Description project={project} />
        <NpmCard.Tags project={project} />
        {showVersion && <NpmCard.Stats project={project} />}
        {showStatus && <NpmCard.Status project={project} />}
        <NpmCard.Links project={project} />
      </NpmCard>
    </div>
  )
}
