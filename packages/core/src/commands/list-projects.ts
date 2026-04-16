import chalk from 'chalk'
import { getProjectSummaries, ConfigEditorError } from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

function truncate(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value
  return value.slice(0, maxLen - 1) + '…'
}

export async function listProjectsCommand(): Promise<void> {
  const configPath = resolve(process.cwd(), CONFIG_FILE)

  if (!existsSync(configPath)) {
    console.error(
      chalk.red(`✖ ${CONFIG_FILE} not found. Run 'projex init' first.`),
    )
    process.exit(1)
    return
  }

  try {
    const summaries = getProjectSummaries(configPath)

    if (summaries.length === 0) {
      console.log('No projects found.')
      return
    }

    const MAX_LEN = 20

    const rows = summaries.map((s) => ({
      ID: truncate(s.id, MAX_LEN),
      Type: truncate(s.type, MAX_LEN),
      Status: truncate(s.status, MAX_LEN),
      Featured: s.featured ? '★' : '-',
      Name: truncate(s.name, MAX_LEN),
    }))

    console.table(rows)
  } catch (error) {
    if (error instanceof ConfigEditorError) {
      console.error(chalk.red(`✖ ${error.message}`))
      process.exit(1)
    }
    throw error
  }
}
