import chalk from 'chalk'
import { editProjectCommand } from './edit-project.js'

interface DispatchEditOptions {
  name?: string
  description?: string
  status?: string
  featured?: boolean
  stack?: string
  repo?: string
  package?: string
  slug?: string
  channelId?: string
  productId?: string
  storeId?: string
  username?: string
}

export async function dispatchEdit(
  type: string,
  id: string | undefined,
  options: DispatchEditOptions = {},
): Promise<void> {
  switch (type) {
    case 'project':
      if (!id) {
        console.error(
          chalk.red('✖ Project ID is required: projex edit project <id>'),
        )
        process.exit(1)
      }
      await editProjectCommand(id, options)
      break
    default:
      console.error(
        chalk.red(
          `✖ Unknown content type '${type}'. Valid types: project`,
        ),
      )
      process.exit(1)
  }
}
