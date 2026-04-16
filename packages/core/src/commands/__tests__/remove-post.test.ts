import { describe, it, expect, vi, beforeEach } from 'vitest'
import { removePostCommand } from '../remove-post.js'
import * as configEditor from '../../lib/config-editor.js'

vi.mock('@inquirer/prompts', () => ({
  select: vi.fn(),
}))

vi.mock('node:fs')

vi.mock('../../lib/config-editor.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/config-editor.js')>()
  return {
    ...actual,
    removePost: vi.fn(),
    getProjectIds: vi.fn(() => ['my-project']),
    getPostEntries: vi.fn(() => [
      { index: 0, title: 'Test Post', date: '2024-01-15' },
    ]),
  }
})

describe('removePostCommand', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(configEditor.getProjectIds).mockReturnValue(['my-project'])
    vi.mocked(configEditor.getPostEntries).mockReturnValue([
      { index: 0, title: 'Test Post', date: '2024-01-15' },
    ])
  })

  describe('non-interactive mode', () => {
    it('should remove post entry by index', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removePostCommand('my-project', { index: 0 })

      expect(configEditor.removePost).toHaveBeenCalledWith(
        'my-project',
        0,
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Post entry #0 removed from 'my-project'"),
      )

      logSpy.mockRestore()
    })

    it('should print message when no entries exist', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(configEditor.getPostEntries).mockReturnValue([])

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removePostCommand('my-project', { index: 0 })

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('No post entries to remove'),
      )

      logSpy.mockRestore()
    })
  })

  describe('interactive mode', () => {
    it('should prompt for selection when no index given', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select).mockResolvedValue(0)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removePostCommand('my-project')

      expect(prompts.select).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('post') }),
      )
      expect(configEditor.removePost).toHaveBeenCalledWith(
        'my-project',
        0,
        expect.any(String),
      )

      logSpy.mockRestore()
    })
  })

  describe('error handling', () => {
    it('should exit when config file not found', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(false)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await removePostCommand('my-project', { index: 0 })

      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'))
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should exit when project ID is invalid', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await removePostCommand('nonexistent', { index: 0 })

      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'))
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should handle prompt cancellation', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      const cancelError = new Error('User cancelled')
      cancelError.name = 'ExitPromptError'
      vi.mocked(prompts.select).mockRejectedValue(cancelError)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removePostCommand('my-project')

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })
})
