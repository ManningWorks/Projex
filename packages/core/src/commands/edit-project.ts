import { input, select, confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import {
  setProjectField,
  removeProjectField,
  getProjectIds,
  getProjectSummaries,
  ConfigEditorError,
} from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

const VALID_STATUSES = [
  'active',
  'shipped',
  'in-progress',
  'coming-soon',
  'archived',
  'for-sale',
] as const

const TYPE_FIELD_MAP: Record<string, string[]> = {
  github: ['repo'],
  npm: ['package'],
  hybrid: ['repo', 'package'],
  'product-hunt': ['slug'],
  youtube: ['channelId'],
  gumroad: ['productId'],
  lemonsqueezy: ['storeId'],
  devto: ['username'],
  manual: [],
}

const COMMON_FIELDS = ['name', 'description', 'status', 'featured', 'stack']

function getEditableFields(projectType: string): string[] {
  const typeFields = TYPE_FIELD_MAP[projectType] ?? []
  return [...COMMON_FIELDS, ...typeFields]
}

interface EditProjectOptions {
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
  unset?: string
}

export async function editProjectCommand(
  projectId: string,
  options: EditProjectOptions = {},
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

    const summaries = getProjectSummaries(configPath)
    const projectType =
      summaries.find((s) => s.id === projectId)?.type ?? 'manual'

    const updates = collectUpdates(options)
    const hasFlags = updates.length > 0

    if (options.unset) {
      const PROTECTED_FIELDS = ['id', 'type', 'struggles', 'timeline', 'posts']
      if (PROTECTED_FIELDS.includes(options.unset)) {
        console.error(
          chalk.red(`✖ Cannot remove protected field '${options.unset}'`),
        )
        process.exit(1)
      }
      if (hasFlags) {
        console.error(
          chalk.red(`✖ Cannot use --unset with other flags`),
        )
        process.exit(1)
      }
      const removed = removeProjectField(projectId, options.unset, configPath)
      if (removed) {
        console.log(chalk.green(`✓ Field '${options.unset}' removed from '${projectId}'`))
      } else {
        console.log(chalk.yellow(`⚠ Field '${options.unset}' not found on '${projectId}'`))
      }
      return
    }

    if (!hasFlags) {
      const fields = getEditableFields(projectType)
      const fieldChoice = await select({
        message: 'Which field to edit?',
        choices: fields.map((f: string) => ({
          value: f,
          name: f,
        })),
      })

      const normalizedName = fieldChoice.replace(/-./g, (c: string) =>
        c[1].toUpperCase(),
      )
      const value = await getFieldValueInteractive(fieldChoice)
      validateFieldType(projectType, normalizedName)
      setProjectField(projectId, normalizedName, value, configPath)
    } else {
      for (const [field, value] of updates) {
        validateFieldType(projectType, field)
        setProjectField(projectId, field, value, configPath)
      }
    }

    console.log(chalk.green(`✓ Project '${projectId}' updated`))
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

function collectUpdates(
  options: EditProjectOptions,
): [string, string | boolean | string[]][] {
  const updates: [string, string | boolean | string[]][] = []

  if (options.name !== undefined) updates.push(['name', options.name])
  if (options.description !== undefined)
    updates.push(['description', options.description])
  if (options.status !== undefined) updates.push(['status', options.status])
  if (options.featured !== undefined)
    updates.push(['featured', options.featured])
  if (options.stack !== undefined) {
    const stack = options.stack
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
    updates.push(['stack', stack])
  }
  if (options.repo !== undefined) updates.push(['repo', options.repo])
  if (options.package !== undefined)
    updates.push(['package', options.package])
  if (options.slug !== undefined) updates.push(['slug', options.slug])
  if (options.channelId !== undefined)
    updates.push(['channelId', options.channelId])
  if (options.productId !== undefined)
    updates.push(['productId', options.productId])
  if (options.storeId !== undefined)
    updates.push(['storeId', options.storeId])
  if (options.username !== undefined)
    updates.push(['username', options.username])

  return updates
}

async function getFieldValueInteractive(
  field: string,
): Promise<string | boolean | string[]> {
  if (field === 'status') {
    return await select({
      message: 'New status:',
      choices: VALID_STATUSES.map((s) => ({ value: s, name: s })),
    })
  }
  if (field === 'featured') {
    return await confirm({ message: 'Featured?', default: false })
  }
  const value = await input({
    message: `New ${field} value:`,
    validate: (v: string) => v.trim().length > 0 || 'Value is required',
  })

  if (field === 'stack') {
    return value
      .split(',')
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0)
  }

  return value
}

function validateFieldType(projectType: string, field: string): void {
  const standardFields = TYPE_FIELD_MAP[projectType] ?? []
  const typeSpecificFields = [
    'repo',
    'package',
    'slug',
    'channelId',
    'productId',
    'storeId',
    'username',
  ]
  if (
    typeSpecificFields.includes(field) &&
    !standardFields.includes(field)
  ) {
    console.error(
      chalk.red(
        `✖ '${field}' is not a valid field for type '${projectType}'. Valid type-specific fields: ${standardFields.length > 0 ? standardFields.join(', ') : 'none'}`,
      ),
    )
    process.exit(1)
  }
}
