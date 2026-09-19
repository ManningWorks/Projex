// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { removeProjectCommand } from '../remove-project.js'
import * as configEditor from '../../lib/config-editor.js'
import confirm from '@inquirer/confirm'

vi.mock('@inquirer/confirm', () => ({
  default: vi.fn(),
}))

vi.mock('node:fs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  existsSync: vi.fn(),
}))

vi.mock('../../lib/config-editor.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/config-editor.js')>()
  return {
    ...actual,
    removeProject: vi.fn(),
    getProjectIds: vi.fn(() => ['my-project', 'other-project']),
  }
})

describe('removeProjectCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(configEditor.getProjectIds).mockReturnValue(['my-project', 'other-project'])
  })

  describe('with --force flag', () => {
    it('should remove project without confirmation', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removeProjectCommand('my-project', { force: true })

      expect(configEditor.removeProject).toHaveBeenCalledWith(
        'my-project',
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Project 'my-project' removed"),
      )

      logSpy.mockRestore()
    })
  })

  describe('interactive confirmation', () => {
    it('should prompt for confirmation and remove when confirmed', async () => {
      const { existsSync } = await import('node:fs')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(confirm).mockResolvedValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removeProjectCommand('my-project')

      expect(confirm).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('my-project') }),
      )
      expect(configEditor.removeProject).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Project 'my-project' removed"),
      )

      logSpy.mockRestore()
    })

    it('should cancel when user declines', async () => {
      const { existsSync } = await import('node:fs')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(confirm).mockResolvedValue(false)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removeProjectCommand('my-project')

      expect(configEditor.removeProject).not.toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })

  describe('error handling', () => {
    it('should exit when config file not found', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(false)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await removeProjectCommand('my-project', { force: true })

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

      await removeProjectCommand('nonexistent', { force: true })

      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'))
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should handle prompt cancellation', async () => {
      const { existsSync } = await import('node:fs')

      vi.mocked(existsSync).mockReturnValue(true)
      const cancelError = new Error('User cancelled')
      cancelError.name = 'ExitPromptError'
      vi.mocked(confirm).mockRejectedValue(cancelError)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await removeProjectCommand('my-project')

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })
})
