import { readFile, writeFile, access, constants } from 'node:fs/promises'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { execSync } from 'node:child_process'
import { fetchGitHubRepos } from '../lib/github.js'

const CONFIG_FILE = 'folio.config.ts'
const PACKAGE_JSON = 'package.json'

interface InitOptions {
  github?: boolean
}

export async function init(options: InitOptions = {}): Promise<void> {
  const workingDir = process.cwd()

  console.log(chalk.bold('🚀 Initializing Folio project...'))
  console.log()

  try {
    await access(CONFIG_FILE, constants.F_OK)

    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `${CONFIG_FILE} already exists. Overwrite?`,
        default: false,
      },
    ])

    if (!overwrite) {
      console.log(chalk.yellow('✖ Init cancelled.'))
      return
    }
  } catch {
  }

  const isNextJs = await detectNextJs(workingDir)

  if (isNextJs) {
    console.log(chalk.green('✓ Next.js project detected'))
  } else {
    console.log(chalk.yellow('⚠ Next.js not detected. Folio is optimized for Next.js projects.'))
  }

  console.log()

  let template: string

  if (options.github) {
    template = await generateGitHubConfig()
  } else {
    template = generateConfigTemplate()
  }

  try {
    const configPath = resolve(workingDir, CONFIG_FILE)

    await writeFile(configPath, template, 'utf-8')

    await ensureFolioInstalled()

    console.log(chalk.green(`✓ ${CONFIG_FILE} created successfully`))
    console.log()
    console.log(chalk.bold('Next steps:'))
    console.log(chalk.gray('1. Edit folio.config.ts to add your projects'))
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

async function detectNextJs(workingDir: string): Promise<boolean> {
  const packagePath = resolve(workingDir, PACKAGE_JSON)

  try {
    await access(packagePath, constants.F_OK)
  } catch {
    console.log(chalk.yellow(`⚠ ${PACKAGE_JSON} not found. Proceeding with basic scaffold.`))
    return false
  }

  try {
    const content = await readFile(packagePath, 'utf-8')
    const pkg = JSON.parse(content)

    if (!pkg || typeof pkg !== 'object') {
      return false
    }

    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    return 'next' in deps
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(chalk.red(`✖ ${PACKAGE_JSON} is not valid JSON`))
      console.error(chalk.gray('  Check syntax and try again.'))
    } else {
      console.error(chalk.red(`✖ Error reading ${PACKAGE_JSON}`))
      console.error(chalk.gray(`  ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
    return false
  }
}

function generateConfigTemplate(): string {
  return `import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
  {
    id: 'my-project',
    type: 'github',
    repo: 'username/repo',
    status: 'active',
    featured: true,
    background: 'A brief background of your project...',
    why: 'Why you built this project...',
    stack: ['TypeScript', 'React', 'Next.js'],
    struggles: [],
    timeline: [],
    posts: [],
  },
])
`
}

// Optional fields to add context to your project:
// background: The story behind the project - what problem does it solve?
// why: Your motivation for building it - why does this matter to you?
// struggles: Current challenges or technical hurdles faced
//   - type: 'warn' (minor issues) or 'error' (blockers)
//   - text: Description of the challenge
// timeline: Milestones and important dates in the project's journey
//   - date: Formatted date string (e.g., '2025-01-15')
//   - note: What happened on this date
// posts: Related blog posts, announcements, or documentation
//   - title: Post title
//   - date: Publication date
//   - url: Link to the post (optional)

async function generateGitHubConfig(): Promise<string> {
  const { username } = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Enter your GitHub username:',
      validate: (input: string) => input.trim().length > 0 || 'Username is required',
    },
  ])

  console.log()
  console.log(chalk.gray('Fetching repositories...'))

  const result = await fetchGitHubRepos(username)

  if (result.error) {
    if (result.error === 'rate_limit') {
      console.log(chalk.red('✖ GitHub API rate limit exceeded'))
      if (!process.env.GITHUB_TOKEN) {
        console.log(chalk.yellow('  Rate limit: 60 requests/hour (unauthenticated)'))
        console.log(chalk.yellow('  Recommended: Set GITHUB_TOKEN for 5000 requests/hour'))
        console.log(chalk.yellow('  Create token: https://github.com/settings/personal-access-token/new'))
      }
      console.log(chalk.gray('  Run "npx folio init" for a basic scaffold instead.'))
    } else if (result.error === 'network') {
      console.log(chalk.red('✖ Failed to fetch repositories from GitHub'))
      console.log(chalk.gray('  Check your network connection and try again.'))
      console.log(chalk.gray('  Run "npx folio init" for a basic scaffold instead.'))
    } else if (result.error === 'not_found') {
      console.log(chalk.red(`✖ GitHub user "${username}" not found`))
      console.log(chalk.gray('  Check the username and try again.'))
      console.log(chalk.gray('  Run "npx folio init" for a basic scaffold instead.'))
    } else {
      console.log(chalk.red('✖ Failed to fetch repositories from GitHub'))
      console.log(chalk.gray('  Run "npx folio init" for a basic scaffold instead.'))
    }
    process.exit(1)
  }

  if (!result.data || result.data.length === 0) {
    console.log(chalk.yellow('✖ No repositories found'))
    console.log(chalk.gray('  This could mean:'))
    console.log(chalk.gray('  - You have no public repositories'))
    console.log(chalk.gray('  - Your GITHUB_TOKEN is not set (private repos require auth)'))
    console.log(chalk.gray('  - Rate limit exceeded (60/hr unauthenticated)'))
    console.log()
    console.log(chalk.gray('Suggestions:'))
    console.log(chalk.gray('  1. Set GITHUB_TOKEN (fine-grained PAT with Contents read-only)'))
    console.log(chalk.gray('  2. Run "npx folio init" for a basic scaffold instead'))
    console.log(chalk.gray('  3. Check your GitHub username and try again'))
    process.exit(1)
  }

  const { includeForks } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'includeForks',
      message: 'Include forked repositories?',
      default: false,
    },
  ])

  const filteredRepos = result.data.filter((repo) => {
    if (repo.archived) {
      return false
    }

    if (repo.name.endsWith('.template') || repo.name.endsWith('.github.io')) {
      return false
    }

    if (repo.description === null) {
      return false
    }

    return true
  })

  const finalRepos = includeForks
    ? filteredRepos
    : filteredRepos.filter((repo) => !repo.fork)

  if (finalRepos.length === 0) {
    console.log(chalk.yellow('✖ No repositories match your criteria'))
    console.log(chalk.gray('  Try including forks or check your repository descriptions.'))
    console.log(chalk.gray('  Run "npx folio init" for a basic scaffold instead.'))
    process.exit(1)
  }

  const repoEntries = finalRepos
    .map(
      (repo) => `  {
    id: '${repo.name}',
    type: 'github',
    repo: '${username}/${repo.name}',
    status: 'active',
    featured: false,
    description: '${(repo.description || '').replace(/'/g, "\\'").replace(/\n/g, ' ')}',
    background: null,
    why: null,
    stack: ${repo.language ? `['${repo.language}']` : '[]'},
    struggles: [],
    timeline: [],
    posts: [],
  },`
    )
    .join('\n')

  return `import { defineProjects } from '@reallukemanning/folio'

export const projects = defineProjects([
${repoEntries}
])
`
}

async function ensureFolioInstalled(): Promise<void> {
  const packageJsonPath = resolve(process.cwd(), 'package.json')
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
}
