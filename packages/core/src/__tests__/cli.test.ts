// @vitest-environment node
//
// Top-level CLI error handling (issue #52). Commander's `.parse()` does not
// await async action handlers, so a handler rejection used to escape as an
// unhandled rejection (raw stack trace + exit 1). The fix wraps
// `program.parseAsync()` in a single top-level try/catch that prints a
// chalk-formatted `✖` error and sets a non-zero exit code.
//
// These tests drive the REAL command path (no command-level mocks): the
// temp cwd has no package.json, so `add theme-minimal` -> addTheme ->
// ensureProjexInstalled() rejects with ENOENT before any install can run.
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { main } from '../cli.js'

describe('cli top-level error handler', () => {
  let originalCwd: string
  let tempDir: string
  let errorSpy: Mock
  let logSpy: Mock
  let exitSpy: Mock

  beforeEach(() => {
    originalCwd = process.cwd()
    // Empty cwd: no package.json, so the add path rejects with ENOENT.
    tempDir = mkdtempSync(join(tmpdir(), 'projex-cli-'))
    process.chdir(tempDir)
    process.exitCode = undefined

    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    // The handler must signal failure via process.exitCode, not process.exit
    // (immediate exit can truncate piped output). Fail loudly if exit is used.
    exitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((code?: number) => {
        throw new Error(`unexpected process.exit(${code})`)
      })
  })

  afterEach(() => {
    process.chdir(originalCwd)
    rmSync(tempDir, { recursive: true, force: true })
    errorSpy.mockRestore()
    logSpy.mockRestore()
    exitSpy.mockRestore()
    process.exitCode = undefined
  })

  it('prints a formatted error and sets a non-zero exitCode when a handler rejects', async () => {
    await main(['node', 'projex', 'add', 'theme-minimal'])

    const errLines = errorSpy.mock.calls.map((call) => String(call[0]))
    // Red title line (chalk-formatted, `✖`-prefixed) + gray detail line.
    expect(errLines.some((line) => line.includes('✖') && line.includes('Command failed'))).toBe(
      true,
    )
    expect(errLines.some((line) => line.includes('ENOENT'))).toBe(true)
    // Non-zero exit via exitCode (not process.exit).
    expect(process.exitCode).toBe(1)
    expect(exitSpy).not.toHaveBeenCalled()
  })
})
