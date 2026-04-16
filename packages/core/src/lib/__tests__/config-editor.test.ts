import { describe, it, expect, afterEach } from 'vitest'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  getProjectIds,
  addProject,
  addLearning,
  addTimelineEntry,
  addPost,
  removeProject,
  removeLearning,
  removeTimelineEntry,
  removePost,
  setProjectField,
  removeProjectField,
  getProjectSummaries,
  getArrayLength,
  getLearningEntries,
  getTimelineEntries,
  getPostEntries,
  ConfigEditorError,
} from '../config-editor.js'

const SAMPLE_CONFIG = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'project-1',
    type: 'github',
    repo: 'user/repo-1',
    status: 'active',
    featured: true,
    name: 'Project One',
    description: 'First project',
    stack: ['TypeScript', 'React'],
    struggles: [],
    timeline: [],
    posts: [],
  },
  {
    id: 'project-2',
    type: 'npm',
    package: 'my-package',
    status: 'shipped',
    featured: false,
    struggles: [{ type: 'learning', text: 'learned something' }],
    timeline: [{ date: '2025-01-01', note: 'started' }],
    posts: [{ title: 'Blog Post', date: '2025-01-15', url: 'https://example.com' }],
  },
])
`

const MINIMAL_CONFIG = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'minimal-project',
    type: 'manual',
    status: 'active',
    featured: false,
  },
])
`

const CONFIG_WITH_COMMENTS = `import { defineProjects } from '@manningworks/projex'

// This is a top-level comment
export const projects = defineProjects([
  // This is a project comment
  {
    id: 'commented-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
    featured: true,
    /* inline block comment */
    stack: ['TypeScript'],
    struggles: [],
    timeline: [],
    posts: [],
  },
])
`

async function createTempConfig(content: string): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), 'projex-test-'))
  const configPath = join(tempDir, 'projex.config.ts')
  await writeFile(configPath, content, 'utf-8')
  return configPath
}

async function cleanup(configPath: string): Promise<void> {
  const dir = configPath.substring(0, configPath.lastIndexOf('/'))
  await rm(dir, { recursive: true, force: true })
}

