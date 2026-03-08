import { readFile, writeFile, access, constants, unlink, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { confirm, input } from '@inquirer/prompts'
import chalk from 'chalk'
import { execSync } from 'node:child_process'
import { fetchGitHubRepos } from '../lib/github.js'

const CONFIG_FILE = 'projex.config.ts'
const PACKAGE_JSON = 'package.json'

interface InitOptions {
  github?: boolean
  yes?: boolean
}

export async function init(options: InitOptions = {}): Promise<void> {
  const workingDir = process.cwd()

  let tempConfigPath: string | null = null

  const handleSigint = () => {
    console.log()
    console.log(chalk.yellow('✖ Init cancelled by user'))
    if (tempConfigPath) {
      unlink(tempConfigPath).catch(() => {})
    }
    process.exit(0)
  }

  const originalSigint = process.listenerCount('SIGINT') > 0 ? process.listeners('SIGINT')[0] : null
  process.removeAllListeners('SIGINT')
  process.on('SIGINT', handleSigint)

  try {
    await runInit(options, workingDir, (path: string) => {
      tempConfigPath = path
    })
  } finally {
    process.removeAllListeners('SIGINT')
    if (originalSigint) {
      process.on('SIGINT', originalSigint)
    }
  }
}

async function runInit(options: InitOptions, workingDir: string, setTempPath: (path: string) => void): Promise<void> {
  console.log(chalk.bold('🚀 Initializing Projex project...'))
  console.log()

  try {
    await access(CONFIG_FILE, constants.F_OK)

    if (!options.yes) {
      const overwrite = await confirm({
        message: `${CONFIG_FILE} already exists. Overwrite?`,
        default: false,
      })

      if (!overwrite) {
        console.log(chalk.yellow('✖ Init cancelled.'))
        return
      }
    }
  } catch {
  }

  const isNextJs = await detectNextJs(workingDir)

  if (isNextJs) {
    console.log(chalk.green('✓ Next.js project detected'))
  } else {
    console.log(chalk.yellow('⚠ Next.js not detected. Projex is optimized for Next.js projects.'))
  }

  console.log()

  let template: string

  if (options.github) {
    template = await generateGitHubConfig(options.yes)
  } else {
    template = generateConfigTemplate()
  }

  try {
    const configPath = resolve(workingDir, CONFIG_FILE)
    const tempPath = resolve(workingDir, `${CONFIG_FILE}.tmp`)

    setTempPath(tempPath)

    await writeFile(tempPath, template, 'utf-8')

    await rename(tempPath, configPath)

    setTempPath('')

    await ensureProjexInstalled()

    console.log(chalk.green(`✓ ${CONFIG_FILE} created successfully`))
    console.log()
    console.log(chalk.bold('Next steps:'))
    console.log(chalk.gray('1. Edit projex.config.ts to add your projects'))
    console.log(chalk.gray('2. Import and use components in your Next.js app'))
    console.log(chalk.gray('3. See https://docs.projex.dev for usage examples'))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
      console.error(chalk.red(`✖ Permission denied. Cannot write to ${CONFIG_FILE}`))
      console.error(chalk.gray('  Check file permissions and try again.'))
    } else {
      console.error(chalk.red('✖ Failed to create projex.config.ts'))
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
  return `import { defineProjects } from '@manningworks/projex'

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

async function generateGitHubConfig(yes = false): Promise<string> {
  let username: string

  if (yes) {
    try {
      username = execSync('git config --get user.name', { encoding: 'utf-8' }).trim()
      if (username.length === 0) {
        console.log(chalk.yellow('⚠ Could not detect GitHub username from git config'))
        console.log(chalk.gray('  Falling back to basic template. Use --github without --yes for interactive mode.'))
        return generateConfigTemplate()
      }
    } catch {
      console.log(chalk.yellow('⚠ Could not detect GitHub username from git config'))
      console.log(chalk.gray('  Falling back to basic template. Use --github without --yes for interactive mode.'))
      return generateConfigTemplate()
    }
  } else {
    username = await input({
      message: 'Enter your GitHub username:',
      validate: (value: string) => value.trim().length > 0 || 'Username is required',
    })
  }

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
      console.log(chalk.gray('  Run "npx projex init" for a basic scaffold instead.'))
    } else if (result.error === 'network') {
      console.log(chalk.red('✖ Failed to fetch repositories from GitHub'))
      console.log(chalk.gray('  Check your network connection and try again.'))
      console.log(chalk.gray('  Run "npx projex init" for a basic scaffold instead.'))
    } else if (result.error === 'not_found') {
      console.log(chalk.red(`✖ GitHub user "${username}" not found`))
      console.log(chalk.gray('  Check username and try again.'))
      console.log(chalk.gray('  Run "npx projex init" for a basic scaffold instead.'))
    } else {
      console.log(chalk.red('✖ Failed to fetch repositories from GitHub'))
      console.log(chalk.gray('  Run "npx projex init" for a basic scaffold instead.'))
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
    console.log(chalk.gray('  2. Run "npx projex init" for a basic scaffold instead'))
    console.log(chalk.gray('  3. Check your GitHub username and try again'))
    process.exit(1)
  }

  const includeForks = yes ? false : await confirm({
    message: 'Include forked repositories?',
    default: false,
  })

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
    console.log(chalk.gray('  Run "npx projex init" for a basic scaffold instead.'))
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

  return `import { defineProjects } from '@manningworks/projex'

export const projects = defineProjects([
${repoEntries}
])
`
}

async function ensureProjexInstalled(): Promise<void> {
  const packageJsonPath = resolve(process.cwd(), 'package.json')
  const content = await readFile(packageJsonPath, 'utf-8')
  const pkg = JSON.parse(content)

  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  if ('@manningworks/projex' in deps) {
    return
  }

  const hasPnpm = existsSync(resolve(process.cwd(), 'pnpm-lock.yaml'))
  const hasYarn = existsSync(resolve(process.cwd(), 'yarn.lock'))

  const installCmd = hasPnpm ? 'pnpm add' : hasYarn ? 'yarn add' : 'npm install'

  console.log(chalk.gray(`  Installing @manningworks/projex...`))
  execSync(`${installCmd} @manningworks/projex`, { stdio: 'inherit' })
  console.log(chalk.gray(`  ✓ @manningworks/projex installed`))
}
