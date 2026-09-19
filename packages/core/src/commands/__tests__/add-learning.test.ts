// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addLearningCommand } from '../add-learning.js'
import * as configEditor from '../../lib/config-editor.js'
import input from '@inquirer/input'
import select from '@inquirer/select'

vi.mock('@inquirer/input', () => ({
  default: vi.fn(),
}))
vi.mock('@inquirer/select', () => ({
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
    addLearning: vi.fn(),
    getProjectIds: vi.fn(() => ['my-project', 'other-project']),
  }
})

describe('addLearningCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks()
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

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(select).mockResolvedValue('challenge')
      vi.mocked(input).mockResolvedValue('Overcame a tough bug')

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addLearningCommand('my-project')

      expect(select).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Entry type:' }),
      )
      expect(input).toHaveBeenCalledWith(
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

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(select).mockResolvedValue('learning')
      vi.mocked(input).mockResolvedValue('Something learned')

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await addLearningCommand('my-project')

      expect(input).toHaveBeenCalledWith(
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

      vi.mocked(existsSync).mockReturnValue(true)
      const cancelError = new Error('User cancelled')
      cancelError.name = 'ExitPromptError'
      vi.mocked(select).mockRejectedValue(cancelError)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addLearningCommand('my-project')

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })
})
