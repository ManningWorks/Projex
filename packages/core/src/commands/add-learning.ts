import { input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import { addLearning, getProjectIds, ConfigEditorError } from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

const LEARNING_TYPES = [
  { value: 'challenge', label: 'Challenge', description: 'An obstacle you overcame' },
  { value: 'learning', label: 'Learning', description: 'An insight or lesson learned' },
] as const

interface AddLearningOptions {
  type?: string
  text?: string
}

export async function addLearningCommand(
  projectId: string,
  options: AddLearningOptions = {},
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

    const type =
      options.type ??
      (await select({ message: 'Entry type:', choices: LEARNING_TYPES }))

    const text =
      options.text ??
      (await input({
        message: `${type === 'challenge' ? 'Challenge' : 'Learning'}:`,
        validate: (v: string) => v.trim().length > 0 || 'Text is required',
      }))

    addLearning(projectId, { type: type as 'challenge' | 'learning', text }, configPath)

    console.log(
      chalk.green(`✓ ${type} added to '${projectId}'`),
    )
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
