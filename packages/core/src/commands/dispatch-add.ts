import chalk from 'chalk'
import { add } from './add.js'
import { addProjectCommand } from './add-project.js'
import { addLearningCommand } from './add-learning.js'
import { addTimelineCommand } from './add-timeline.js'
import { addPostCommand } from './add-post.js'

const CONTENT_TYPES = new Set(['project', 'learning', 'timeline', 'post'])

interface DispatchAddOptions {
  force?: boolean
  type?: string
  name?: string
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
  description?: string
  text?: string
  date?: string
  note?: string
  title?: string
  url?: string
}

export async function dispatchAdd(
  typeOrComponent: string,
  projectId: string | undefined,
  options: DispatchAddOptions = {},
): Promise<void> {
  if (CONTENT_TYPES.has(typeOrComponent)) {
    switch (typeOrComponent) {
      case 'project':
        await addProjectCommand(options)
        break
      case 'learning':
        if (!projectId) {
          console.error(
            chalk.red('✖ Project ID is required: projex add learning <project-id>'),
          )
          process.exit(1)
        }
        await addLearningCommand(projectId, options)
        break
      case 'timeline':
        if (!projectId) {
          console.error(
            chalk.red('✖ Project ID is required: projex add timeline <project-id>'),
          )
          process.exit(1)
        }
        await addTimelineCommand(projectId, options)
        break
      case 'post':
        if (!projectId) {
          console.error(
            chalk.red('✖ Project ID is required: projex add post <project-id>'),
          )
          process.exit(1)
        }
        await addPostCommand(projectId, options)
        break
    }
    return
  }

  await add(typeOrComponent, options)
}
