import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addProjectCommand } from '../add-project.js'
import * as configEditor from '../../lib/config-editor.js'

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  select: vi.fn(),
  confirm: vi.fn(),
}))

vi.mock('node:fs')

vi.mock('../../lib/config-editor.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../lib/config-editor.js')>()
  return {
    ...actual,
    addProject: vi.fn(),
    getProjectIds: vi.fn(),
  }
})

describe('addProjectCommand', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('non-interactive mode', () => {
    it('should add a github project with all flags', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addProjectCommand({
        type: 'github',
        name: 'My Project',
        repo: 'user/repo',
        status: 'active',
        featured: true,
        stack: 'React,TypeScript',
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'my-project',
          type: 'github',
          repo: 'user/repo',
          status: 'active',
          featured: true,
          name: 'My Project',
          stack: ['React', 'TypeScript'],
        }),
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Project 'my-project' added"),
      )

      logSpy.mockRestore()
    })

    it('should add an npm project with package field', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'npm',
        name: 'My Package',
        package: 'my-package',
        status: 'shipped',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'my-package',
          type: 'npm',
          package: 'my-package',
        }),
        expect.any(String),
      )
    })

    it('should add a hybrid project with repo and package', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'hybrid',
        name: 'Hybrid Proj',
        repo: 'user/repo',
        package: 'pkg',
        status: 'active',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'hybrid',
          repo: 'user/repo',
          package: 'pkg',
        }),
        expect.any(String),
      )
    })

    it('should add a youtube project with channelId', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'youtube',
        name: 'YT Channel',
        channelId: 'UC123',
        status: 'active',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ channelId: 'UC123' }),
        expect.any(String),
      )
    })

    it('should add a manual project with no type-specific fields', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'manual',
        name: 'Manual Proj',
        status: 'active',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'manual' }),
        expect.any(String),
      )
      const call = vi.mocked(configEditor.addProject).mock.calls[0][0]
      expect(call).not.toHaveProperty('repo')
      expect(call).not.toHaveProperty('package')
      expect(call).not.toHaveProperty('channelId')
    })

    it('should derive id from name by lowercasing and replacing spaces', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'github',
        name: 'My Cool Project',
        repo: 'user/repo',
        status: 'active',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'my-cool-project' }),
        expect.any(String),
      )
    })

    it('should handle empty stack string', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'manual',
        name: 'No Stack',
        status: 'active',
        featured: false,
        stack: '',
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ stack: undefined }),
        expect.any(String),
      )
    })
  })

  describe('interactive mode', () => {
    it('should prompt for all fields when no flags provided', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select).mockResolvedValue('github')
      vi.mocked(prompts.input)
        .mockResolvedValueOnce('My Project')
        .mockResolvedValueOnce('user/repo')
        .mockResolvedValueOnce('React,TypeScript')
      vi.mocked(prompts.confirm).mockResolvedValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await addProjectCommand()

      expect(prompts.select).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Project type:' }),
      )
      expect(prompts.input).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Project name:' }),
      )
      expect(prompts.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Featured project?' }),
      )
      expect(configEditor.addProject).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Project 'my-project' added"),
      )

      logSpy.mockRestore()
    })

    it('should prompt only for missing fields with partial flags', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.input).mockResolvedValue('user/repo')
      vi.mocked(prompts.confirm).mockResolvedValue(false)

      await addProjectCommand({
        type: 'github',
        name: 'My Project',
        status: 'active',
        stack: 'React',
      })

      expect(prompts.select).not.toHaveBeenCalled()
      expect(prompts.input).toHaveBeenCalledTimes(1)
      expect(prompts.confirm).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('should exit when config file not found', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(false)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await addProjectCommand({ type: 'github', name: 'Test', repo: 'r', status: 'active', featured: false })

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

      await addProjectCommand()

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })

  describe('type-specific fields', () => {
    it('should pass product-hunt slug', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'product-hunt',
        name: 'PH Product',
        slug: 'my-product',
        status: 'shipped',
        featured: true,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'my-product' }),
        expect.any(String),
      )
    })

    it('should pass gumroad productId', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'gumroad',
        name: 'Gumroad Product',
        productId: 'abc123',
        status: 'for-sale',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ productId: 'abc123' }),
        expect.any(String),
      )
    })

    it('should pass lemonsqueezy storeId', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'lemonsqueezy',
        name: 'LS Store',
        storeId: 'store123',
        status: 'active',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ storeId: 'store123' }),
        expect.any(String),
      )
    })

    it('should pass devto username', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      await addProjectCommand({
        type: 'devto',
        name: 'DevTo User',
        username: 'myusername',
        status: 'active',
        featured: false,
      })

      expect(configEditor.addProject).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'myusername' }),
        expect.any(String),
      )
    })
  })
})
