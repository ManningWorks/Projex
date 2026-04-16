import chalk from 'chalk'
import { removeProjectCommand } from './remove-project.js'
import { removeLearningCommand } from './remove-learning.js'
import { removeTimelineCommand } from './remove-timeline.js'
import { removePostCommand } from './remove-post.js'

const VALID_REMOVE_TYPES = new Set(['project', 'learning', 'challenge', 'timeline', 'post'])

interface DispatchRemoveOptions {
  force?: boolean
  index?: number
}

export async function dispatchRemove(
  type: string,
  id: string | undefined,
  options: DispatchRemoveOptions = {},
): Promise<void> {
  if (!VALID_REMOVE_TYPES.has(type)) {
    console.error(
      chalk.red(
        `✖ Unknown content type '${type}'. Valid types: ${[...VALID_REMOVE_TYPES].join(', ')}`,
      ),
    )
    process.exit(1)
  }

  if (!id) {
    console.error(
      chalk.red(`✖ Project ID is required: projex remove ${type} <project-id>`),
    )
    process.exit(1)
  }

  switch (type) {
    case 'project':
      await removeProjectCommand(id, { force: options.force })
      break
    case 'learning':
    case 'challenge':
      await removeLearningCommand(id, { index: options.index })
      break
    case 'timeline':
      await removeTimelineCommand(id, { index: options.index })
      break
    case 'post':
      await removePostCommand(id, { index: options.index })
      break
  }
}
