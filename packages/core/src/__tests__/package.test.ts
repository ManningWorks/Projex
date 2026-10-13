import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const packageJson = JSON.parse(
  readFileSync('package.json', 'utf8'),
) as { dependencies: Record<string, string> }

describe('published package', () => {
  it('installs the CLI runtime dependencies for package consumers', () => {
    expect(Object.keys(packageJson.dependencies)).toEqual(
      expect.arrayContaining([
        '@inquirer/confirm',
        '@inquirer/input',
        '@inquirer/number',
        '@inquirer/search',
        '@inquirer/select',
        'chalk',
        'commander',
        'ts-morph',
      ]),
    )
  })
})
