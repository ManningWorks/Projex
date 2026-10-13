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
import { init } from '../init.js'
import confirm from '@inquirer/confirm'
import input from '@inquirer/input'

vi.mock('@inquirer/confirm', () => ({
  default: vi.fn(),
}))

vi.mock('@inquirer/input', () => ({
  default: vi.fn(),
}))

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
  })
})
