import { select } from '@inquirer/prompts'
import chalk from 'chalk'
import {
  removeTimelineEntry,
  getProjectIds,
  getTimelineEntries,
  ConfigEditorError,
} from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

interface RemoveTimelineOptions {
  index?: number
}

export async function removeTimelineCommand(
  projectId: string,
  options: RemoveTimelineOptions = {},
): Promise<void> {
  const configPath = resolve(process.cwd(), CONFIG_FILE)

  if (!existsSync(configPath)) {
    console.error(
      chalk.red(`✖ ${CONFIG_FILE} not found. Run 'projex init' first.`),
    )
    process.exit(1)
  }

  try {
    const validIds = getProjectIds(configPath)
    if (!validIds.includes(projectId)) {
      console.error(
        chalk.red(
          `✖ Project '${projectId}' not found. Valid IDs: ${validIds.join(', ') || 'none'}`,
        ),
      )
      process.exit(1)
    }

    const entries = getTimelineEntries(projectId, configPath)
    if (entries.length === 0) {
      console.log(chalk.yellow('No timeline entries to remove.'))
      return
    }

    let index = options.index
    if (index === undefined) {
      const choice = await select({
        message: 'Which timeline entry to remove?',
        choices: entries.map((entry) => ({
          value: entry.index,
          name: `${entry.date} - ${entry.note.length > 50 ? entry.note.slice(0, 47) + '...' : entry.note}`,
        })),
      })
      index = choice
    }

    removeTimelineEntry(projectId, index, configPath)
    console.log(chalk.green(`✓ Timeline entry #${index} removed from '${projectId}'`))
  } catch (error) {
    if (error instanceof ConfigEditorError) {
      console.error(chalk.red(`✖ ${error.message}`))
      process.exit(1)
    }
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log(chalk.yellow('\n✖ Cancelled.'))
      return
    }
    throw error
  }
}
