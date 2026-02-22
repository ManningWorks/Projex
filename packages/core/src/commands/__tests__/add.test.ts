import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import inquirer from 'inquirer'
import { add } from '../add'
import * as fs from 'node:fs/promises'

vi.mock('node:fs/promises', () => ({
  mkdir: vi.fn(),
  access: vi.fn(),
  copyFile: vi.fn(),
  readdir: vi.fn(),
}))

vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(),
  },
}))

const mockFs = vi.mocked(fs)

const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
}

const originalProcessExit = process.exit
let mockProcessExit: ReturnType<typeof vi.fn>

class ExitProcessError extends Error {
  code: number
  constructor(code: number) {
    super(`Process exited with code ${code}`)
    this.code = code
  }
}

describe('add command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockProcessExit = vi.fn((code: number) => {
      throw new ExitProcessError(code)
    })
    process.exit = mockProcessExit as never
    mockFs.readdir.mockResolvedValue(['ProjectCard.tsx', 'index.ts'] as unknown as Awaited<ReturnType<typeof fs.readdir>>)
    mockFs.access.mockImplementation(() => Promise.reject(new Error('File not found')))
    mockFs.mkdir.mockResolvedValue(undefined)
    mockFs.copyFile.mockResolvedValue(undefined)
  })

  afterEach(() => {
    process.exit = originalProcessExit
  })

  describe('project-card component', () => {
    it('should copy project-card files to correct location', async () => {
      await add('project-card')

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('components/folio/ProjectCard'),
        { recursive: true }
      )
      expect(mockFs.copyFile).toHaveBeenCalledTimes(3)
    })

    it('should show success message after copy', async () => {
      await add('project-card')

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('project-card added successfully')
      )
    })

    it('should show import usage', async () => {
      await add('project-card')

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining("import { ProjectCard } from './components/folio/ProjectCard'")
      )
    })
  })

  describe('project-view component', () => {
    it('should copy project-view files to correct location', async () => {
      await add('project-view')

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('components/folio/ProjectView'),
        { recursive: true }
      )
    })
  })

  describe('project-grid component', () => {
    it('should copy project-grid files to correct location', async () => {
      await add('project-grid')

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('components/folio/ProjectGrid'),
        { recursive: true }
      )
    })
  })

  describe('project-list component', () => {
    it('should copy project-list files to correct location', async () => {
      await add('project-list')

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('components/folio/ProjectList'),
        { recursive: true }
      )
    })
  })

  describe('featured-project component', () => {
    it('should copy featured-project files to correct location', async () => {
      await add('featured-project')

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('components/folio/FeaturedProject'),
        { recursive: true }
      )
    })
  })

  describe('invalid component', () => {
    it('should show error for invalid component name', async () => {
      try {
        await add('invalid-component')
      } catch (e) {
        expect(e).toBeInstanceOf(ExitProcessError)
      }

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('not found')
      )
    })

    it('should list available components', async () => {
      try {
        await add('invalid-component')
      } catch (e) {
        expect(e).toBeInstanceOf(ExitProcessError)
      }

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('Available components')
      )
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('project-card')
      )
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('project-view')
      )
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('project-grid')
      )
    })

    it('should show usage hint', async () => {
      try {
        await add('invalid-component')
      } catch (e) {
        expect(e).toBeInstanceOf(ExitProcessError)
        expect((e as ExitProcessError).code).toBe(1)
      }

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('Usage: npx folio add')
      )
    })
  })

  describe('existing files', () => {
    it('should prompt to confirm before overwriting when destination directory exists', async () => {
      mockFs.access.mockResolvedValue(undefined)
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ overwrite: true })

      await add('project-card')

      expect(inquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'overwrite',
            type: 'confirm',
          }),
        ])
      )
    })

    it('should list existing files when found', async () => {
      mockFs.access.mockResolvedValue(undefined)
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ overwrite: true })

      await add('project-card')

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('existing file')
      )
    })

    it('should cancel add if user declines overwrite', async () => {
      mockFs.access.mockResolvedValue(undefined)
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ overwrite: false })

      await add('project-card')

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('Add cancelled')
      )
      expect(mockFs.copyFile).not.toHaveBeenCalled()
    })

    it('should proceed with copy when user confirms overwrite', async () => {
      mockFs.access.mockResolvedValue(undefined)
      vi.mocked(inquirer.prompt).mockResolvedValueOnce({ overwrite: true })

      await add('project-card')

      expect(mockFs.copyFile).toHaveBeenCalled()
    })
  })

  describe('file system errors', () => {
    it('should handle permission denied error', async () => {
      const error = new Error('Permission denied') as Error & { code: string }
      error.code = 'EACCES'
      mockFs.mkdir.mockRejectedValue(error)

      try {
        await add('project-card')
      } catch (e) {
        expect(e).toBeInstanceOf(ExitProcessError)
      }

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('Permission denied')
      )
    })

    it('should handle source files not found error', async () => {
      const error = new Error('Not found') as Error & { code: string }
      error.code = 'ENOENT'
      mockFs.copyFile.mockRejectedValue(error)

      try {
        await add('project-card')
      } catch (e) {
        expect(e).toBeInstanceOf(ExitProcessError)
      }

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('Source files not found')
      )
    })

    it('should handle empty source directory', async () => {
      mockFs.readdir.mockResolvedValue([] as unknown as Awaited<ReturnType<typeof fs.readdir>>)

      try {
        await add('project-card')
      } catch (e) {
        expect(e).toBeInstanceOf(ExitProcessError)
      }

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('No files found')
      )
    })

    it('should filter source files to only include .ts and .tsx', async () => {
      mockFs.readdir.mockResolvedValue(['Component.tsx', 'index.ts', 'README.md', 'styles.css'] as unknown as Awaited<ReturnType<typeof fs.readdir>>)

      await add('project-card')

      expect(mockFs.copyFile).toHaveBeenCalledTimes(3)
    })
  })
})
