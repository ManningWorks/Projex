import { input, select, confirm } from '@inquirer/prompts'
import chalk from 'chalk'
import { addProject, getProjectIds, ConfigEditorError } from '../lib/config-editor.js'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

const CONFIG_FILE = 'projex.config.ts'

const PROJECT_TYPES = [
  { value: 'github', label: 'GitHub Repository', description: 'Track a GitHub repo' },
  { value: 'manual', label: 'Manual Project', description: 'Manually defined project' },
  { value: 'npm', label: 'NPM Package', description: 'Track an npm package' },
  { value: 'product-hunt', label: 'Product Hunt', description: 'Track a Product Hunt launch' },
  { value: 'hybrid', label: 'Hybrid (GitHub + NPM)', description: 'Both GitHub repo and npm package' },
  { value: 'youtube', label: 'YouTube Channel', description: 'Track a YouTube channel' },
  { value: 'gumroad', label: 'Gumroad Product', description: 'Track a Gumroad product' },
  { value: 'lemonsqueezy', label: 'LemonSqueezy Store', description: 'Track a LemonSqueezy store' },
  { value: 'devto', label: 'Dev.to User', description: 'Track a Dev.to user' },
] as const

const PROJECT_STATUSES = [
  { value: 'active', label: 'Active', description: 'Currently working on' },
  { value: 'shipped', label: 'Shipped', description: 'Completed and launched' },
  { value: 'in-progress', label: 'In Progress', description: 'Under development' },
  { value: 'coming-soon', label: 'Coming Soon', description: 'Planned but not started' },
  { value: 'archived', label: 'Archived', description: 'No longer maintained' },
  { value: 'for-sale', label: 'For Sale', description: 'Looking for a buyer' },
] as const

interface AddProjectOptions {
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
}

export async function addProjectCommand(
  options: AddProjectOptions = {},
): Promise<void> {
  const configPath = resolve(process.cwd(), CONFIG_FILE)

  if (!existsSync(configPath)) {
    console.error(
      chalk.red(`✖ ${CONFIG_FILE} not found. Run 'projex init' first.`),
    )
    process.exit(1)
  }

  try {
    const type =
      options.type ??
      (await select({ message: 'Project type:', choices: PROJECT_TYPES }))

    const name =
      options.name ??
      (await input({
        message: 'Project name:',
        validate: (v: string) => v.trim().length > 0 || 'Name is required',
      }))

    const id = name.toLowerCase().replace(/\s+/g, '-')

    const typeSpecificFields = await getTypeSpecificFields(type, options)

    const status =
      options.status ??
      (await select({ message: 'Project status:', choices: PROJECT_STATUSES }))

    const stackInput =
      options.stack ??
      (await input({
        message: 'Tech stack (comma-separated, press Enter to skip):',
      }))

    const stack = stackInput
      ? stackInput
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0)
      : undefined

    const featured =
      options.featured ?? (await confirm({ message: 'Featured project?', default: false }))

    const description = options.description

    addProject(
      {
        id,
        type,
        status,
        featured,
        name,
        description,
        stack,
        ...typeSpecificFields,
      },
      configPath,
    )

    console.log(
      chalk.green(`✓ Project '${id}' added to ${CONFIG_FILE}`),
    )
  } catch (error) {
    if (error instanceof ConfigEditorError) {
      console.error(chalk.red(`✖ ${error.message}`))
      process.exit(1)
    }
    if (
      error instanceof Error &&
      error.name === 'ExitPromptError'
    ) {
      console.log(chalk.yellow('\n✖ Cancelled.'))
      return
    }
    throw error
  }
}

async function getTypeSpecificFields(
  type: string,
  options: AddProjectOptions,
): Promise<Record<string, string>> {
  const fields: Record<string, string> = {}

  switch (type) {
    case 'github':
      fields.repo =
        options.repo ??
        (await input({
          message: 'GitHub repository (e.g., username/repo):',
          validate: (v: string) => v.trim().length > 0 || 'Repository is required',
        }))
      break
    case 'npm':
      fields.package =
        options.package ??
        (await input({
          message: 'npm package name:',
          validate: (v: string) => v.trim().length > 0 || 'Package name is required',
        }))
      break
    case 'hybrid':
      fields.repo =
        options.repo ??
        (await input({
          message: 'GitHub repository (e.g., username/repo):',
          validate: (v: string) => v.trim().length > 0 || 'Repository is required',
        }))
      fields.package =
        options.package ??
        (await input({
          message: 'npm package name:',
          validate: (v: string) => v.trim().length > 0 || 'Package name is required',
        }))
      break
    case 'product-hunt':
      fields.slug =
        options.slug ??
        (await input({
          message: 'Product Hunt slug:',
          validate: (v: string) => v.trim().length > 0 || 'Slug is required',
        }))
      break
    case 'youtube':
      fields.channelId =
        options.channelId ??
        (await input({
          message: 'YouTube channel ID:',
          validate: (v: string) => v.trim().length > 0 || 'Channel ID is required',
        }))
      break
    case 'gumroad':
      fields.productId =
        options.productId ??
        (await input({
          message: 'Gumroad product ID:',
          validate: (v: string) => v.trim().length > 0 || 'Product ID is required',
        }))
      break
    case 'lemonsqueezy':
      fields.storeId =
        options.storeId ??
        (await input({
          message: 'LemonSqueezy store ID:',
          validate: (v: string) => v.trim().length > 0 || 'Store ID is required',
        }))
      break
    case 'devto':
      fields.username =
        options.username ??
        (await input({
          message: 'Dev.to username:',
          validate: (v: string) => v.trim().length > 0 || 'Username is required',
        }))
      break
    case 'manual':
      break
  }

  return fields
}

export { getProjectIds }
