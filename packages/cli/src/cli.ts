#!/usr/bin/env node

import { Command } from 'commander'
import { init } from './commands/init.js'

const program = new Command()

program
  .name('folio')
  .description('CLI tool for Folio project showcase pages')
  .version('0.0.0')

program
  .command('init')
  .description('Initialize a new Folio project')
  .option('--github', 'Auto-detect projects from GitHub repos')
  .action(init)

program.parse()
