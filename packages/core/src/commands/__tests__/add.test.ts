import { describe, it, expect, vi, beforeEach } from 'vitest'
import { add } from '../add'
import * as prompts from '@inquirer/prompts'

vi.mock('@inquirer/prompts', async () => ({
  confirm: vi.fn()
}))
vi.mock('node:fs/promises')
vi.mock('node:fs')
vi.mock('node:child_process')

describe('add command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('COMPONENTS mapping', () => {
    it('should copy github-card preset to components/folio/GitHubCard/', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const processExitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as () => never)

      const { mkdir, access, copyFile, readdir, readFile, writeFile } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')
      const { execSync } = await import('node:child_process')

      vi.mocked(mkdir).mockResolvedValue(undefined)
      vi.mocked(access).mockImplementation(async () => {
        throw { code: 'ENOENT' }
      })
      vi.mocked(copyFile).mockResolvedValue(undefined)
      vi.mocked(readdir).mockResolvedValue(['index.ts', 'GitHubCard.tsx'])
      vi.mocked(readFile).mockImplementation((path: string | Buffer) => {
        const pathStr = path.toString()
        if (pathStr.includes('package.json')) {
          return Promise.resolve(JSON.stringify({ dependencies: { '@manningworks/projex': '1.0.0' } }))
        }
        if (pathStr.includes('GitHubCard.tsx')) {
          return Promise.resolve("import type { FolioProject } from '../../types'")
        }
        return Promise.resolve('')
      })
      vi.mocked(writeFile).mockResolvedValue(undefined)
      vi.mocked(existsSync).mockReturnValue(false)
      vi.mocked(execSync).mockImplementation(() => Buffer.from(''))

      await add('github-card', { force: false })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('github-card added successfully')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("import { GitHubCard } from './components/folio/GitHubCard'")
      )

      consoleSpy.mockRestore()
      errorSpy.mockRestore()
      processExitSpy.mockRestore()
    })

    it('should copy npm-card preset to components/folio/NpmCard/', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { mkdir, access, copyFile, readdir, readFile, writeFile } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')
      const { execSync } = await import('node:child_process')

      vi.mocked(mkdir).mockResolvedValue(undefined)
      vi.mocked(access).mockImplementation(async () => {
        throw { code: 'ENOENT' }
      })
      vi.mocked(copyFile).mockResolvedValue(undefined)
      vi.mocked(readdir).mockResolvedValue(['index.ts', 'NpmCard.tsx'])
      vi.mocked(readFile).mockImplementation((path: string | Buffer) => {
        const pathStr = path.toString()
        if (pathStr.includes('package.json')) {
          return Promise.resolve(JSON.stringify({ dependencies: { '@manningworks/projex': '1.0.0' } }))
        }
        if (pathStr.includes('NpmCard.tsx')) {
          return Promise.resolve("import type { FolioProject } from '../../types'")
        }
        return Promise.resolve('')
      })
      vi.mocked(writeFile).mockResolvedValue(undefined)
      vi.mocked(existsSync).mockReturnValue(false)
      vi.mocked(execSync).mockImplementation(() => Buffer.from(''))

      await add('npm-card', { force: false })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('npm-card added successfully')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("import { NpmCard } from './components/folio/NpmCard'")
      )

      consoleSpy.mockRestore()
      errorSpy.mockRestore()
    })

    it('should copy showcase-card preset to components/folio/ShowcaseCard/', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { mkdir, access, copyFile, readdir, readFile, writeFile } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')
      const { execSync } = await import('node:child_process')

      vi.mocked(mkdir).mockResolvedValue(undefined)
      vi.mocked(access).mockImplementation(async () => {
        throw { code: 'ENOENT' }
      })
      vi.mocked(copyFile).mockResolvedValue(undefined)
      vi.mocked(readdir).mockResolvedValue(['index.ts', 'ShowcaseCard.tsx'])
      vi.mocked(readFile).mockImplementation((path: string | Buffer) => {
        const pathStr = path.toString()
        if (pathStr.includes('package.json')) {
          return Promise.resolve(JSON.stringify({ dependencies: { '@manningworks/projex': '1.0.0' } }))
        }
        if (pathStr.includes('ShowcaseCard.tsx')) {
          return Promise.resolve("import type { FolioProject } from '../../types'")
        }
        return Promise.resolve('')
      })
      vi.mocked(writeFile).mockResolvedValue(undefined)
      vi.mocked(existsSync).mockReturnValue(false)
      vi.mocked(execSync).mockImplementation(() => Buffer.from(''))

      await add('showcase-card', { force: false })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('showcase-card added successfully')
      )
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("import { ShowcaseCard } from './components/folio/ShowcaseCard'")
      )

      consoleSpy.mockRestore()
      errorSpy.mockRestore()
    })
  })

  describe('invalid preset', () => {
    it('should exit with error for unknown preset', async () => {
      const processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
        throw new Error(`process.exit(${code})`)
      })

      await expect(add('invalid-preset', { force: false })).rejects.toThrow('process.exit(1)')

      processExitSpy.mockRestore()
    })
  })

  describe('--force flag', () => {
    it('should skip prompt when --force is true', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const { access } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(access).mockResolvedValue(undefined)

      await add('github-card', { force: true })

      const prompts = await import('@inquirer/prompts')
      expect(prompts.confirm).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Overwriting')
      )

      consoleSpy.mockRestore()
    })

    it('should prompt when --force is false and files exist', async () => {
      vi.mocked(prompts.confirm).mockResolvedValue(true)

      const { access } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(access).mockResolvedValue(undefined)

      await add('github-card', { force: false })

      expect(prompts.confirm).toHaveBeenCalled()
    })
  })
})
