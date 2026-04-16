import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addLearningCommand } from '../add-learning.js'
import * as configEditor from '../../lib/config-editor.js'

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  select: vi.fn(),
}))

vi.mock('node:fs')

vi.mock('../../lib/config-editor.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/config-editor.js')>()
  return {
    ...actual,
    addLearning: vi.fn(),
    getProjectIds: vi.fn(() => ['my-project', 'other-project']),
  }
})

describe('addLearningCommand', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(configEditor.getProjectIds).mockReturnValue(['my-project', 'other-project'])
  })

  describe('non-interactive mode', () => {
    it('should add a challenge without prompts', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addLearningCommand('my-project', {
        type: 'challenge',
        text: 'Fixed memory leak in event listeners',
      })

      expect(configEditor.addLearning).toHaveBeenCalledWith(
        'my-project',
        { type: 'challenge', text: 'Fixed memory leak in event listeners' },
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("challenge added to 'my-project'"),
      )

      logSpy.mockRestore()
    })

    it('should add a learning without prompts', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addLearningCommand('my-project', {
        type: 'learning',
        text: 'Discovered better error handling pattern',
      })

      expect(configEditor.addLearning).toHaveBeenCalledWith(
        'my-project',
        { type: 'learning', text: 'Discovered better error handling pattern' },
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("learning added to 'my-project'"),
      )

      logSpy.mockRestore()
    })
  })

  describe('interactive mode', () => {
    it('should prompt for type and text when no flags provided', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select).mockResolvedValue('challenge')
      vi.mocked(prompts.input).mockResolvedValue('Overcame a tough bug')

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addLearningCommand('my-project')

      expect(prompts.select).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Entry type:' }),
      )
      expect(prompts.input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Challenge:' }),
      )
      expect(configEditor.addLearning).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("challenge added to 'my-project'"),
      )

      logSpy.mockRestore()
    })

    it('should prompt with "Learning:" label when type is learning', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select).mockResolvedValue('learning')
      vi.mocked(prompts.input).mockResolvedValue('Something learned')

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await addLearningCommand('my-project')

      expect(prompts.input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Learning:' }),
      )
    })
  })

  describe('error handling', () => {
    it('should exit when config file not found', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(false)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await addLearningCommand('my-project', { type: 'challenge', text: 'test' })

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

      await addLearningCommand('nonexistent', { type: 'challenge', text: 'test' })

      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('not found'))
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('my-project'))
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

      await addLearningCommand('my-project')

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })
})
