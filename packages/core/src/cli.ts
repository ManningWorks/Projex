#!/usr/bin/env node

import { Command } from 'commander'
import { init } from './commands/init.js'
import { add } from './commands/add.js'

const program = new Command()

program
  .name('folio')
  .description('CLI tool for Folio project showcase pages')
  .version('1.3.0')

program
  .command('init')
  .description('Initialize a new Folio project')
  .option('--github', 'Auto-detect projects from GitHub repos')
  .option('-y, --yes', 'Skip all prompts and use default values')
  .action(init)

program
  .command('add')
  .description('Add a Folio component to your project')
  .argument('<component>', 'Component name (e.g., github-card, npm-card, showcase-card)')
  .option('-f, --force', 'Overwrite existing files without prompting')
  .action(add)

program.parse()
