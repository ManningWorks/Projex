#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { init } from './commands/init.js'
import { initInteractive } from './commands/init-interactive.js'
import { dispatchAdd } from './commands/dispatch-add.js'
import { dispatchEdit } from './commands/dispatch-edit.js'
import { dispatchRemove } from './commands/dispatch-remove.js'
import { listProjectsCommand } from './commands/list-projects.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'))

const program = new Command()

program
  .name('projex')
  .description('CLI tool for Projex project showcase pages')
  .version(pkg.version)

program
  .command('init')
  .description('Initialize a new Projex project')
  .option('--github', 'Auto-detect projects from GitHub repos')
  .option('-y, --yes', 'Skip all prompts and use default values')
  .option('-i, --interactive', 'Guided interactive setup')
  .action(async (options) => {
    if (options.interactive) {
      await initInteractive(options)
    } else {
      await init(options)
    }
  })

program
  .command('add')
  .description('Add a Projex component or content to your project')
  .argument('<type>', 'Content type (project, learning, timeline, post) or component name')
  .argument('[id]', 'Project ID (required for learning, timeline, post)')
  .option('-f, --force', 'Overwrite existing files without prompting')
  .option('--type <type>', 'Project type (for add project)')
  .option('--name <name>', 'Project name (for add project)')
  .option('--status <status>', 'Project status (for add project)')
  .option('--featured', 'Mark as featured (for add project)')
  .option('--stack <stack>', 'Comma-separated tech stack (for add project)')
  .option('--repo <repo>', 'GitHub repository (for add project)')
  .option('--package <package>', 'npm package name (for add project)')
  .option('--slug <slug>', 'Product Hunt slug (for add project)')
  .option('--channel-id <channelId>', 'YouTube channel ID (for add project)')
  .option('--product-id <productId>', 'Gumroad product ID (for add project)')
  .option('--store-id <storeId>', 'LemonSqueezy store ID (for add project)')
  .option('--username <username>', 'Dev.to username (for add project)')
  .option('--description <description>', 'Project description (for add project)')
  .option('--text <text>', 'Text content (for add learning)')
  .option('--date <date>', 'Date in YYYY-MM-DD format (for add timeline, post)')
  .option('--note <note>', 'Milestone note (for add timeline)')
  .option('--title <title>', 'Post title (for add post)')
  .option('--url <url>', 'URL (for add post)')
  .action(dispatchAdd)

program
  .command('edit')
  .description('Edit an existing project')
  .argument('<type>', 'Content type (project)')
  .argument('[id]', 'Project ID')
  .option('--name <name>', 'Project name')
  .option('--description <description>', 'Project description')
  .option('--status <status>', 'Project status')
  .option('--featured', 'Mark as featured')
  .option('--no-featured', 'Remove featured status')
  .option('--stack <stack>', 'Comma-separated tech stack')
  .option('--repo <repo>', 'GitHub repository')
  .option('--package <package>', 'npm package name')
  .option('--slug <slug>', 'Product Hunt slug')
  .option('--channel-id <channelId>', 'YouTube channel ID')
  .option('--product-id <productId>', 'Gumroad product ID')
  .option('--store-id <storeId>', 'LemonSqueezy store ID')
  .option('--username <username>', 'Dev.to username')
  .option('--unset <field>', 'Remove a field from the project')
  .action(dispatchEdit)

program
  .command('remove')
  .description('Remove a project or content entry')
  .argument('<type>', 'Content type (project, learning, timeline, post)')
  .argument('[id]', 'Project ID')
  .option('-f, --force', 'Skip confirmation prompt')
  .option('--index <index>', 'Index of entry to remove (for learning, timeline, post)', (value: string) => parseInt(value, 10))
  .action(dispatchRemove)

program
  .command('list')
  .description('List all projects')
  .action(listProjectsCommand)

program.parse()