describe('config-editor', () => {
  afterEach(() => {
    // Cleanup is handled per-test
  })

  describe('getProjectIds', () => {
    it('returns all project IDs from config', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const ids = getProjectIds(configPath)
        expect(ids).toEqual(['project-1', 'project-2'])
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns single project ID', async () => {
      const configPath = await createTempConfig(MINIMAL_CONFIG)
      try {
        const ids = getProjectIds(configPath)
        expect(ids).toEqual(['minimal-project'])
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws when config file does not exist', () => {
      expect(() => getProjectIds('/nonexistent/path/projex.config.ts')).toThrow(
        ConfigEditorError,
      )
      expect(() => getProjectIds('/nonexistent/path/projex.config.ts')).toThrow(
        "Run 'projex init' first",
      )
    })
  })

  describe('addProject', () => {
    it('appends a new project to the config', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addProject(
          {
            id: 'new-project',
            type: 'github',
            repo: 'user/new-repo',
            status: 'active',
            featured: false,
            name: 'New Project',
          },
          configPath,
        )

        const ids = getProjectIds(configPath)
        expect(ids).toEqual(['project-1', 'project-2', 'new-project'])

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("id: 'new-project'")
        expect(content).toContain("type: 'github'")
        expect(content).toContain("repo: 'user/new-repo'")
        expect(content).toContain("name: 'New Project'")
        expect(content).toContain('struggles: []')
        expect(content).toContain('timeline: []')
        expect(content).toContain('posts: []')
      } finally {
        await cleanup(configPath)
      }
    })

    it('adds a project with all optional fields', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addProject(
          {
            id: 'full-project',
            type: 'hybrid',
            repo: 'user/repo',
            package: 'my-pkg',
            status: 'shipped',
            featured: true,
            name: 'Full Project',
            description: 'A full project',
            stack: ['React', 'TypeScript'],
          },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("id: 'full-project'")
        expect(content).toContain("type: 'hybrid'")
        expect(content).toContain("repo: 'user/repo'")
        expect(content).toContain("package: 'my-pkg'")
        expect(content).toContain("name: 'Full Project'")
        expect(content).toContain("description: 'A full project'")
        expect(content).toContain("'React'")
        expect(content).toContain("'TypeScript'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for duplicate project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() =>
          addProject(
            {
              id: 'project-1',
              type: 'github',
              repo: 'user/repo',
              status: 'active',
              featured: false,
            },
            configPath,
          ),
        ).toThrow(ConfigEditorError)
        expect(() =>
          addProject(
            {
              id: 'project-1',
              type: 'github',
              repo: 'user/repo',
              status: 'active',
              featured: false,
            },
            configPath,
          ),
        ).toThrow("Project ID 'project-1' already exists")
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws when config file does not exist', () => {
      expect(() =>
        addProject(
          {
            id: 'test',
            type: 'github',
            repo: 'user/repo',
            status: 'active',
            featured: false,
          },
          '/nonexistent/path/projex.config.ts',
        ),
      ).toThrow(ConfigEditorError)
    })

    it('adds project to config with comments preserving comments', async () => {
      const configPath = await createTempConfig(CONFIG_WITH_COMMENTS)
      try {
        addProject(
          {
            id: 'new-project',
            type: 'npm',
            package: 'new-pkg',
            status: 'active',
            featured: false,
          },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('This is a top-level comment')
        expect(content).toContain('This is a project comment')
        expect(content).toContain('inline block comment')
        expect(content).toContain("id: 'new-project'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('generates valid TypeScript output', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addProject(
          {
            id: 'typescript-test',
            type: 'github',
            repo: 'user/repo',
            status: 'active',
            featured: false,
          },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('defineProjects')
        expect(content).toContain('export const projects')
        expect(content).toContain("id: 'project-1'")
        expect(content).toContain("id: 'typescript-test'")
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('addLearning', () => {
    it('appends a learning entry to struggles array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addLearning(
          'project-1',
          { type: 'challenge', text: 'Fixed memory leak in event listeners' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("text: 'Fixed memory leak in event listeners'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('appends to existing struggles array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addLearning(
          'project-2',
          { type: 'challenge', text: 'New challenge' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('learned something')
        expect(content).toContain('New challenge')
      } finally {
        await cleanup(configPath)
      }
    })

    it('creates struggles property if missing', async () => {
      const configPath = await createTempConfig(MINIMAL_CONFIG)
      try {
        addLearning(
          'minimal-project',
          { type: 'learning', text: 'Learned something new' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('Learned something new')
        expect(content).toContain('struggles')
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() =>
          addLearning(
            'nonexistent',
            { type: 'challenge', text: 'test' },
            configPath,
          ),
        ).toThrow(ConfigEditorError)
        expect(() =>
          addLearning(
            'nonexistent',
            { type: 'challenge', text: 'test' },
            configPath,
          ),
        ).toThrow('not found')
      } finally {
        await cleanup(configPath)
      }
    })

    it('escapes single quotes in text', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addLearning(
          'project-1',
          { type: 'learning', text: "It's a learnings" },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("It\\'s a learnings")
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('addTimelineEntry', () => {
    it('appends a timeline entry to timeline array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addTimelineEntry(
          'project-1',
          { date: '2025-06-01', note: 'Reached 100 stars' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("date: '2025-06-01'")
        expect(content).toContain("note: 'Reached 100 stars'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('appends to existing timeline array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addTimelineEntry(
          'project-2',
          { date: '2025-06-01', note: 'New milestone' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('started')
        expect(content).toContain('New milestone')
      } finally {
        await cleanup(configPath)
      }
    })

    it('creates timeline property if missing', async () => {
      const configPath = await createTempConfig(MINIMAL_CONFIG)
      try {
        addTimelineEntry(
          'minimal-project',
          { date: '2025-06-01', note: 'Started' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('timeline')
        expect(content).toContain('Started')
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() =>
          addTimelineEntry(
            'nonexistent',
            { date: '2025-01-01', note: 'test' },
            configPath,
          ),
        ).toThrow(ConfigEditorError)
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('addPost', () => {
    it('appends a post to posts array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addPost(
          'project-1',
          {
            title: 'How I built X',
            date: '2025-06-01',
            url: 'https://example.com/post',
          },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("title: 'How I built X'")
        expect(content).toContain("date: '2025-06-01'")
        expect(content).toContain("url: 'https://example.com/post'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('appends a post without URL', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addPost(
          'project-1',
          { title: 'My Post', date: '2025-06-01' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("title: 'My Post'")
        expect(content).toContain("posts: [{ title: 'My Post', date: '2025-06-01' }],")
      } finally {
        await cleanup(configPath)
      }
    })

    it('appends to existing posts array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        addPost(
          'project-2',
          { title: 'New Post', date: '2025-06-01' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('Blog Post')
        expect(content).toContain('New Post')
      } finally {
        await cleanup(configPath)
      }
    })

    it('creates posts property if missing', async () => {
      const configPath = await createTempConfig(MINIMAL_CONFIG)
      try {
        addPost(
          'minimal-project',
          { title: 'First Post', date: '2025-06-01' },
          configPath,
        )

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('posts')
        expect(content).toContain('First Post')
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() =>
          addPost(
            'nonexistent',
            { title: 'Test', date: '2025-01-01' },
            configPath,
          ),
        ).toThrow(ConfigEditorError)
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('removeProject', () => {
    it('removes a project from config with 3 projects', async () => {
      const configWith3 = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'project-1',
    type: 'github',
    repo: 'user/repo-1',
    status: 'active',
    featured: true,
  },
  {
    id: 'project-2',
    type: 'npm',
    package: 'my-package',
    status: 'shipped',
    featured: false,
  },
  {
    id: 'project-3',
    type: 'manual',
    status: 'active',
    featured: false,
  },
])
`
      const configPath = await createTempConfig(configWith3)
      try {
        removeProject('project-2', configPath)

        const ids = getProjectIds(configPath)
        expect(ids).toEqual(['project-1', 'project-3'])

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("id: 'project-1'")
        expect(content).toContain("id: 'project-3'")
        expect(content).not.toContain("id: 'project-2'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('removes the only project leaving empty array', async () => {
      const configPath = await createTempConfig(MINIMAL_CONFIG)
      try {
        removeProject('minimal-project', configPath)

        const ids = getProjectIds(configPath)
        expect(ids).toEqual([])

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('defineProjects')
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removeProject('nonexistent', configPath)).toThrow(
          ConfigEditorError,
        )
        expect(() => removeProject('nonexistent', configPath)).toThrow(
          'not found',
        )
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves comments when removing', async () => {
      const configPath = await createTempConfig(CONFIG_WITH_COMMENTS)
      try {
        removeProject('commented-project', configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('This is a top-level comment')
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('removeLearning', () => {
    it('removes first learning entry', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        removeLearning('project-2', 0, configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).not.toContain('learned something')
      } finally {
        await cleanup(configPath)
      }
    })

    it('removes last learning entry leaving empty array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        removeLearning('project-2', 0, configPath)

        const length = getArrayLength('project-2', 'struggles', configPath)
        expect(length).toBe(0)
      } finally {
        await cleanup(configPath)
      }
    })

    it('removes one of two entries preserving the other', async () => {
      const configWithTwoLearnings = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'test-project',
    type: 'manual',
    status: 'active',
    featured: false,
    struggles: [{ type: 'challenge', text: 'first' }, { type: 'learning', text: 'second' }],
  },
])
`
      const configPath = await createTempConfig(configWithTwoLearnings)
      try {
        removeLearning('test-project', 0, configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).not.toContain('first')
        expect(content).toContain('second')
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for out-of-range index', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removeLearning('project-2', 5, configPath)).toThrow(
          ConfigEditorError,
        )
        expect(() => removeLearning('project-2', 5, configPath)).toThrow(
          'Invalid learning index',
        )
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removeLearning('nonexistent', 0, configPath)).toThrow(
          ConfigEditorError,
        )
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves comments when removing', async () => {
      const configWithCommentsAndEntries = `import { defineProjects } from '@manningworks/projex'

// This is a top-level comment
export const projects = defineProjects([
  // This is a project comment
  {
    id: 'commented-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
    featured: true,
    /* inline block comment */
    stack: ['TypeScript'],
    struggles: [{ type: 'learning', text: 'learned' }],
    timeline: [{ date: '2025-01-01', note: 'started' }],
    posts: [{ title: 'Post', date: '2025-01-15' }],
  },
])
`
      const configPath = await createTempConfig(configWithCommentsAndEntries)
      try {
        removeLearning('commented-project', 0, configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('This is a top-level comment')
        expect(content).toContain('inline block comment')
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('removeTimelineEntry', () => {
    it('removes a timeline entry', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        removeTimelineEntry('project-2', 0, configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).not.toContain('started')
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for out-of-range index', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removeTimelineEntry('project-2', 5, configPath)).toThrow(
          ConfigEditorError,
        )
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removeTimelineEntry('nonexistent', 0, configPath)).toThrow(
          ConfigEditorError,
        )
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves comments when removing', async () => {
      const configWithCommentsAndEntries = `import { defineProjects } from '@manningworks/projex'

// This is a top-level comment
export const projects = defineProjects([
  // This is a project comment
  {
    id: 'commented-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
    featured: true,
    /* inline block comment */
    stack: ['TypeScript'],
    struggles: [{ type: 'learning', text: 'learned' }],
    timeline: [{ date: '2025-01-01', note: 'started' }],
    posts: [{ title: 'Post', date: '2025-01-15' }],
  },
])
`
      const configPath = await createTempConfig(configWithCommentsAndEntries)
      try {
        removeTimelineEntry('commented-project', 0, configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('This is a top-level comment')
        expect(content).toContain('inline block comment')
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('removePost', () => {
    it('removes a post entry', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        removePost('project-2', 0, configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).not.toContain('Blog Post')
      } finally {
        await cleanup(configPath)
      }
    })

    it('removes last post leaving empty array', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        removePost('project-2', 0, configPath)

        const length = getArrayLength('project-2', 'posts', configPath)
        expect(length).toBe(0)
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for out-of-range index', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removePost('project-2', 5, configPath)).toThrow(
          ConfigEditorError,
        )
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removePost('nonexistent', 0, configPath)).toThrow(
          ConfigEditorError,
        )
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves comments when removing', async () => {
      const configWithCommentsAndEntries = `import { defineProjects } from '@manningworks/projex'

// This is a top-level comment
export const projects = defineProjects([
  // This is a project comment
  {
    id: 'commented-project',
    type: 'github',
    repo: 'user/repo',
    status: 'active',
    featured: true,
    /* inline block comment */
    stack: ['TypeScript'],
    struggles: [{ type: 'learning', text: 'learned' }],
    timeline: [{ date: '2025-01-01', note: 'started' }],
    posts: [{ title: 'Post', date: '2025-01-15' }],
  },
])
`
      const configPath = await createTempConfig(configWithCommentsAndEntries)
      try {
        removePost('commented-project', 0, configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('This is a top-level comment')
        expect(content).toContain('inline block comment')
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('setProjectField', () => {
    it('updates an existing string field', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        setProjectField('project-1', 'status', 'shipped', configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("status: 'shipped'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('creates a missing property', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        setProjectField('project-2', 'description', 'A new description', configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("description: 'A new description'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('sets a stack array field', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        setProjectField('project-1', 'stack', ['React', 'Next.js'], configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("'React'")
        expect(content).toContain("'Next.js'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('sets a boolean field to true', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        setProjectField('project-2', 'featured', true, configPath)

        const summaries = getProjectSummaries(configPath)
        const project2 = summaries.find((s) => s.id === 'project-2')
        expect(project2?.featured).toBe(true)
      } finally {
        await cleanup(configPath)
      }
    })

    it('sets a boolean field to false', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        setProjectField('project-1', 'featured', false, configPath)

        const summaries = getProjectSummaries(configPath)
        const project1 = summaries.find((s) => s.id === 'project-1')
        expect(project1?.featured).toBe(false)
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() =>
          setProjectField('nonexistent', 'status', 'active', configPath),
        ).toThrow(ConfigEditorError)
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves comments when updating', async () => {
      const configPath = await createTempConfig(CONFIG_WITH_COMMENTS)
      try {
        setProjectField('commented-project', 'status', 'shipped', configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('This is a top-level comment')
        expect(content).toContain('This is a project comment')
        expect(content).toContain('inline block comment')
        expect(content).toContain("status: 'shipped'")
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('getProjectSummaries', () => {
    it('returns summaries for all projects', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const summaries = getProjectSummaries(configPath)

        expect(summaries).toHaveLength(2)
        expect(summaries[0]).toEqual({
          id: 'project-1',
          type: 'github',
          status: 'active',
          featured: true,
          name: 'Project One',
        })
        expect(summaries[1]).toEqual({
          id: 'project-2',
          type: 'npm',
          status: 'shipped',
          featured: false,
          name: 'project-2',
        })
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns empty array for config with no projects', async () => {
      const emptyConfig = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([])
`
      const configPath = await createTempConfig(emptyConfig)
      try {
        const summaries = getProjectSummaries(configPath)
        expect(summaries).toEqual([])
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws when config file does not exist', () => {
      expect(() =>
        getProjectSummaries('/nonexistent/path/projex.config.ts'),
      ).toThrow(ConfigEditorError)
    })
  })

  describe('getLearningEntries', () => {
    it('returns learning entries from project', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const entries = getLearningEntries('project-2', configPath)
        expect(entries).toEqual([
          { index: 0, type: 'learning', text: 'learned something' },
        ])
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns empty array when no entries', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const entries = getLearningEntries('project-1', configPath)
        expect(entries).toEqual([])
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns empty array when struggles property missing', async () => {
      const configPath = await createTempConfig(MINIMAL_CONFIG)
      try {
        const entries = getLearningEntries('minimal-project', configPath)
        expect(entries).toEqual([])
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves original indices when non-object elements exist', async () => {
      const configWithSpread = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'test-project',
    type: 'manual',
    status: 'active',
    featured: false,
    struggles: [...sharedStruggles, { type: 'challenge', text: 'actual entry' }],
  },
])
`
      const configPath = await createTempConfig(configWithSpread)
      try {
        const entries = getLearningEntries('test-project', configPath)
        expect(entries).toHaveLength(1)
        expect(entries[0].index).toBe(1)
        expect(entries[0].text).toBe('actual entry')
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns multiple entries with correct indices', async () => {
      const configWithMultiple = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'test-project',
    type: 'manual',
    status: 'active',
    featured: false,
    struggles: [
      { type: 'challenge', text: 'first' },
      { type: 'learning', text: 'second' },
      { type: 'challenge', text: 'third' },
    ],
  },
])
`
      const configPath = await createTempConfig(configWithMultiple)
      try {
        const entries = getLearningEntries('test-project', configPath)
        expect(entries).toEqual([
          { index: 0, type: 'challenge', text: 'first' },
          { index: 1, type: 'learning', text: 'second' },
          { index: 2, type: 'challenge', text: 'third' },
        ])
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('getTimelineEntries', () => {
    it('returns timeline entries from project', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const entries = getTimelineEntries('project-2', configPath)
        expect(entries).toEqual([
          { index: 0, date: '2025-01-01', note: 'started' },
        ])
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns empty array when no entries', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const entries = getTimelineEntries('project-1', configPath)
        expect(entries).toEqual([])
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns empty array when timeline property missing', async () => {
      const configPath = await createTempConfig(MINIMAL_CONFIG)
      try {
        const entries = getTimelineEntries('minimal-project', configPath)
        expect(entries).toEqual([])
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('getPostEntries', () => {
    it('returns post entries from project', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const entries = getPostEntries('project-2', configPath)
        expect(entries).toEqual([
          { index: 0, title: 'Blog Post', date: '2025-01-15', url: 'https://example.com' },
        ])
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns empty array when no entries', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const entries = getPostEntries('project-1', configPath)
        expect(entries).toEqual([])
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns post without url as undefined', async () => {
      const configWithoutUrl = `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
  {
    id: 'test-project',
    type: 'manual',
    status: 'active',
    featured: false,
    posts: [{ title: 'No URL Post', date: '2025-01-01' }],
  },
])
`
      const configPath = await createTempConfig(configWithoutUrl)
      try {
        const entries = getPostEntries('test-project', configPath)
        expect(entries).toEqual([
          { index: 0, title: 'No URL Post', date: '2025-01-01', url: undefined },
        ])
      } finally {
        await cleanup(configPath)
      }
    })
  })

  describe('removeProjectField', () => {
    it('removes an existing field', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const result = removeProjectField('project-1', 'description', configPath)
        expect(result).toBe(true)

        const content = await readFile(configPath, 'utf-8')
        expect(content).not.toContain('description')
        expect(content).toContain("id: 'project-1'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('returns false when field does not exist', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const result = removeProjectField('project-1', 'nonexistent', configPath)
        expect(result).toBe(false)
      } finally {
        await cleanup(configPath)
      }
    })

    it('removes a type-specific field', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        const result = removeProjectField('project-1', 'repo', configPath)
        expect(result).toBe(true)

        const content = await readFile(configPath, 'utf-8')
        expect(content).not.toContain('repo')
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves other fields when removing', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        removeProjectField('project-1', 'description', configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain("id: 'project-1'")
        expect(content).toContain("type: 'github'")
        expect(content).toContain("status: 'active'")
        expect(content).toContain("name: 'Project One'")
      } finally {
        await cleanup(configPath)
      }
    })

    it('preserves comments when removing', async () => {
      const configPath = await createTempConfig(CONFIG_WITH_COMMENTS)
      try {
        removeProjectField('commented-project', 'stack', configPath)

        const content = await readFile(configPath, 'utf-8')
        expect(content).toContain('This is a top-level comment')
        expect(content).toContain('inline block comment')
      } finally {
        await cleanup(configPath)
      }
    })

    it('throws for invalid project ID', async () => {
      const configPath = await createTempConfig(SAMPLE_CONFIG)
      try {
        expect(() => removeProjectField('nonexistent', 'description', configPath)).toThrow(
          ConfigEditorError,
        )
      } finally {
        await cleanup(configPath)
      }
    })
  })
})
