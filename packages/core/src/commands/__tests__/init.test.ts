// @vitest-environment node
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest'
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { access } from 'node:fs/promises'
import { init } from '../init.js'
import confirm from '@inquirer/confirm'
import input from '@inquirer/input'

vi.mock('@inquirer/confirm', () => ({
  default: vi.fn(),
}))

vi.mock('@inquirer/input', () => ({
  default: vi.fn(),
}))

// Stub ONLY `access` from node:fs/promises so the existence-check's non-ENOENT
// branch in init.ts can be driven deterministically; every other fs op init.ts
// uses (readFile/writeFile/rename/unlink/constants) stays real. The default
// behavior for the stub is set per-test in beforeEach.
vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>()
  return {
    ...actual,
    access: vi.fn(),
  }
})

const CONFIG_FILE = 'projex.config.ts'
const EXISTING_CONFIG = 'export const projects = []\n'

function setStdinTTY(value: boolean | undefined): void {
  Object.defineProperty(process.stdin, 'isTTY', {
    value,
    configurable: true,
  })
}

describe('init', () => {
  let originalCwd: string
  let tempDir: string
  let exitSpy: Mock<(code?: number) => never>

  beforeEach(() => {
    vi.resetAllMocks()

    originalCwd = process.cwd()
    tempDir = mkdtempSync(join(tmpdir(), 'projex-init-'))
    process.chdir(tempDir)

    // package.json already declares @manningworks/projex so the internal
    // ensureProjexInstalled() step short-circuits and never attempts a real
    // package install.
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify(
        {
          name: 'projex-init-test-app',
          version: '1.0.0',
          devDependencies: { '@manningworks/projex': '^1.0.0' },
        },
        null,
        2,
      ),
    )

    // If code under test calls process.exit, fail the test loudly instead of
    // killing the vitest worker.
    exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((code?: number) => {
        throw new Error(`unexpected process.exit(${code})`)
      })

    setStdinTTY(true)
    vi.mocked(confirm).mockResolvedValue(true)
    vi.mocked(input).mockResolvedValue('testuser')

    // Default behavior for the stubbed `access`: replicate real-fs
    // `access(path, F_OK)` — resolve when the file exists (relative to cwd),
    // reject ENOENT otherwise — so every test keeps its real-fs behavior.
    // Individual tests override this (see the non-ENOENT existence-check case).
    vi.mocked(access).mockImplementation(async (path) => {
      if (!existsSync(String(path))) {
        const err = new Error(
          `ENOENT: no such file or directory, access '${String(path)}'`,
        ) as NodeJS.ErrnoException
        err.code = 'ENOENT'
        throw err
      }
    })
  })

  afterEach(() => {
    process.chdir(originalCwd)
    rmSync(tempDir, { recursive: true, force: true })
    exitSpy.mockRestore()
    setStdinTTY(undefined)
  })

  describe('existing config present', () => {
    it('leaves the config untouched and exits cleanly when the prompt is cancelled (Ctrl+C)', async () => {
      writeFileSync(join(tempDir, CONFIG_FILE), EXISTING_CONFIG)

      const cancelError = new Error('User cancelled')
      cancelError.name = 'ExitPromptError'
      vi.mocked(confirm).mockRejectedValue(cancelError)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init()).resolves.toBeUndefined()

      expect(confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Overwrite?'),
        }),
      )
      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toBe(EXISTING_CONFIG)
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Cancelled'))
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })

    it('leaves the config untouched and exits cleanly when the user answers no', async () => {
      writeFileSync(join(tempDir, CONFIG_FILE), EXISTING_CONFIG)
      vi.mocked(confirm).mockResolvedValue(false)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init()).resolves.toBeUndefined()

      expect(confirm).toHaveBeenCalled()
      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toBe(EXISTING_CONFIG)
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Init cancelled'))
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })

    it('does not prompt or overwrite when stdin is not a TTY (EOF / non-interactive)', async () => {
      writeFileSync(join(tempDir, CONFIG_FILE), EXISTING_CONFIG)
      setStdinTTY(undefined) // e.g. stdin from /dev/null

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init()).resolves.toBeUndefined()

      expect(confirm).not.toHaveBeenCalled()
      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toBe(EXISTING_CONFIG)
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('non-interactive'))
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })

    it('surfaces unexpected prompt errors instead of overwriting', async () => {
      writeFileSync(join(tempDir, CONFIG_FILE), EXISTING_CONFIG)
      vi.mocked(confirm).mockRejectedValue(new Error('prompt exploded'))

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init()).rejects.toThrow('prompt exploded')

      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toBe(EXISTING_CONFIG)
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })

    it('surfaces a non-ENOENT existence-check error instead of writing', async () => {
      writeFileSync(join(tempDir, CONFIG_FILE), EXISTING_CONFIG)
      // Only `access` is stubbed, rejecting with a non-ENOENT (EACCES) code, to
      // drive the existence-check's `else { throw error }` branch (init.ts).
      const eacces = new Error(
        `EACCES: permission denied, access '${CONFIG_FILE}'`,
      ) as NodeJS.ErrnoException
      eacces.code = 'EACCES'
      vi.mocked(access).mockRejectedValue(eacces)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init()).rejects.toMatchObject({ code: 'EACCES' })

      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toBe(EXISTING_CONFIG)
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })
  })

  describe('no existing config', () => {
    it('generates the config without prompting', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init()).resolves.toBeUndefined()

      expect(confirm).not.toHaveBeenCalled()
      expect(existsSync(join(tempDir, CONFIG_FILE))).toBe(true)
      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toContain('defineProjects')
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })

    it('overwrites without prompting when --yes is passed', async () => {
      writeFileSync(join(tempDir, CONFIG_FILE), EXISTING_CONFIG)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init({ yes: true })).resolves.toBeUndefined()

      expect(confirm).not.toHaveBeenCalled()
      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toContain('defineProjects')
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })

    it('overwrites without prompting when --yes is passed and stdin is not a TTY', async () => {
      writeFileSync(join(tempDir, CONFIG_FILE), EXISTING_CONFIG)
      // --yes must short-circuit the guard before the non-interactive (isTTY)
      // check is ever reached — so this still overwrites with a non-TTY stdin.
      // Guards the invariant against a refactor that moves the TTY check
      // outside the `!options.yes` guard.
      setStdinTTY(undefined)

      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await expect(init({ yes: true })).resolves.toBeUndefined()

      expect(confirm).not.toHaveBeenCalled()
      expect(readFileSync(join(tempDir, CONFIG_FILE), 'utf-8')).toContain('defineProjects')
      expect(exitSpy).not.toHaveBeenCalled()

      logSpy.mockRestore()
    })
  })
})
