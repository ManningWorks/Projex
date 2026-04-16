import { describe, it, expect, vi, beforeEach } from 'vitest'
import { dispatchRemove } from '../dispatch-remove.js'

vi.mock('../remove-project.js', () => ({
  removeProjectCommand: vi.fn(),
}))

vi.mock('../remove-learning.js', () => ({
  removeLearningCommand: vi.fn(),
}))

vi.mock('../remove-timeline.js', () => ({
  removeTimelineCommand: vi.fn(),
}))

vi.mock('../remove-post.js', () => ({
  removePostCommand: vi.fn(),
}))

describe('dispatchRemove', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('content type routing', () => {
    it('should route "project" to removeProjectCommand', async () => {
      const { removeProjectCommand } = await import('../remove-project.js')

      await dispatchRemove('project', 'my-project', { force: true })

      expect(removeProjectCommand).toHaveBeenCalledWith('my-project', { force: true })
    })

    it('should route "learning" to removeLearningCommand', async () => {
      const { removeLearningCommand } = await import('../remove-learning.js')

      await dispatchRemove('learning', 'my-project', { index: 0 })

      expect(removeLearningCommand).toHaveBeenCalledWith('my-project', { index: 0 })
    })

    it('should route "timeline" to removeTimelineCommand', async () => {
      const { removeTimelineCommand } = await import('../remove-timeline.js')

      await dispatchRemove('timeline', 'my-project', { index: 0 })

      expect(removeTimelineCommand).toHaveBeenCalledWith('my-project', { index: 0 })
    })

    it('should route "post" to removePostCommand', async () => {
      const { removePostCommand } = await import('../remove-post.js')

      await dispatchRemove('post', 'my-project', { index: 0 })

      expect(removePostCommand).toHaveBeenCalledWith('my-project', { index: 0 })
    })
  })

  describe('validation', () => {
    it('should exit for unknown content type', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await dispatchRemove('unknown', 'some-id')

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown content type'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should exit when project ID is missing', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await dispatchRemove('project', undefined)

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Project ID is required'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })
  })
})
