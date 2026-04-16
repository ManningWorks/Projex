import { describe, it, expect, vi, beforeEach } from 'vitest'
import { dispatchAdd } from '../dispatch-add.js'

vi.mock('../add.js', () => ({
  add: vi.fn(),
}))

vi.mock('../add-project.js', () => ({
  addProjectCommand: vi.fn(),
}))

vi.mock('../add-learning.js', () => ({
  addLearningCommand: vi.fn(),
}))

vi.mock('../add-timeline.js', () => ({
  addTimelineCommand: vi.fn(),
}))

vi.mock('../add-post.js', () => ({
  addPostCommand: vi.fn(),
}))

describe('dispatchAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('content type routing', () => {
    it('should route "project" to addProjectCommand', async () => {
      const { addProjectCommand } = await import('../add-project.js')

      await dispatchAdd('project', undefined, { type: 'github', name: 'Test', repo: 'r', status: 'active', featured: false })

      expect(addProjectCommand).toHaveBeenCalled()
    })

    it('should route "learning" to addLearningCommand with project ID', async () => {
      const { addLearningCommand } = await import('../add-learning.js')

      await dispatchAdd('learning', 'my-project', { type: 'challenge', text: 'test' })

      expect(addLearningCommand).toHaveBeenCalledWith('my-project', { type: 'challenge', text: 'test' })
    })

    it('should route "timeline" to addTimelineCommand with project ID', async () => {
      const { addTimelineCommand } = await import('../add-timeline.js')

      await dispatchAdd('timeline', 'my-project', { date: '2025-01-01', note: 'test' })

      expect(addTimelineCommand).toHaveBeenCalledWith('my-project', { date: '2025-01-01', note: 'test' })
    })

    it('should route "post" to addPostCommand with project ID', async () => {
      const { addPostCommand } = await import('../add-post.js')

      await dispatchAdd('post', 'my-project', { title: 'Test', date: '2025-01-01' })

      expect(addPostCommand).toHaveBeenCalledWith('my-project', { title: 'Test', date: '2025-01-01' })
    })
  })

  describe('component routing', () => {
    it('should route component names to add function', async () => {
      const { add } = await import('../add.js')

      await dispatchAdd('github-card', undefined, { force: false })

      expect(add).toHaveBeenCalledWith('github-card', { force: false })
    })

    it('should route unknown types to add function', async () => {
      const { add } = await import('../add.js')

      await dispatchAdd('some-unknown-thing', undefined, {})

      expect(add).toHaveBeenCalledWith('some-unknown-thing', {})
    })
  })

  describe('missing project ID validation', () => {
    it('should exit when learning is called without project ID', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await dispatchAdd('learning', undefined, {})

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Project ID is required'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should exit when timeline is called without project ID', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await dispatchAdd('timeline', undefined, {})

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Project ID is required'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should exit when post is called without project ID', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await dispatchAdd('post', undefined, {})

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Project ID is required'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })
  })
})
