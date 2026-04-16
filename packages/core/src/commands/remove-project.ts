import { confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import { removeProject, getProjectIds, ConfigEditorError } from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

interface RemoveProjectOptions {
  force?: boolean
}

export async function removeProjectCommand(
  projectId: string,
  options: RemoveProjectOptions = {},
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

    if (!options.force) {
      const confirmed = await confirm({
        message: `Remove project '${projectId}'? This cannot be undone.`,
        default: false,
      })

      if (!confirmed) {
        console.log(chalk.yellow('✖ Cancelled.'))
        return
      }
    }

    removeProject(projectId, configPath)

    console.log(chalk.green(`✓ Project '${projectId}' removed`))
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
