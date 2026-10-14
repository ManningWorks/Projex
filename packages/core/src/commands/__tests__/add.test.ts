// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest'
import { add } from '../add'
import confirm from '@inquirer/confirm'

vi.mock('@inquirer/confirm', () => ({
  default: vi.fn(),
}))
vi.mock('node:fs/promises', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs/promises')>()),
  mkdir: vi.fn(),
  access: vi.fn(),
  copyFile: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
}))
vi.mock('node:fs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  existsSync: vi.fn(),
}))
vi.mock('node:child_process', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:child_process')>()),
  execSync: vi.fn(),
}))

describe('add command', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('COMPONENTS mapping', () => {
    it('should copy github-card preset to components/projex/GitHubCard/', async () => {
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
          return Promise.resolve("import type { ProjexProject } from '../../types'")
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
        expect.stringContaining("import { GitHubCard } from './components/projex/GitHubCard'")
      )

      consoleSpy.mockRestore()
      errorSpy.mockRestore()
      processExitSpy.mockRestore()
    })

    it('should copy npm-card preset to components/projex/NpmCard/', async () => {
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
          return Promise.resolve("import type { ProjexProject } from '../../types'")
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
        expect.stringContaining("import { NpmCard } from './components/projex/NpmCard'")
      )

      consoleSpy.mockRestore()
      errorSpy.mockRestore()
    })

    it('should copy showcase-card preset to components/projex/ShowcaseCard/', async () => {
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
          return Promise.resolve("import type { ProjexProject } from '../../types'")
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
        expect.stringContaining("import { ShowcaseCard } from './components/projex/ShowcaseCard'")
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

      expect(confirm).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Overwriting')
      )

      consoleSpy.mockRestore()
    })

    it('should prompt when --force is false and files exist', async () => {
      vi.mocked(confirm).mockResolvedValue(true)

      const { access } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')

      vi.mocked(existsSync).mockReturnValue(true)
      vi.mocked(access).mockResolvedValue(undefined)

      await add('github-card', { force: false })

      expect(confirm).toHaveBeenCalled()
    })
  })

  describe('overwrite prompt under non-TTY / prompt cancellation', () => {
    const ORIGINAL_IS_TTY = process.stdin.isTTY

    // The guards read process.stdin.isTTY; set it explicitly per test
    // instead of relying on how vitest was launched.
    function setStdinTTY(value: boolean | undefined): void {
      Object.defineProperty(process.stdin, 'isTTY', {
        value,
        configurable: true,
      })
    }

    function makeExitPromptError(message: string): Error {
      const error = new Error(message)
      error.name = 'ExitPromptError'
      return error
    }

    function failOnExit(): Mock<(code?: number) => never> {
      return vi
        .spyOn(process, 'exit')
        .mockImplementation((code?: number) => {
          throw new Error(`unexpected process.exit(${code})`)
        })
    }

    beforeEach(async () => {
      const { mkdir, copyFile, readFile } = await import('node:fs/promises')
      const { existsSync } = await import('node:fs')
      const { execSync } = await import('node:child_process')

      // package.json declares @manningworks/projex so the internal
      // ensureProjexInstalled() step short-circuits and no real fs write
      // or install is ever attempted.
      vi.mocked(readFile).mockImplementation((path: string | Buffer) => {
        const pathStr = path.toString()
        if (pathStr.includes('package.json')) {
          return Promise.resolve(
            JSON.stringify({ dependencies: { '@manningworks/projex': '1.0.0' } }),
          )
        }
        return Promise.resolve('')
      })
      vi.mocked(existsSync).mockReturnValue(false)
      vi.mocked(execSync).mockImplementation(() => Buffer.from(''))
      vi.mocked(mkdir).mockResolvedValue(undefined)
      vi.mocked(copyFile).mockResolvedValue(undefined)
    })

    afterEach(() => {
      setStdinTTY(ORIGINAL_IS_TTY)
    })

    it('refuses to overwrite an existing theme in a non-interactive session without --force', async () => {
      setStdinTTY(undefined) // e.g. stdin from /dev/null
      const exitSpy = failOnExit()
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { access, copyFile } = await import('node:fs/promises')
      // Re-add: theme source and destination file both exist.
      vi.mocked(access).mockResolvedValue(undefined)
      // Real inquirer rejects with ExitPromptError under non-TTY stdin —
      // the guard must refuse before the prompt is ever attempted.
      vi.mocked(confirm).mockRejectedValue(makeExitPromptError('user closed prompt'))

      await expect(add('theme-minimal', { force: false })).resolves.toBeUndefined()

      expect(confirm).not.toHaveBeenCalled()
      expect(vi.mocked(copyFile)).not.toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('already exists'))
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('non-interactive'))
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('--force'))
      expect(errorSpy).not.toHaveBeenCalled()
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('overwrites an existing theme without prompting when --force is passed in a non-interactive session', async () => {
      setStdinTTY(undefined)
      const exitSpy = failOnExit()
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const { access, copyFile } = await import('node:fs/promises')
      vi.mocked(access).mockResolvedValue(undefined)
      // --force must short-circuit before the non-interactive (isTTY) check
      // is ever reached; a consulted prompt means the flag stopped working
      // non-interactively.
      vi.mocked(confirm).mockRejectedValue(new Error('prompt must not be reached with --force'))

      await expect(add('theme-minimal', { force: true })).resolves.toBeUndefined()

      expect(confirm).not.toHaveBeenCalled()
      expect(vi.mocked(copyFile)).toHaveBeenCalledTimes(1)
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Overwriting'))
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('theme-minimal added successfully'),
      )
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('cancels cleanly instead of failing when the component overwrite prompt is force-closed', async () => {
      setStdinTTY(undefined)
      const exitSpy = failOnExit()
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const { access, copyFile, readdir } = await import('node:fs/promises')
      // Re-add: destination directory and component files exist.
      vi.mocked(access).mockResolvedValue(undefined)
      vi.mocked(readdir).mockResolvedValue(['index.ts', 'GitHubCard.tsx'])
      vi.mocked(confirm).mockRejectedValue(
        makeExitPromptError('User force closed the prompt with 0 null'),
      )

      await expect(add('github-card', { force: false })).resolves.toBeUndefined()

      expect(confirm).toHaveBeenCalled()
      expect(vi.mocked(copyFile)).not.toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Add cancelled'))
      expect(errorSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Failed to add component'),
      )
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
      errorSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('cancels cleanly instead of overwriting when the theme prompt is force-closed in a TTY', async () => {
      setStdinTTY(true)
      const exitSpy = failOnExit()
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const { access, copyFile } = await import('node:fs/promises')
      vi.mocked(access).mockResolvedValue(undefined)
      vi.mocked(confirm).mockRejectedValue(makeExitPromptError('user closed prompt'))

      await expect(add('theme-minimal', { force: false })).resolves.toBeUndefined()

      expect(confirm).toHaveBeenCalled()
      expect(vi.mocked(copyFile)).not.toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Add cancelled'))
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('surfaces unexpected theme prompt errors instead of overwriting', async () => {
      setStdinTTY(true)
      const exitSpy = failOnExit()

      const { access, copyFile } = await import('node:fs/promises')
      vi.mocked(access).mockResolvedValue(undefined)
      vi.mocked(confirm).mockRejectedValue(new Error('prompt exploded'))

      await expect(add('theme-minimal', { force: false })).rejects.toThrow('prompt exploded')

      expect(vi.mocked(copyFile)).not.toHaveBeenCalled()
      expect(exitSpy).not.toHaveBeenCalled()

      exitSpy.mockRestore()
    })

    it('leaves the theme untouched when the user answers no in a TTY', async () => {
      setStdinTTY(true)
      const exitSpy = failOnExit()
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const { access, copyFile } = await import('node:fs/promises')
      vi.mocked(access).mockResolvedValue(undefined)
      vi.mocked(confirm).mockResolvedValue(false)

      await expect(add('theme-minimal', { force: false })).resolves.toBeUndefined()

      expect(vi.mocked(copyFile)).not.toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Add cancelled'))
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('surfaces a non-ENOENT existence-check error instead of writing', async () => {
      const exitSpy = failOnExit()
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const { access, copyFile } = await import('node:fs/promises')
      const eacces = new Error(
        `EACCES: permission denied, access 'styles/projex-theme-minimal.css'`,
      ) as NodeJS.ErrnoException
      eacces.code = 'EACCES'
      // The source check must pass; only the destination existence check
      // rejects, with a non-ENOENT (EACCES) code, to drive the
      // existence-check's `else { throw error }` branch (add.ts).
      vi.mocked(access).mockImplementation(async (path: string | Buffer) => {
        if (path.toString().includes('styles/projex-theme-minimal.css')) {
          throw eacces
        }
      })

      await expect(add('theme-minimal', { force: false })).rejects.toMatchObject({
        code: 'EACCES',
      })

      expect(vi.mocked(copyFile)).not.toHaveBeenCalled()
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
      exitSpy.mockRestore()
    })
  })
})
