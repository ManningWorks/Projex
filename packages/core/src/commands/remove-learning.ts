import { select } from '@inquirer/prompts'
import chalk from 'chalk'
import {
  removeLearning,
  getProjectIds,
  getLearningEntries,
  ConfigEditorError,
} from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

interface RemoveLearningOptions {
  index?: number
}

export async function removeLearningCommand(
  projectId: string,
  options: RemoveLearningOptions = {},
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

    const entries = getLearningEntries(projectId, configPath)
    if (entries.length === 0) {
      console.log(chalk.yellow('No learning entries to remove.'))
      return
    }

    let index = options.index
    if (index === undefined) {
      const choice = await select({
        message: 'Which learning entry to remove?',
        choices: entries.map((entry) => ({
          value: entry.index,
          name: `[${entry.type}] ${entry.text.length > 60 ? entry.text.slice(0, 57) + '...' : entry.text}`,
        })),
      })
      index = choice
    }

    removeLearning(projectId, index, configPath)
    console.log(chalk.green(`✓ Learning entry #${index} removed from '${projectId}'`))
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
