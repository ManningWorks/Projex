import { writeFile, access, constants } from 'node:fs/promises'
import { resolve } from 'node:path'
import { confirm, input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

const CONFIG_FILE = 'folio.config.ts'

const PROJECT_TYPES = [
  { value: 'github', label: 'GitHub Repository', description: 'Track a GitHub repo' },
  { value: 'manual', label: 'Manual Project', description: 'Manually defined project' },
  { value: 'npm', label: 'NPM Package', description: 'Track an npm package' },
  { value: 'product-hunt', label: 'Product Hunt', description: 'Track a Product Hunt launch' },
  { value: 'hybrid', label: 'Hybrid (GitHub + NPM)', description: 'Both GitHub repo and npm package' },
] as const

const PROJECT_STATUSES = [
  { value: 'active', label: 'Active', description: 'Currently working on' },
  { value: 'shipped', label: 'Shipped', description: 'Completed and launched' },
  { value: 'in-progress', label: 'In Progress', description: 'Under development' },
  { value: 'coming-soon', label: 'Coming Soon', description: 'Planned but not started' },
  { value: 'archived', label: 'Archived', description: 'No longer maintained' },
  { value: 'for-sale', label: 'For Sale', description: 'Looking for a buyer' },
] as const

export interface InitInteractiveOptions {
  force?: boolean
}

export async function initInteractive(options: InitInteractiveOptions = {}): Promise<void> {
  console.log(chalk.bold('🚀 Interactive Folio Setup'))
  console.log(chalk.gray('Let\'s create your folio.config.ts together'))
  console.log()

  const workingDir = process.cwd()

  if (!options.force) {
    try {
      await access(CONFIG_FILE, constants.F_OK)

      const overwrite = await confirm({
        message: `${CONFIG_FILE} already exists. Overwrite?`,
        default: false,
      })

      if (!overwrite) {
        console.log(chalk.yellow('✖ Setup cancelled.'))
        return
      }
    } catch {
    }
  }

  const projects: string[] = []

  let addMore = true

  while (addMore) {
    const project = await promptForProject()
    projects.push(generateProjectConfig(project))

    console.log()

    if (projects.length > 0) {
      addMore = await confirm({
        message: 'Add another project?',
        default: false,
      })
    } else {
      addMore = false
    }
  }

  if (projects.length === 0) {
    console.log(chalk.yellow('✖ No projects added. Exiting.'))
    return
  }

  const configContent = generateConfigFile(projects)

  try {
    const configPath = resolve(workingDir, CONFIG_FILE)
    await writeFile(configPath, configContent, 'utf-8')

    await ensureFolioInstalled()

    console.log()
    console.log(chalk.green(`✓ ${CONFIG_FILE} created with ${projects.length} project(s)`))
    console.log()
    console.log(chalk.bold('Next steps:'))
    console.log(chalk.gray('1. Edit folio.config.ts to add more details'))
    console.log(chalk.gray('2. Import and use the components in your Next.js app'))
    console.log(chalk.gray('3. See https://docs.folio.dev for usage examples'))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
      console.error(chalk.red(`✖ Permission denied. Cannot write to ${CONFIG_FILE}`))
      console.error(chalk.gray('  Check file permissions and try again.'))
    } else {
      console.error(chalk.red('✖ Failed to create folio.config.ts'))
      console.error(chalk.gray(`  ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
    process.exit(1)
  }
}

interface ProjectAnswers {
  name: string
  description: string
  type: string
  status: string
  repo?: string
  packageName?: string
  slug?: string
  stack: string[]
  featured: boolean
}

async function promptForProject(): Promise<ProjectAnswers> {
  console.log(chalk.bold('--- Adding New Project ---'))

  const name = await input({
    message: 'Project name:',
    validate: (value: string) => value.trim().length > 0 || 'Project name is required',
  })

  const description = await input({
    message: 'Description (optional - press Enter to skip):',
  })

  const type = await select<string>({
    message: 'Project type:',
    choices: PROJECT_TYPES,
  })

  let repo: string | undefined
  let packageName: string | undefined
  let slug: string | undefined

  if (type === 'github' || type === 'hybrid') {
    repo = await input({
      message: 'GitHub repository (e.g., username/repo):',
      validate: (value: string) => value.trim().length > 0 || 'Repository is required',
    })
  }

  if (type === 'npm' || type === 'hybrid') {
    packageName = await input({
      message: 'NPM package name:',
      validate: (value: string) => value.trim().length > 0 || 'Package name is required',
    })
  }

  if (type === 'product-hunt') {
    slug = await input({
      message: 'Product Hunt slug:',
      validate: (value: string) => value.trim().length > 0 || 'Slug is required',
    })
  }

  const status = await select<string>({
    message: 'Project status:',
    choices: PROJECT_STATUSES,
  })

  const stackInput = await input({
    message: 'Tech stack (comma-separated, e.g., React, TypeScript, Next.js - press Enter to skip):',
  })

  const stack = stackInput
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const featured = await confirm({
    message: 'Featured project?',
    default: false,
  })

  return {
    name,
    description,
    type,
    status,
    repo,
    packageName,
    slug,
    stack,
    featured,
  }
}

function generateProjectConfig(project: ProjectAnswers): string {
  const lines: string[] = []
  lines.push('  {')
  lines.push(`    id: '${project.name.toLowerCase().replace(/\s+/g, '-')}',`)
  lines.push(`    type: '${project.type}',`)

  if (project.repo) {
    lines.push(`    repo: '${project.repo}',`)
  }

  if (project.packageName) {
    lines.push(`    package: '${project.packageName}',`)
  }

  if (project.slug) {
    lines.push(`    slug: '${project.slug}',`)
  }

  lines.push(`    status: '${project.status}',`)
  lines.push(`    featured: ${project.featured},`)

  if (project.name) {
    lines.push(`    name: '${escapeString(project.name)}',`)
  }

  if (project.description) {
    lines.push(`    description: '${escapeString(project.description)}',`)
  }

  if (project.stack.length > 0) {
    lines.push(`    stack: [${project.stack.map((s) => `'${escapeString(s)}'`).join(', ')}],`)
  }

  lines.push('    struggles: [],')
  lines.push('    timeline: [],')
  lines.push('    posts: [],')
  lines.push('  }')

  return lines.join('\n')
}

function generateConfigFile(projects: string[]): string {
  return `import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
${projects.join(',\n')}
])
`
}

function escapeString(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\n/g, ' ')
}

async function ensureFolioInstalled(): Promise<void> {
  const packageJsonPath = resolve(process.cwd(), 'package.json')

  try {
    const content = await readFile(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(content)

    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    if ('@reallukemanning/folio' in deps) {
      return
    }

    const hasPnpm = existsSync(resolve(process.cwd(), 'pnpm-lock.yaml'))
    const hasYarn = existsSync(resolve(process.cwd(), 'yarn.lock'))

    const installCmd = hasPnpm ? 'pnpm add' : hasYarn ? 'yarn add' : 'npm install'

    console.log(chalk.gray(`  Installing @reallukemanning/folio...`))
    execSync(`${installCmd} @reallukemanning/folio`, { stdio: 'inherit' })
    console.log(chalk.gray(`  ✓ @reallukemanning/folio installed`))
  } catch {
  }
}
