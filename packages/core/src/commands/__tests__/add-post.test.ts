import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addPostCommand } from '../add-post.js'
import * as configEditor from '../../lib/config-editor.js'

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
}))

vi.mock('node:fs')

vi.mock('../../lib/config-editor.js', () => ({
  addPost: vi.fn(),
  getProjectIds: vi.fn(() => ['my-project', 'other-project']),
  ConfigEditorError: class extends Error {
    constructor(m: string) { super(m); this.name = 'ConfigEditorError' }
  },
}))

describe('addPostCommand', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(configEditor.getProjectIds).mockReturnValue(['my-project', 'other-project'])
  })

  describe('non-interactive mode', () => {
    it('should add a post with URL without prompts', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addPostCommand('my-project', {
        title: 'How I built X',
        date: '2025-06-01',
        url: 'https://example.com/post',
      })

      expect(configEditor.addPost).toHaveBeenCalledWith(
        'my-project',
        { title: 'How I built X', date: '2025-06-01', url: 'https://example.com/post' },
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Post added to 'my-project'"),
      )

      logSpy.mockRestore()
    })

    it('should add a post without URL', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addPostCommand('my-project', {
        title: 'My Post',
        date: '2025-06-01',
      })

      expect(configEditor.addPost).toHaveBeenCalledWith(
        'my-project',
        { title: 'My Post', date: '2025-06-01', url: undefined },
        expect.any(String),
      )
    })
  })

  describe('interactive mode', () => {
    it('should prompt for title, date, and url when no flags provided', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.input)
        .mockResolvedValueOnce('My Blog Post')
        .mockResolvedValueOnce('2025-06-01')
        .mockResolvedValueOnce('https://example.com')

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addPostCommand('my-project')

      expect(prompts.input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Post title:' }),
      )
      expect(prompts.input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Date (YYYY-MM-DD):' }),
      )
      expect(prompts.input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'URL (optional - press Enter to skip):' }),
      )
      expect(configEditor.addPost).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Post added to 'my-project'"),
      )

      logSpy.mockRestore()
    })

    it('should pass undefined url when user skips in interactive mode', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.input)
        .mockResolvedValueOnce('A Post')
        .mockResolvedValueOnce('2025-06-01')
        .mockResolvedValueOnce('')

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await addPostCommand('my-project')

      expect(configEditor.addPost).toHaveBeenCalledWith(
        'my-project',
        { title: 'A Post', date: '2025-06-01', url: undefined },
        expect.any(String),
      )
    })
  })

  describe('error handling', () => {
    it('should exit when config file not found', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(false)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await addPostCommand('my-project', { title: 'Test', date: '2025-01-01' })

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

      await addPostCommand('nonexistent', { title: 'Test', date: '2025-01-01' })

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
      vi.mocked(prompts.input).mockRejectedValue(cancelError)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addPostCommand('my-project')

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })
})
