import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import { addPost, getProjectIds, ConfigEditorError } from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

function todayFormatted(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface AddPostOptions {
  title?: string
  date?: string
  url?: string
}

export async function addPostCommand(
  projectId: string,
  options: AddPostOptions = {},
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

    const title =
      options.title ??
      (await input({
        message: 'Post title:',
        validate: (v: string) => v.trim().length > 0 || 'Title is required',
      }))

    const date =
      options.date ??
      (await input({
        message: 'Date (YYYY-MM-DD):',
        default: todayFormatted(),
        validate: (v: string) =>
          /^\d{4}-\d{2}-\d{2}$/.test(v) || 'Date must be in YYYY-MM-DD format',
      }))

    const url =
      options.url ??
      (await input({
        message: 'URL (optional - press Enter to skip):',
      }))

    addPost(
      projectId,
      { title, date, url: url || undefined },
      configPath,
    )

    console.log(
      chalk.green(`✓ Post added to '${projectId}'`),
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
