#!/usr/bin/env node

import { Command } from 'commander'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { init } from './commands/init.js'
import { add } from './commands/add.js'

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
  .action(init)

program
  .command('add')
  .description('Add a Projex component to your project')
  .argument('<component>', 'Component name (e.g., github-card, npm-card, showcase-card)')
  .option('-f, --force', 'Overwrite existing files without prompting')
  .action(add)

program.parse()
