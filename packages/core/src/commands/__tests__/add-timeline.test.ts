// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addTimelineCommand } from '../add-timeline.js'
import * as configEditor from '../../lib/config-editor.js'
import input from '@inquirer/input'

vi.mock('@inquirer/input', () => ({
  default: vi.fn(),
}))

vi.mock('node:fs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  existsSync: vi.fn(),
}))

vi.mock('../../lib/config-editor.js', () => ({
  addTimelineEntry: vi.fn(),
  getProjectIds: vi.fn(() => ['my-project', 'other-project']),
  ConfigEditorError: class extends Error {
    constructor(m: string) { super(m); this.name = 'ConfigEditorError' }
  },
}))

describe('addTimelineCommand', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(configEditor.getProjectIds).mockReturnValue(['my-project', 'other-project'])
  })

  describe('non-interactive mode', () => {
    it('should add a timeline entry without prompts', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addTimelineCommand('my-project', {
        date: '2025-06-01',
        note: 'Reached 100 stars',
      })

      expect(configEditor.addTimelineEntry).toHaveBeenCalledWith(
        'my-project',
        { date: '2025-06-01', note: 'Reached 100 stars' },
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Timeline entry added to 'my-project'"),
      )

      logSpy.mockRestore()
    })

    it('should use today as default when only note is provided', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const today = new Date()
      const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

      vi.mocked(input).mockResolvedValue(expectedDate)

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await addTimelineCommand('my-project', { note: 'Something happened' })

      expect(configEditor.addTimelineEntry).toHaveBeenCalledWith(
        'my-project',
        { date: expectedDate, note: 'Something happened' },
        expect.any(String),
      )
    })
  })

  describe('interactive mode', () => {
    it('should prompt for date and note when no flags provided', async () => {
      const { existsSync } = await import('node:fs')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(input)
        .mockResolvedValueOnce('2025-06-01')
        .mockResolvedValueOnce('Milestone reached')

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addTimelineCommand('my-project')

      expect(input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Date (YYYY-MM-DD):' }),
      )
      expect(input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Milestone note:' }),
      )
      expect(configEditor.addTimelineEntry).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Timeline entry added to 'my-project'"),
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

      await addTimelineCommand('my-project', { date: '2025-01-01', note: 'test' })

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

      await addTimelineCommand('nonexistent', { date: '2025-01-01', note: 'test' })

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
      vi.mocked(input).mockRejectedValue(cancelError)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addTimelineCommand('my-project')

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })
})
