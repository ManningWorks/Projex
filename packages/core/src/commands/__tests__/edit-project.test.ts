import { describe, it, expect, vi, beforeEach } from 'vitest'
import { editProjectCommand } from '../edit-project.js'
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
    setProjectField: vi.fn(),
    removeProjectField: vi.fn(() => true),
    getProjectIds: vi.fn(() => ['my-project', 'other-project']),
    getProjectSummaries: vi.fn(() => [
      { id: 'my-project', type: 'github', status: 'active', featured: true, name: 'My Project' },
      { id: 'other-project', type: 'product-hunt', status: 'shipped', featured: false, name: 'Other' },
    ]),
  }
})

describe('editProjectCommand', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(configEditor.getProjectIds).mockReturnValue(['my-project', 'other-project'])
    vi.mocked(configEditor.getProjectSummaries).mockReturnValue([
      { id: 'my-project', type: 'github', status: 'active', featured: true, name: 'My Project' },
      { id: 'other-project', type: 'product-hunt', status: 'shipped', featured: false, name: 'Other' },
    ])
  })

  describe('non-interactive mode', () => {
    it('should update a single field via --status flag', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', { status: 'shipped' })

      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'status',
        'shipped',
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Project 'my-project' updated"),
      )

      logSpy.mockRestore()
    })

    it('should update multiple fields via flags', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', {
        name: 'New Name',
        description: 'Updated description',
      })

      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'name',
        'New Name',
        expect.any(String),
      )
      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'description',
        'Updated description',
        expect.any(String),
      )

      logSpy.mockRestore()
    })

    it('should update stack via --stack flag', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', { stack: 'React,TypeScript,Next.js' })

      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'stack',
        ['React', 'TypeScript', 'Next.js'],
        expect.any(String),
      )
    })

    it('should set featured to true via --featured', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', { featured: true })

      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'featured',
        true,
        expect.any(String),
      )
    })

    it('should set featured to false via --no-featured', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', { featured: false })

      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'featured',
        false,
        expect.any(String),
      )
    })

    it('should block when setting type-incompatible field', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await editProjectCommand('other-project', { repo: 'foo/bar' })

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("not a valid field for type 'product-hunt'"),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should NOT print warning when setting type-compatible field', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', { repo: 'foo/bar' })

      const warningCalls = logSpy.mock.calls.filter((c) =>
        c[0].toString().includes('not a standard field'),
      )
      expect(warningCalls).toHaveLength(0)

      logSpy.mockRestore()
    })
  })

  describe('interactive mode', () => {
    it('should prompt for field selection and value when no flags given', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select).mockResolvedValue('name')
      vi.mocked(prompts.input).mockResolvedValue('New Interactive Name')

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project')

      expect(prompts.select).toHaveBeenCalledWith(
        expect.objectContaining({
          choices: expect.arrayContaining([
            expect.objectContaining({ value: 'name' }),
            expect.objectContaining({ value: 'repo' }),
          ]),
        }),
      )
      expect(prompts.select).toHaveBeenCalledWith(
        expect.objectContaining({
          choices: expect.not.arrayContaining([
            expect.objectContaining({ value: 'channelId' }),
          ]),
        }),
      )
      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'name',
        'New Interactive Name',
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Project 'my-project' updated"),
      )

      logSpy.mockRestore()
    })

    it('should show type-specific fields for product-hunt project', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select).mockResolvedValue('slug')
      vi.mocked(prompts.input).mockResolvedValue('my-slug')

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('other-project')

      expect(prompts.select).toHaveBeenCalledWith(
        expect.objectContaining({
          choices: expect.arrayContaining([
            expect.objectContaining({ value: 'slug' }),
          ]),
        }),
      )
      expect(prompts.select).toHaveBeenCalledWith(
        expect.objectContaining({
          choices: expect.not.arrayContaining([
            expect.objectContaining({ value: 'repo' }),
          ]),
        }),
      )
    })

    it('should use confirm prompt for featured field', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select).mockResolvedValue('featured')
      vi.mocked(prompts.confirm).mockResolvedValue(true)

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project')

      expect(prompts.confirm).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('Featured') }),
      )
      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'featured',
        true,
        expect.any(String),
      )
    })

    it('should use select prompt for status field', async () => {
      const { existsSync } = await import('node:fs')
      const prompts = await import('@inquirer/prompts')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(prompts.select)
        .mockResolvedValueOnce('status')
        .mockResolvedValueOnce('shipped')

      vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project')

      expect(configEditor.setProjectField).toHaveBeenCalledWith(
        'my-project',
        'status',
        'shipped',
        expect.any(String),
      )
    })
  })

  describe('--unset', () => {
    it('should remove a field via --unset', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', { unset: 'description' })

      expect(configEditor.removeProjectField).toHaveBeenCalledWith(
        'my-project',
        'description',
        expect.any(String),
      )
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("Field 'description' removed"),
      )

      logSpy.mockRestore()
    })

    it('should warn when field does not exist', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(configEditor.removeProjectField).mockReturnValue(false)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await editProjectCommand('my-project', { unset: 'nonexistent' })

      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining("not found"),
      )

      logSpy.mockRestore()
    })

    it('should block removing protected fields', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await editProjectCommand('my-project', { unset: 'id' })

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot remove protected field'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should block removing array fields via --unset', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await editProjectCommand('my-project', { unset: 'struggles' })

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot remove protected field'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('should block --unset combined with other flags', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(true)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await editProjectCommand('my-project', { unset: 'description', name: 'New' })

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot use --unset with other flags'),
      )
      expect(exitSpy).toHaveBeenCalledWith(1)

      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })
  })

  describe('error handling', () => {
    it('should exit when config file not found', async () => {
      const { existsSync } = await import('node:fs')
      vi.mocked(existsSync).mockReturnValue(false)

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      await editProjectCommand('my-project', { status: 'shipped' })

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

      await editProjectCommand('nonexistent', { status: 'shipped' })

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

      await editProjectCommand('my-project')

      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))

      logSpy.mockRestore()
    })
  })
})
